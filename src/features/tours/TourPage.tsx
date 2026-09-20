import { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { blocks, units, unitTypes } from '../../data'
import NotFoundPage from '../../app/NotFoundPage'
import { getDevelopmentTour } from './developmentTours'
import VirtualTour from './VirtualTour'
import TourHelp from './TourHelp'
import { formatFloor, formatUnitTypeName, localizeTour } from '../../i18n/formatters'
import { useI18n } from '../../i18n/useI18n'
import './TourPage.css'

export default function TourPage() {
  const { t } = useI18n()
  const returnLink = useRef<HTMLAnchorElement>(null)
  const { blockId, unitId } = useParams()
  const block = blocks.find((item) => item.id === blockId)
  const unit = units.find((item) => item.id === unitId && item.blockId === blockId)
  const unitType = unitTypes.find((item) => item.id === unit?.unitTypeId)
  const tour = unitType ? getDevelopmentTour(unitType.id) : undefined
  const localizedTour = tour ? localizeTour(tour, t) : undefined
  if (!block || !unit || !unitType) return <NotFoundPage />

  return (
    <section className="unit-tour" aria-labelledby="unit-tour-title">
      <header className="unit-tour__header">
        <h1 id="unit-tour-title">{t('tour.title', { unit: unit.id })}</h1>
        <Link className="ui-action ui-action--secondary" ref={returnLink}
          to={`/block/${block.id}/unit/${unit.id}`}>{t('tour.returnUnit')}</Link>
      </header>
      <p className="unit-tour__context">{block.name} · {formatUnitTypeName(unitType.name, unitType.rooms, t)} · {formatFloor(unit.floor, t)}</p>
      {localizedTour ? <>
        <p className="ui-notice unit-tour__notice">{t('tour.notice')}</p>
        <VirtualTour key={unit.id} tour={localizedTour} />
        <TourHelp key={`help-${unit.id}`} returnFocus={returnLink} />
      </> : <p className="unit-tour__unavailable" role="status">{t('tour.unavailable')}</p>}
    </section>
  )
}
