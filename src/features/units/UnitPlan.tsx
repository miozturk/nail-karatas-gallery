import type { Unit, UnitType } from '../../types'
import { useI18n } from '../../i18n/useI18n'
import { getUnitPlanMedia } from '../../media/unitPlanMedia'
import './UnitPlan.css'

interface UnitPlanProps {
  unit: Unit
  unitType: UnitType
  variant: 'compact' | 'detail'
}

export default function UnitPlan({ unit, unitType, variant }: UnitPlanProps) {
  const { t } = useI18n()
  const planSrc = getUnitPlanMedia(unitType.id)
  const caption = variant === 'compact' ? t('unit.planPreview') : t('details.planTitle')

  return (
    <figure className={`unit-plan unit-plan--${variant}`}>
      <div className="unit-plan__frame">
        {planSrc
          ? <img src={planSrc} alt={t('unit.planImageAlt', { unit: unit.id })}
              loading="lazy" decoding="async" />
          : <p className="unit-plan__unavailable">{t('unit.planUnavailable')}</p>}
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

