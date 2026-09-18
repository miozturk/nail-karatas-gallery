import type { Polygon } from '../../types'

// DEVELOPMENT-ONLY: arbitrary rectangles, not approved building silhouettes.
// Replace with authored project geometry in a later task; never domain Block data.
export const developmentBlockPolygons: Record<string, Polygon> = {
  a: [[180, 360], [620, 360], [620, 1080], [180, 1080]],
  b: [[740, 360], [1180, 360], [1180, 1080], [740, 1080]],
  c: [[1300, 360], [1740, 360], [1740, 1080], [1300, 1080]],
}
