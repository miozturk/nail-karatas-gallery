# IMP-032 — Human-Assisted 2+1 Panorama Tour Integration

Status: READY — 2026-09-23

## Objective

Replace the current development panorama content with the new project panorama set for one residential unit type only:

- `BC-T01` — 2+1
- Do NOT create a separate tour for `BC-T01-M`
- Do NOT enable Tour for 1+1 or commercial types in this task

The goal is a presentation-quality demo tour with the existing Tour UI/adapter architecture preserved.

## Required reading

Follow `AGENTS.md`, locked baseline documents, `CURRENT_TASK.md`, and the latest completion reports, especially IMP-030 and IMP-031.

Inspect:
- existing Tour data model
- current `developmentTours` or equivalent source
- Pannellum adapter
- room menu / minimap / hotspot implementation
- Tour availability logic
- localization
- staging verifier

## Human-provided panorama media

The following files already exist and must be treated as intentional human input:

- `public/media/panoramas/project/living-room.jpg`
- `public/media/panoramas/project/bedroom-master.jpg`
- `public/media/panoramas/project/bedroom-single.jpg`
- `public/media/panoramas/project/bathroom.jpg`

Do not edit, recompress, crop, rename, regenerate or replace them.

Verify they are valid 2:1 equirectangular images and record dimensions/filesizes.

## Tour scope

Create exactly one canonical project Tour for `BC-T01`.

Current known `BC-T01` demo units include:
- `B-304`
- `C-401`

These units may resolve to the same canonical Tour definition.

Do not enable the Tour for:
- `BC-T01-M`
- `BC-T02`
- `BC-T02-M`
- commercial types

If the current UI exposes a Tour CTA for types without a Tour, preserve or implement the existing unavailable/disabled behavior without inventing fake content.

## Scene set

Use these canonical scene IDs:

1. `living-room`
2. `bedroom-master`
3. `bedroom-single`
4. `bathroom`

Suggested localized labels:

TR:
- Salon / Yaşam Alanı
- Ebeveyn Yatak Odası
- Oda
- Banyo

Use natural EN/RU equivalents through the existing i18n system.

The room menu must provide deterministic access to all four scenes.

## IMPORTANT — hotspot placement must be human-authored

Do NOT infer or invent hotspot pitch/yaw coordinates from filenames, room semantics or image geometry.

The panoramas are AI-generated demo media and their visible doors/openings are not guaranteed to form a mathematically consistent apartment graph.

### Phase A — integrate scenes and provide hotspot authoring mode

First:
- wire the four project panoramas into the canonical `BC-T01` Tour
- ensure room-menu switching works
- ensure minimap / active scene behavior remains functional
- do not add guessed room-to-room hotspots

Then provide the smallest DEV-only hotspot-coordinate authoring workflow.

Preferred implementation:
1. If the installed Pannellum version supports a built-in hotspot debug / click-to-coordinate capability, expose/use it only in DEV.
2. Otherwise add a minimal DEV-only interaction that allows the user to click/double-click a panorama location and read/copy the resulting `pitch` and `yaw`.
3. Do not add a production dependency.
4. Do not expose the authoring UI in production/staging customer builds.

The authoring output must identify:
- active source scene ID
- pitch
- yaw

If practical, let the user also select or type a target scene ID, but this is optional.

### Required checkpoint

After Phase A is complete and technically validated, STOP and report exactly:

`PANORAMA HOTSPOT AUTHORING READY`

Then tell the user how to open the DEV tour and collect coordinates.

Do not finalize IMP-032 yet.

## Phase B — human provides hotspot coordinates

The user will inspect each panorama visually and provide only hotspots that look spatially believable.

Do not require every room to have direct hotspots to every other room.

The room menu remains the guaranteed navigation fallback.

Likely useful relationships may include:
- living-room -> bedroom-master
- bedroom-master -> living-room
- bedroom-master -> bathroom
- bathroom -> bedroom-master
- bedroom-single -> living-room

These are suggestions only. Use only human-provided coordinates and targets.

Once the user supplies coordinates:
- add them to canonical typed Tour data
- preserve accessible labels
- keep hotspot styling consistent
- verify scene switching and history behavior
- remove/disable DEV authoring UI from production behavior

## Route / architecture constraints

Preserve:
- current Tour route schema
- Pannellum adapter boundary
- first-use help
- room menu
- minimap
- active viewpoint indication
- `Daireye Dön`
- Browser Back / Forward
- lazy-loading behavior

Do not alter:
- exterior transitions
- Masterplan / Unit hotspot coordinates
- Unit / UnitType identity
- plan integration
- project video
- IMP-031 route-layout work

No new dependency.

## Production wording

These are still demo/representative panoramas.

Keep the existing honest representative/demo wording established in IMP-030. Do not describe them as final delivered interior imagery.

Do not use raw engineering wording such as `DEVELOPMENT-ONLY`, `proof`, `synthetic`, or `placeholder` in customer-facing UI.

## Validation after Phase A

Before asking the user for hotspot coordinates:
- `BC-T01` Tour resolves for B-304 and C-401
- room menu reaches all four scenes
- panorama images load correctly
- active scene/minimap remain coherent
- no Tour availability appears for excluded types
- direct Tour route works
- Browser Back / Forward smoke test
- Home does not eagerly load panoramas
- no console error/warning caused by the integration
- DEV coordinate authoring is isolated from production

Run at minimum:
- `npm run validate:data`
- `npm run build`
- `npm run lint`
- `npx tsc -b`
- `npm run test:localization`
- `node scripts/test-panorama-adapter.mjs`
- `node scripts/test-tour-help-storage.mjs`
- `npm run staging:verify` if production-media expectations changed
- `git diff --check`

Known sandbox `spawn EPERM` rerun behavior may be documented if encountered.

## Final validation after Phase B

After human-authored hotspots are integrated:
- verify every supplied hotspot navigates to its intended scene
- verify room menu remains functional
- verify minimap/active scene
- verify 390×844 and presentation laptop/F11 view
- verify B-304 and C-401
- verify excluded unit types do not incorrectly expose this Tour
- verify no new eager loading
- rerun affected automated checks

## Completion report

Create:
`docs/IMP-032-COMPLETION-REPORT.md`

Write in Turkish and include:

1. Özet
2. Starting repository state
3. Human-provided panorama media audit
4. Canonical `BC-T01` Tour mapping
5. Units using the Tour
6. Explicit list of types excluded from Tour
7. Scene labels and media paths
8. DEV hotspot-authoring method
9. Human-provided hotspot coordinates and target graph
10. Room-menu behavior
11. Minimap / active-scene result
12. Browser Back/Forward
13. Lazy-loading/media loading
14. Responsive/demo-laptop result
15. Staging result
16. Required command results
17. Dependency changes
18. Remaining demo limitations
19. Confirmation that media files were not modified
20. Confirmation IMP-033 was not started

## Acceptance criteria

IMP-032 can PASS only if:
- only `BC-T01` uses this canonical Tour
- B-304 and C-401 resolve correctly
- mirror / 1+1 / commercial types are not accidentally assigned the Tour
- all four project panoramas load
- no hotspot coordinate is guessed by Codex
- final room-to-room hotspots come from human-authored coordinates
- room menu remains a complete fallback
- customer-facing Tour remains honest about representative/demo imagery
- adapter / help / minimap / back behavior remain intact
- automated checks pass
- no new dependency
- production panorama media are unchanged
- IMP-033 is not started
