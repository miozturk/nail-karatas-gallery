import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import TransitionLayer, { type TransitionBounds } from './TransitionLayer'
import {
  ExteriorTransitionContext,
  type ExteriorTransitionContextValue,
  type ExteriorTransitionRequest,
} from './ExteriorTransitionContext'

interface ExteriorTransitionRun extends ExteriorTransitionRequest {
  id: number
  mode: 'video' | 'direct'
  phase: 'playing' | 'navigating' | 'releasing'
  sourceLocationKey: string
}

function readSceneStageBounds(): TransitionBounds | null {
  const stage = document.querySelector<HTMLElement>('.app-main--exterior .scene-stage')
  if (!stage) return null
  const rect = stage.getBoundingClientRect()
  if (rect.width <= 0 || rect.height <= 0) return null
  return { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
}

function isDestinationStageReady(destinationImageSrc: string) {
  const stage = document.querySelector<HTMLElement>('.app-main--exterior .scene-stage[data-ready="true"]')
  const image = stage?.querySelector<HTMLImageElement>('.scene-stage__image')
  if (!stage || !image || !image.complete || image.naturalWidth <= 0) return false

  try {
    return new URL(image.currentSrc || image.src, window.location.href).href
      === new URL(destinationImageSrc, window.location.href).href
  } catch {
    return false
  }
}

export function ExteriorTransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const nextId = useRef(0)
  const runRef = useRef<ExteriorTransitionRun | null>(null)
  const [run, setRun] = useState<ExteriorTransitionRun | null>(null)
  const [preloadSrc, setPreloadSrc] = useState<string | null>(null)
  const [bounds, setBounds] = useState<TransitionBounds | null>(null)

  const release = useCallback((id: number) => {
    if (runRef.current?.id !== id) return
    runRef.current = null
    setRun(null)
    setBounds(null)
  }, [])

  const startTransition = useCallback((request: ExteriorTransitionRequest) => {
    if (runRef.current) return false

    const nextBounds = readSceneStageBounds()
    const mode = window.matchMedia('(prefers-reduced-motion: reduce)').matches || !nextBounds
      ? 'direct'
      : 'video'
    const nextRun: ExteriorTransitionRun = {
      ...request,
      id: ++nextId.current,
      mode,
      phase: mode === 'video' ? 'playing' : 'navigating',
      sourceLocationKey: location.key,
    }
    runRef.current = nextRun
    setBounds(nextBounds)
    setRun(nextRun)

    if (mode === 'direct') void navigate(request.to)
    return true
  }, [location.key, navigate])

  const commitNavigation = useCallback(() => {
    const current = runRef.current
    if (!current || current.phase !== 'playing') return
    const navigating: ExteriorTransitionRun = { ...current, phase: 'navigating' }
    runRef.current = navigating
    setRun(navigating)
    void navigate(current.to)
  }, [navigate])

  useEffect(() => {
    const current = runRef.current
    if (!current) return

    if (current.phase === 'playing') {
      // Browser history or global navigation interrupted the source route.
      if (location.key !== current.sourceLocationKey) release(current.id)
      return
    }

    if (current.phase === 'releasing') {
      // The video was hidden in the previous paint. Only now remove/reset its
      // compositor layer so cleanup cannot become part of the visual handoff.
      const cleanupFrame = window.requestAnimationFrame(() => release(current.id))
      return () => window.cancelAnimationFrame(cleanupFrame)
    }

    if (location.pathname !== current.to) {
      if (location.key !== current.sourceLocationKey) release(current.id)
      return
    }

    if (current.mode === 'direct') {
      const directFrame = window.requestAnimationFrame(() => release(current.id))
      return () => window.cancelAnimationFrame(directFrame)
    }

    // Decoding the preloaded WebP is necessary but not sufficient: the newly
    // mounted stage first reports scale=0. Wait for the actual destination DOM
    // image and scaled stage, then give them one full paint below the terminal
    // video frame before hiding that frame.
    let readinessFrame = 0
    let releaseFrame = 0
    const waitStartedAt = performance.now()
    const waitForDestination = () => {
      const destinationBounds = readSceneStageBounds()
      const destinationReady = isDestinationStageReady(current.destinationImageSrc)
      if (destinationBounds) setBounds(destinationBounds)

      // Never trap navigation if browser image readiness reporting fails.
      if (destinationReady || performance.now() - waitStartedAt >= 1500) {
        releaseFrame = window.requestAnimationFrame(() => {
          if (runRef.current?.id !== current.id) return
          const releasing: ExteriorTransitionRun = { ...current, phase: 'releasing' }
          runRef.current = releasing
          setRun(releasing)
        })
        return
      }
      readinessFrame = window.requestAnimationFrame(waitForDestination)
    }
    readinessFrame = window.requestAnimationFrame(waitForDestination)
    return () => {
      window.cancelAnimationFrame(readinessFrame)
      window.cancelAnimationFrame(releaseFrame)
    }
  }, [location.key, location.pathname, release, run?.id, run?.phase])

  useEffect(() => {
    if (run?.mode !== 'video') return
    const syncBounds = () => {
      const nextBounds = readSceneStageBounds()
      if (nextBounds) setBounds(nextBounds)
    }
    window.addEventListener('resize', syncBounds)
    window.addEventListener('scroll', syncBounds, true)
    return () => {
      window.removeEventListener('resize', syncBounds)
      window.removeEventListener('scroll', syncBounds, true)
    }
  }, [run?.id, run?.mode])

  const value = useMemo<ExteriorTransitionContextValue>(() => ({
    isTransitioning: run !== null,
    preloadTransition: setPreloadSrc,
    startTransition,
  }), [run, startTransition])

  return (
    <ExteriorTransitionContext.Provider value={value}>
      {children}
      <TransitionLayer
        src={run?.src ?? preloadSrc ?? ''}
        active={run?.mode === 'video'}
        visible={run?.mode === 'video' && run.phase !== 'releasing'}
        playbackId={run?.id}
        bounds={bounds ?? undefined}
        preloadRequested={preloadSrc !== null}
        destinationImageSrc={run?.destinationImageSrc}
        label={run?.label}
        onComplete={commitNavigation}
        onFailure={commitNavigation}
      />
    </ExteriorTransitionContext.Provider>
  )
}
