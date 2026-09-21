# IMP-027 — Human-Assisted Real Masterplan Hotspot Authoring

Status: READY — TWO PHASES

## Objective

Replace the DEVELOPMENT-ONLY A/B/C Masterplan hotspot polygons with production geometry authored against the actual Nail Karataş `masterplan.webp`.

Critical rule: Codex must not guess which visible building mass is A, B or C and must not independently invent final polygon geometry from visual inference.

The human operator (İdris) is the source of truth for:
- which visible building is A / B / C
- where each clickable polygon should run on the rendered image

Codex is responsible for:
- preparing the existing DEV-only Hotspot Editor against the real Masterplan image
- preserving logical 1920×1440 coordinate mapping
- receiving the human-authored A/B/C coordinates
- integrating those coordinates into the canonical production data source
- running regressions and documenting the result

This task covers only the three Home/Masterplan Block-selection polygons.
Do not modify Unit hotspot geometry.

# PHASE A — Editor preparation and operator handoff

## A1. Required reading

Follow `AGENTS.md` and locked baseline documents.

Also read:
- `docs/IMP-024-COMPLETION-REPORT.md`
- `docs/IMP-025-COMPLETION-REPORT.md`
- `docs/IMP-026-COMPLETION-REPORT.md`
- `src/media/exteriorMedia.ts`
- current Masterplan polygon data source
- current Hotspot Editor implementation and README
- `docs/STAGING-QA-CHECKLIST.md`

## A2. Audit

Before changes, record:
- current DEVELOPMENT-ONLY Masterplan A/B/C polygon source
- current polygon IDs and coordinates
- how Masterplan consumes the data
- whether coordinate literals are duplicated
- how the Hotspot Editor loads its background scene
- how screen coordinates map to logical 1920×1440
- how export output is produced

Do not alter production polygon geometry in Phase A.

## A3. Prepare existing DEV-only Hotspot Editor

The editor must allow the operator to author polygons directly over:

`/media/scenes/project/masterplan.webp`

Requirements:
- reuse the existing editor
- do not create a second editor
- do not add a dependency
- preserve logical 1920×1440 mapping
- preserve deterministic export
- remain DEV-only
- production build must not expose editor route/bundle
- do not change customer-facing Home geometry
- do not change production hotspot coordinates yet

If the editor already supports the real Masterplan cleanly, do not modify it unnecessarily.

## A4. Phase A manual QA

Verify:
- real `masterplan.webp` is visible in the editor
- rendered image and authoring overlay align exactly
- clicks map correctly to 1920×1440
- viewport resize does not change exported logical coordinates
- polygon completion/reset/export controls still work
- production `/__dev/hotspot-editor` remains NotFound

## A5. Mandatory STOP point

After Phase A is ready, STOP.

Do not guess or draw A/B/C yourself.

Report in Turkish:
1. exact local DEV URL to open
2. exact steps to create polygon A
3. exact steps to finish/save/export polygon A
4. repeat for B and C if needed
5. what exact exported JSON/text the user should paste back into the same Codex conversation
6. practical vertex-count guidance

Then wait for user-provided A/B/C exported coordinates.

Do not start Phase B until the user supplies coordinates.

# HUMAN AUTHORING GUIDANCE

The operator will visually identify the buildings.

Recommended polygon intent:
- trace the clickable visible mass / façade footprint, not every tiny architectural edge
- use a modest number of meaningful vertices
- avoid large sky/ground regions
- avoid overlaps unless projection genuinely overlaps
- prioritize predictable selection behavior over microscopic precision
- author only against the real Masterplan view

Codex must not relabel or reinterpret the operator's A/B/C assignment.

# PHASE B — Production integration after user coordinates are supplied

## B1. Validate operator input

Require exactly three IDs:
- `a`
- `b`
- `c`

Each:
- minimum 3 vertices
- coordinates within 0..1920 / 0..1440
- no duplicate polygon IDs

Preserve the user's A/B/C assignment exactly.

Do not algorithmically “improve” the polygon shapes.

## B2. Replace DEVELOPMENT-ONLY Masterplan geometry

Integrate only the three operator-authored Masterplan polygons.

Requirements:
- one canonical data source
- no duplicate coordinate literals in UI components
- preserve `SvgHotspotLayer` API
- preserve hover/focus/active/disabled semantics
- preserve keyboard activation
- preserve selector ↔ polygon synchronization
- update only Masterplan DEVELOPMENT-ONLY geometry comments that are no longer truthful

Do not remove warnings for Unit hotspots or other placeholder content.

## B3. Visual QA

Verify:
- A polygon highlights A
- B polygon highlights B
- C polygon highlights C
- selector hover/focus highlights matching polygon
- polygon hover highlights matching selector
- no obvious drift
- no unintended large overlap

Codex may verify rendering alignment, but must not rename or redesign user-authored polygons.

## B4. Responsive QA

Verify:
- 320×844
- 390×844
- 768×1024
- 1280×800
- 1440×900

Requirements:
- SceneStage remains 4:3
- image / SVG rects align
- logical coordinates unchanged
- no horizontal overflow
- no coordinate drift
- IMP-026 stage-anchor contract remains intact

## B5. Transition regression

Verify Home -> A/B/C:
- correct polygon activates correct Block
- correct transition mapping
- transition lock remains
- target route correct
- no preload regression
- no IMP-026 layout/handoff regression

Do not modify transition MP4 files.

## B6. Accessibility/localization

Verify:
- keyboard focus/activation
- visible polygon focus state
- translated accessible labels
- TR / EN / RU Home
- locale switch does not alter geometry or route

## B7. DEV editor regression

If editor changed:
- keep DEV-only
- production route NotFound
- logical mapping correct
- export deterministic
- production bundle gains no DEV editor chunk

## B8. Required checks

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

## B9. Completion report

Create:
`docs/IMP-027-COMPLETION-REPORT.md`

Include in Turkish:
1. Özet
2. Değişen dosyalar
3. Eski DEVELOPMENT-ONLY geometry audit
4. Phase A editor hazırlığı
5. Human authoring workflow
6. A coordinates / vertex count
7. B coordinates / vertex count
8. C coordinates / vertex count
9. Production geometry integration
10. Selector ↔ polygon sync
11. Responsive geometry result
12. IMP-026 layout-contract regression
13. Transition regression
14. Keyboard/accessibility
15. TR / EN / RU
16. DEV editor regression
17. Staging
18. Commands
19. Required checks
20. Dependency changes
21. Human-eye review note
22. Warnings/blockers
23. Confirmation that next IMP was not started

# Explicitly forbidden

Do not:
- guess final A/B/C polygon geometry without user input
- infer or change the user's A/B/C building assignment
- alter Unit hotspot coordinates
- modify Block scene images
- modify transition videos
- modify Unit/UnitType data
- modify panorama/tour behavior
- redesign customer UI
- add product features
- add dependencies
- deploy
- change locked baseline documents
- begin IMP-028

# Acceptance criteria

IMP-027 passes only if:
- Phase A stops for user-authored polygon input
- final production polygons come from user's editor authoring
- real `masterplan.webp` is the authoring reference
- exactly three canonical A/B/C polygons exist
- logical 1920×1440 coordinates are preserved
- selector ↔ polygon sync remains correct
- A/B/C routes/transitions remain correct
- IMP-026 stage-anchor stability remains intact
- five viewport checks pass
- accessibility and TR/EN/RU remain intact
- Unit hotspot geometry remains untouched
- staging/build/lint/tests pass
- no new dependency
- locked baselines unchanged
- no later IMP started
