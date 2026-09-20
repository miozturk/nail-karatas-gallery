# IMP-023 — Customer UI Polish: Unit / Tour / Video

Status: **READY**

## Objective

Continue the visual-design system established in IMP-022 and bring the remaining customer-facing demo surfaces to a coherent presentation-ready level:

- Unit Quick Card
- Unit Details drawer
- Virtual Tour page
- Tour room menu / minimap / help dialog
- Project Video page
- localized NotFound page

This task is visual/UI polish only.

Do not integrate real Nail Karataş media, change routes, change domain data, change panorama architecture, or add new features.

## Required reading

Follow `AGENTS.md` and read all locked baseline documents.

Also read:

- `docs/IMP-018-COMPLETION-REPORT.md`
- `docs/IMP-019-COMPLETION-REPORT.md`
- `docs/IMP-020-COMPLETION-REPORT.md`
- `docs/IMP-021-COMPLETION-REPORT.md`
- `docs/IMP-022-COMPLETION-REPORT.md`
- `docs/STAGING-QA-CHECKLIST.md`

## Visual continuity

Reuse IMP-022 tokens and visual direction.

The finished customer flow should feel like one product, not separate prototypes.

Use:
- warm neutral surfaces
- restrained bronze/accent treatment
- strong editorial hierarchy
- subtle borders and shadows
- calm spacing
- minimal chrome
- clear hover/focus/active states
- image-first composition where media exists

Avoid:
- SaaS/dashboard aesthetics
- generic browser-default form/button appearance
- excessive glassmorphism
- loud gradients
- neon hotspot styling
- over-decoration

Do not invent a logo or brand identity.

## 1. Quick Card polish

Polish the existing Unit Quick Card without changing its behavior.

Requirements:
- refined panel/surface treatment
- stronger hierarchy for Unit identity / type / metadata
- plan placeholder should read as intentional demo content, not broken content
- factual fields remain readable
- primary action `Sanal Tur` visually distinct
- secondary `Detayları Gör`
- close / return affordance clear
- selected Unit active state remains visible on scene
- no route or data changes
- 320px Russian-safe
- practical 44px touch targets preserved

Do not add new Unit fields.

## 2. Details drawer polish

Polish the existing Details drawer.

Requirements:
- same design language as Quick Card
- clear heading / metadata hierarchy
- plan and gallery placeholders should look intentional
- action group visually coherent
- vertical scrolling remains safe on small screens
- drawer must not block essential scene context unnecessarily
- `Quick Card'a Dön`, `Sanal Tur`, `Bloğa Dön` remain clear and reachable
- no conversion to a standalone full page
- reverse Home interaction lock behavior unchanged

Do not add gallery functionality.

## 3. Virtual Tour page shell

Polish Tour layout around the panorama.

Requirements:
- panorama remains dominant
- route/header context remains readable
- `Daireye Dön` should be easy to find without visually overpowering the panorama
- room controls should feel like part of the product
- loading/error/unavailable states styled consistently
- no change to panorama adapter or lazy-load behavior
- no change to scene graph
- no change to direct route semantics

## 4. Room menu / viewpoint controls

Polish application-owned room controls.

Requirements:
- active room clearly identifiable
- inactive room calm and readable
- keyboard focus visible
- 44px practical target retained
- long EN/RU labels wrap safely
- no horizontal overflow
- preserve existing scene switching behavior

Do not attempt to redesign Pannellum-native controls.

## 5. Minimap polish

Polish current development minimap into a presentation-ready demo component while preserving its current data/behavior.

Requirements:
- visually lighter and cleaner
- active viewpoint obvious
- inactive viewpoint readable
- collapse/expand affordance clear
- compact but usable on 320/390px
- no excessive panorama obstruction
- responsive behavior from IMP-018 preserved
- no new floorplan functionality
- no changes to scene IDs or navigation semantics

The current placeholder/minimap proof remains development media/content; presentation should make that status intentional.

## 6. Tour first-use help polish

Polish the existing first-use help dialog.

Requirements:
- clear title/body/action hierarchy
- modal remains compact and readable
- `Turu Keşfet` remains obvious
- Escape / focus-return behavior unchanged
- dismissal persistence unchanged
- changing TR/EN/RU must not resurrect dismissed help
- 320px Russian-safe
- modal must remain vertically scrollable if necessary

No new onboarding steps.

## 7. Project Video page polish

Polish `/video`.

Requirements:
- video remains dominant
- 16:9 preserved
- native controls retained
- heading, DEVELOPMENT-ONLY notice and Home return visually coherent
- loading/ready/error states fit visual system
- no autoplay
- no custom player
- no preload/lifecycle behavior changes
- 320px and 1280px safe

