import { useEffect, useRef, useState, type CSSProperties } from 'react'
import './TransitionLayer.css'

export interface TransitionBounds {
  top: number
  left: number
  width: number
  height: number
}

export interface TransitionLayerProps {
  src: string
  active: boolean
  visible?: boolean
  playbackId?: number
  bounds?: TransitionBounds
  preloadRequested?: boolean
  destinationImageSrc?: string
  onComplete: () => void
  onFailure: () => void
  label?: string
  timeoutMs?: number
}

export default function TransitionLayer({
  src, active, visible = active, playbackId, bounds, preloadRequested = false, destinationImageSrc, onComplete, onFailure,
  label = 'Geliştirme geçiş videosu', timeoutMs = 10000,
}: TransitionLayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [presentedPlaybackId, setPresentedPlaybackId] = useState<number | null>(null)
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
    let playbackStarted = false
    let frameCallback = 0
    let fallbackFrame = 0
    const destinationImage = destinationImageSrc ? new Image() : null
    const destinationReady = destinationImage
      ? (() => {
          destinationImage.src = destinationImageSrc!
          return destinationImage.decode().catch(() => undefined)
        })()
      : Promise.resolve()
    const reset = () => {
      video.pause()
      video.currentTime = 0
    }
    const finish = (success: boolean) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      if (success) callbacks.current.onComplete()
      else {
        setPresentedPlaybackId(null)
        reset()
        callbacks.current.onFailure()
      }
    }
    // Keep the terminal video frame visible while the destination WebP decodes.
    const reveal = () => {
      if (!settled && playbackId !== undefined) setPresentedPlaybackId(playbackId)
    }
    const revealFallback = () => {
      fallbackFrame = window.requestAnimationFrame(reveal)
    }
    const beginPlayback = () => {
      if (settled || playbackStarted) return
      playbackStarted = true
      try {
        video.currentTime = 0
        if (typeof video.requestVideoFrameCallback === 'function') {
          frameCallback = video.requestVideoFrameCallback(reveal)
        } else {
          video.addEventListener('playing', revealFallback, { once: true })
        }
        void video.play().catch(failed)
      } catch {
        failed()
      }
    }
    const ended = () => { void destinationReady.then(() => finish(true)) }
    const failed = () => finish(false)
    // Also resolve stalled loading/playback instead of leaving the feature locked.
    const timer = window.setTimeout(failed, timeoutMs)
    video.addEventListener('loadeddata', beginPlayback)
    video.addEventListener('ended', ended)
    video.addEventListener('error', failed)
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) beginPlayback()
    return () => {
      settled = true
      clearTimeout(timer)
      video.removeEventListener('loadeddata', beginPlayback)
      video.removeEventListener('ended', ended)
      video.removeEventListener('error', failed)
      video.removeEventListener('playing', revealFallback)
      if (frameCallback) video.cancelVideoFrameCallback(frameCallback)
      window.cancelAnimationFrame(fallbackFrame)
      reset()
    }
  }, [active, destinationImageSrc, playbackId, src, timeoutMs])

  const isPresented = visible && playbackId !== undefined && presentedPlaybackId === playbackId
  const style: CSSProperties = active && bounds
    ? { top: bounds.top, left: bounds.left, width: bounds.width, height: bounds.height }
    : { display: 'none' }

  return <video ref={videoRef} className="transition-layer"
    style={style} data-presented={isPresented} aria-hidden={!visible}
    muted playsInline preload="auto" aria-label={label} />
}
