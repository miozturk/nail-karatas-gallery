import type { PanoramaAdapter } from './PanoramaAdapter'

// Keep the engine and its CSS lazy, including on unavailable Tour routes.
export async function createPanoramaAdapter(): Promise<PanoramaAdapter> {
  const { PannellumAdapter } = await import('./PannellumAdapter')
  return new PannellumAdapter()
}
