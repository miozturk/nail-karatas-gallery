import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import 'pannellum'
import 'pannellum/build/pannellum.css'
import { configuration, scenes } from './scenes'
import './PanoramaSpike.css'

function ViewerProof() {
  const container = useRef<HTMLDivElement>(null)
  const viewer = useRef<SpikeViewer | null>(null)
  const [active, setActive] = useState('living-room')
  const [error, setError] = useState('')

  useEffect(() => {
    const instance = window.pannellum.viewer(container.current!, configuration)
    viewer.current = instance
    const sceneChanged = (id: string) => { setActive(id); setError('') }
    const failed = (message: string) => setError(message)
    instance.on('scenechange', sceneChanged)
    instance.on('error', failed)
    return () => {
      instance.off('scenechange', sceneChanged)
      instance.off('error', failed)
      instance.destroy()
      viewer.current = null
    }
  }, [])

  function navigate(id: string) {
    if (viewer.current?.getScene() !== id) viewer.current?.loadScene(id)
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
