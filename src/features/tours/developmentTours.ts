import type { PanoramaTourDefinition } from '../../panorama/types'

// DEVELOPMENT-ONLY: synthetic media and schematic positions, not project interiors.
// Stable scene IDs are shared by every assigned UnitType; no per-Unit graph copies.
const rooms = [
  { id: 'living-room', name: 'Salon', panorama: '/media/panoramas/dev/living-room.jpg', x: 23, y: 28, targets: ['hall'] },
  { id: 'hall', name: 'Hol', panorama: '/media/panoramas/dev/hall.jpg', x: 50, y: 70, targets: ['living-room', 'bedroom'] },
  { id: 'bedroom', name: 'Yatak Odası', panorama: '/media/panoramas/dev/bedroom.jpg', x: 77, y: 28, targets: ['hall'] },
] as const

const developmentTour: PanoramaTourDefinition = {
  initialSceneId: 'living-room',
  scenes: rooms.map((room) => ({
    id: room.id,
    name: room.name,
    panoramaImage: room.panorama,
    minimap: { x: room.x, y: room.y },
    initialView: { yaw: 0, pitch: 0, hfov: 100 },
    hotspots: room.targets.map((target, index) => ({
      targetSceneId: target,
      label: rooms.find((item) => item.id === target)!.name,
      pitch: 0,
      yaw: room.targets.length === 1 ? 0 : index * 40 - 20,
    })),
  })),
}

// Approved snapshot marks these four types sourceTourMarkedAvailable.
// This explicit DEVELOPMENT-ONLY assignment does not imply production tourId/media.
const developmentTours: Readonly<Partial<Record<string, PanoramaTourDefinition>>> = {
  'BC-T01': developmentTour,
  'BC-T01-M': developmentTour,
  'BC-T02': developmentTour,
  'BC-T02-M': developmentTour,
}

export function getDevelopmentTour(unitTypeId: string) {
  return developmentTours[unitTypeId]
}
