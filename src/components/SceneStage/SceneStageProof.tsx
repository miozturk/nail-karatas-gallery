import SceneStage from './SceneStage'
import './SceneStageProof.css'

export default function SceneStageProof() {
  return (
    <figure className="scene-stage-proof">
      <SceneStage
        label="Geliştirme sahnesi: 1920 × 1440 mantıksal koordinat alanı"
        base={<div className="scene-stage-proof__background" />}
        overlay={<span className="scene-stage-proof__center" aria-hidden="true" />}
      />
      <figcaption>Geliştirme kontrolü: 1920 × 1440 · 4:3 · merkez işareti (960, 720).</figcaption>
    </figure>
  )
}