## 8. NotFound polish

Polish localized NotFound page.

Requirements:
- coherent with product visual system
- clear message
- obvious Home action
- TR/EN/RU safe
- no route behavior changes

## 9. Shared UI consistency

Where these surfaces repeat patterns, reuse existing tokens/classes where practical:
- panel surfaces
- buttons
- secondary actions
- status copy
- metadata labels
- focus rings
- spacing/radii/shadows

Do not create a full component library.

## 10. Responsive verification

Verify at minimum:
- 320 × 844
- 390 × 844
- 768 × 1024
- 1280 × 800
- 1440 × 900
- 844 × 390 landscape for Tour

For all critical customer surfaces.

Also verify Russian at 320px for:
- Quick Card
- Details
- Tour
- minimap
- help dialog
- Video
- NotFound

Requirements:
- no horizontal overflow
- no clipped actions
- all essential controls reachable
- vertical scrolling remains sensible
- panorama and video maintain intended dimensions

## 11. Localization regression

Verify TR / EN / RU on:
- Quick Card
- Details
- Tour
- help
- Video
- NotFound

Locale switch:
- does not change URL
- does not add history entry
- preserves Tour active scene
- does not reset help dismissal

Do not add or alter translation scope unless a clearly missing customer-facing string is discovered. If a key must be added, preserve dictionary parity and update localization tests.

## 12. Accessibility

Preserve/improve:
- semantic buttons/links
- visible keyboard focus
- modal semantics
- readable contrast
- localized accessible labels
- practical touch targets
- reduced-motion behavior
- native media semantics

No redundant ARIA.

## 13. Performance / lifecycle regression

Do not disturb IMP-019 behavior.

Verify:
- Home initial load still does not fetch panorama/project-video media
- Tour lazy loads
- Project Video remains route-loaded
- Tour viewer cleanup remains correct
- Video cleanup remains correct
- no duplicate panorama canvas
- no new eager dependency/media loading

## 14. Staging regression

`npm run staging:verify` must continue to pass.

DEV routes remain production NotFound.

No provider-specific deployment work.

## 15. Required validation

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

Manual production/staging flows:

### Flow A
Home -> B -> B-301 -> Quick Card -> Details -> Quick Card -> Block -> Home.

### Flow B
Home -> B -> B-301 -> Tour -> dismiss help if shown -> room menu -> hotspot -> minimap collapse/expand -> Daireye Dön.

### Flow C
Home -> Video -> play/pause -> Home -> Browser Back / Forward.

### Flow D
Invalid route -> localized NotFound -> Home.

Verify flows at 390 and 1280. Verify Tour additionally at 320 and 844×390 landscape.

## Explicitly forbidden in IMP-023

Do not:
- add real project media
- change routes
- change seed/domain data
- change hotspot coordinates
- change panorama adapter semantics
- add Availability / Brochure / Location / Contact
- add analytics
- add backend
- add CSS/UI framework
- add icon library
- add web fonts
- add dependencies
- deploy to a provider
- alter locked baseline documents
- begin the next IMP

## Completion report

Create:
`docs/IMP-023-COMPLETION-REPORT.md`

Return report in Turkish and include:
1. Özet.
2. Oluşturulan / değiştirilen dosyalar.
3. Quick Card görsel sonucu.
4. Details drawer görsel sonucu.
5. Tour shell sonucu.
6. Room controls sonucu.
7. Minimap sonucu.
8. First-use help sonucu.
9. Project Video sonucu.
10. NotFound sonucu.
11. Shared token/style reuse sonucu.
12. 320 / 390 / 768 / 1280 / 1440 / landscape sonucu.
13. TR / EN / RU regression sonucu.
14. Accessibility/focus sonucu.
15. Performance/lifecycle regression sonucu.
16. Staging regression sonucu.
17. Çalıştırılan komutlar.
18. Tüm zorunlu kontrol sonuçları.
19. Eklenen dependency varsa listesi.
20. Bilinen görsel sınırlar / proof-media etkileri.
21. Uyarılar / çözülmemiş konu / mimari çelişki.
22. Sonraki IMP'ye başlama.

## Acceptance criteria

IMP-023 passes only if:
- Quick Card, Details, Tour, minimap/help, Video and NotFound visually belong to the design system established in IMP-022
- customer demo no longer contains obvious default/developer UI styling in these production surfaces
- existing behavior is unchanged
- TR/EN/RU remain correct
- 320/390/768/1280/1440 and Tour landscape checks pass
- no horizontal overflow is introduced
- performance/lazy-loading/lifecycle behavior does not regress
- staging verification passes
- no new dependency is added
- locked baseline documents remain unchanged
- no later IMP is started
