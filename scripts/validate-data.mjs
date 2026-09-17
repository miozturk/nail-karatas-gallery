import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { blocks, unitTypes, units } from '../src/data/index.ts'

// Node 24 loads the actual application seeds using built-in type stripping.
const source = JSON.parse(readFileSync(new URL('../data-source/inventory.snapshot.json', import.meta.url), 'utf8'))
const expectedDemoIds = ['A-003', 'B-301', 'B-302', 'B-303', 'B-304', 'C-401', 'C-402', 'C-403', 'C-404']

function uniqueIds(records, label) {
  const ids = new Set(records.map(record => record.id))
  assert.equal(ids.size, records.length, `${label}: duplicate ID`)
  return ids
}

try {
  const blockIds = uniqueIds(blocks, 'Block')
  const typeIds = uniqueIds(unitTypes, 'UnitType')
  uniqueIds(units, 'Unit')
  assert.equal(blocks.length, 3, 'Expected 3 Blocks')
  assert.equal(unitTypes.length, 10, 'Expected 10 UnitTypes')
  assert.equal(units.length, 78, 'Expected 78 Units')
  assert.deepEqual([...blockIds].sort(), ['a', 'b', 'c'])

  for (const [id, count] of Object.entries({ a: 6, b: 32, c: 40 })) {
    assert.equal(units.filter(unit => unit.blockId === id).length, count, `Block ${id}: wrong Unit count`)
    assert.equal(blocks.find(block => block.id === id).category, id === 'a' ? 'commercial' : 'residential')
  }
  for (const unit of units) {
    assert.ok(blockIds.has(unit.blockId), `${unit.id}: unknown Block ${unit.blockId}`)
    assert.ok(typeIds.has(unit.unitTypeId), `${unit.id}: unknown UnitType ${unit.unitTypeId}`)
  }
  const demoIds = units.filter(unit => unit.demoEnabled).map(unit => unit.id).sort()
  assert.equal(demoIds.length, 9, 'Expected 9 demo Units')
  assert.deepEqual(demoIds, expectedDemoIds, 'Unexpected demo-unit set')

  // Compare all domain fields to the approved normalized source, including omissions.
  // UnitType planning flags must never become runtime tour/demo values.
  const expectedTypes = source.unitTypes.map(row => Object.fromEntries(
    Object.entries(row).filter(([key, value]) => !['sourceBlocks', 'sourceTourMarkedAvailable', 'sourceDemoMarked'].includes(key) && value != null),
  ))
  const expectedUnits = source.units.map(row => Object.fromEntries(
    Object.entries(row).filter(([key, value]) => key !== 'category' && value != null),
  ))
  assert.deepEqual(unitTypes, expectedTypes, 'UnitType data differs from approved snapshot')
  assert.deepEqual(units, expectedUnits, 'Unit data differs from approved snapshot')
  console.log('PASS: 3 Blocks; 10 UnitTypes; 78 Units; A=6, B=32, C=40; 9 exact demo Units; unique IDs; valid references; snapshot parity.')
} catch (error) {
  console.error(`FAIL: ${error.message}`)
  process.exitCode = 1
}
