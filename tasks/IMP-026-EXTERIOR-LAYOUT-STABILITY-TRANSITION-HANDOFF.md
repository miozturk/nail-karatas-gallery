# IMP-026 — Exterior Layout Stability & Transition Handoff

Status: **READY**

## Objective

Eliminate unintended route-to-route "layout dancing" in the customer-facing exterior experience and remove the visible flash / frame-jump sensation at the end of exterior transition videos.

This task comes **before** real hotspot authoring.

The exterior geometry must become a stable visual contract so that Home, Block, Unit and Details routes can later receive final hotspot coordinates without the surrounding layout moving underneath them.

This task covers:

- global header height/alignment stability,
- horizontal content-grid stability,
- scrollbar-induced horizontal movement,
- exterior intro/header-slot height stability,
- SceneStage screen-space anchoring,
- transition video -> destination static-scene handoff,
- measurement-driven regression validation.

Do not author or modify Masterplan or Unit hotspot coordinates in IMP-026.

## Required reading

Follow `AGENTS.md` and read all locked baseline documents.

Also read:

- `docs/IMP-022-COMPLETION-REPORT.md`
- `docs/IMP-023-COMPLETION-REPORT.md`
- `docs/IMP-024-COMPLETION-REPORT.md`
- `docs/IMP-025-COMPLETION-REPORT.md`
- `docs/STAGING-QA-CHECKLIST.md`

Inspect the current implementation of:

- `AppShell`
- Masterplan page
- Block page
- Unit route composition
- Details route composition
- SceneStage
- TransitionLayer
- shared/global CSS

Relevant locked behavior:

- Exterior logical scene is exactly 1920 × 1440, responsive 4:3, contain/no crop.
- Real Home/Block WebP and six H.264 transitions are already integrated and validated.
- Transition preload/lifecycle behavior from IMP-019/024/025 must remain intact.
- Browser Back remains normal history navigation and does not play reverse transition.
- Contextual Home triggers the separately encoded reverse transition.
- TR/EN/RU behavior must remain intact.
- Current customer visual system from IMP-022/023 must remain intact.
- Real hotspot authoring is deferred until after this task.

## Known symptoms to reproduce before changing code

At the same desktop viewport:

1. Home/Masterplan SceneStage and Block SceneStage do not begin at the same screen-space Y coordinate because the content above them has route-dependent height.
2. Header / horizontal alignment can shift route-to-route, especially where vertical scrollbar presence changes the effective `clientWidth`.
3. At the end of a forward/reverse transition, the user can perceive a short "flash / frame escape / jump" as the video disappears and the destination static scene appears.

Do not assume the root cause. Measure first.

## 1. Baseline measurement audit

Before editing CSS or components, record screen-space geometry with `getBoundingClientRect()` in production/staging Chromium.

At minimum measure on:

- `/`
- `/block/b`
- `/block/b/unit/B-301`
- `/block/b/unit/B-301/details`
- `/video` for global-header comparison only

Measure:

- global header outer rect
- header inner/content rect
- main/content container rect
- exterior intro/header region rect
- SceneStage outer rect
- scene image rect
- SVG interaction-layer rect
- transition video rect when active
- exterior status / control region rect where relevant
- `document.documentElement.clientWidth`
- `document.documentElement.scrollWidth`
- whether vertical scrolling is present

Record Home vs Block deltas before changes.

The completion report must include a concise before/after table.

## 2. Define an exterior layout contract

Implement a small, explicit layout contract for exterior routes.

At a given viewport/breakpoint, the following must remain stable across Home, Block, Unit and Details routes:

- header height,
- header inner X and width,
- exterior content X and width,
- exterior intro-slot Y and height,
- SceneStage X,
- SceneStage Y,
- SceneStage width,
- SceneStage height.

Target tolerance:

- ideally 0 CSS px difference,
- at most 1 CSS px where browser fractional rounding makes exact equality impractical.

The contract may use shared CSS custom properties/classes or a small shared layout wrapper if that reduces duplication.

Do not create a large new layout framework.

## 3. Stabilize scrollbar behavior

Prevent vertical-scrollbar presence/absence from shifting the centered page horizontally.

Prefer a standards-based solution such as stable scrollbar gutter behavior where supported.

Requirements:

- no forced permanent ugly scrollbar if avoidable,
- no horizontal overflow regression,
- Home and Block should keep the same horizontal content alignment at the same viewport,
- 320/390 mobile behavior must remain clean.

