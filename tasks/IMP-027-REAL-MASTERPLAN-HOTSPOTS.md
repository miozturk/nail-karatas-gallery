# IMP-027 — Real Masterplan Hotspot Authoring

Status: **READY**

## Objective

Replace the DEVELOPMENT-ONLY A/B/C Masterplan hotspot polygons with real polygons authored against the actual Nail Karataş `masterplan.webp`.

IMP-026 stabilized the exterior layout and SceneStage screen-space contract. IMP-027 now uses that stable geometry to author the three production Block-selection polygons.

This task covers **only the three Block-selection polygons on the Home / Masterplan scene**.

Do not modify Unit hotspot geometry in this task. Unit hotspot realignment will be handled separately.

## Required reading

Follow `AGENTS.md` and read all locked baseline documents.

Also read:

- `docs/IMP-024-COMPLETION-REPORT.md`
- `docs/IMP-025-COMPLETION-REPORT.md`
- `docs/IMP-026-COMPLETION-REPORT.md`
- `src/media/exteriorMedia.ts`
- current Masterplan hotspot/polygon source
- current Hotspot Editor implementation and README
- `docs/STAGING-QA-CHECKLIST.md`

Relevant locked behavior:

- Masterplan SceneStage logical space is exactly 1920 × 1440.
- Real Home scene is `/media/scenes/project/masterplan.webp`.
- Exterior SceneStage X/Y/W/H is now stable route-to-route per IMP-026.
- A/B/C control ↔ polygon synchronization already works.
- Forward transition mapping/lifecycle must not change.
- TR/EN/RU behavior must not change.
- Hotspot geometry must remain data-driven and UI-independent.
- Production customer flow must not depend on DEV-only editor routes.

## 1. Geometry-source audit

Locate the current DEVELOPMENT-ONLY Masterplan A/B/C polygon data.

Record:
- source file(s)
- current polygon IDs
- current coordinates
- how Masterplan consumes them
- whether any geometry is duplicated in component code

Do not change behavior before completing this audit.

## 2. Authoring method

Use the existing DEV-only Hotspot Editor where practical.

The authoring reference must be the real:
`/media/scenes/project/masterplan.webp`

All coordinates must be authored in the existing 1920 × 1440 logical coordinate space.

If the existing editor cannot load the real Masterplan image without a small, clearly scoped improvement, a minimal DEV-only editor enhancement is allowed.

Do not add a new dependency.
Do not create a second hotspot editor.

## 3. Polygon intent

Author exactly three production Block polygons:
- `a`
- `b`
- `c`

Each polygon should trace the visible mass / façade footprint of its corresponding block sufficiently closely for hover/click selection.

Guidelines:
- prefer a modest number of meaningful vertices
- avoid hundreds of points
- do not include large empty sky/ground regions
- avoid overlap between A/B/C polygons unless the rendered architecture genuinely overlaps in projection
- prioritize predictable selection over microscopic edge tracing
- polygon should feel correct at both desktop and narrow responsive sizes because coordinates are logical-space based

Do not change Block IDs.

## 4. Production geometry replacement

Replace only the existing DEVELOPMENT-ONLY Masterplan polygons with the newly authored real geometry.

Requirements:
- one canonical data source
- no duplicate coordinate literals in UI components
- preserve existing `SvgHotspotLayer` API
- preserve hover/focus/active/disabled semantics
- preserve keyboard activation
- preserve A/B/C control synchronization
- remove or update DEVELOPMENT-ONLY geometry comments/labels that are no longer truthful for Masterplan polygons

Do not remove development warnings related to Unit polygons or other still-placeholder content.

## 5. Visual QA

On the real Masterplan image verify:
- A polygon visually corresponds to Block A
- B polygon visually corresponds to Block B
- C polygon visually corresponds to Block C
- hover from polygon highlights matching selector control
- hover/focus from selector control highlights matching polygon
- active/transition-lock state remains correct
- polygons do not visibly select another block's primary façade area

## 6. Responsive geometry QA

Verify at:
- 320 × 844
- 390 × 844
- 768 × 1024
- 1280 × 800
- 1440 × 900

Requirements:
- SceneStage remains 4:3
- image and SVG rect remain aligned
- polygons scale correctly with the scene
- hit targets remain attached to the intended building
- no horizontal overflow
- no coordinate drift
- IMP-026 exterior stage-anchor contract remains intact

The polygon data itself must remain expressed only in 1920 × 1440 logical coordinates.

## 7. Transition regression

