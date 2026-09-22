# IMP-031 — Demo Hardening, Transition Handoff & Final Rehearsal

Status: READY — 2026-09-22

## Objective

Prepare the application for the Friday 12:00 customer demo.

This is strictly a hardening task. No new feature, no premium final-design work, no full-bleed redesign.

Primary goals:
1. Remove or materially reduce the remaining random exterior transition flash/compositor glitch.
2. Preserve IMP-026 route-anchor stability.
3. Perform final demo-flow regression and production/staging rehearsal.
4. Address Home vertical scrollbar only if a low-risk principled fix exists.
5. Produce a demo-readiness report.

## Required reading

Follow `AGENTS.md` and all mandatory locked baseline documents.

Also read:
- `docs/IMP-026-COMPLETION-REPORT.md`
- `docs/IMP-027-COMPLETION-REPORT.md`
- `docs/IMP-028-COMPLETION-REPORT.md`
- `docs/IMP-029-COMPLETION-REPORT.md`
- `docs/IMP-030-COMPLETION-REPORT.md`
- current transition implementation
- current router/AppShell/SceneStage layout
- `docs/STAGING-QA-CHECKLIST.md`

## Known-good baseline

IMP-030 is committed and the working tree must start clean.

Production media:
- four real exterior WebP scenes
- six real H.264 transition MP4s
- five 1:1 plan PNGs
- final project video at `public/media/video/project/video-animation.mp4`
- Tour sample panoramas

Final project video:
- H.264 High
- yuv420p
- 1280×720
- 30 fps
- TV range
- BT.709 color space / primaries
- correct colors manually verified in Chrome

## Known issue A — random transition flash

A non-deterministic visual flash/glitch still appears during some exterior transitions.

History:
- SceneStage route geometry is stable
- destination WebP readiness is guarded with `Image.decode()`
- successful transition no longer resets `currentTime=0` before route handoff
- flash still occurs randomly
- likely cause is route paint/compositor/layer teardown timing, not media encoding or layout geometry

### Preferred direction

Use a persistent transition presentation layer that survives route commit long enough to prevent an intermediate frame from becoming visible.

Preferred behavior:
- transition video stays visually on top through navigation
- destination scene mounts/paints behind it
- overlay is released only after destination readiness and an appropriate post-commit paint boundary
- no black frame
- no artificial fade used to hide the problem
- no transition-media re-encoding
- no stale overlay, double-play or route-content pop
- Browser Back and reverse transitions remain coherent

A route-independent persistent overlay is acceptable if it is the cleanest implementation.

Do not add broad state management.

### Transition acceptance

Test all six transitions repeatedly:
- Home → A
- Home → B
- Home → C
- A → Home
- B → Home
- C → Home

Target at least 10 repetitions per direction in Chromium if practical.

Record any:
- white/black frame
- source/destination frame escape
- compositor flash
- route-content pop
- double-play
- stale overlay

If reliable elimination requires risky architecture, stop and report the remaining behavior rather than masking it.

## Known issue B — Home vertical scrollbar

At desktop sizes such as 1280×800, Home may vertically overflow because shell content plus the 4:3 SceneStage exceeds viewport height.

Rules:
- only fix if low risk
- no global `overflow: hidden`
- do not clip customer content
- do not change logical SceneStage coordinates
- do not break route-anchor stability
- prefer a principled viewport-height-aware fit if small and stable
- otherwise leave the scrollbar and document why

## SceneStage geometry lock

IMP-026 reference values:

| Viewport | `(x, documentY, width, height)` |
| --- | --- |
| 320 × 844 | `(16, 411, 273, 204.75)` |
| 390 × 844 | `(16, 411, 343, 257.25)` |
| 768 × 1024 | `(24, 319, 705, 528.75)` |
| 1280 × 800 | `(96.5, 319, 1072, 804)` |
| 1440 × 900 | `(176.5, 319, 1072, 804)` |

Do not casually change these.

