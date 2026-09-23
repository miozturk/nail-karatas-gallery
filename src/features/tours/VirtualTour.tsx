import { useEffect, useRef, useState } from 'react'
import { createPanoramaAdapter } from '../../panorama/createPanoramaAdapter'
import type { PanoramaAdapter } from '../../panorama/PanoramaAdapter'
import type { PanoramaTourDefinition } from '../../panorama/types'
import { useI18n } from '../../i18n/useI18n'

export default function VirtualTour({ tour }: { tour: PanoramaTourDefinition }) {
  const { t } = useI18n()
  const host = useRef<HTMLDivElement>(null)
  const adapter = useRef<PanoramaAdapter | null>(null)
  const activeScene = useRef<string | null>(null)
  const [active, setActive] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [collapsed, setCollapsed] = useState(false)
  const [picked, setPicked] = useState<{ sourceSceneId: string; pitch: number; yaw: number } | null>(null)

  useEffect(() => {
    let disposed = false
    let instance: PanoramaAdapter | undefined
    let unsubscribe: (() => void) | undefined
    let unsubscribeError: (() => void) | undefined

    async function initialize() {
      try {
        setActive(null)
        setError('')
        const created = await createPanoramaAdapter()
        if (disposed) { created.destroy(); return }
        instance = created
        adapter.current = created
        unsubscribe = created.onSceneChange((id) => {
          activeScene.current = id
          setActive(id)
        })
        unsubscribeError = created.onError(() => setError(t('tour.panoramaError')))
        created.mount(host.current!)
        const previousScene = activeScene.current
        created.loadTour(previousScene && tour.scenes.some((scene) => scene.id === previousScene)
          ? { ...tour, initialSceneId: previousScene }
          : tour)
      } catch {
        if (!disposed) setError(t('tour.startError'))
      }
    }
    void initialize()
    return () => {
      disposed = true
      unsubscribe?.()
      unsubscribeError?.()
      instance?.destroy()
      adapter.current = null
    }
  }, [t, tour])

  function navigate(id: string) {
    try {
      adapter.current?.goToScene(id)
    } catch {
      setError(t('tour.roomError'))
    }
  }

  function pickCoordinate(event: React.MouseEvent<HTMLDivElement>) {
    if (!import.meta.env.DEV || !event.shiftKey) return
    const coordinates = adapter.current?.getCoordinatesAt(event.nativeEvent)
    if (coordinates) setPicked(coordinates)
  }

  const activeRoom = tour.scenes.find((scene) => scene.id === active)
  return <>
    <nav className="unit-tour__rooms" aria-label={t('tour.roomsLabel')}>
      {tour.scenes.map((scene) => <button key={scene.id} type="button"
        disabled={!active || !!error} aria-pressed={active === scene.id}
        onClick={() => navigate(scene.id)}>{scene.name}</button>)}
    </nav>
    <p className="ui-status unit-tour__status" role="status">{activeRoom ? t('tour.activeRoom', { room: activeRoom.name })
      : !error ? t('tour.starting') : t('tour.unavailableStatus')}</p>
    {error && <p className="unit-tour__error" role="alert">{error}</p>}
    <div className="unit-tour__stage">
      <div ref={host} className="unit-tour__viewer" role="region" aria-label={t('tour.viewerLabel')}
        onClick={pickCoordinate} />
      <section className={`unit-tour__minimap${collapsed ? ' unit-tour__minimap--collapsed' : ''}`}
        aria-label={t('tour.minimapLabel')}>
        <button type="button" aria-expanded={!collapsed} aria-controls="tour-minimap"
          onClick={() => setCollapsed((value) => !value)}>
          {collapsed ? t('tour.minimapOpen') : t('tour.minimapCollapse')}
        </button>
        <div id="tour-minimap" hidden={collapsed}>
          <p>{t('tour.minimapNotice')}</p>
          <div className="unit-tour__map">
            {tour.scenes.map((scene) => <button key={scene.id} type="button"
              disabled={!active || !!error} aria-pressed={active === scene.id}
              aria-label={t('tour.viewpointLabel', { room: scene.name })} onClick={() => navigate(scene.id)}>
              <span aria-hidden="true">{active === scene.id ? '●' : '○'}</span> {scene.name}
            </button>)}
          </div>
        </div>
      </section>
    </div>
    {import.meta.env.DEV && <div className="unit-tour__authoring">
      <strong>DEV · Hotspot koordinatı</strong>
      <p>Panorama üzerinde Shift+tık: kaynak sahne, pitch ve yaw değerini gösterir. Değeri seçip kopyalayın.</p>
      <output>{picked ? `sourceSceneId: ${picked.sourceSceneId}, pitch: ${picked.pitch.toFixed(4)}, yaw: ${picked.yaw.toFixed(4)}` : 'Henüz konum seçilmedi.'}</output>
    </div>}
  </>
}