If a fallback is necessary, keep it minimal and document it.

## 4. Stabilize global header

The AppShell header must not change height or internal baseline merely because route-specific links appear/disappear.

Requirements:

- same outer header height at the same breakpoint,
- project identity position stable,
- locale selector position stable,
- right navigation area aligned consistently,
- active-route styling must not alter geometry,
- suppressed contextual/global Home behavior remains semantically unchanged,
- 44 px practical targets remain,
- TR/EN/RU still fit safely.

Do not change route semantics just to make the header look stable.

## 5. Stabilize exterior intro/header slot

Home and Block currently contain different amounts of heading/meta content above SceneStage.

Create a breakpoint-aware exterior intro slot so that content variation does not push SceneStage to a different screen-space Y coordinate within the same breakpoint.

Requirements:

- Home title/intro remains readable,
- Block title/category/Home control remains readable,
- Unit/Details routes that render through BlockPage preserve the same stage anchor,
- no clipping of EN/RU copy,
- no absolute-position hacks that overlap content,
- mobile may use a different slot height from desktop, but all exterior routes at that mobile breakpoint must share the same contract.

## 6. SceneStage anchoring

After the layout changes:

- Home, Block, Unit and Details must render SceneStage at the same X/Y/W/H at the same viewport,
- scene image and SVG interaction rects must match SceneStage,
- no crop/stretch,
- 4:3 preserved,
- Quick Card/Details can appear below/over the stage according to existing behavior but must not move the stage anchor unexpectedly,
- opening/closing Quick Card must not cause an unintended stage jump.

Do not change logical 1920 × 1440 coordinates.

## 7. Transition handoff investigation

Reproduce forward and reverse transition at least for Block B before changing TransitionLayer behavior.

Inspect:

- source static scene rect,
- transition video rect during playback,
- destination static scene rect immediately after navigation,
- destination image decode/readiness if observable,
- whether the perceived flash is caused by rect movement, image decode/paint delay, background exposure, or a combination.

Do not refactor transition architecture before identifying the likely cause.

## 8. Destination-image readiness

If the destination static WebP can be decoded/prepared before transition completion without disturbing existing media policy, add a small, explicit predecode/preload helper.

Preferred behavior:

- user activates transition,
- destination scene image is prepared in parallel,
- transition plays normally,
- destination image is decoded before the video overlay disappears where practical,
- navigation completes without exposing an unloaded scene/background.

Use native browser image loading/`decode()` behavior where appropriate.

Requirements:

- no new dependency,
- no global media manager,
- no eager loading of all Block images on initial Home solely for this fix,
- failure to predecode must fail safely and must not trap navigation,
- reduced-motion behavior remains safe.

## 9. Handoff stabilization

After fixing layout geometry, test whether flash/jump remains.

If the flash disappears through stable rects + destination predecode, stop there.

Only if a visible one-frame handoff artifact still remains may you implement the smallest additional transition-overlay persistence needed to bridge the navigation paint boundary.

Do **not** immediately build a new application-wide transition architecture.

Any handoff fix must preserve:

- existing A/B/C file mapping,
- forward/reverse semantics,
- intent-based preload,
- error/timeout fail-safe,
- interaction lock,
- Browser Back semantics,
- reduced-motion behavior.

## 10. Do not mask encoded media problems

Do not:

- add fades solely to hide a geometry bug,
- blur the video,
- insert black/white frames,
- change MP4 files,
- change static WebP files.

The current transition media passed IMP-025 delivery validation.

This task fixes layout / handoff, not source media.

## 11. "Dancing elements" audit

During route transitions inspect other customer-facing elements for unintended geometry changes.

At minimum compare:

- header bottom edge,
- project identity,
- locale selector,
- Home/Video navigation region,
- exterior title/meta block,
- contextual Home control,
- SceneStage,
- status line / selector region.

Classify each movement as:

- intentional content change,
- expected responsive reflow,
- unintended layout shift.

Fix only unintended route-to-route layout shifts within this task.

Do not force unrelated pages such as Tour into the exact exterior geometry contract.

## 12. Responsive validation

Verify:

- 320 × 844
- 390 × 844
- 768 × 1024
- 1280 × 800
- 1440 × 900

At each viewport compare at least:

- Home
- Block B
- B-301 Quick Card route
- B-301 Details route

Requirements:

- no horizontal overflow,
- SceneStage 4:3,
- scene image / SVG rect aligned,
- same exterior stage anchor within 1 px per viewport,
- header geometry stable,
- no text clipping,
- Russian at 320 px remains usable.

