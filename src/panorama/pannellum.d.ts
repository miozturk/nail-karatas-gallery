declare module 'pannellum'

interface PannellumViewer {
  getScene(): string
  loadScene(id: string): void
  on(event: 'scenechange' | 'error', listener: (value: string) => void): void
  off(event: 'scenechange' | 'error', listener: (value: string) => void): void
  destroy(): void
}

interface Window {
  pannellum: { viewer(container: HTMLElement, config: unknown): PannellumViewer }
}
