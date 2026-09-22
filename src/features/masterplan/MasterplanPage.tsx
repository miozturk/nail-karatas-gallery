import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { blocks } from '../../data'
import SceneStage from '../../components/SceneStage/SceneStage'
import SceneStageImage from '../../components/SceneStage/SceneStageImage'
import SvgHotspotLayer from '../../components/SvgHotspotLayer/SvgHotspotLayer'
import TransitionLayer from '../../components/TransitionLayer/TransitionLayer'
import { getMasterplanBlockPolygon } from './masterplanHotspots'
import { useI18n } from '../../i18n/useI18n'
import { exteriorMedia, getExteriorBlockMedia } from '../../media/exteriorMedia'
import './MasterplanPage.css'

type Source = 'polygon-pointer' | 'polygon-focus' | 'control-pointer' | 'control-focus'

export default function MasterplanPage() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const destination = useRef<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionBlockId, setTransitionBlockId] = useState<string | null>(null)
  // Most recently entered source owns the highlight; leaving restores any owner below it.
  const [interactions, setInteractions] = useState<{ source: Source; id: string }[]>([])
  const highlightedId = interactions.at(-1)?.id ?? null
  const transitionVideo = getExteriorBlockMedia(transitionBlockId ?? highlightedId)?.forwardTransition
    ?? exteriorMedia.blocks.a.forwardTransition
  const hotspots = blocks.flatMap((block) => {
    const points = getMasterplanBlockPolygon(block.id)
    return points ? [{
      id: block.id,
      label: t('masterplan.hotspotLabel', { block: block.name }),
      points,
    }] : []
  })
  const enter = (source: Source, id: string) => setInteractions((current) => [
    ...current.filter((item) => item.source !== source), { source, id },
  ])
  const leave = (source: Source, id: string) => setInteractions((current) =>
    current.filter((item) => item.source !== source || item.id !== id))
  const resolveTransition = () => {
    const id = destination.current
    if (!id) return
    destination.current = null
    setTransitionBlockId(null)
    setIsTransitioning(false)
    void navigate(`/block/${id}`)
  }
  const activate = (id: string) => {
    // Ref closes the gap before React renders disabled controls.
    if (destination.current) return
    destination.current = id
    setTransitionBlockId(id)
    setInteractions([])
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      resolveTransition()
      return
    }
    setIsTransitioning(true)
  }

  return (
    <>
      <div className="exterior-intro-slot">
        <header className="masterplan__intro">
          <h1>{t('masterplan.title')}</h1>
          <p>{t('masterplan.intro')}</p>
        </header>
      </div>
      <figure className="masterplan">
        <SceneStage
          label={t('masterplan.stageLabel')}
          base={<SceneStageImage src={exteriorMedia.masterplan} alt={t('masterplan.stageLabel')} />}
          interaction={<SvgHotspotLayer
            label={t('masterplan.hotspotGroupLabel')}
            hotspots={hotspots.map((hotspot) => ({ ...hotspot, disabled: isTransitioning }))}
            hoveredId={highlightedId}
            onHover={(id) => enter('polygon-pointer', id)}
            onLeave={(id) => leave('polygon-pointer', id)}
            onFocus={(id) => enter('polygon-focus', id)}
            onBlur={(id) => leave('polygon-focus', id)}
            onActivate={activate}
          />}
          overlay={<TransitionLayer src={transitionVideo} active={isTransitioning}
            preloadRequested={highlightedId !== null}
            destinationImageSrc={getExteriorBlockMedia(transitionBlockId)?.scene}
            label={t('masterplan.transitionLabel')}
            onComplete={resolveTransition} onFailure={resolveTransition} />}
        />
        <figcaption>{t('masterplan.caption')}</figcaption>
      </figure>
      <div className="masterplan__selector">
        <p className="masterplan__status" role="status">{isTransitioning
          ? t('masterplan.statusPlaying')
          : t('masterplan.statusReady')}</p>
        <div className="masterplan__controls" role="group" aria-label={t('masterplan.controlsLabel')}>
          {blocks.map((block) => (
            <button key={block.id} type="button"
              disabled={isTransitioning}
              data-highlighted={highlightedId === block.id}
              onPointerEnter={() => enter('control-pointer', block.id)}
              onPointerLeave={() => leave('control-pointer', block.id)}
              onFocus={() => enter('control-focus', block.id)}
              onBlur={() => leave('control-focus', block.id)}
              onClick={() => activate(block.id)}>{t('masterplan.blockButton', { block: block.name })}</button>
          ))}
        </div>
      </div>
    </>
  )
}
