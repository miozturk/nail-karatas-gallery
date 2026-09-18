import { useState } from 'react'
import SvgHotspotLayer, { type SvgHotspot } from '../SvgHotspotLayer/SvgHotspotLayer'
import SceneStage from './SceneStage'
import './SceneStageProof.css'

const developmentHotspots: readonly SvgHotspot[] = [
  { id: 'rectangle', label: 'Deneme dikdörtgeni', points: [[160, 180], [700, 180], [700, 540], [160, 540]] },
  { id: 'irregular', label: 'Deneme düzensiz bölgesi', points: [[1160, 220], [1690, 160], [1780, 500], [1450, 620], [1120, 430]] },
  { id: 'disabled', label: 'Devre dışı deneme bölgesi', disabled: true, points: [[320, 940], [760, 940], [760, 1240], [320, 1240]] },
]

export default function SceneStageProof() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activations, setActivations] = useState(0)
  const [baseClicks, setBaseClicks] = useState(0)
  return (
    <figure className="scene-stage-proof">
      <SceneStage
        label="Geliştirme sahnesi: 1920 × 1440 mantıksal koordinat alanı"
        base={<div className="scene-stage-proof__background" onClick={() => setBaseClicks((count) => count + 1)} />}
        interaction={
          <SvgHotspotLayer
            label="Sahte geliştirme poligonları"
            hotspots={developmentHotspots}
            hoveredId={hoveredId}
            activeId={activeId}
            onHover={setHoveredId}
            onLeave={(id) => setHoveredId((current) => current === id ? null : current)}
            onActivate={(id) => {
              setActiveId(id)
              setActivations((count) => count + 1)
            }}
          />
        }
        overlay={<span className="scene-stage-proof__center" aria-hidden="true" />}
      />
      <figcaption>Geliştirme kontrolü: 1920 × 1440 · 4:3 · merkez işareti (960, 720).</figcaption>
      <p>Hover: {hoveredId ?? 'yok'} · Zemin tıklaması: {baseClicks}</p>
      <p role="status">Seçilen: {activeId ?? 'yok'} · Aktivasyon: {activations}</p>
    </figure>
  )
}
