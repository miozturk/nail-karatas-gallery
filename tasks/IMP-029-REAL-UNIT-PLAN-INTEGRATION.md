# IMP-029 — Real Unit Plan Integration & Content Cleanup

Status: READY

## Objective

Integrate the real Unit plan media in `public/media/plans/project` into Quick Card and Details using one canonical production mapping. The user may replace these files tomorrow with improved square-framed versions under the same filenames, so no code change should be required when files are overwritten in-place.

This task is presentation-critical for the Friday 12:00 customer demo.

## Required reading

Follow `AGENTS.md` and all mandatory locked baseline documents.

Also read:
- `docs/IMP-026-COMPLETION-REPORT.md`
- `docs/IMP-027-COMPLETION-REPORT.md`
- `docs/IMP-028-COMPLETION-REPORT.md`
- current Unit / UnitType seed/domain data
- current Quick Card implementation
- current Details implementation
- current plan/proof media handling
- `docs/STAGING-QA-CHECKLIST.md`

## Source media

Exact current files under `public/media/plans/project`:

- `plan-bc-t01.png`
- `plan-bc-t01-m.png`
- `plan-bc-t02.png`
- `plan-bc-t02-m.png`
- `plan-ticari.png`

Important:
1. The four BC plan files are real residential floor plans currently captured from a PDF presentation.
2. The user may replace them tomorrow with cleaner square-framed versions using the exact same filenames.
3. `plan-ticari.png` is currently a temporary black placeholder because the real commercial plan is not yet available.
4. The user explicitly wants `plan-ticari.png` to be shown in the demo for now.
5. The user plans to overwrite `plan-ticari.png` tomorrow with the real commercial plan using the same filename.
6. Do not hide it, replace it with a missing-plan state, or build placeholder-specific logic.

## Expected canonical mapping

Use canonical UnitType data as source of truth:

- `BC-T01` -> `/media/plans/project/plan-bc-t01.png`
- `BC-T01-M` -> `/media/plans/project/plan-bc-t01-m.png`
- `BC-T02` -> `/media/plans/project/plan-bc-t02.png`
- `BC-T02-M` -> `/media/plans/project/plan-bc-t02-m.png`

A-003 must resolve to:
- `/media/plans/project/plan-ticari.png`

If the exact commercial UnitType ID differs in existing seed data, resolve it through the current canonical model and document the actual mapping. Do not infer UnitType identity from pixels.

## Canonical media architecture

Create or extend a small production-safe canonical plan-media mapping.

Requirements:
- one source of truth
- no scattered filename literals across Quick Card and Details
- use existing UnitType / Unit IDs
- Quick Card and Details consume the same resolver
- no new dependency
- no backend
- no route schema change
- no hotspot changes
- no transition media changes
- no panorama architecture changes

A small shared resolver/component is acceptable if it reduces duplication.

## Rendering behavior

The plan UI must remain stable even if tomorrow's replacement images have different dimensions/crops.

Requirements:
- stable plan viewport/frame
- no layout shift from aspect-ratio changes
- no stretch/distortion
- avoid accidental crop of meaningful plan content
- prefer contain-style presentation inside a stable frame
- keep current premium visual language
- responsive behavior clean
- do not hardcode today's image pixel dimensions

## Commercial plan behavior

`plan-ticari.png` must be shown normally for A-003.

Do not:
- hide it
- replace it with text-only state
- show "plan unavailable"
- detect black pixels
- special-case it as placeholder

Treat it as the current production media asset.

## Quick Card integration

Verify at minimum:
- A-003
- B-301
- B-302
- C-401
- C-404

Requirements:
- correct plan for canonical UnitType
- no mirrored/non-mirrored mismatch
- stable card geometry
- existing Unit metadata intact
- `Sanal Tur` / `Detayları Gör` behavior intact
- close behavior intact

## Details integration

Requirements:
- same Unit resolves to same plan as Quick Card
- no duplicated plan-path logic
- existing sales info remains intact
- no route regression
- no visual overflow

## Localization

Verify TR / EN / RU:
- no parity regression
- media path independent of locale
- locale switch does not alter Unit identity/route
- new text, if any, exists in all three locales

## Responsive QA

Verify:
- 320×844
- 390×844
- 768×1024
- 1280×800
- 1440×900

At minimum inspect:
- A-003 Quick Card
- B-301 Quick Card
- B-302 Details
- C-401 Quick Card
- C-404 Details

Requirements:
- no horizontal overflow
- plan readable within frame
- no stretch
- no layout jumping
- IMP-026 SceneStage anchor unchanged
- Quick Card / Details usable on mobile

## Browser / route regression

Verify:
- Home -> Block -> Unit -> Quick Card
- Quick Card -> Details
- Details -> Back
- Quick Card close -> Block
- Browser Back/Forward
- Tour behavior unchanged
- unavailable Tour behavior unchanged where applicable
- no console warning/error

## Media handling

Do not modify plan PNG contents during this task.

Do not:
- crop
- resize
- recompress
- rename
- convert
- regenerate

The user will manage image replacement separately. Integrate the exact current filenames only.

## Staging / production behavior

Verify:
- production build serves all five plan assets
- correct MIME
- route fallback unaffected
- DEV-only routes remain isolated
- no new eager-load storm
- plan assets load only when their customer-facing surface needs them unless current architecture already behaves otherwise

## Required checks

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

## Completion report

Create `docs/IMP-029-COMPLETION-REPORT.md` in Turkish and include:

1. Özet
2. Değişen dosyalar
3. Plan media audit
4. Canonical plan-media mapping yeri
5. UnitType -> plan eşleme tablosu
6. A-003 ticari plan çözümlemesi
7. Quick Card entegrasyonu
8. Details entegrasyonu
9. Ortak component/resolver açıklaması
10. Görsel frame / object-fit yaklaşımı
11. Aynı dosya adları üzerine yeni plan yazıldığında neden kod değişikliği gerekmediği
12. 320 / 390 / 768 / 1280 / 1440 responsive sonuçları
13. TR / EN / RU sonucu
14. Browser Back/Forward ve route regression
15. Tour / unavailable regression
16. IMP-026 SceneStage anchor regression
17. Staging/media serving
18. Çalıştırılan komutlar
19. Zorunlu kontrol sonuçları
20. Dependency değişiklikleri
21. İnsan gözü review notu
22. Uyarılar / blocker / mimari çelişki
23. Sonraki IMP'ye başlanmadığı teyidi

## Explicitly forbidden

Do not:
- alter plan PNG files
- alter hotspot coordinates
- alter Masterplan or Unit geometry
- alter exterior WebP/MP4 media
- alter Unit/UnitType identity
- change route schema
- change panorama architecture
- add backend/analytics
- deploy
- add dependencies
- alter locked baseline documents
- begin IMP-030

## Acceptance criteria

IMP-029 passes only if:
- all five exact plan filenames are integrated through one canonical mapping
- A-003 shows `plan-ticari.png`
- B/C demo Units resolve the correct BC-T01 / T01-M / T02 / T02-M plan from canonical UnitType data
- Quick Card and Details use the same plan resolution source
- overwriting any current plan file tomorrow under the same filename needs no code change
- layout stays stable across tested viewports
- no stretch / unintended crop / horizontal overflow
- TR/EN/RU remain correct
- Unit/Details/Tour routing remains correct
- IMP-026 stage-anchor remains intact
- staging/build/lint/tests pass
- no new dependency
- locked baselines unchanged
- no later IMP started
