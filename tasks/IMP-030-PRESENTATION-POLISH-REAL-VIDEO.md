# IMP-030 — Presentation Content Cleanup, Navigation Polish & Real Video Integration

Status: READY — REVISED 2026-09-22

## Objective

Prepare the current application for the Friday 12:00 customer demo by polishing the customer-facing presentation flow, integrating the real project animation video, cleaning development/proof language, fixing visible navigation inconsistencies, and ensuring Unit Quick Card content is immediately usable without scrolling.

This is a focused presentation-readiness task. Do not expand product scope.

## Required reading

Follow `AGENTS.md` and all mandatory locked baseline documents.

Also read:
- `docs/IMP-026-COMPLETION-REPORT.md`
- `docs/IMP-027-COMPLETION-REPORT.md`
- `docs/IMP-028-COMPLETION-REPORT.md`
- `docs/IMP-029-COMPLETION-REPORT.md`
- current Home/Masterplan, Block, Quick Card, Details, Tour and Video implementations
- current TR/EN/RU dictionaries
- `docs/STAGING-QA-CHECKLIST.md`

## Human-provided media state

### Plans

The user replaced the tracked plan PNG contents in-place with cleaner 1:1 demo images:

- `public/media/plans/project/plan-bc-t01.png`
- `public/media/plans/project/plan-bc-t01-m.png`
- `public/media/plans/project/plan-bc-t02.png`
- `public/media/plans/project/plan-bc-t02-m.png`
- `public/media/plans/project/plan-ticari.png`

These are intentional human-authored changes.

Do not rename, crop, resize, recompress, regenerate or otherwise modify these files.
Preserve the IMP-029 canonical UnitType mapping and verify the new 1:1 images still render correctly.

### Real project animation video

The real demo animation is present at:

`public/media/video/project/video-animation.mp4`

Use this file for the customer-facing `/video` experience.

Requirements:
- keep global `Video` navigation visible
- replace customer-facing use of `public/media/video/dev/project-video-proof.mp4`
- integrate `video-animation.mp4` as the canonical production video
- do not transcode or modify the MP4
- inspect codec/container metadata read-only if tooling is available
- verify actual Chromium playback
- staging must verify correct `video/mp4` MIME and byte-range behavior
- old proof video may remain only if still legitimately used by DEV/test infrastructure

## Presentation principle

Normal customer-facing production UI must not expose raw engineering terms such as:
- `DEVELOPMENT-ONLY`
- `proof`
- `synthetic`
- `placeholder`

Temporary demo content must not be misrepresented as final real project content.

DEV-only tooling and historical completion reports may retain engineering terminology.

## 1. Home title cleanup

Replace customer-facing Home/Masterplan title:

`Ana Sayfa / Vaziyet Planı`

with:

- TR: `Genel Görünüm`
- EN: natural equivalent such as `Overview`
- RU: natural equivalent

Do not show the old compound title in normal customer UI.

## 2. Remove visible A/B/C development labels from Masterplan image

Remove the visible in-scene A/B/C text labels that remain over the real Masterplan image.

Do not:
- remove polygon hotspots
- alter polygon coordinates
- break hover/focus/click/keyboard behavior
- remove localized accessible names / ARIA labels

Keep the bottom A Blok / B Blok / C Blok selector controls and selector↔polygon interaction sync.

## 3. Unify Home ↔ Block scene navigation placement

Current inconsistency:
- Home scene navigation is in the lower control area beneath SceneStage
- Block pages show the contextual Home return control in the upper-right

Create one coherent scene-navigation pattern.

Preferred behavior:
- scene-level navigation lives in the lower scene-control region
- Home keeps A/B/C selectors there
- Block pages show the return-to-Genel-Görünüm/Home control in the equivalent lower region
- remove the redundant visible upper-right contextual Home button

Critical:
- preserve IMP-026 SceneStage document-space X/Y/W/H anchor exactly across Home / Block / Unit / Details
- if the upper intro area reserves geometry needed for the anchor, preserve that reservation invisibly without leaving a duplicate clickable control
- do not reintroduce route-to-route scene jumping

