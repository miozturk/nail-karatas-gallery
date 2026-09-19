import type { Tour } from '../types'

// Playback selection is not part of the reusable domain Tour.
export type PanoramaTourDefinition = Pick<Tour, 'scenes'> & {
  initialSceneId: string
}
