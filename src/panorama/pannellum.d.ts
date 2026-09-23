declare module 'pannellum'

interface PannellumViewer {
  getScene(): string
  loadScene(id: string): void
  mouseEventToCoords(event: MouseEvent): [number, number]
  on(event: 'scenechange' | 'error' | 'load', listener: (value: string) => void): void
  off(event: 'scenechange' | 'error' | 'load', listener: (value: string) => void): void
  destroy(): void
}

interface Window {
  pannellum: { viewer(container: HTMLElement, config: unknown): PannellumViewer }
}
