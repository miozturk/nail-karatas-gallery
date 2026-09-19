import type { PanoramaTourDefinition } from '../../../panorama/types'

const rooms = [
  { id: 'living-room', name: 'Living Room', panorama: '/media/panoramas/dev/living-room.jpg', targets: ['hall'] },
  { id: 'hall', name: 'Hall', panorama: '/media/panoramas/dev/hall.jpg', targets: ['living-room', 'bedroom'] },
  { id: 'bedroom', name: 'Bedroom', panorama: '/media/panoramas/dev/bedroom.jpg', targets: ['hall'] },
] as const

export const tour: PanoramaTourDefinition = {
  initialSceneId: 'living-room',
  scenes: rooms.map((scene) => ({
    id: scene.id, name: scene.name, panoramaImage: scene.panorama,
    initialView: { yaw: 0, pitch: 0, hfov: 100 },
    hotspots: scene.targets.map((target, index) => ({
      targetSceneId: target, label: rooms.find((item) => item.id === target)!.name,
      pitch: 0, yaw: scene.targets.length === 1 ? 0 : index * 40 - 20,
    })),
  })),
}

export const scenes = tour.scenes
