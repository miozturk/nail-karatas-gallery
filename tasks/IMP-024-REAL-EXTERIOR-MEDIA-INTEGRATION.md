# IMP-024 — Real Exterior Media Integration

Status: **READY**

## Objective

Replace the DEVELOPMENT-ONLY exterior scene / transition proof media used by the customer-facing application with the real Nail Karataş project media that has already been copied into the repository.

Expected real-media paths:

```text
public/media/scenes/project/masterplan.webp
public/media/scenes/project/block-a.webp
public/media/scenes/project/block-b.webp
public/media/scenes/project/block-c.webp

public/media/transitions/project/home-to-a.mp4
public/media/transitions/project/home-to-b.mp4
public/media/transitions/project/home-to-c.mp4
public/media/transitions/project/a-to-home.mp4
public/media/transitions/project/b-to-home.mp4
public/media/transitions/project/c-to-home.mp4
```

This task is media integration + media QA only.

Do not change hotspot geometry, route semantics, domain data, visual design system, localization architecture, panorama architecture, or staging architecture.

## Required reading

Follow `AGENTS.md` and read all locked baseline documents.

Also read:

- `docs/IMP-019-COMPLETION-REPORT.md`
- `docs/IMP-020-COMPLETION-REPORT.md`
- `docs/IMP-021-COMPLETION-REPORT.md`
- `docs/IMP-022-COMPLETION-REPORT.md`
- `docs/IMP-023-COMPLETION-REPORT.md`
- `docs/STAGING-QA-CHECKLIST.md`

## 1. Preflight audit

Before changing code, inspect the actual files listed above.

Record for each file:

- exists / missing
- file size
- image dimensions for WebP files
- video duration
- video intrinsic width / height
- whether the browser can decode and play it
- whether dimensions/aspect ratio are compatible with the current 1920 × 1440 logical exterior scene

Do not silently resize, transcode or replace any real project file.

If any required file is missing or clearly incompatible, stop that specific integration, report the exact blocker, and do not fabricate substitute project media.

## 2. Centralized real-media configuration

Create or update one centralized exterior-media configuration module.

The customer-facing production flow must resolve:

- Home scene -> `masterplan.webp`
- Block A scene -> `block-a.webp`
- Block B scene -> `block-b.webp`
- Block C scene -> `block-c.webp`

Forward transitions:

- A -> `home-to-a.mp4`
- B -> `home-to-b.mp4`
- C -> `home-to-c.mp4`

Reverse transitions:

- A -> `a-to-home.mp4`
- B -> `b-to-home.mp4`
- C -> `c-to-home.mp4`

Requirements:

- no duplicated hard-coded project-media URLs across components
- existing development proof-media configuration may remain for DEV tools/tests if still useful
- production customer flow must not accidentally point to proof exterior media after this task
- source/master files outside `public/media` must not be introduced

## 3. Masterplan real scene integration

Replace the customer-facing Home / Masterplan proof scene with the real `masterplan.webp`.

Requirements:

- preserve logical 1920 × 1440 SceneStage coordinate system
- preserve SVG hotspot coordinates exactly
- no crop
- no image distortion
- image remains `contain` aligned with interaction layer
- A/B/C hotspot control synchronization remains unchanged
- TR/EN/RU behavior unchanged

Do not edit real image content.

## 4. Block A/B/C real scene integration

Replace Block proof scenes with:

- A -> `block-a.webp`
- B -> `block-b.webp`
- C -> `block-c.webp`

Requirements:

- keep each scene inside the same logical stage model
- no crop or distortion
- Unit hotspot geometry files must remain unchanged
- Unit active / hover / focus behavior unchanged
- Quick Card / Details layering unchanged
- contextual Home behavior unchanged

If the real images reveal obvious hotspot mismatch, document it but do not alter hotspot coordinates in IMP-024.

Hotspot authoring/realignment is a separate later task.

## 5. Forward transition integration

Wire the real project forward transition videos.

Requirements:

- Home -> A/B/C uses the correct distinct project MP4
- current intent-based preload policy remains intact
- no autoplay outside explicit transition activation
- transition lock behavior remains intact
- ended/error/timeout safe routing remains intact
- reduced-motion behavior remains intact
- video stays exactly aligned to the same SceneStage frame
- no white/layout flash

Do not merge or regenerate MP4 files.

## 6. Reverse transition integration

Wire the real separately encoded reverse videos.

Requirements:

- Block A -> Home uses `a-to-home.mp4`
- Block B -> Home uses `b-to-home.mp4`
- Block C -> Home uses `c-to-home.mp4`
- never use negative playbackRate
- current reverse preload policy remains intact
- reverse transition activation from Unit / Details contextual Home must remain correct
- browser Back behavior remains direct history behavior and must not be hijacked

## 7. Visual continuity QA

For all A/B/C transitions, manually inspect:

### Forward
Home static frame -> transition video -> target Block static frame.

### Reverse
Block static frame -> reverse transition video -> Home static frame.

Look for:

- obvious first-frame jump
- obvious last-frame jump
- scale mismatch
- crop mismatch
- aspect mismatch
- white/black flash caused by layout rather than encoded media
- incorrect A/B/C mapping

Do not claim pixel-perfect match unless actually measured.

If a visible discontinuity appears to be encoded into the provided media itself, document it as a media-source issue rather than masking it with code.

## 8. Real-media labeling cleanup