If a low-risk scrollbar fix intentionally changes desktop stage sizing:
- Home / Block / Unit / Details must remain consistent per viewport
- 4:3 must remain preserved
- hotspot alignment must remain exact
- change must be explicitly documented and visually verified

Otherwise leave geometry unchanged.

## Exact demo-chain rehearsal

Verify in TR:

1. Genel Görünüm
2. hover/select B
3. Home → B transition
4. B-301 hotspot
5. Quick Card
6. Details
7. Quick Card
8. Tour
9. switch panorama rooms
10. Daireye Dön
11. close Quick Card / Block
12. Genel Görünüme Dön
13. reverse transition to Home
14. Video
15. play final project animation
16. Browser Back to Home

Also quick-check:
- A-003
- C-401
- A/B/C selectors
- keyboard activation of at least one hotspot
- direct `/video` refresh
- Browser Back/Forward around Tour and Unit

## Responsive verification

Check:
- 320×844
- 390×844
- 768×1024
- 1280×800
- 1440×900

Inspect:
- AppShell/header
- Home
- Block B
- B-301 Quick Card
- B-301 Details
- B-301 Tour
- Video
- transition overlay/handoff

Record:
- horizontal overflow
- vertical overflow
- SceneStage rect
- Quick Card bounds
- transition result

## Production/staging rehearsal

Run a clean production rehearsal:
- production build
- staging server
- direct route refresh
- media MIME/range validation
- DEV-route isolation
- no missing media
- final video playback
- all six transition paths
- no console errors in normal demo chain

If practical, verify on the actual presentation laptop/browser.

## Loading regression

Verify:
- Home does not eagerly fetch Tour panoramas
- Home does not eagerly fetch project video
- no transition request storm
- Video remains route-loaded
- Tour remains route-loaded
- transition fix does not excessively preload unrelated media

## Do not change

Do not alter:
- Masterplan hotspot coordinates
- Unit hotspot coordinates
- Unit/UnitType identity
- route schema
- four exterior WebPs
- six transition MP4 contents
- five plan PNG contents
- final project video contents
- panorama media
- panorama adapter architecture
- locked baseline docs

No new dependency.

## Explicitly forbidden

Do not:
- add full-bleed redesign
- add glass UI
- add premium final shell
- redesign Nail Karataş host-site integration
- add backend
- add Availability
- add Favorites
- add lead forms
- add analytics
- add new customer routes
- regenerate final render media
- change project-video encoding
- begin post-sale/final-product work
- begin IMP-032

## Required commands

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

Use existing media-loading inspection tooling where relevant.

Known sandbox note:
A first `npm run build` may fail with `spawn EPERM`; a permitted rerun is acceptable if documented.

## Completion report

Create `docs/IMP-031-COMPLETION-REPORT.md` in Turkish and include:

1. Özet
2. Başlangıç repository durumu
3. Değişen dosyalar
4. Transition flash root-cause analysis
5. Implemented handoff strategy
6. Why the fix is safe
7. Six-transition repetition matrix
8. Any remaining visual anomaly
9. Home scrollbar decision and rationale
10. SceneStage geometry regression
11. Main demo-chain rehearsal
12. Responsive matrix
13. Browser Back/Forward result
14. Video playback result
15. Tour result
16. Media-loading regression
17. Staging result
18. Console result
19. Required command results
20. Dependency changes
21. Remaining known demo limitations
22. Human-eye review
23. Friday demo readiness
24. Confirmation no post-sale premium work and no IMP-032 was started

## Acceptance criteria

IMP-031 passes only if:
- working tree started clean from IMP-030
- transition handoff is materially improved with no new regression
- all six directions are tested repeatedly
- no black/white masking trick is introduced
- SceneStage/hotspot alignment stays correct
- Quick Card/Details/Tour/Video remain functional
- final H.264 project video still plays with correct color in Chromium
- exact demo chain completes end-to-end
- responsive matrix is checked
- build/lint/typecheck/tests/staging pass
- no new dependency
- no product expansion or premium-final-design work starts
- IMP-032 is not started
