import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

// Contract test with a deterministic engine double; real WebGL is checked in-browser.
const instances = []
const window = { pannellum: { viewer(host, config) {
  assert.equal(host.children, 0, 'previous viewer must be disposed first')
  host.children++
  const listeners = new Map()
  const instance = {
    config, destroyed: false, scene: config.default.firstScene, loads: 0,
    getScene() { return this.scene },
    loadScene(id) { this.loads++; this.scene = id; listeners.get('scenechange')?.(id) },
    on(event, callback) { listeners.set(event, callback) },
    off(event, callback) { assert.equal(listeners.get(event), callback); listeners.delete(event) },
    destroy() { assert.equal(listeners.size, 0); assert.equal(this.destroyed, false); this.destroyed = true; host.children-- },
    emit(event, value) { listeners.get(event)?.(value) },
  }
  instances.push(instance)
  return instance
} } }
const source = readFileSync(new URL('../src/panorama/PannellumAdapter.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
const context = { exports: {}, window, require: (name) => {
  assert.ok(['pannellum', 'pannellum/build/pannellum.css'].includes(name))
} }
vm.runInNewContext(compiled, context)
const adapter = new context.exports.PannellumAdapter()
const host = { children: 0 }
const tour = { initialSceneId: 'a', scenes: [
  { id: 'a', name: 'A', panoramaImage: '/a.jpg', initialView: { yaw: 1, pitch: 2, hfov: 90 }, hotspots: [{ targetSceneId: 'b', label: 'B', pitch: 3, yaw: 4 }] },
  { id: 'b', name: 'B', panoramaImage: '/b.jpg', hotspots: [] },
] }
assert.throws(() => adapter.loadTour(tour), /mount/)
assert.throws(() => adapter.goToScene('a'), /loadTour/)
adapter.mount(host)
const changes = []
const unsubscribe = adapter.onSceneChange((id) => changes.push(id))
const errors = []
const unsubscribeError = adapter.onError((message) => errors.push(message))
adapter.loadTour(tour)
assert.equal(adapter.getActiveScene(), 'a')
assert.deepEqual(changes, ['a'])
const first = instances[0]
assert.equal(first.config.scenes.a.panorama, '/a.jpg')
assert.equal(first.config.scenes.a.yaw, 1)
assert.equal(first.config.scenes.a.hotSpots[0].sceneId, 'b')
assert.equal(first.config.scenes.a.hotSpots[0].yaw, 4)
adapter.goToScene('b')
assert.equal(adapter.getActiveScene(), 'b')
adapter.goToScene('b')
assert.equal(first.loads, 1)
first.emit('scenechange', 'a')
assert.equal(adapter.getActiveScene(), 'a')
assert.deepEqual(changes, ['a', 'b', 'a'])
assert.throws(() => adapter.goToScene('missing'), /unknown scene/)
assert.throws(() => adapter.loadTour({ ...tour, initialSceneId: 'missing' }), /initial scene/)
assert.throws(() => adapter.loadTour({ ...tour, scenes: [tour.scenes[0], tour.scenes[0]] }), /unique/)
assert.throws(() => adapter.loadTour({ ...tour, scenes: [tour.scenes[0]] }), /hotspot/)
assert.equal(first.destroyed, false, 'invalid input preserves current viewer')
first.emit('error', 'test error')
assert.deepEqual(errors, ['test error'])
unsubscribeError()
first.emit('error', 'ignored')
assert.equal(errors.length, 1)
unsubscribe()
unsubscribe()
adapter.goToScene('b')
assert.equal(changes.length, 3)
adapter.loadTour({ ...tour, initialSceneId: 'b' })
assert.equal(first.destroyed, true)
assert.equal(host.children, 1)
assert.equal(adapter.getActiveScene(), 'b')
adapter.onSceneChange(() => assert.fail('destroy must remove subscribers'))
adapter.destroy()
adapter.destroy()
assert.equal(adapter.getActiveScene(), null)
assert.equal(host.children, 0)
for (let cycle = 0; cycle < 3; cycle++) {
  adapter.mount(host)
  adapter.loadTour(tour)
  assert.equal(host.children, 1)
  adapter.destroy()
  assert.equal(host.children, 0)
}
console.log('PASS: mapping, navigation, validation, unsubscribe, replacement, idempotent destroy and 3 remounts')
