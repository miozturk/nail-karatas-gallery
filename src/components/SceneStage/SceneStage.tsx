import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import './SceneStage.css'

interface SceneStageProps {
  label: string
  base: ReactNode
  interaction?: ReactNode
  overlay?: ReactNode
}

// All slots use logical pixel coordinates; the entire composition scales together.
export default function SceneStage({ label, base, interaction, overlay }: SceneStageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.min(entry.contentRect.width / 1920, entry.contentRect.height / 1440))
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="scene-stage" role="group" aria-label={label}
      data-ready={scale > 0}>
      <div className="scene-stage__coordinates" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
        <div className="scene-stage__layer scene-stage__base">{base}</div>
        <div className="scene-stage__layer scene-stage__interaction">{interaction}</div>
        <div className="scene-stage__layer scene-stage__overlay">{overlay}</div>
      </div>
    </div>
  )
}
