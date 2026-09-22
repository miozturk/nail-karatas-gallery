import { Link } from 'react-router-dom'
import type { Unit, UnitType } from '../../types'
import { formatArea, formatCategory, formatFloor, formatUnitTypeName } from '../../i18n/formatters'
import { useI18n } from '../../i18n/useI18n'
import UnitPlan from './UnitPlan'
import './UnitQuickCard.css'

interface UnitQuickCardProps {
  unit: Unit
  unitType: UnitType
  disabled: boolean
}

export default function UnitQuickCard({ unit, unitType, disabled }: UnitQuickCardProps) {
  const { locale, t } = useI18n()
  const route = `/block/${unit.blockId}/unit/${unit.id}`
  return (
    <section className="unit-quick-card" aria-labelledby="unit-quick-card-title" inert={disabled}>
      <header>
        <h2 id="unit-quick-card-title">{t('unit.quickTitle', { unit: unit.id })}</h2>
        <Link className="ui-action ui-action--quiet" to={`/block/${unit.blockId}`}
          aria-label={t('unit.closeAria')}>{t('unit.close')}</Link>
      </header>
      <div className="unit-quick-card__body">
        <UnitPlan unit={unit} unitType={unitType} variant="compact" />
        <dl>
          <div><dt>{t('unit.officialNumber')}</dt><dd>{unit.unitNo}</dd></div>
          <div><dt>{t('unit.floor')}</dt><dd>{formatFloor(unit.floor, t)}</dd></div>
          <div><dt>{t('unit.type')}</dt><dd>{formatUnitTypeName(unitType.name, unitType.rooms, t)}</dd></div>
          <div><dt>{t('unit.category')}</dt><dd>{formatCategory(unitType.category, t)}</dd></div>
          {unitType.rooms && <div><dt>{t('unit.rooms')}</dt><dd>{unitType.rooms}</dd></div>}
          {unitType.netArea !== undefined && <div><dt>{t('unit.netArea')}</dt><dd>{formatArea(unitType.netArea, locale)}</dd></div>}
        </dl>
      </div>
      <nav aria-label={t('unit.actionsLabel', { unit: unit.id })}>
        <Link className="ui-action ui-action--primary" to={`${route}/tour`}>{t('unit.virtualTour')}</Link>
        <Link className="ui-action ui-action--secondary" to={`${route}/details`}>{t('unit.details')}</Link>
      </nav>
    </section>
  )
}
