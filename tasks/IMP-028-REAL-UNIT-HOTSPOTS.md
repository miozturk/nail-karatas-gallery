# IMP-028 — Human-Assisted Real Unit Hotspot Authoring

Status: READY — TWO PHASES

## Objective

Replace the DEVELOPMENT-ONLY Unit hotspot polygons with production geometry authored by the human operator directly over the real Block A/B/C exterior scene images.

This task covers exactly the nine demo-enabled Units:

- A-003
- B-301
- B-302
- B-303
- B-304
- C-401
- C-402
- C-403
- C-404

Critical rule: Codex must not guess where any Unit is located on a façade and must not invent final polygon geometry from visual inference.

The human operator (İdris) is the source of truth for:
- which visible façade region belongs to each Unit ID
- where each clickable polygon should run on the rendered Block scene

Codex is responsible for:
- preparing the existing DEV-only Hotspot Editor for real Block A/B/C scene images
- preserving logical 1920×1440 coordinate mapping
- receiving the operator-authored Unit polygons
- integrating them into one canonical production Unit hotspot source
- preserving Quick Card / Details / Tour routing
- running regression validation and documenting the result

Do not modify Masterplan A/B/C hotspot geometry in IMP-028.

# PHASE A — Editor preparation and operator handoff

## A1. Required reading

Follow `AGENTS.md` and locked baseline documents.

Also read:
- `docs/IMP-026-COMPLETION-REPORT.md`
- `docs/IMP-027-COMPLETION-REPORT.md`
- `src/media/exteriorMedia.ts`
- current Unit hotspot data source
- current Block page hotspot integration
- current Hotspot Editor implementation and README
- current seed/demo Unit definitions
- `docs/STAGING-QA-CHECKLIST.md`

## A2. Audit current Unit hotspot implementation

Before changes, record:
- current DEVELOPMENT-ONLY Unit hotspot source file(s)
- current Unit IDs and coordinates
- how Block A/B/C consume the geometry
- whether coordinate literals are duplicated in UI code
- whether Unit ID validation is already type-safe
- how Unit click opens Quick Card
- whether Unit geometry affects Details/Tour routes
- how the Hotspot Editor currently chooses a scene/background

Do not alter production Unit geometry in Phase A.

## A3. Prepare the existing DEV-only Hotspot Editor

Extend the existing editor only as much as necessary so the operator can author polygons against these real exterior images:

- Block A: `/media/scenes/project/block-a.webp`
- Block B: `/media/scenes/project/block-b.webp`
- Block C: `/media/scenes/project/block-c.webp`

Preferred workflow:
- scene selector: A / B / C
- polygon ID input
- current scene visible as the true background
- logical coordinate space remains 1920×1440
- existing polygon draw/save/reset/export behavior remains

Allowed Unit IDs for authoring:

Block A:
- `A-003`

Block B:
- `B-301`
- `B-302`
- `B-303`
- `B-304`

Block C:
- `C-401`
- `C-402`
- `C-403`
- `C-404`

Requirements:
- reuse the existing editor
- do not create a second editor
- do not add a dependency
- do not alter customer-facing Block page geometry in Phase A
- do not change production Unit hotspot coordinates yet
- editor remains DEV-only
- production bundle must not expose editor code/route
- deterministic export must be preserved

## A4. Validate scene switching and coordinate mapping

Verify in DEV:
- A selector loads real Block A image
- B selector loads real Block B image
- C selector loads real Block C image
- image and overlay rect match exactly
- clicks map to logical 1920×1440 coordinates
- viewport resize does not change exported logical coordinates
- changing scene does not silently reassign existing polygon IDs
- export clearly preserves Unit ID + polygon coordinates + associated scene/block if the schema needs it

Do not infer Unit placement.

## A5. Mandatory STOP point

After the editor is ready, STOP.

Do not draw Unit polygons yourself.

Report in Turkish:
1. exact DEV URL
2. how to select Block A/B/C
3. exact drawing steps
4. how to finish/save each polygon
5. exact required Unit IDs per Block
6. how to export the final geometry
7. exactly what JSON/text the user should paste back into the same Codex conversation
8. practical vertex-count guidance

Then wait for operator input.

Do not start Phase B until the user provides all nine Unit polygons.

# HUMAN AUTHORING GUIDANCE

The operator will visually identify each Unit.

Recommended polygon intent:
- trace the clickable visible façade/balcony/window/terrace area representing that Unit
- do not trace tiny architectural details
- use a modest number of meaningful vertices
- keep neighboring Unit hit areas visually separate
- avoid large empty sky/ground regions
- avoid overlap unless the projection genuinely requires it
- prioritize predictable selection over microscopic edge precision
- author only against the real Block image for that Unit

Codex must preserve the operator's Unit ID assignment and point order.

# PHASE B — Production integration after operator coordinates are supplied

## B1. Validate operator input

Require exactly these nine Unit IDs:

- A-003
- B-301
- B-302
- B-303
- B-304
- C-401
- C-402
- C-403
- C-404

For each:
- minimum 3 vertices
- all coordinates within 0..1920 / 0..1440
- no duplicate Unit IDs
- Unit belongs to the expected Block
- Unit exists in canonical seed/domain data
- Unit remains demo-enabled as currently defined

Reject malformed/missing/extra IDs.

Do not algorithmically improve, reorder, smooth, simplify or reinterpret the operator's polygons.

## B2. Canonical production Unit geometry

Replace only the DEVELOPMENT-ONLY Unit hotspot geometry with the operator-authored production geometry.

