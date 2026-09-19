import { useEffect, useRef } from 'react'
import './TransitionLayer.css'

export interface TransitionLayerProps {
  src: string
  active: boolean
  preloadRequested?: boolean
  onComplete: () => void
  onFailure: () => void
  label?: string
  timeoutMs?: number
}

export default function TransitionLayer({
  src, active, preloadRequested = false, onComplete, onFailure,
  label = 'Geliştirme geçiş videosu', timeoutMs = 10000,
}: TransitionLayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const callbacks = useRef({ onComplete, onFailure })
  useEffect(() => { callbacks.current = { onComplete, onFailure } }, [onComplete, onFailure])

  // Intent-only warmup reuses the playback element and its buffered resource.
  // Defer idle work so brief pointer passes and StrictMode do not start requests.
  useEffect(() => {
    const video = videoRef.current!
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let timer: number | undefined
    const prepare = () => {
      window.clearTimeout(timer)
      if (!active && motion.matches) {
        if (video.hasAttribute('src')) {
          video.removeAttribute('src')
          video.load()
        }
        return
      }
      if (!active && !preloadRequested) return
      const load = () => {
        if (video.getAttribute('src') !== src) {
          video.src = src
          video.load()
        }
      }
      if (active) load()
      else timer = window.setTimeout(load, 150)
    }
    prepare()
    motion.addEventListener('change', prepare)
    return () => {
      window.clearTimeout(timer)
      motion.removeEventListener('change', prepare)
    }
  }, [active, preloadRequested, src])

  useEffect(() => {
    const video = videoRef.current!
    return () => {
      video.pause()
      video.removeAttribute('src')
      video.load()
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!active || !video) return
    let settled = false
    const reset = () => {
      video.pause()
      video.currentTime = 0
    }
    const finish = (success: boolean) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      reset()
      if (success) callbacks.current.onComplete()
      else callbacks.current.onFailure()
    }
    const ended = () => finish(true)
    const failed = () => finish(false)
    // Also resolve stalled loading/playback instead of leaving the feature locked.
    const timer = window.setTimeout(failed, timeoutMs)
    video.addEventListener('ended', ended)
    video.addEventListener('error', failed)
    try {
      video.currentTime = 0
      void video.play().catch(failed)
    } catch {
      failed()
    }
    return () => {
      settled = true
      clearTimeout(timer)
      video.removeEventListener('ended', ended)
      video.removeEventListener('error', failed)
      reset()
    }
  }, [active, src, timeoutMs])

  return <video ref={videoRef} className="transition-layer"
    style={active ? undefined : { display: 'none' }}
    muted playsInline preload="auto" aria-label={label} />
}