## 4. Quick Card viewport-safe positioning

Current problem:
after clicking a Unit hotspot, Quick Card can appear partly below the visible browser viewport and requires page scrolling.

Required:
- card must be immediately visible after Unit selection
- desktop/tablet: polished lower-right viewport-safe overlay
- narrow/mobile: bottom-sheet-like or equivalent viewport-safe behavior is acceptable
- card bounds must remain inside visible viewport
- if content is taller than available height, constrain card height and use internal scrolling
- no horizontal overflow
- no scroll should be required merely to discover card actions
- preserve route semantics, close behavior, Details and Tour actions
- preserve IMP-026 SceneStage anchor
- do not alter Unit hotspot coordinates

Verify:
- 320×844
- 390×844
- 768×1024
- 1280×800
- 1440×900

## 5. Details gallery cleanup

There are no real gallery assets.

Do not render a fake/empty gallery placeholder in normal customer UI.
Do not add fake images.
Preserve future gallery architecture if the section can simply be omitted when no gallery media exists.
Keep Unit plan and sales information intact and rebalance the layout.

## 6. Tour presentation cleanup

Tour remains essential, but panorama media is temporary demo/sample content.

Requirements:
- keep Tour fully functional
- remove visible raw `DEVELOPMENT-ONLY`, `synthetic`, `proof`, `placeholder` wording
- do not claim panorama media is final project imagery
- use concise honest wording
- TR recommendation: `Temsili sanal tur`
- add natural EN/RU equivalents
- clean minimap notice similarly
- preserve first-use help, room navigation, minimap, active viewpoint, Return to Unit and Browser Back/Forward
- do not replace panorama files
- do not change panorama adapter architecture

## 7. Real Project Video integration

Use:

`/media/video/project/video-animation.mp4`

Requirements:
- keep Video in global navigation
- `/video` must present the real animation
- use existing Video-page visual language
- remove customer-facing development/proof wording
- retain accessible native playback controls unless current architecture has an equivalent
- do not autoplay with sound
- do not create duplicate players
- verify route refresh and Browser Back/Forward
- verify TR/EN/RU copy
- verify actual Chromium playback
- use one canonical customer-facing video-media source
- normal production Video code must not import development-only media config

Staging:
- file exists in production output
- `video/mp4` MIME
- byte range works
- direct `/video` SPA refresh works

If metadata shows a browser compatibility concern, report it. Do not transcode silently.

## 8. Customer-facing i18n cleanup

Audit TR/EN/RU customer production strings for development/proof/placeholder/synthetic language.

Requirements:
- parity preserved
- natural concise wording
- no raw developer jargon
- do not alter DEV Hotspot Editor labels
- do not rewrite historical reports
- preserve accessibility strings

## 9. Legacy development artifact audit

Audit, do not blindly delete:
- `src/features/masterplan/developmentMedia.ts`
- `src/features/blocks/developmentMedia.ts`
- `src/features/video/developmentMedia.ts`
- old transition proof MP4s
- old project-video proof MP4
- `SceneStageProof.*`

Classification:
A. legitimate DEV/test use -> keep
B. unreachable legacy proof artifact -> safe removal allowed
C. historical docs reference -> leave docs alone

Do not perform broad speculative cleanup.

## 10. Do not touch locked/current geometry or real media

Do not alter:
- Masterplan polygon coordinates
- nine Unit polygon coordinates
- Unit / UnitType identity
- route schema
- four exterior WebPs
- six production transition MP4s
- five updated plan PNG contents
- `video-animation.mp4` contents
- panorama adapter architecture
- locked baseline docs

No new dependency.

## 11. Main presentation-flow QA

Verify in TR:

Genel Görünüm
→ Block B
→ B-301 Quick Card
→ Details
→ Back to Quick Card
→ Tour
→ switch rooms
→ Return to Unit
→ Block
→ Genel Görünüm

Also verify:
- A-003 Quick Card + Details
- C-401 Quick Card + Tour
- Home A/B/C selectors
- Block → General View return
- Video nav → `/video` → real playback
- Browser Back/Forward
- direct `/video` refresh

