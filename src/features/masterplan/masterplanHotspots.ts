import type { ExteriorBlockId } from '../../media/exteriorMedia'
import type { Polygon } from '../../types'

// Human-authored against the production 1920 × 1440 Masterplan render in IMP-027.
export const masterplanBlockPolygons = {
  a: [
    [189, 801],
    [458, 641],
    [863, 722],
    [886, 697],
    [973, 719],
    [969, 749],
    [1390, 843],
    [1348, 906],
    [1348, 958],
    [1167, 1150],
    [234, 907],
    [230, 817],
  ],
  b: [
    [586, 663],
    [568, 316],
    [636, 284],
    [629, 240],
    [701, 206],
    [786, 224],
    [811, 212],
    [888, 222],
    [890, 239],
    [938, 248],
    [933, 611],
    [762, 701],
  ],
  c: [
    [1064, 224],
    [1111, 199],
    [1228, 217],
    [1266, 186],
    [1435, 213],
    [1431, 246],
    [1604, 276],
    [1580, 636],
    [1532, 684],
    [1048, 605],
  ],
} as const satisfies Record<ExteriorBlockId, Polygon>

export function getMasterplanBlockPolygon(blockId: string): Polygon | undefined {
  if (blockId !== 'a' && blockId !== 'b' && blockId !== 'c') return undefined
  return masterplanBlockPolygons[blockId]
}
