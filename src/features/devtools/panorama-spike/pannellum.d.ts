// Spike-local declarations only; the formal adapter belongs to IMP-014.
declare module 'pannellum'

interface SpikeViewer {
  getScene(): string
  loadScene(id: string): void
  on(event: string, listener: (value: string) => void): void
  off(event: string, listener: (value: string) => void): void
  destroy(): void
}

interface Window {
  pannellum: { viewer(container: HTMLElement, config: unknown): SpikeViewer }
}