## 13. Transition regression matrix

Production/staging flows:

### Flow A
Home -> A -> Home.

### Flow B
Home -> B -> Home.

### Flow C
Home -> C -> Home.

### Flow D
Home -> B -> B-301 -> close Quick Card -> Home.

Verify at 390 and 1280.

For each:

- source/video/destination rect continuity,
- correct transition file,
- no visible layout jump,
- no white/black/background flash caused by UI,
- no green/magenta media issue,
- no watermark,
- interaction lock,
- correct route result,
- clean console.

Also verify Browser Back remains direct history navigation.

## 14. Localization regression

Verify TR / EN / RU on:

- Home
- Block B

Requirements:

- locale switch does not change URL,
- header geometry does not jump when switching locale beyond natural text width inside its reserved region,
- SceneStage anchor remains unchanged,
- no horizontal overflow.

## 15. Performance / loading regression

Preserve prior behavior:

- clean Home does not eagerly request all transition videos,
- panorama/project-video media not requested by exterior Home,
- selective transition intent preload remains,
- any destination-image readiness addition is scoped and documented,
- no request storm,
- no duplicate video elements after navigation.

## 16. DEV-tool and staging regression

- Hotspot Editor remains DEV-only.
- Panorama Spike remains DEV-only.
- Production DEV routes remain NotFound.
- `npm run staging:verify` must pass.
- Do not begin hotspot authoring.

## 17. Required automated checks

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

No new dependency is expected.

## 18. Completion report

Create:

`docs/IMP-026-COMPLETION-REPORT.md`

Return the report in Turkish and include:

1. Özet.
2. Oluşturulan / değiştirilen dosyalar.
3. Baseline layout ölçüm tablosu.
4. Tespit edilen unintended layout-shift kök nedenleri.
5. Exterior layout contract yaklaşımı.
6. Scrollbar-gutter / horizontal alignment sonucu.
7. Header stability sonucu.
8. Exterior intro-slot sonucu.
9. SceneStage X/Y/W/H before/after karşılaştırması.
10. Transition handoff kök neden analizi.
11. Destination-image readiness çözümü varsa ayrıntısı.
12. Ek handoff çözümü uygulandıysa neden gerekli olduğu.
13. "Dancing elements" audit sonucu.
14. 320 / 390 / 768 / 1280 / 1440 responsive ölçüm sonucu.
15. A/B/C forward-reverse transition regression sonucu.
16. Quick Card / Details stage-anchor sonucu.
17. Browser Back/Forward sonucu.
18. TR / EN / RU sonucu.
19. Loading/preload regression sonucu.
20. Staging sonucu.
21. Çalıştırılan komutlar.
22. Tüm zorunlu kontrol sonuçları.
23. Dependency değişikliği varsa listesi.
24. Kalan görsel belirsizlik / insan gözü review notu.
25. Uyarılar / blocker / mimari çelişki.
26. Sonraki IMP'ye başlama.

## Explicitly forbidden in IMP-026

Do not:

- author or alter Masterplan A/B/C hotspot coordinates,
- alter Unit hotspot coordinates,
- modify transition MP4 files,
- modify exterior WebP files,
- change route schema,
- change domain/seed data,
- redesign customer UI,
- add Availability/Brochure/Location/Contact,
- change panorama architecture,
- add backend/analytics,
- add dependencies unless absolutely required and explicitly justified,
- deploy to a hosting provider,
- alter locked baseline documents,
- begin IMP-027.

## Acceptance criteria

IMP-026 passes only if:

- global header geometry is stable route-to-route at the same breakpoint,
- scrollbar presence no longer causes horizontal page/content dancing,
- Home/Block/Unit/Details SceneStage rects match within <=1 CSS px at each tested viewport,
- scene image/SVG/video rects remain aligned,
- the perceived transition-end flash/layout jump is eliminated or reduced to a clearly documented non-layout source artifact,
- destination static image readiness is handled safely if decode latency contributes,
- A/B/C forward and reverse flows remain correct,
- Browser Back semantics remain unchanged,
- TR/EN/RU remain correct,
- 320/390/768/1280/1440 checks pass,
- no horizontal overflow is introduced,
- loading/preload behavior does not regress,
- staging/build/lint/tests pass,
- no hotspot geometry is changed,
- no new dependency is added,
- locked baseline documents remain unchanged,
- no later IMP is started.
