import 'pannellum'
import 'pannellum/build/pannellum.css'
import type { PanoramaAdapter } from './PanoramaAdapter'
import type { PanoramaTourDefinition } from './types'

export class PannellumAdapter implements PanoramaAdapter {
  private host: HTMLElement | null = null
  private viewer: PannellumViewer | null = null
  private sceneIds = new Set<string>()
  private active: string | null = null
  private subscribers = new Set<(sceneId: string) => void>()
  private errors = new Set<(message: string) => void>()

  private sceneChanged = (id: string) => {
    if (this.active === id) return
    this.active = id
    this.subscribers.forEach((callback) => callback(id))
  }

  private failed = (message: string) => {
    this.errors.forEach((callback) => callback(message))
  }

  private hotspotKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    event.stopPropagation()
    const target = event.currentTarget as HTMLElement
    target.click()
  }

  private labelHotspots = () => {
    this.host?.querySelectorAll<HTMLElement>('.pnlm-hotspot-base.pnlm-scene').forEach((element) => {
      if (element.getAttribute('role') === 'button') return
      const label = element.textContent?.trim()
      if (!label) return
      element.setAttribute('role', 'button')
      element.setAttribute('aria-label', label)
      element.tabIndex = 0
      element.addEventListener('keydown', this.hotspotKeydown)
    })
  }

  mount(element: HTMLElement) {
    if (this.host === element) return
    this.disposeViewer()
    this.host = element
  }

  loadTour(tour: PanoramaTourDefinition) {
    if (!this.host) throw new Error('Panorama: mount() must precede loadTour().')
    const ids = new Set(tour.scenes.map((scene) => scene.id))
    if (ids.size !== tour.scenes.length || tour.scenes.some((scene) => !scene.id)) {
      throw new Error('Panorama: scene IDs must be nonempty and unique.')
    }
    if (!ids.has(tour.initialSceneId)) throw new Error('Panorama: unknown initial scene.')
    for (const scene of tour.scenes) {
      for (const hotspot of scene.hotspots) {
        if (!ids.has(hotspot.targetSceneId)) throw new Error('Panorama: unknown hotspot target.')
      }
    }

    this.disposeViewer()
    try {
      this.viewer = window.pannellum.viewer(this.host, {
        default: { firstScene: tour.initialSceneId, autoLoad: true, sceneFadeDuration: 0 },
        scenes: Object.fromEntries(tour.scenes.map((scene) => [scene.id, {
          type: 'equirectangular', panorama: scene.panoramaImage, title: scene.name,
          ...scene.initialView,
          hotSpots: scene.hotspots.map((hotspot) => ({
            type: 'scene', sceneId: hotspot.targetSceneId, text: hotspot.label,
            pitch: hotspot.pitch, yaw: hotspot.yaw,
          })),
        }])),
      })
      this.sceneIds = ids
      this.viewer.on('scenechange', this.sceneChanged)
      this.viewer.on('error', this.failed)
      this.viewer.on('load', this.labelHotspots)
    } catch (error) {
      this.disposeViewer()
      throw error
    }
    this.sceneChanged(this.viewer.getScene())
  }

  goToScene(sceneId: string) {
    if (!this.viewer) throw new Error('Panorama: loadTour() must precede goToScene().')
    if (!this.sceneIds.has(sceneId)) throw new Error(`Panorama: unknown scene "${sceneId}".`)
    if (this.active !== sceneId) this.viewer.loadScene(sceneId)
  }

  getActiveScene() { return this.active }

  onSceneChange(callback: (sceneId: string) => void) {
    this.subscribers.add(callback)
    return () => { this.subscribers.delete(callback) }
  }

  onError(callback: (message: string) => void) {
    this.errors.add(callback)
    return () => { this.errors.delete(callback) }
  }

  getCoordinatesAt(event: MouseEvent) {
    if (!this.viewer || !this.active) return null
    const [pitch, yaw] = this.viewer.mouseEventToCoords(event)
    return { sourceSceneId: this.active, pitch, yaw }
  }

  private disposeViewer() {
    if (this.viewer) {
      this.viewer.off('scenechange', this.sceneChanged)
      this.viewer.off('error', this.failed)
      this.viewer.off('load', this.labelHotspots)
      this.viewer.destroy()
    }
    this.viewer = null
    this.sceneIds.clear()
    this.active = null
  }

  destroy() {
    this.disposeViewer()
    this.host = null
    this.subscribers.clear()
    this.errors.clear()
  }
}
