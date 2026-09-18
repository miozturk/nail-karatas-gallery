import { useEffect, useRef } from 'react'
import './TransitionLayer.css'

export interface TransitionLayerProps {
  src: string
  active: boolean
  onComplete: () => void
  onFailure: () => void
  label?: string
  timeoutMs?: number
}

export default function TransitionLayer({
  src, active, onComplete, onFailure,
  label = 'Geliştirme geçiş videosu', timeoutMs = 10000,
}: TransitionLayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const callbacks = useRef({ onComplete, onFailure })
  useEffect(() => { callbacks.current = { onComplete, onFailure } }, [onComplete, onFailure])

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

  return active ? <video ref={videoRef} className="transition-layer" src={src}
    muted playsInline preload="auto" aria-label={label} /> : null
}
