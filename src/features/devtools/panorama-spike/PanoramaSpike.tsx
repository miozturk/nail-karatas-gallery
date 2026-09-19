import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { PanoramaAdapter } from '../../../panorama/PanoramaAdapter'
import { PannellumAdapter } from '../../../panorama/PannellumAdapter'
import { tour, scenes } from './scenes'
import './PanoramaSpike.css'

function ViewerProof() {
  const container = useRef<HTMLDivElement>(null)
  const viewer = useRef<PanoramaAdapter | null>(null)
  const [active, setActive] = useState('living-room')
  const [error, setError] = useState('')

  useEffect(() => {
    const instance: PanoramaAdapter = new PannellumAdapter()
    viewer.current = instance
    const sceneChanged = (id: string) => { setActive(id); setError('') }
    const failed = (message: string) => setError(message)
    const unsubscribe = instance.onSceneChange(sceneChanged)
    const unsubscribeError = instance.onError(failed)
    instance.mount(container.current!)
    try {
      instance.loadTour(tour)
    } catch (cause) {
      failed(cause instanceof Error ? cause.message : String(cause))
    }
    return () => {
      unsubscribe()
      unsubscribeError()
      instance.destroy()
      viewer.current = null
    }
  }, [])

  function navigate(id: string) {
    if (viewer.current?.getActiveScene() !== id) viewer.current?.goToScene(id)
  }

  return <>
    <p aria-live="polite">Aktif sahne: <strong>{active}</strong></p>
    <nav aria-label="Test oda menüsü">
      {scenes.map((scene) => <button key={scene.id} aria-pressed={active === scene.id}
        onClick={() => navigate(scene.id)}>{scene.name}</button>)}
    </nav>
    {error && <p role="alert">Panorama hatası: {error}</p>}
    <div ref={container} className="panorama-spike-viewer" aria-label="Test panoraması" />
    <section aria-label="Test minimap">
      <h2>Şematik minimap — gerçek plan değildir</h2>
      <div className="panorama-spike-map">
        {scenes.map((scene) => <button key={scene.id} aria-pressed={active === scene.id}
          onClick={() => navigate(scene.id)}>
          {active === scene.id ? '● ' : '○ '}{scene.name}
        </button>)}
      </div>
    </section>
  </>
}

export default function PanoramaSpike() {
  const [mounted, setMounted] = useState(true)
  return <main className="panorama-spike">
    <Link to="/">Home</Link>
    <h1>Panorama Technology Spike</h1>
    <p>DEVELOPMENT-ONLY — sentetik test görselleri; Nail Karataş iç mekânları değildir.</p>
    <button onClick={() => setMounted(!mounted)}>{mounted ? 'Viewer unmount' : 'Viewer mount'}</button>
    {mounted && <ViewerProof />}
  </main>
}
