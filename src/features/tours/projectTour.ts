import type { Tour } from '../../types'
import type { PanoramaTourDefinition } from '../../panorama/types'

// The four viewpoints are menu positions, not surveyed locations on a floor plan.
// Room-to-room pitch/yaw values below were authored by the human operator for IMP-032.
export const bcT01Tour: Tour = {
  id: 'bc-t01-project-tour',
  unitTypeId: 'BC-T01',
  scenes: [
    {
      id: 'living-room', name: 'Salon / Yaşam Alanı', panoramaImage: '/media/panoramas/project/living-room.jpg',
      hotspots: [
        { targetSceneId: 'bedroom-master', label: 'Ebeveyn Yatak Odası', pitch: -4.9493, yaw: 155.0516 },
        { targetSceneId: 'bathroom', label: 'Banyo', pitch: -1.2952, yaw: 123.4208 },
        { targetSceneId: 'bedroom-single', label: 'Oda', pitch: -0.0138, yaw: 105.6953 },
      ],
    },
    {
      id: 'bedroom-master', name: 'Ebeveyn Yatak Odası', panoramaImage: '/media/panoramas/project/bedroom-master.jpg',
      hotspots: [
        { targetSceneId: 'living-room', label: 'Salon / Yaşam Alanı', pitch: -0.7370, yaw: -119.5104 },
      ],
    },
    {
      id: 'bedroom-single', name: 'Oda', panoramaImage: '/media/panoramas/project/bedroom-single.jpg',
      hotspots: [
        { targetSceneId: 'living-room', label: 'Salon / Yaşam Alanı', pitch: 10.2664, yaw: 128.6045 },
      ],
    },
    {
      id: 'bathroom', name: 'Banyo', panoramaImage: '/media/panoramas/project/bathroom.jpg',
      hotspots: [
        { targetSceneId: 'living-room', label: 'Salon / Yaşam Alanı', pitch: 2.2864, yaw: 176.3229 },
      ],
    },
  ],
}

export function getProjectTour(unitTypeId: string): PanoramaTourDefinition | undefined {
  return unitTypeId === bcT01Tour.unitTypeId
    ? { initialSceneId: 'living-room', scenes: bcT01Tour.scenes }
    : undefined
}
