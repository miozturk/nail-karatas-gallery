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
import UnitDetailsDrawer from '../units/UnitDetailsDrawer'
import { formatCategory, formatFloor } from '../../i18n/formatters'
import { useI18n } from '../../i18n/useI18n'
import './BlockPage.css'

export default function BlockPage({ showDetails = false }: { showDetails?: boolean }) {
  const { t } = useI18n()
  const { blockId, unitId } = useParams()
  const navigate = useNavigate()
  const pending = useRef(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [homeIntent, setHomeIntent] = useState(false)
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
      ? [{ id: unit.id, points, label: t('block.hotspotLabel', {
          unit: unit.id, floor: formatFloor(unit.floor, t),
        }),
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
      <header className="block-scene__header">
        <div className="block-scene__intro">
          <p className="block-scene__meta">{formatCategory(block.category, t)} · {t('block.developmentScene')}</p>
          <h1>{t('block.title', { block: block.name })}</h1>
        </div>
        <button className="block-scene__home" type="button" disabled={isTransitioning}
          onPointerEnter={() => setHomeIntent(true)} onFocus={() => setHomeIntent(true)}
          onClick={activateHome}>{t('block.home')}</button>
      </header>
      <div className="block-scene__feedback">
        <p className="block-scene__status" role="status">{isTransitioning
          ? t('block.statusPlaying')
          : t('block.statusReady')}</p>
        <p className="block-scene__highlight">{t('block.highlight', { unit: highlightedUnit ?? t('block.none') })}</p>
      </div>
      <figure className="block-scene">
        <div className="block-scene__composition">
          <SceneStage label={t('block.stageLabel', { block: block.name })}
            base={<div className="block-scene__background">
              <strong>{block.name}</strong>
              <span>{t('block.backgroundLabel')}</span>
            </div>}
            interaction={<SvgHotspotLayer label={t('block.hotspotGroupLabel', { block: block.name })}
                hotspots={hotspots} hoveredId={highlightedUnit} activeId={unit?.id}
                onHover={setHoveredUnit} onLeave={() => setHoveredUnit(null)}
                onFocus={setFocusedUnit} onBlur={() => setFocusedUnit(null)}
                onActivate={activateUnit} />}
            overlay={<TransitionLayer src={developmentReverseVideo} active={isTransitioning}
              preloadRequested={homeIntent}
              label={t('block.transitionLabel')}
              onComplete={returnHome} onFailure={returnHome} />}
          />
          {unit && unitType && (showDetails
            ? <UnitDetailsDrawer unit={unit} unitType={unitType} disabled={isTransitioning} />
            : <UnitQuickCard unit={unit} unitType={unitType} disabled={isTransitioning} />)}
        </div>
        <figcaption>{t('block.caption')}</figcaption>
      </figure>
    </>
  )
}
