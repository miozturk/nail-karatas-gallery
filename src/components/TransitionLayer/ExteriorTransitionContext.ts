import { createContext } from 'react'

export interface ExteriorTransitionRequest {
  src: string
  destinationImageSrc: string
  to: string
  label: string
}

export interface ExteriorTransitionContextValue {
  isTransitioning: boolean
  preloadTransition: (src: string | null) => void
  startTransition: (request: ExteriorTransitionRequest) => boolean
}

export const ExteriorTransitionContext = createContext<ExteriorTransitionContextValue | null>(null)
