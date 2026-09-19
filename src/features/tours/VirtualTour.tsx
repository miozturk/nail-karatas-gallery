import { useEffect, useRef, useState } from 'react'
import { createPanoramaAdapter } from '../../panorama/createPanoramaAdapter'
import type { PanoramaAdapter } from '../../panorama/PanoramaAdapter'
import type { PanoramaTourDefinition } from '../../panorama/types'

export default function VirtualTour({ tour }: { tour: PanoramaTourDefinition }) {
  const host = useRef<HTMLDivElement>(null)
  const adapter = useRef<PanoramaAdapter | null>(null)
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
        const created = await createPanoramaAdapter()
        if (disposed) { created.destroy(); return }
        instance = created
        adapter.current = created
        unsubscribe = created.onSceneChange(setActive)
        unsubscribeError = created.onError(() => setError('Panorama yüklenemedi. Daireye dönebilirsiniz.'))
        created.mount(host.current!)
        created.loadTour(tour)
      } catch {
        if (!disposed) setError('Sanal tur başlatılamadı. Daireye dönebilirsiniz.')
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
  }, [tour])

  function navigate(id: string) {
    try {
      adapter.current?.goToScene(id)
    } catch {
      setError('Oda açılamadı. Daireye dönebilirsiniz.')
    }
  }

  const activeRoom = tour.scenes.find((scene) => scene.id === active)
  return <>
    <nav className="unit-tour__rooms" aria-label="Oda menüsü">
      {tour.scenes.map((scene) => <button key={scene.id} type="button"
        disabled={!active || !!error} aria-pressed={active === scene.id}
        onClick={() => navigate(scene.id)}>{scene.name}</button>)}
    </nav>
    <p role="status">{activeRoom ? `Aktif oda: ${activeRoom.name}` : !error ? 'Tur görüntüleyici başlatılıyor…' : 'Tur kullanılamıyor.'}</p>
    {error && <p role="alert">{error}</p>}
    <div className="unit-tour__stage">
      <div ref={host} className="unit-tour__viewer" role="region" aria-label="360 derece oda panoraması" />
      <section className="unit-tour__minimap" aria-label="Tur minimap">
        <button type="button" aria-expanded={!collapsed} aria-controls="tour-minimap"
          onClick={() => setCollapsed((value) => !value)}>
          {collapsed ? 'Minimap’i aç' : 'Minimap’i daralt'}
        </button>
        <div id="tour-minimap" hidden={collapsed}>
          <p>DEVELOPMENT-ONLY<br />Şematik görünüm · Gerçek plan değildir.</p>
          <div className="unit-tour__map">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <path d="M23 28 L50 70 L77 28" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
            {tour.scenes.map((scene) => <button key={scene.id} type="button"
              style={{ left: `${scene.minimap!.x}%`, top: `${scene.minimap!.y}%` }}
              disabled={!active || !!error} aria-pressed={active === scene.id}
              aria-label={`${scene.name} bakış noktası`} onClick={() => navigate(scene.id)}>
              <span aria-hidden="true">{active === scene.id ? '●' : '○'}</span> {scene.name}
            </button>)}
          </div>
        </div>
      </section>
    </div>
  </>
}