Normal customer flow must not expose raw:
- DEVELOPMENT-ONLY
- proof
- synthetic
- placeholder

## 12. Responsive QA

Verify:
- 320×844
- 390×844
- 768×1024
- 1280×800
- 1440×900

Inspect at minimum:
- Home
- Block B
- B-301 Quick Card
- B-301 Details
- B-301 Tour
- Video

Record:
- SceneStage X/Y/W/H
- route anchor delta
- Quick Card viewport bounds
- horizontal overflow
- lower scene-navigation placement
- header/nav wrapping
- video-player containment

IMP-026 SceneStage route anchor must remain `0 px` delta within each viewport.

## 13. Loading/performance regression

Verify:
- Home does not eagerly fetch Tour panorama media
- Home does not eagerly fetch full project video media merely because nav contains Video
- Tour remains lazy
- Video remains lazy if current architecture supports it
- production DEV routes remain isolated
- no request storm

## 14. Staging verification

Update staging verification only as needed.

Verify:
- SPA routes
- four real exterior WebPs
- six production transition MP4s
- five plan PNGs
- new real `video-animation.mp4`
- panorama media required by Tour demo
- MIME/range behavior
- missing-file 404
- DEV-route isolation

Do not weaken existing checks.

## 15. Required commands

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

If ffprobe/FFmpeg exists, inspect `video-animation.mp4` metadata read-only and include it in the report.
Actual Chromium playback remains mandatory.

Known environment note:
a first sandbox `npm run build` may fail with `spawn EPERM`; an allowed rerun is acceptable if the same source then passes.

## 16. Completion report

Create `docs/IMP-030-COMPLETION-REPORT.md` in Turkish and include:

1. Özet
2. Değişen dosyalar
3. Başlangıç human-media audit: replaced 1:1 plan PNGs + real video
4. Home heading result
5. Masterplan A/B/C visual-label cleanup
6. Home/Block scene-navigation unification
7. Quick Card viewport-safe positioning
8. Quick Card viewport measurements for all five viewports
9. Details gallery cleanup
10. Tour presentation cleanup
11. Real Project Video canonical integration
12. Video metadata and Chromium playback
13. TR/EN/RU wording changes
14. Legacy development artifact audit
15. Removed files, if any
16. Main demo flow QA
17. Responsive matrix
18. IMP-026 SceneStage anchor regression
19. Loading/lazy-load regression
20. Staging/media result
21. Commands
22. Required check results
23. Dependency changes
24. Remaining temporary/demo content and why
25. Human-eye review
26. Warnings/blockers/architectural conflicts
27. Confirmation IMP-031 was not started

## Explicitly forbidden

Do not:
- edit five plan PNG contents
- edit/transcode `video-animation.mp4`
- alter Masterplan/Unit hotspot coordinates
- alter Unit/UnitType identity
- change route schema
- redesign unrelated surfaces
- add backend/analytics
- add dependencies
- change panorama adapter architecture
- deploy
- rewrite historical completion reports
- alter locked baseline docs
- fix the random transition compositor flash in this task unless IMP-030 introduces a regression that requires it
- solve the Home-page scrollbar as a separate redesign in this task
- begin IMP-031

Random transition flash and final hardening remain for IMP-031.

## Acceptance criteria

IMP-030 passes only if:
- Home title is presentation-ready (`Genel Görünüm` in TR)
- visible Masterplan A/B/C development labels are removed without breaking hotspots
- Home and Block scene navigation use a coherent lower control-region grammar
- IMP-026 SceneStage anchor remains stable
- Quick Card is fully visible inside the viewport immediately after Unit selection at all five target viewports
- Details no longer shows fake empty gallery placeholder
- Tour remains functional with honest representative/sample wording
- real `video-animation.mp4` is customer-facing Project Video
- Video remains in global navigation
- real Video plays in Chromium
- normal customer flow contains no raw development/proof/placeholder/synthetic jargon
- updated 1:1 plans still resolve correctly
- TR/EN/RU and accessibility remain correct
- build/lint/typecheck/tests/staging pass
- no new dependency
- locked baselines remain unchanged
- IMP-031 is not started
