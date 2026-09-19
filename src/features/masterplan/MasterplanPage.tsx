import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { blocks } from '../../data'
import SceneStage from '../../components/SceneStage/SceneStage'
import SvgHotspotLayer from '../../components/SvgHotspotLayer/SvgHotspotLayer'
import TransitionLayer from '../../components/TransitionLayer/TransitionLayer'
import { developmentTransitionVideo } from './developmentMedia'
import { developmentBlockPolygons } from './developmentHotspots'
import './MasterplanPage.css'

const hotspots = blocks.map((block) => ({
  id: block.id,
  label: `${block.name} Blok — geliştirme bölgesi`,
  points: developmentBlockPolygons[block.id],
}))

type Source = 'polygon-pointer' | 'polygon-focus' | 'control-pointer' | 'control-focus'

export default function MasterplanPage() {
  const navigate = useNavigate()
  const destination = useRef<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  // Most recently entered source owns the highlight; leaving restores any owner below it.
  const [interactions, setInteractions] = useState<{ source: Source; id: string }[]>([])
  const highlightedId = interactions.at(-1)?.id ?? null
  const enter = (source: Source, id: string) => setInteractions((current) => [
    ...current.filter((item) => item.source !== source), { source, id },
  ])
  const leave = (source: Source, id: string) => setInteractions((current) =>
    current.filter((item) => item.source !== source || item.id !== id))
  const resolveTransition = () => {
    const id = destination.current
    if (!id) return
    destination.current = null
    setIsTransitioning(false)
    void navigate(`/block/${id}`)
  }
  const activate = (id: string) => {
    // Ref closes the gap before React renders disabled controls.
    if (destination.current) return
    destination.current = id
    setInteractions([])
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      resolveTransition()
      return
    }
    setIsTransitioning(true)
  }

  return (
    <>
      <h1>Home / Masterplan</h1>
      <p>Geliştirme sahnesi: A, B ve C bloklarını işaretleyin veya klavye ile seçin.</p>
      <figure className="masterplan">
        <SceneStage
          label="Masterplan geliştirme sahnesi: 1920 × 1440"
          base={<div className="masterplan__background" />}
          interaction={<SvgHotspotLayer
            label="Geliştirme blok bölgeleri"
            hotspots={hotspots.map((hotspot) => ({ ...hotspot, disabled: isTransitioning }))}
            hoveredId={highlightedId}
            onHover={(id) => enter('polygon-pointer', id)}
            onLeave={(id) => leave('polygon-pointer', id)}
            onFocus={(id) => enter('polygon-focus', id)}
            onBlur={(id) => leave('polygon-focus', id)}
            onActivate={activate}
          />}
          overlay={<><svg className="masterplan__labels" viewBox="0 0 1920 1440" aria-hidden="true">
            {hotspots.map((hotspot) => <text key={hotspot.id}
              x={(hotspot.points[0][0] + hotspot.points[1][0]) / 2} y="720"
              textAnchor="middle" dominantBaseline="middle" fontSize="80">
              {blocks.find((block) => block.id === hotspot.id)?.name}
            </text>)}
          </svg>
            <TransitionLayer src={developmentTransitionVideo} active={isTransitioning}
              preloadRequested={highlightedId !== null}
              onComplete={resolveTransition} onFailure={resolveTransition} />
          </>}
        />
        <figcaption>Yalnızca geliştirme: 4:3 alanındaki temsili dikdörtgenler gerçek bina sınırları değildir.</figcaption>
      </figure>
      <p className="masterplan__status" role="status">{isTransitioning
        ? 'Geliştirme videosu oynatılıyor — blok seçimi kilitli.'
        : 'Geliştirme geçişi hazır — blok seçimi açık.'}</p>
      <div className="masterplan__controls" role="group" aria-label="Blok seçimi">
        {blocks.map((block) => (
          <button key={block.id} type="button"
            disabled={isTransitioning}
            data-highlighted={highlightedId === block.id}
            onPointerEnter={() => enter('control-pointer', block.id)}
            onPointerLeave={() => leave('control-pointer', block.id)}
            onFocus={() => enter('control-focus', block.id)}
            onBlur={() => leave('control-focus', block.id)}
            onClick={() => activate(block.id)}>{block.name} Blok</button>
        ))}
      </div>
    </>
  )
}