Remove DEVELOPMENT-ONLY exterior-media notices from customer-facing Home / Block UI where they specifically refer to the now-replaced exterior proof image/transition content.

Do not remove development notices from still-proof content such as:

- Unit plan placeholders
- gallery placeholders
- panorama proof content
- minimap proof content
- project-video proof content

Localization dictionaries must remain in parity if any exterior-only development label is removed or adjusted.

Do not rewrite general customer copy unnecessarily.

## 9. Loading / performance regression

IMP-019 behavior must remain intact.

Verify on clean production Home load:

- real Masterplan image loads
- project transition MP4s are not all eagerly downloaded on startup
- panorama media is not requested
- project-video proof media is not requested

Verify:

- hover/focus intent preloads only the needed forward transition
- entering a Block does not eagerly download unrelated Block transition files
- contextual Home intent preloads only that Block's reverse transition
- no request storm / repeated duplicate request caused by integration

Large real-media size may naturally change transfer volume. Do not alter preload architecture merely to chase file-size numbers.

## 10. Staging media verification

Update staging verification if it currently hard-codes exterior proof-media URLs.

The staging verifier must verify the actual production exterior files:

- `masterplan.webp`
- `block-a.webp`
- `block-b.webp`
- `block-c.webp`
- all six project transition MP4s

Verify:

- HTTP success
- correct content type
- MP4 range support
- stable root-relative URL
- no filesystem/local path leakage

Existing panorama and project-video proof media verification remains intact.

## 11. Responsive / geometry verification

Verify:

- 320 × 844
- 390 × 844
- 768 × 1024
- 1280 × 800
- 1440 × 900

For Home and A/B/C Block scenes.

Requirements:

- stage remains 4:3
- no horizontal overflow
- image and SVG interaction layer remain aligned
- no crop introduced by CSS
- existing UI polish remains intact

Russian 320px header/navigation should receive a quick regression check.

## 12. Localization regression

Verify TR / EN / RU at minimum on:

- Home
- Block B

No route or history behavior change.

If exterior development-label translation keys become unused, clean them only if safe and keep dictionary parity.

## 13. Scope protection

Do not in IMP-024:

- alter hotspot coordinates
- create new polygon geometry
- integrate real floorplans
- integrate real panorama images
- integrate real project video
- add Availability / Brochure / Location / Contact
- redesign customer UI
- add dependencies
- add backend or analytics
- change routes
- deploy to a provider
- introduce source PNG sequences
- modify source/master Drive assets
- begin the next IMP

## 14. Required automated validation

Run:

- `npm run validate:data`
- `npm run build`
- `npm run lint`
- `npx tsc -b`
- `npm run test:localization`
- `node scripts/test-panorama-adapter.mjs`
- `node scripts/test-tour-help-storage.mjs`
- `npm run staging:verify`
- `git diff --check`

Add a tiny media-manifest validation script only if it materially improves deterministic checks and requires no dependency.

## 15. Manual production/staging validation

### Flow A
Home -> A -> Home.

### Flow B
Home -> B -> B-301 -> close Quick Card -> Home.

### Flow C
Home -> C -> Home.

For A/B/C verify:

- correct static media
- correct forward MP4 mapping
- correct reverse MP4 mapping
- transition lock
- transition completion
- no obvious alignment/layout flash
- Browser Back still coherent

Also verify:

- 390px
- 1280px
- one 320px Home check
- TR / EN / RU quick regression
- console has no new runtime warning/error

## 16. Completion report

Create:

`docs/IMP-024-COMPLETION-REPORT.md`

Return report in Turkish and include:

1. Özet.
2. Oluşturulan / değiştirilen dosyalar.
3. Real-media preflight tablosu (path, size, dimensions/duration, status).
4. Exterior media configuration yaklaşımı.
5. Masterplan gerçek medya sonucu.
6. Block A/B/C gerçek medya sonucu.
7. Forward transition mapping sonucu.
8. Reverse transition mapping sonucu.
9. Visual continuity / first-last-frame gözlemleri.
10. Exterior DEVELOPMENT-ONLY label cleanup sonucu.
11. Loading/preload/network regression sonucu.
12. Staging verifier/media sonucu.
13. 320 / 390 / 768 / 1280 / 1440 geometry-responsive sonucu.
14. TR / EN / RU regression sonucu.
15. Browser Back/Forward sonucu.
16. Çalıştırılan komutlar.
17. Tüm zorunlu kontrol sonuçları.
18. Dependency değişikliği varsa listesi.
19. Medya kaynaklı görünen hizalama/crop/encode sorunları.
20. Bilinen sınırlar.
21. Uyarılar / çözülmemiş konu / mimari çelişki.
22. Sonraki IMP'ye başlama.

## Acceptance criteria

IMP-024 passes only if:

- all required real exterior files exist and are browser-usable
- Home uses real masterplan media
- A/B/C Block scenes use correct real images
- each A/B/C forward transition uses the correct project MP4
- each A/B/C reverse transition uses the correct separately encoded MP4
- no proof exterior media remains in the customer production exterior flow
- SceneStage logical geometry remains unchanged
- hotspot coordinates remain unchanged
- no crop/distortion is introduced
- preload/lazy-load behavior does not regress
- staging verification covers the real exterior media
- customer-facing exterior proof labels are removed where no longer truthful
- TR/EN/RU remain correct
- responsive checks pass
- existing tests/build/lint/staging checks pass
- no new dependency is added
- locked baseline documents remain unchanged
- no later IMP is started
