import { useEffect, useState } from 'react'
import { blocks } from '../../data'
import SceneStage from '../../components/SceneStage/SceneStage'
import SceneStageImage from '../../components/SceneStage/SceneStageImage'
import SvgHotspotLayer from '../../components/SvgHotspotLayer/SvgHotspotLayer'
import { useExteriorTransition } from '../../components/TransitionLayer/useExteriorTransition'
import { getMasterplanBlockPolygon } from './masterplanHotspots'
import { useI18n } from '../../i18n/useI18n'
import { exteriorMedia, getExteriorBlockMedia } from '../../media/exteriorMedia'
import './MasterplanPage.css'

type Source = 'polygon-pointer' | 'polygon-focus' | 'control-pointer' | 'control-focus'

export default function MasterplanPage() {
  const { t } = useI18n()
  const { isTransitioning, preloadTransition, startTransition } = useExteriorTransition()
  // Most recently entered source owns the highlight; leaving restores any owner below it.
  const [interactions, setInteractions] = useState<{ source: Source; id: string }[]>([])
  const highlightedId = interactions.at(-1)?.id ?? null
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
  useEffect(() => {
    preloadTransition(getExteriorBlockMedia(highlightedId)?.forwardTransition ?? null)
    return () => preloadTransition(null)
  }, [highlightedId, preloadTransition])

  const activate = (id: string) => {
    const media = getExteriorBlockMedia(id)
    if (!media) return
    if (startTransition({
      src: media.forwardTransition,
      destinationImageSrc: media.scene,
      to: `/block/${id}`,
      label: t('masterplan.transitionLabel'),
    })) setInteractions([])
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
