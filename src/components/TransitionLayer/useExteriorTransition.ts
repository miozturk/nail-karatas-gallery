import { useContext } from 'react'
import { ExteriorTransitionContext } from './ExteriorTransitionContext'

export function useExteriorTransition() {
  const value = useContext(ExteriorTransitionContext)
  if (!value) throw new Error('useExteriorTransition requires ExteriorTransitionProvider')
  return value
}
