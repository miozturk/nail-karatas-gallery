# IMP-009 — Unit Hotspots

Status: **READY**

## Objective

Bind the reusable SVG hotspot infrastructure to real approved Unit seed records inside the A / B / C Block scenes.

This task proves data-driven independent-unit interaction:
- Unit hotspot rendering
- Unit hover / focus state
- Unit activation
- navigation to the existing Unit route

Do not implement the Unit Quick Card UI yet. Do not add real production hotspot geometry unless separately approved.

## Required reading

Follow `AGENTS.md` and read all baseline documents before starting.

Relevant locked decisions:
- Block scenes use the shared 1920 x 1440 SceneStage.
- Unit selection uses SVG polygon hotspots.
- `Unit` is the real independent-unit entity.
- Unit routes are `/block/:blockId/unit/:unitId`.
- Quick Card belongs to IMP-010.
- Real project hotspot coordinates are not yet authored.

## Approved Unit scope for this development proof

Use only the approved `demoEnabled: true` Unit records as visible development hotspots in IMP-009.

Expected demo Units:
- A-003
- B-301
- B-302
- B-303
- B-304
- C-401
- C-402
- C-403
- C-404

Expected distribution:
- A Block: 1 demo Unit
- B Block: 4 demo Units
- C Block: 4 demo Units

This is a development proof subset. It does not mean non-demo Units are removed from the project data model.

## Required work

### 1. Unit hotspot feature

Extend the Block feature under `src/features/blocks/`.

Each valid Block scene must derive its visible Unit targets from the approved Unit seed data.

For IMP-009:
- filter Units by current `blockId`
- include only `demoEnabled === true` Units in the visible development hotspot layer
- render them through the existing reusable `SvgHotspotLayer`
- do not duplicate Unit domain data inside hotspot configuration

### 2. Development-only Unit geometry

Create an isolated Block-feature configuration for DEVELOPMENT-ONLY Unit polygons.

Requirements:
- geometry must be keyed by real Unit IDs
- include exactly the nine approved demo Units
- keep all coordinates in the 1920 x 1440 logical coordinate system
- use simple clearly artificial polygons suitable for interaction testing
- label / comment the file as DEVELOPMENT-ONLY
- do not claim geometry matches the real facades
- do not write these placeholder polygons back into `src/data/units.ts`

### 3. Referential safety

Before rendering a hotspot:
- resolve the Unit from seed data
- ensure it belongs to the current Block route
- ensure a development polygon exists for that Unit

Do not silently render orphaned geometry.

A lightweight feature-level check / clear implementation invariant is sufficient. Do not add a validation framework.

### 4. Hover / focus behavior

The Block scene must maintain a simple local highlighted Unit state.

Requirements:
- pointer enter highlights the Unit polygon
- pointer leave clears it
- keyboard focus makes the Unit visibly highlighted
- leaving focus clears appropriately
- a small development-only status label may show the highlighted Unit ID / type / floor

Do not implement final sales tooltip / Quick Card styling.

### 5. Activation / navigation

Activating a Unit hotspot must navigate through React Router to:

`/block/:blockId/unit/:unitId`

Examples:
- B-301 in Block B -> `/block/b/unit/B-301`
- C-404 in Block C -> `/block/c/unit/C-404`
- A-003 in Block A -> `/block/a/unit/A-003`

Do not implement Quick Card UI in IMP-009. The existing Unit placeholder route remains the destination.

### 6. Accessibility

Unit hotspots must preserve the accessibility behavior established by `SvgHotspotLayer`.

Verify:
- Tab can reach Unit targets
- focus-visible state is inspectable
- Enter / Space activation works
- accessible labels identify the Unit clearly

Avoid adding duplicate clickable DOM controls for the same Unit unless required for the development proof.

### 7. Home return regression

The IMP-008 in-app Home reverse-transition flow must remain intact.

While the Home reverse transition is active:
- Unit hotspots must not activate
- Unit hotspot interaction must be effectively locked
- no competing navigation should occur

Reuse the existing Block transition state.

### 8. Browser Back

Do not hijack browser Back.

Verify:
- Unit route -> browser Back returns to the Block scene
- Block scene -> in-app Home still uses reverse transition
- Masterplan -> Block forward transition still works

### 9. Responsive behavior

Unit polygons must remain aligned with the SceneStage in wide and narrow viewport tests.

No real media is required.

Use the existing neutral Block development visual.

### 10. Validation

Required checks:
- `npm run validate:data`
- `npm run build`
- `npm run lint`
- `git diff --check`

Manual browser verification must confirm:

#### A Block
- exactly A-003 is visible as a development Unit hotspot
- hover / focus / activation works
- activation goes to `/block/a/unit/A-003`

#### B Block
- exactly B-301, B-302, B-303, B-304 are visible
- each hotspot highlights independently
- each navigates to its correct Unit route

#### C Block
- exactly C-401, C-402, C-403, C-404 are visible
- each hotspot highlights independently
- each navigates to its correct Unit route

Also verify:
- keyboard activation
- Browser Back Unit -> Block
- IMP-008 Home reverse transition regression
- Unit hotspots cannot activate during reverse transition
- wide / narrow responsive alignment
- invalid Unit route behavior from IMP-003 remains correct
- browser console has no new runtime errors

## Explicitly forbidden in IMP-009

Do not:
- add real Nail Karataş Unit hotspot coordinates
- add real Block render images
- add real production transition videos
- implement Unit Quick Card UI
- implement Unit Details drawer
- implement Availability UI
- implement the hotspot editor
- add Pannellum or another panorama engine
- add Redux / Zustand / MobX
- add a backend
- alter locked baseline documents
- begin IMP-010

## Acceptance criteria

IMP-009 passes only if:
- Block scenes derive Unit targets from approved Unit seed data
- only the exact nine demo-enabled Units render as development hotspots
- the A/B/C demo distribution is 1 / 4 / 4
- development polygons are isolated and clearly labeled DEVELOPMENT-ONLY
- real Unit IDs drive the interaction
- hover / leave / keyboard focus behavior works
- activation navigates to the correct Unit route
- Home reverse-transition behavior remains intact
- Unit activation is locked during Home reverse playback
- browser Back remains coherent
- no Quick Card UI is implemented
- no real production geometry / media is introduced
- no new dependency is added
- `npm run validate:data` passes
- `npm run build` passes
- `npm run lint` passes
- `git diff --check` passes
- baseline documents remain unchanged

## Completion report

Return the report in Turkish:

1. Özet.
2. Oluşturulan / değiştirilen dosyalar.
3. Unit seed verisinin Block sahnesine bağlanma yaklaşımı.
4. Development-only Unit geometri yapısı.
5. A/B/C görünür demo Unit listeleri.
6. Hover / focus / activation davranışı.
7. Unit route navigation ve Browser Back doğrulaması.
8. Home reverse-transition regression doğrulaması.
9. Responsive hizalama doğrulaması.
10. Çalıştırılan komutlar.
11. `validate:data`, build, lint ve `git diff --check` sonuçları.
12. Eklenen bağımlılık varsa listesi.
13. Uyarılar / çözülmemiş konu / mimari çelişki.
14. IMP-010'a başlama.
