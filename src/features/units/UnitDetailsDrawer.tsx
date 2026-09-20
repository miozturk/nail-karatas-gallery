import { Link } from 'react-router-dom'
import type { Unit, UnitType } from '../../types'
import {
  formatArea, formatAvailability, formatCategory, formatFloor, formatOrientation, formatUnitTypeName,
} from '../../i18n/formatters'
import { useI18n } from '../../i18n/useI18n'
import './UnitDetailsDrawer.css'

interface UnitDetailsDrawerProps {
  unit: Unit
  unitType: UnitType
  disabled: boolean
}

export default function UnitDetailsDrawer({ unit, unitType, disabled }: UnitDetailsDrawerProps) {
  const { locale, t } = useI18n()
  const route = `/block/${unit.blockId}/unit/${unit.id}`

  return (
    <section className="unit-details-drawer" aria-labelledby="unit-details-title" inert={disabled}>
      <header>
        <h2 id="unit-details-title">{t('details.title', { unit: unit.id })}</h2>
        <Link to={`/block/${unit.blockId}`}>{t('details.backBlock')}</Link>
      </header>
      <dl>
        <div><dt>{t('details.unitId')}</dt><dd>{unit.id}</dd></div>
        <div><dt>{t('unit.officialNumber')}</dt><dd>{unit.unitNo}</dd></div>
        <div><dt>{t('unit.floor')}</dt><dd>{formatFloor(unit.floor, t)}</dd></div>
        <div><dt>{t('unit.type')}</dt><dd>{formatUnitTypeName(unitType.name, unitType.rooms, t)}</dd></div>
        <div><dt>{t('unit.category')}</dt><dd>{formatCategory(unitType.category, t)}</dd></div>
        {unitType.rooms && <div><dt>{t('unit.rooms')}</dt><dd>{unitType.rooms}</dd></div>}
        {unitType.netArea !== undefined && <div><dt>{t('unit.netArea')}</dt><dd>{formatArea(unitType.netArea, locale)}</dd></div>}
        {unit.orientation && <div><dt>{t('unit.orientation')}</dt><dd>{formatOrientation(unit.orientation, t)}</dd></div>}
        <div><dt>{t('unit.availability')}</dt><dd>{formatAvailability(unit.availability, t)}</dd></div>
      </dl>
      <div className="unit-details-drawer__media">
        <section className="unit-details-drawer__placeholder" aria-label={t('details.planAria')}>
          <h3>{t('details.planTitle')}</h3>
          <p>{t('details.planNotice')}</p>
        </section>
        <section className="unit-details-drawer__placeholder" aria-label={t('details.galleryAria')}>
          <h3>{t('details.galleryTitle')}</h3>
          <p>{t('details.galleryNotice')}</p>
        </section>
      </div>
      <nav aria-label={t('details.actionsLabel', { unit: unit.id })}>
        <Link to={route}>{t('details.backQuickCard')}</Link>
        <Link to={`${route}/tour`}>{t('unit.virtualTour')}</Link>
      </nav>
    </section>
  )
}
