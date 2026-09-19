import { Link, useParams } from 'react-router-dom'
import { blocks, units, unitTypes } from '../../data'
import NotFoundPage from '../../app/NotFoundPage'
import { getDevelopmentTour } from './developmentTours'
import VirtualTour from './VirtualTour'
import './TourPage.css'

export default function TourPage() {
  const { blockId, unitId } = useParams()
  const block = blocks.find((item) => item.id === blockId)
  const unit = units.find((item) => item.id === unitId && item.blockId === blockId)
  const unitType = unitTypes.find((item) => item.id === unit?.unitTypeId)
  if (!block || !unit || !unitType) return <NotFoundPage />
  const tour = getDevelopmentTour(unitType.id)

  return (
    <section className="unit-tour" aria-labelledby="unit-tour-title">
      <header className="unit-tour__header">
        <h1 id="unit-tour-title">Sanal Tur · {unit.id}</h1>
        <Link to={`/block/${block.id}/unit/${unit.id}`}>Daireye Dön</Link>
      </header>
      <p>{block.name} · {unitType.name} · {unit.floor}</p>
      {tour ? <>
        <p className="unit-tour__notice">DEVELOPMENT-ONLY · Sentetik test görselleri; gerçek proje iç mekânları değildir.</p>
        <VirtualTour key={unit.id} tour={tour} />
      </> : <p role="status">Sanal tur henüz mevcut değil</p>}
    </section>
  )
}
