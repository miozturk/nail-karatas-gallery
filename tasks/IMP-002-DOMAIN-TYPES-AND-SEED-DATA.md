# IMP-002 — Domain Types and Seed Data

Status: **READY**

## Objective

Implement the baseline TypeScript domain model required by the application and convert the approved normalized inventory snapshot into typed seed data.

Do not implement UI, routes, scene rendering, hotspots, transitions, panorama integration, or media wiring in this task.

## Required reading

Follow `AGENTS.md` and read all baseline documents before starting.

Approved source data for this task:

`data-source/inventory.snapshot.json`

Expected source counts:

- 10 UnitTypes
- 78 Units
- 9 demo-enabled Units
- Block distribution:
  - A: 6
  - B: 32
  - C: 40

## Required work

### 1. Domain types

Create clear domain types under `src/types/`.

At minimum implement:

- `UnitCategory = "residential" | "commercial"`
- `AvailabilityStatus = "unknown" | "available" | "reserved" | "sold"`
- `Point`
- `Polygon`
- `UnitType`
- `Unit`
- `Block`
- the narrowest provisional `SceneDefinition` needed to satisfy the locked Block concept.

Important:

`SceneDefinition` is not yet fully specified by the baseline. Do not invent scene/media architecture in IMP-002. Define only the minimum placeholder shape necessary for `Block`, and clearly mark it provisional until the SceneStage work. A simple stable scene identity is sufficient.

### 2. Seed data

Create typed application seed modules under `src/data/`.

At minimum:

- `blocks.ts`
- `unitTypes.ts`
- `units.ts`
- `index.ts`

Seed exactly three Blocks:

- A: commercial
- B: residential
- C: residential

Convert all approved source UnitTypes and Units.

Use stable lowercase application block IDs: `a`, `b`, `c`.

Preserve the source IDs exactly for UnitType and Unit IDs, for example:

- `A-T01`
- `BC-T01-M`
- `B-301`
- `C-404`

### 3. Data mapping rules

Map source categories:

- `Konut` -> `residential`
- `Ticari` -> `commercial`

Map availability:

- `Bilinmiyor` -> `unknown`
- `Müsait` -> `available`
- `Rezerve` -> `reserved`
- `Satıldı` -> `sold`

Map plan variants:

- Normal -> `normal`
- Aynalı -> `mirrored`
- Özel -> `special`

Do not invent missing values.

In particular:

- Do not invent `grossArea`.
- Do not invent `planImage`.
- Do not invent gallery images.
- Do not invent `tourId`.
- Do not invent facade hotspot polygons.

The source spreadsheet marks some UnitTypes as having 360 tours. This is source-planning metadata, not permission to create dangling `tourId` values before tour data exists.

`Unit.demoEnabled` must come from the approved Unit rows, not from UnitType source metadata.

### 4. Referential integrity

All Units must reference an existing UnitType.

All Units must reference one of the three Blocks.

IDs must be unique within their entity collection.

Seed data must satisfy these expected facts:

- UnitTypes: 10
- Units: 78
- demoEnabled Units: 9
- A Block Units: 6
- B Block Units: 32
- C Block Units: 40

Demo-enabled Units must be exactly:

- A-003
- B-301
- B-302
- B-303
- B-304
- C-401
- C-402
- C-403
- C-404

### 5. Validation

Add a lightweight data-integrity validation that does not introduce a new runtime state library or test framework.

The validation must be executable through an npm script:

`npm run validate:data`

It must fail with a non-zero exit code if at least one of the following is wrong:

- duplicate Unit ID,
- duplicate UnitType ID,
- unknown block reference,
- unknown UnitType reference,
- expected entity counts,
- expected block counts,
- expected demo-unit set.

Prefer a simple Node script using built-in Node capabilities. Do not add a dependency solely for this validator.

### 6. App behavior

Do not build any real project UI in IMP-002.

The existing bootstrap screen may remain visually minimal.

If necessary, it may display a tiny non-interactive seed-data summary, but this is optional and must not become a product feature.

## Explicitly forbidden in IMP-002

Do not:

- implement IMP-003 routing / AppShell,
- build Masterplan / Block scenes,
- add SVG hotspot rendering,
- add real project media,
- add transition playback,
- add the hotspot editor,
- add Pannellum or any panorama engine,
- implement Availability UI,
- add Redux / Zustand / MobX,
- add a backend,
- change locked baseline documents,
- create fake production values to fill missing data.

## Acceptance criteria

IMP-002 passes only if:

- Required domain types exist and compile.
- Exactly 3 Block seed records exist.
- Exactly 10 UnitType seed records exist.
- Exactly 78 Unit seed records exist.
- Exactly 9 Unit records have `demoEnabled: true`.
- Block counts are A=6, B=32, C=40.
- The exact demo-unit set matches the task specification.
- All Unit -> Block references are valid.
- All Unit -> UnitType references are valid.
- IDs are unique.
- Missing plan / tour / hotspot / gross-area values remain absent rather than invented.
- `npm run validate:data` passes.
- `npm run build` passes.
- `npm run lint` passes.
- Baseline documents remain unchanged.
- No forbidden dependency or feature is introduced.

## Completion report

Return the report in Turkish:

1. Özet.
2. Oluşturulan / değiştirilen dosyalar.
3. Veri dönüşüm özeti.
4. UnitType / Unit / blok sayıları.
5. Demo-enabled Unit listesi.
6. Çalıştırılan komutlar.
7. `validate:data`, build ve lint sonuçları.
8. Eklenen bağımlılık varsa listesi.
9. Uyarılar / çözülmemiş konu / mimari çelişki.
10. IMP-003'e başlama.
