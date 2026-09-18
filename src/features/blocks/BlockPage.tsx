import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { blocks } from '../../data'
import NotFoundPage from '../../app/NotFoundPage'
import SceneStage from '../../components/SceneStage/SceneStage'
import TransitionLayer from '../../components/TransitionLayer/TransitionLayer'
import { developmentReverseVideo } from './developmentMedia'
import './BlockPage.css'

export default function BlockPage() {
  const { blockId } = useParams()
  const navigate = useNavigate()
  const pending = useRef(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const block = blocks.find((item) => item.id === blockId)

  const returnHome = () => {
    if (!pending.current) return
    pending.current = false
    setIsTransitioning(false)
    void navigate('/')
  }
  const activateHome = () => {
    // Protect even repeated activation before disabled is rendered.
    if (pending.current) return
    pending.current = true
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      returnHome()
      return
    }
    setIsTransitioning(true)
  }

  if (!block) return <NotFoundPage />

  return (
    <>
      <h1>{block.name} Blok</h1>
      <p>{block.category === 'commercial' ? 'Ticari' : 'Konut'} · Geliştirme sahnesi</p>
      <button className="block-scene__home" type="button" disabled={isTransitioning}
        onClick={activateHome}>Home — Ana görünüme dön</button>
      <p role="status">{isTransitioning
        ? 'Geliştirme geri dönüş videosu oynatılıyor — Home kilitli.'
        : 'Geri dönüş hazır — Home açık.'}</p>
      <figure className="block-scene">
        <SceneStage label={`${block.name} Blok geliştirme sahnesi: 1920 × 1440`}
          base={<div className="block-scene__background">
            <strong>{block.name}</strong>
            <span>GELİŞTİRME SAHNESİ</span>
          </div>}
          overlay={<TransitionLayer src={developmentReverseVideo} active={isTransitioning}
            label="Geliştirme geri dönüş videosu"
            onComplete={returnHome} onFailure={returnHome} />}
        />
        <figcaption>1920 × 1440 · 4:3 · Temsili geliştirme görseli ve videosu; gerçek proje medyası değildir.</figcaption>
      </figure>
    </>
  )
}