For each Block:
- Home -> A
- Home -> B
- Home -> C

Verify:
- clicking/focusing the newly aligned polygon still triggers the correct forward transition
- transition file mapping remains correct
- controls lock during transition
- route ends at correct Block
- no change to preload behavior
- no transition handoff regression from IMP-026

Do not touch the six MP4 delivery files.

## 8. Accessibility / localization regression

Verify at minimum:
- keyboard Tab / focus -> A/B/C controls
- keyboard activation
- visible polygon focus state
- translated hotspot accessible labels
- TR / EN / RU on Home
- locale changes do not alter geometry or route

No new translation keys are expected unless an existing development-only geometry label must be cleaned safely.

## 9. DEV editor regression

If the Hotspot Editor is touched:
- it must remain DEV-only
- production route remains NotFound
- coordinate mapping screen -> logical 1920 × 1440 remains correct
- existing JSON export remains deterministic
- production bundle must not gain DEV editor chunks

Do not redesign the editor.

## 10. Geometry documentation

Create a concise geometry record in the completion report.

For each A/B/C polygon include:
- vertex count
- final logical-space coordinates
- brief description of the visual region traced

Do not add screenshots to Git unless they are already part of the repository workflow.

## 11. Scope protection

Do not in IMP-027:
- change Unit hotspot coordinates
- modify Block scene images
- modify transition videos
- modify Unit/UnitType data
- modify panorama/tour behavior
- modify Quick Card/Details behavior
- redesign customer UI
- add new product features
- add dependencies
- deploy to a provider
- alter IMP-026 layout contract unless a clear regression is found and documented
- begin the next IMP

## 12. Required automated validation

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

If an existing geometry validation script exists, run it.

A tiny deterministic Masterplan-polygon validator may be added only if useful and dependency-free.

## 13. Manual browser validation

Production/staging:

Flow A:
Home -> hover/focus/click A -> Block A -> Browser Back -> Home.

Flow B:
Home -> hover/focus/click B -> Block B -> Home using contextual reverse transition.

Flow C:
Home -> hover/focus/click C -> Block C -> Home.

Verify at 390 and 1280.
Also inspect Home at 320, 768 and 1440 for geometry alignment.

Verify:
- no console warning/error
- no horizontal overflow
- correct locale behavior
- correct transition mapping
- SceneStage anchor remains stable

## 14. Completion report

Create:
`docs/IMP-027-COMPLETION-REPORT.md`

Return the report in Turkish and include:
1. Özet.
2. Oluşturulan / değiştirilen dosyalar.
3. Eski DEVELOPMENT-ONLY geometry audit sonucu.
4. Authoring yöntemi.
5. A polygon koordinatları / vertex sayısı / görsel bölge açıklaması.
6. B polygon koordinatları / vertex sayısı / görsel bölge açıklaması.
7. C polygon koordinatları / vertex sayısı / görsel bölge açıklaması.
8. Production geometry entegrasyonu.
9. Selector ↔ polygon senkron doğrulaması.
10. 320 / 390 / 768 / 1280 / 1440 geometry sonucu.
11. IMP-026 layout-contract regression sonucu.
12. A/B/C transition regression sonucu.
13. Keyboard/accessibility sonucu.
14. TR / EN / RU sonucu.
15. DEV editor regression sonucu (editor değiştiyse ayrıntılı).
16. Staging sonucu.
17. Çalıştırılan komutlar.
18. Tüm zorunlu kontrol sonuçları.
19. Dependency değişikliği varsa listesi.
20. Görsel doğruluk açısından kalan belirsizlik / insan gözüyle review gereken nokta.
21. Uyarılar / blocker / mimari çelişki.
22. Sonraki IMP'ye başlama.

## Acceptance criteria

IMP-027 passes only if:
- Masterplan A/B/C production polygons are authored against the real `masterplan.webp`
- the old DEVELOPMENT-ONLY Masterplan geometry is no longer used in customer production flow
- only three canonical A/B/C polygons exist
- geometry remains in logical 1920 × 1440 coordinates
- selector ↔ polygon sync remains correct
- A/B/C transition routing remains correct
- IMP-026 stage-anchor stability remains intact
- all five viewport checks show correct alignment/no drift
- keyboard/focus/accessibility behavior remains intact
- TR/EN/RU behavior remains intact
- Unit hotspot geometry remains untouched
- staging/build/lint/tests pass
- no new dependency is added
- locked baseline documents remain unchanged
- no later IMP is started
