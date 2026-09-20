import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

function loadTypeScript(path) {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8')
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  const context = { exports: {} }
  vm.runInNewContext(compiled, context)
  return context.exports
}

const { tr } = loadTypeScript('../src/i18n/translations/tr.ts')
const { en } = loadTypeScript('../src/i18n/translations/en.ts')
const { ru } = loadTypeScript('../src/i18n/translations/ru.ts')
const locale = loadTypeScript('../src/i18n/locale.ts')

assert.deepEqual([...locale.SUPPORTED_LOCALES], ['tr', 'en', 'ru'])
assert.equal(locale.DEFAULT_LOCALE, 'tr')
assert.equal(locale.LOCALE_STORAGE_KEY, 'nail-karatas-locale-v1')

const canonicalKeys = Object.keys(tr).sort()
assert(canonicalKeys.length > 0)
for (const [name, dictionary] of Object.entries({ tr, en, ru })) {
  assert.deepEqual(Object.keys(dictionary).sort(), canonicalKeys, `${name} dictionary keys must match Turkish`)
  assert(Object.values(dictionary).every((value) => typeof value === 'string' && value.length > 0))
}

const storage = (value) => ({ getItem: () => value, setItem: () => {} })
for (const supported of locale.SUPPORTED_LOCALES) {
  assert.equal(locale.readStoredLocale(storage(supported)), supported)
}
for (const invalid of [null, '', 'de', 'TR', 'ru-RU']) {
  assert.equal(locale.readStoredLocale(storage(invalid)), 'tr')
}

const fail = () => { throw new Error('Storage unavailable') }
assert.equal(locale.readStoredLocale({ getItem: fail, setItem: fail }), 'tr')
assert.doesNotThrow(() => locale.writeStoredLocale('en', { getItem: fail, setItem: fail }))

console.log(`PASS: locales tr/en/ru, ${canonicalKeys.length} parity keys, invalid/storage-failure fallback to tr`)
