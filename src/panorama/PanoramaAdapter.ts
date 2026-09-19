import type { PanoramaTourDefinition } from './types'

export interface PanoramaAdapter {
  mount(element: HTMLElement): void
  loadTour(tour: PanoramaTourDefinition): void
  goToScene(sceneId: string): void
  getActiveScene(): string | null
  onSceneChange(callback: (sceneId: string) => void): () => void
  onError(callback: (message: string) => void): () => void
  destroy(): void
}
