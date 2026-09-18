import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { blocks, units, unitTypes } from '../../data'
import NotFoundPage from '../../app/NotFoundPage'
import SceneStage from '../../components/SceneStage/SceneStage'
import TransitionLayer from '../../components/TransitionLayer/TransitionLayer'
import SvgHotspotLayer from '../../components/SvgHotspotLayer/SvgHotspotLayer'
import { developmentReverseVideo } from './developmentMedia'
import { developmentUnitPolygons } from './developmentUnitPolygons'
import UnitQuickCard from '../units/UnitQuickCard'
import './BlockPage.css'

export default function BlockPage() {
  const { blockId, unitId } = useParams()
  const navigate = useNavigate()
  const pending = useRef(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [hoveredUnit, setHoveredUnit] = useState<string | null>(null)
  const [focusedUnit, setFocusedUnit] = useState<string | null>(null)
  const block = blocks.find((item) => item.id === blockId)
  const unit = units.find((item) => item.id === unitId && item.blockId === blockId)
  const unitType = unitTypes.find((item) => item.id === unit?.unitTypeId)
  // Seed-first lookup: orphan geometry cannot produce a target, and missing
  // geometry cannot produce a clickable Unit. Never infer domain data from IDs.
  const hotspots = units.flatMap((unit) => {
    const points = developmentUnitPolygons[unit.id]
    return unit.blockId === blockId && unit.demoEnabled === true && points
      ? [{ id: unit.id, points, label: `Bağımsız bölüm ${unit.id}, kat ${unit.floor}`,
          disabled: isTransitioning }]
      : []
  })
  const highlightedUnit = isTransitioning ? null : focusedUnit ?? hoveredUnit
  const activateUnit = (id: string) => {
    if (pending.current || !hotspots.some((hotspot) => hotspot.id === id)) return
    void navigate(`/block/${blockId}/unit/${id}`)
  }

  const returnHome = () => {
    if (!pending.current) return
    pending.current = false
    setIsTransitioning(false)
    void navigate('/')
  }
  const activateHome = () => {
    // Protect even repeated activation before disabled is rendered.
    if (pending.current) return
    pending.current = true
    setHoveredUnit(null)
    setFocusedUnit(null)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      returnHome()
      return
    }
    setIsTransitioning(true)
  }

  if (!block || (unitId && (!unit || !unitType))) return <NotFoundPage />

  return (
    <>
      <h1>{block.name} Blok</h1>
      <p>{block.category === 'commercial' ? 'Ticari' : 'Konut'} · Geliştirme sahnesi</p>
      <button className="block-scene__home" type="button" disabled={isTransitioning}
        onClick={activateHome}>Home — Ana görünüme dön</button>
      <p role="status">{isTransitioning
        ? 'Geliştirme geri dönüş videosu oynatılıyor — Home ve Unit etkileşimi kilitli.'
        : 'Geri dönüş hazır — Home açık.'}</p>
      <p>Geliştirme Unit vurgusu: {highlightedUnit ?? 'Yok'}</p>
      <figure className="block-scene">
        <div className="block-scene__composition">
          <SceneStage label={`${block.name} Blok geliştirme sahnesi: 1920 × 1440`}
            base={<div className="block-scene__background">
              <strong>{block.name}</strong>
              <span>GELİŞTİRME SAHNESİ</span>
            </div>}
            interaction={<SvgHotspotLayer label={`${block.name} Blok geliştirme Unit hedefleri`}
                hotspots={hotspots} hoveredId={highlightedUnit} activeId={unit?.id}
                onHover={setHoveredUnit} onLeave={() => setHoveredUnit(null)}
                onFocus={setFocusedUnit} onBlur={() => setFocusedUnit(null)}
                onActivate={activateUnit} />}
            overlay={<TransitionLayer src={developmentReverseVideo} active={isTransitioning}
              label="Geliştirme geri dönüş videosu"
              onComplete={returnHome} onFailure={returnHome} />}
          />
          {unit && unitType && <UnitQuickCard unit={unit} unitType={unitType} disabled={isTransitioning} />}
        </div>
        <figcaption>1920 × 1440 · 4:3 · DEVELOPMENT-ONLY: yapay Unit poligonları gerçek cephelerle eşleşmez. Temsili geliştirme görseli ve videosu; gerçek proje medyası değildir.</figcaption>
      </figure>
    </>
  )
}
