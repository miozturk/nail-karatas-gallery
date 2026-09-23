import assert from 'node:assert/strict'
import { bcT01Tour, getProjectTour } from '../src/features/tours/projectTour.ts'
import { localizeTour } from '../src/i18n/formatters.ts'
import { tr } from '../src/i18n/translations/tr.ts'
import { en } from '../src/i18n/translations/en.ts'
import { ru } from '../src/i18n/translations/ru.ts'

// Exact operator-supplied IMP-032 graph; reject additions and coordinate drift.
const expected = {
  'living-room': [
    ['bedroom-master', -4.9493, 155.0516],
    ['bathroom', -1.2952, 123.4208],
    ['bedroom-single', -0.0138, 105.6953],
  ],
  'bedroom-master': [['living-room', -0.7370, -119.5104]],
  'bedroom-single': [['living-room', 10.2664, 128.6045]],
  bathroom: [['living-room', 2.2864, 176.3229]],
}

assert.equal(bcT01Tour.id, 'bc-t01-project-tour')
assert.equal(bcT01Tour.unitTypeId, 'BC-T01')
assert.deepEqual(Object.fromEntries(bcT01Tour.scenes.map((scene) => [
  scene.id, scene.hotspots.map(({ targetSceneId, pitch, yaw }) => [targetSceneId, pitch, yaw]),
])), expected)
assert.strictEqual(getProjectTour('BC-T01').scenes, bcT01Tour.scenes)
for (const excluded of ['BC-T01-M', 'BC-T02', 'BC-T02-M', 'A-T01', 'A-T02', 'A-T03', 'A-T03-M', 'A-T04', 'A-T04-M']) {
  assert.equal(getProjectTour(excluded), undefined, `${excluded} must have no Tour`)
}
for (const [locale, dictionary] of Object.entries({ tr, en, ru })) {
  const localized = localizeTour(getProjectTour('BC-T01'), (key) => dictionary[key])
  const names = new Map(localized.scenes.map((scene) => [scene.id, scene.name]))
  for (const scene of localized.scenes) {
    for (const hotspot of scene.hotspots) {
      assert.equal(hotspot.label, names.get(hotspot.targetSceneId), `${locale}: target label`)
    }
  }
}
console.log('PASS: exact six human hotspots, one BC-T01 Tour, excluded types, TR/EN/RU hotspot labels')