Requirements:
- one canonical Unit hotspot source
- no duplicate coordinate literals in UI components
- preserve existing `SvgHotspotLayer` API
- preserve Block scene -> Unit hotspot rendering
- preserve hover/focus/active/disabled semantics
- preserve keyboard activation
- preserve Unit -> Quick Card route behavior
- update/remove only Unit DEVELOPMENT-ONLY geometry comments/labels that are no longer truthful

Do not modify Masterplan hotspot geometry from IMP-027.

## B3. Block A QA

Verify on real Block A:
- only A-003 demo hotspot is present
- A-003 highlight visually follows operator-authored polygon
- pointer activation opens A-003 Quick Card
- keyboard activation opens A-003 Quick Card
- close returns to same Block scene without stage movement

## B4. Block B QA

Verify on real Block B:
- B-301/302/303/304 each render exactly once
- each polygon highlights its own Unit
- no selector/route ID mismatch
- pointer and keyboard activation open the matching Unit Quick Card
- neighboring polygons do not produce obvious unintended overlap

## B5. Block C QA

Verify on real Block C:
- C-401/402/403/404 each render exactly once
- each polygon highlights its own Unit
- no selector/route ID mismatch
- pointer and keyboard activation open the matching Unit Quick Card
- neighboring polygons do not produce obvious unintended overlap

## B6. Quick Card / Details / Tour route regression

For at least:
- A-003
- B-301
- C-401

Verify:
- Unit click -> Quick Card
- `Detayları Gör` -> correct Details route
- `Sanal Tur` -> correct Tour route if enabled by existing data
- closing Quick Card returns to the same Block
- browser Back/Forward remains coherent
- SceneStage anchor remains stable
- no Unit hotspot geometry leaks to another Block

Do not change product behavior to force unavailable Tour data.

## B7. Responsive geometry QA

Verify at:
- 320×844
- 390×844
- 768×1024
- 1280×800
- 1440×900

For each Block A/B/C:
- SceneStage remains 4:3
- image / SVG rect align
- Unit polygons scale with the scene
- logical coordinates remain unchanged
- no coordinate drift
- no horizontal overflow
- IMP-026 route/stage-anchor contract remains intact

## B8. Accessibility/localization

Verify:
- Unit hotspot focus-visible state
- keyboard Enter/Space activation
- accessible Unit labels
- TR / EN / RU Block pages
- locale switch does not alter Unit geometry or route
- no translation-key parity regression

## B9. Transition regression

Verify:
- Home -> A/B/C transitions still map correctly
- Unit hotspot interaction is disabled while exterior transition is active
- contextual Home reverse transition still works
- no preload/lifecycle regression
- no modification to six MP4 files
- no modification to real exterior WebP files

## B10. DEV editor regression

If editor was modified:
- DEV-only route remains functional
- production route remains NotFound
- production bundle contains no editor chunk
- A/B/C real Block scene selection remains correct
- export remains deterministic
- logical mapping remains 1920×1440

## B11. Optional deterministic Unit geometry validator

A tiny dependency-free validator is allowed only if useful.

It may verify:
- exact nine expected Unit IDs
- expected Block ownership
- minimum 3 vertices
- coordinate bounds
- no duplicate IDs
- no missing/extra IDs

Do not attempt to prove visual correctness algorithmically.

## B12. Required checks

Run:
- `npm run validate:exterior-media`
- `npm run validate:data`
- `npm run build`
- `npm run lint`
- `npx tsc -b`
- `npm run test:localization`
- `node scripts/test-panorama-adapter.mjs`
- `node scripts/test-tour-help-storage.mjs`
- `npm run staging:verify`
- `git diff --check`

## B13. Completion report

Create:
`docs/IMP-028-COMPLETION-REPORT.md`

Write in Turkish and include:
1. Özet
2. Değişen dosyalar
3. Eski DEVELOPMENT-ONLY Unit geometry audit
4. Phase A editor hazırlığı
5. Human authoring workflow
6. A-003 coordinates / vertex count
7. B-301/302/303/304 coordinates / vertex counts
8. C-401/402/403/404 coordinates / vertex counts
9. Production Unit geometry integration
10. Block A QA
11. Block B QA
12. Block C QA
13. Quick Card / Details / Tour route regression
14. Responsive geometry result
15. IMP-026 stage-anchor regression
16. Accessibility / keyboard
17. TR / EN / RU
18. Home/Block transition regression
19. DEV editor regression
20. Staging result
21. Commands
22. Required check results
23. Dependency changes
24. Human-eye review / remaining uncertainty
25. Warnings / blocker / architectural conflicts
26. Confirmation next IMP was not started

# Explicitly forbidden in IMP-028

Do not:
- guess Unit locations
- invent or modify operator polygon geometry
- alter Masterplan A/B/C geometry
- modify Block images
- modify transition MP4s
- modify Unit/UnitType seed/domain data except safe type/lookup wiring if strictly required
- change panorama architecture
- redesign customer UI
- add product features
- add dependencies
- deploy
- alter locked baseline documents
- begin IMP-029

# Acceptance criteria

IMP-028 passes only if:
- Phase A stops for operator-authored Unit input
- all nine final production Unit polygons come from operator authoring
- real Block A/B/C images are the authoring references
- exactly the nine expected demo Unit polygons exist
- logical 1920×1440 coordinates are preserved
- each Unit opens its own correct Quick Card
- Details/Tour routes remain coherent
- Masterplan geometry remains unchanged
- IMP-026 stage-anchor stability remains intact
- five viewport checks pass
- accessibility and TR/EN/RU remain intact
- Home/Block transitions remain correct
- staging/build/lint/tests pass
- no new dependency
- locked baselines unchanged
- no later IMP started
