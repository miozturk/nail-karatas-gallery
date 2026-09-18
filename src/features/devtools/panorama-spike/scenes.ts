export const scenes = [
  { id: 'living-room', name: 'Living Room', panorama: '/media/panoramas/dev/living-room.jpg', targets: ['hall'] },
  { id: 'hall', name: 'Hall', panorama: '/media/panoramas/dev/hall.jpg', targets: ['living-room', 'bedroom'] },
  { id: 'bedroom', name: 'Bedroom', panorama: '/media/panoramas/dev/bedroom.jpg', targets: ['hall'] },
] as const

export const configuration = {
  default: { firstScene: 'living-room', autoLoad: true, sceneFadeDuration: 0 },
  scenes: Object.fromEntries(scenes.map((scene) => [scene.id, {
    type: 'equirectangular', panorama: scene.panorama, title: scene.name,
    yaw: 0, pitch: 0, hfov: 100,
    hotSpots: scene.targets.map((target, index) => ({
      type: 'scene', sceneId: target, text: scenes.find((item) => item.id === target)!.name,
      pitch: 0, yaw: scene.targets.length === 1 ? 0 : index * 40 - 20,
    })),
  }])),
}
