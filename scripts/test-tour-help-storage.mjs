import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

const source = readFileSync(new URL('../src/features/tours/tourHelpStorage.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
function load(storage) {
  const context = { exports: {} }
  Object.defineProperty(context, 'localStorage', { get: storage })
  vm.runInNewContext(compiled, context)
  return context.exports
}
const data = new Map()
const storage = { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) }
let help = load(() => storage)
assert.equal(help.isTourHelpDismissed(), false)
help.dismissTourHelp()
assert.deepEqual([...data], [['nail-karatas-tour-help-v1', 'dismissed']])
assert.equal(load(() => storage).isTourHelpDismissed(), true, 'dismissal survives reload')
const fail = () => { throw new Error('Storage unavailable') }
for (const access of [fail, () => ({ getItem: fail, setItem: fail }), () => ({ getItem: () => null, setItem: fail })]) {
  help = load(access)
  assert.equal(help.isTourHelpDismissed(), false)
  assert.doesNotThrow(() => help.dismissTourHelp())
  assert.equal(help.isTourHelpDismissed(), true, 'route changes retain in-memory dismissal')
  assert.equal(load(access).isTourHelpDismissed(), false, 'reload safely shows help again without storage')
}
console.log('PASS: first visit, versioned persistence, reload, storage getter/read/write failures, session fallback')
