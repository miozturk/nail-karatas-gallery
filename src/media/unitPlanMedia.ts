type UnitPlanUnitTypeId = 'A-T03' | 'BC-T01' | 'BC-T01-M' | 'BC-T02' | 'BC-T02-M'

const unitPlanMediaByUnitType = {
  'A-T03': '/media/plans/project/plan-ticari.png',
  'BC-T01': '/media/plans/project/plan-bc-t01.png',
  'BC-T01-M': '/media/plans/project/plan-bc-t01-m.png',
  'BC-T02': '/media/plans/project/plan-bc-t02.png',
  'BC-T02-M': '/media/plans/project/plan-bc-t02-m.png',
} as const satisfies Record<UnitPlanUnitTypeId, string>

export function getUnitPlanMedia(unitTypeId: string): string | undefined {
  return Object.prototype.hasOwnProperty.call(unitPlanMediaByUnitType, unitTypeId)
    ? unitPlanMediaByUnitType[unitTypeId as UnitPlanUnitTypeId]
    : undefined
}
