import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { blocks, units, unitTypes } from '../../data'
import NotFoundPage from '../../app/NotFoundPage'
import SceneStage from '../../components/SceneStage/SceneStage'
import SceneStageImage from '../../components/SceneStage/SceneStageImage'
import { useExteriorTransition } from '../../components/TransitionLayer/useExteriorTransition'
import SvgHotspotLayer from '../../components/SvgHotspotLayer/SvgHotspotLayer'
import { getUnitHotspot } from './unitHotspots'
import UnitQuickCard from '../units/UnitQuickCard'
import UnitDetailsDrawer from '../units/UnitDetailsDrawer'
import { formatCategory, formatFloor } from '../../i18n/formatters'
import { useI18n } from '../../i18n/useI18n'
import { exteriorMedia, getExteriorBlockMedia } from '../../media/exteriorMedia'
import './BlockPage.css'

interface BlockOverlayContext {
  unit: (typeof units)[number] | undefined
  unitType: (typeof unitTypes)[number] | undefined
  disabled: boolean
}

export function UnitOverlayRoute({ showDetails = false }: { showDetails?: boolean }) {
  const { unit, unitType, disabled } = useOutletContext<BlockOverlayContext>()
  if (!unit || !unitType) return null
  return showDetails
    ? <UnitDetailsDrawer unit={unit} unitType={unitType} disabled={disabled} />
    : <UnitQuickCard unit={unit} unitType={unitType} disabled={disabled} />
}

export default function BlockPage() {
  const { t } = useI18n()
  const { blockId, unitId } = useParams()
  const navigate = useNavigate()
  const { isTransitioning, preloadTransition, startTransition } = useExteriorTransition()
  const [homeIntent, setHomeIntent] = useState(false)
  const [hoveredUnit, setHoveredUnit] = useState<string | null>(null)
  const [focusedUnit, setFocusedUnit] = useState<string | null>(null)
  const block = blocks.find((item) => item.id === blockId)
  const blockMedia = getExteriorBlockMedia(blockId)
  const unit = units.find((item) => item.id === unitId && item.blockId === blockId)
  const unitType = unitTypes.find((item) => item.id === unit?.unitTypeId)
  // Seed-first lookup: orphan geometry cannot produce a target, and missing
  // geometry cannot produce a clickable Unit. Never infer domain data from IDs.
  const hotspots = units.flatMap((unit) => {
    const hotspot = getUnitHotspot(unit.id)
    return unit.blockId === blockId && unit.demoEnabled === true
      && hotspot?.blockId === unit.blockId
      ? [{ id: unit.id, points: hotspot.points, label: t('block.hotspotLabel', {
          unit: unit.id, floor: formatFloor(unit.floor, t),
        }),
          disabled: isTransitioning }]
      : []
  })
  const highlightedUnit = isTransitioning ? null : focusedUnit ?? hoveredUnit
  const activateUnit = (id: string) => {
    if (isTransitioning || !hotspots.some((hotspot) => hotspot.id === id)) return
    void navigate(`/block/${blockId}/unit/${id}`)
  }

  useEffect(() => {
    preloadTransition(homeIntent ? blockMedia?.reverseTransition ?? null : null)
    return () => preloadTransition(null)
  }, [blockMedia?.reverseTransition, homeIntent, preloadTransition])

  const activateHome = () => {
    if (!blockMedia) return
    setHoveredUnit(null)
    setFocusedUnit(null)
    startTransition({
      src: blockMedia.reverseTransition,
      destinationImageSrc: exteriorMedia.masterplan,
      to: '/',
      label: t('block.transitionLabel'),
    })
  }

  if (!block || !blockMedia || (unitId && (!unit || !unitType))) return <NotFoundPage />

  return (
    <>
      <div className="exterior-intro-slot">
        <header className="block-scene__header">
          <div className="block-scene__intro">
            <p className="block-scene__meta">{formatCategory(block.category, t)}</p>
            <h1>{t('block.title', { block: block.name })}</h1>
          </div>
        </header>
        <div className="block-scene__feedback">
          <p className="block-scene__highlight">{t('block.highlight', { unit: highlightedUnit ?? t('block.none') })}</p>
        </div>
      </div>
      <figure className="block-scene">
        <div className="block-scene__composition">
          <SceneStage label={t('block.stageLabel', { block: block.name })}
            base={<SceneStageImage src={blockMedia.scene}
              alt={t('block.stageLabel', { block: block.name })} />}
            interaction={<SvgHotspotLayer label={t('block.hotspotGroupLabel', { block: block.name })}
                hotspots={hotspots} hoveredId={highlightedUnit} activeId={unit?.id}
                onHover={setHoveredUnit} onLeave={() => setHoveredUnit(null)}
                onFocus={setFocusedUnit} onBlur={() => setFocusedUnit(null)}
                onActivate={activateUnit} />}
          />
        </div>
        <figcaption>{t('block.caption')}</figcaption>
      </figure>
      <div className="block-scene__navigation">
        <p className="block-scene__status" role="status">{isTransitioning
          ? t('block.statusPlaying')
          : t('block.statusReady')}</p>
        <button className="block-scene__home" type="button" disabled={isTransitioning}
          onPointerEnter={() => setHomeIntent(true)} onFocus={() => setHomeIntent(true)}
          onClick={activateHome}>{t('block.home')}</button>
      </div>
      <Outlet context={{ unit, unitType, disabled: isTransitioning } satisfies BlockOverlayContext} />
    </>
  )
}
