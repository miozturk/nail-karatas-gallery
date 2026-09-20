export type ExteriorBlockId = 'a' | 'b' | 'c'

interface ExteriorBlockMedia {
  scene: string
  forwardTransition: string
  reverseTransition: string
}

export const exteriorMedia = {
  masterplan: '/media/scenes/project/masterplan.webp',
  blocks: {
    a: {
      scene: '/media/scenes/project/block-a.webp',
      forwardTransition: '/media/transitions/project/home-to-a.mp4',
      reverseTransition: '/media/transitions/project/a-to-home.mp4',
    },
    b: {
      scene: '/media/scenes/project/block-b.webp',
      forwardTransition: '/media/transitions/project/home-to-b.mp4',
      reverseTransition: '/media/transitions/project/b-to-home.mp4',
    },
    c: {
      scene: '/media/scenes/project/block-c.webp',
      forwardTransition: '/media/transitions/project/home-to-c.mp4',
      reverseTransition: '/media/transitions/project/c-to-home.mp4',
    },
  } satisfies Record<ExteriorBlockId, ExteriorBlockMedia>,
} as const

export function getExteriorBlockMedia(blockId: string | null | undefined) {
  if (blockId !== 'a' && blockId !== 'b' && blockId !== 'c') return undefined
  return exteriorMedia.blocks[blockId]
}
