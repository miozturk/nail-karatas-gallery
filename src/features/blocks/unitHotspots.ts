import type { ExteriorBlockId } from '../../media/exteriorMedia'
import type { Polygon } from '../../types'

export const unitHotspotIds = [
  'A-003',
  'B-301',
  'B-302',
  'B-303',
  'B-304',
  'C-401',
  'C-402',
  'C-403',
  'C-404',
] as const

export type UnitHotspotId = typeof unitHotspotIds[number]

interface UnitHotspot {
  blockId: ExteriorBlockId
  points: Polygon
}

// Human-authored against the production 1920 × 1440 Block renders in IMP-028.
// Unit assignments, coordinates, and point order are preserved from the operator export.
export const unitHotspots = {
  'A-003': {
    blockId: 'a',
    points: [
      [762, 742],
      [757, 584],
      [1039, 585],
      [1037, 740],
    ],
  },
  'B-301': {
    blockId: 'b',
    points: [
      [1352, 621],
      [1350, 717],
      [1187, 731],
      [1187, 634],
    ],
  },
  'B-302': {
    blockId: 'b',
    points: [
      [1154, 760],
      [965, 772],
      [962, 675],
      [1158, 659],
    ],
  },
  'B-303': {
    blockId: 'b',
    points: [
      [940, 677],
      [938, 774],
      [739, 789],
      [737, 693],
    ],
  },
  'B-304': {
    blockId: 'b',
    points: [
      [701, 672],
      [703, 765],
      [493, 787],
      [484, 681],
    ],
  },
  'C-401': {
    blockId: 'c',
    points: [
      [387, 569],
      [591, 567],
      [595, 666],
      [385, 668],
    ],
  },
  'C-402': {
    blockId: 'c',
    points: [
      [620, 587],
      [823, 584],
      [816, 695],
      [615, 688],
    ],
  },
  'C-403': {
    blockId: 'c',
    points: [
      [845, 587],
      [1050, 589],
      [1052, 690],
      [841, 690],
    ],
  },
  'C-404': {
    blockId: 'c',
    points: [
      [1077, 587],
      [1280, 589],
      [1275, 691],
      [1073, 691],
    ],
  },
} as const satisfies Record<UnitHotspotId, UnitHotspot>

export function isUnitHotspotId(unitId: string): unitId is UnitHotspotId {
  return unitHotspotIds.some((expectedId) => expectedId === unitId)
}

export function getUnitHotspot(unitId: string): UnitHotspot | undefined {
  return isUnitHotspotId(unitId) ? unitHotspots[unitId] : undefined
}
