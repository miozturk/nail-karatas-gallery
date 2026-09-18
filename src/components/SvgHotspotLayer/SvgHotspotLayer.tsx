import { useRef } from 'react'
import type { Polygon } from '../../types'
import './SvgHotspotLayer.css'

export interface SvgHotspot {
  id: string
  points: Polygon
  label: string
  disabled?: boolean
}

export interface SvgHotspotLayerProps {
  label: string
  hotspots: readonly SvgHotspot[]
  hoveredId?: string | null
  activeId?: string | null
  onHover?: (id: string) => void
  onLeave?: (id: string) => void
  onFocus?: (id: string) => void
  onBlur?: (id: string) => void
  onActivate: (id: string) => void
}

export default function SvgHotspotLayer({
  label, hotspots, hoveredId, activeId, onHover, onLeave, onFocus, onBlur, onActivate,
}: SvgHotspotLayerProps) {
  const spacePressed = useRef<string | null>(null)

  return (
    <svg className="svg-hotspot-layer" viewBox="0 0 1920 1440" role="group" aria-label={label}>
      {hotspots.map(({ id, points, label: hotspotLabel, disabled }) => (
        <polygon
          key={id}
          className="svg-hotspot-layer__polygon"
          points={points.map(([x, y]) => `${x},${y}`).join(' ')}
          role="button"
          aria-label={hotspotLabel}
          aria-disabled={disabled || undefined}
          aria-pressed={activeId === id}
          tabIndex={disabled ? -1 : 0}
          data-hovered={!disabled && hoveredId === id}
          onPointerEnter={() => { if (!disabled) onHover?.(id) }}
          onPointerLeave={() => { if (!disabled) onLeave?.(id) }}
          onClick={() => { if (!disabled) onActivate(id) }}
          onKeyDown={(event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return
            event.preventDefault()
            if (disabled || event.repeat) return
            if (event.key === 'Enter') onActivate(id)
            else spacePressed.current = id
          }}
          onKeyUp={(event) => {
            if (event.key !== ' ') return
            event.preventDefault()
            if (!disabled && spacePressed.current === id) onActivate(id)
            spacePressed.current = null
          }}
          onFocus={() => { if (!disabled) onFocus?.(id) }}
          onBlur={() => {
            spacePressed.current = null
            if (!disabled) onBlur?.(id)
          }}
        />
      ))}
    </svg>
  )
}
