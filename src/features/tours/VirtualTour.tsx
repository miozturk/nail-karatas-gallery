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

  const activeRoom = tour.scenes.find((scene) => scene.id === active)
  return <>
    <nav className="unit-tour__rooms" aria-label={t('tour.roomsLabel')}>
      {tour.scenes.map((scene) => <button key={scene.id} type="button"
        disabled={!active || !!error} aria-pressed={active === scene.id}
        onClick={() => navigate(scene.id)}>{scene.name}</button>)}
    </nav>
    <p role="status">{activeRoom ? t('tour.activeRoom', { room: activeRoom.name })
      : !error ? t('tour.starting') : t('tour.unavailableStatus')}</p>
    {error && <p role="alert">{error}</p>}
    <div className="unit-tour__stage">
      <div ref={host} className="unit-tour__viewer" role="region" aria-label={t('tour.viewerLabel')} />
      <section className="unit-tour__minimap" aria-label={t('tour.minimapLabel')}>
        <button type="button" aria-expanded={!collapsed} aria-controls="tour-minimap"
          onClick={() => setCollapsed((value) => !value)}>
          {collapsed ? t('tour.minimapOpen') : t('tour.minimapCollapse')}
        </button>
        <div id="tour-minimap" hidden={collapsed}>
          <p>{t('tour.minimapNotice')}</p>
          <div className="unit-tour__map">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <path d="M23 28 L50 70 L77 28" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
            {tour.scenes.map((scene) => <button key={scene.id} type="button"
              style={{ left: `${scene.minimap!.x}%`, top: `${scene.minimap!.y}%` }}
              disabled={!active || !!error} aria-pressed={active === scene.id}
              aria-label={t('tour.viewpointLabel', { room: scene.name })} onClick={() => navigate(scene.id)}>
              <span aria-hidden="true">{active === scene.id ? '●' : '○'}</span> {scene.name}
            </button>)}
          </div>
        </div>
      </section>
    </div>
  </>
}
