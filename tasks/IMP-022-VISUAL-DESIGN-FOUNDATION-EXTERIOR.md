# IMP-022 — Visual Design Foundation & Exterior Polish

Status: **READY**

## Objective

Move the customer-facing application from a functional development prototype toward a polished premium real-estate presentation by establishing a reusable visual system and applying it to:

- AppShell / global navigation
- language selector
- Masterplan / Home
- Block scenes
- exterior transition presentation
- shared focus / button / surface primitives used by these areas

This task is intentionally limited to the **visual foundation + exterior experience**.

Do not polish Quick Card, Details, Tour, Project Video or DEV tools beyond any small shared-token effects that occur automatically. They will be handled separately.

Do not integrate real Nail Karataş media in this task.

## Required reading

Follow `AGENTS.md` and read all locked baseline documents.

Also read:

- `docs/IMP-018-COMPLETION-REPORT.md`
- `docs/IMP-019-COMPLETION-REPORT.md`
- `docs/IMP-020-COMPLETION-REPORT.md`
- `docs/IMP-021-COMPLETION-REPORT.md`
- `docs/STAGING-QA-CHECKLIST.md`

Relevant locked behavior:

- Home / exterior is static architectural render + SVG hotspots + HTML5 transition.
- Exterior logical scene remains 1920 × 1440, responsive contain, no crop.
- Hotspot geometry and interaction semantics must not change.
- Forward / reverse transition behavior must not change.
- TR / EN / RU localization must remain intact.
- Browser history behavior must remain intact.
- Responsive behavior from IMP-018 must remain intact.
- Media-loading behavior from IMP-019 must remain intact.
- Staging behavior from IMP-020 must remain intact.

## Visual direction

Aim for a restrained, premium architectural-sales presentation:

- image-first composition
- calm neutral surfaces
- high contrast, editorial typography hierarchy
- minimal chrome
- subtle depth rather than heavy gradients/effects
- refined thin borders
- elegant, restrained motion
- controls that feel intentional rather than browser-default
- avoid game-like hotspot styling
- avoid glassmorphism excess
- avoid dashboard/SaaS aesthetics
- avoid large decorative gradients
- avoid generic bootstrap-card appearance

The result should feel suitable for presenting a contemporary residential/commercial project to a property buyer.

No new logo or brand identity should be invented.

## 1. Design tokens

Create or consolidate a small reusable CSS token layer using CSS custom properties.

Include sensible tokens for:

- page background
- primary text
- secondary/muted text
- surface
- elevated surface
- border
- accent
- accent-hover / active
- inverse text
- focus ring
- spacing scale
- radius scale
- subtle shadow
- stronger overlay shadow
- transition durations/easing
- content max width where useful

Do not create a design-system framework.

Keep tokens easy to retune when final brand assets/colors are integrated later.

## 2. Typography foundation

Use a dependency-free font strategy.

Requirements:

- no Google Fonts or third-party font requests
- no font files committed
- use a strong system/native font stack
- establish clear hierarchy for:
  - project title
  - section title
  - body
  - metadata
  - controls
- Turkish, English and Cyrillic Russian must all render safely
- long Russian labels must wrap without clipping
- use `clamp()` only where it remains predictable

Do not redesign copy.

## 3. AppShell polish

Polish the production AppShell.

Requirements:

- premium but restrained header
- project/product identity area
- global Home / Video navigation
- language selector integrated cleanly
- active route state visually clear
- active locale visually clear
- 44px practical touch targets preserved
- visible focus preserved
- header must not dominate the architectural scene
- no horizontal overflow at narrow widths
- no behavior / route changes

The AppShell should visually belong to the experience rather than looking like a developer toolbar.

## 4. Language selector polish

Keep existing TR / EN / RU semantics and persistence.

Improve only presentation:

- compact segmented/tab-like treatment is acceptable
- active language clearly visible
- keyboard/focus states clear
- no flags
- no history/URL behavior changes
- 320px Russian-safe

## 5. Masterplan / Home composition

Polish the current Home / Masterplan page without changing the 1920×1440 scene model.

Requirements:

- architectural scene remains visually dominant
- heading / explanatory copy becomes presentation-ready
- A/B/C block controls become a coherent premium selector
- synchronized control ↔ hotspot active/hover/focus behavior remains obvious
- control layout works at 390px and 1280px
- stage may use subtle border/radius/shadow treatment if it does not alter geometry
- no crop
- no coordinate shift
- no new overlay that intercepts hotspot input incorrectly

Do not replace proof media.

## 6. Exterior hotspot visual language

Polish SVG polygon presentation.

Requirements:

- inactive polygons should be unobtrusive
- hover/focus/active state must be clear
- selected/target block should read immediately without aggressive neon styling
- focus remains accessible
- hit geometry unchanged
- pointer behavior unchanged
- disabled state remains meaningful
- no filters/effects that visibly degrade frame rate on normal desktop/mobile

Use CSS presentation only; do not rewrite polygon coordinates.

## 7. Block scene composition

Polish the Block page exterior experience.

Requirements:

- scene remains the focal point
- Block title/category/status hierarchy becomes presentation-ready
- contextual Home control integrates with the visual system
- Unit hotspot behavior remains untouched
- reverse transition trigger semantics remain untouched
- Quick Card / Details overlays must still layer correctly even though their own final styling is out of scope
- no layout jump before/during reverse transition

## 8. Transition presentation

Keep current media/preload/playback architecture intact.

Visually polish transition presentation only where safe:

- transition video should cover exactly the same scene frame
- avoid white flash / layout flash around playback
- loading/locked state should not look broken
- reduced-motion behavior unchanged
- no new preload strategy
- no autoplay behavior changes

## 9. Shared controls

Where AppShell/Masterplan/Block currently duplicate basic button/link styling, consolidate only if this can be done simply and without architectural churn.

Allowed:

- small shared CSS utility classes / variables
- shared primitive class names
- existing semantic `<button>` / `<a>` / React Router link elements

Do not build a component library.

## 10. Responsive requirements

Manually verify:

- 320 × 844
- 390 × 844
- 768 × 1024
- 1280 × 800
- 1440 × 900

Also verify Russian at 320px.

Requirements:

- no horizontal overflow
- header/navigation/language selector remain usable
- Masterplan selector remains usable
- scene remains 4:3 and aligned with SVG
- block page remains usable
- essential controls stay reachable
- no text clipping

## 11. Accessibility

Preserve/improve:

- visible keyboard focus
- semantic links/buttons
- `aria-pressed` locale behavior
- hotspot focus visibility
- reasonable text contrast
- reduced-motion behavior
- translated accessible labels from IMP-021

Do not add ARIA redundantly where native semantics already suffice.

## 12. Localization regression

Verify all visual changes with:

- TR
- EN
- RU

At minimum:

- Home
- Block B
- global navigation
- language selector

Changing locale must:

- remain on current URL
- not add history entries
- preserve current scene/context

## 13. No scope creep

Do not in IMP-022:

- style Quick Card to final design
- style Details to final design
- style Virtual Tour/minimap/help to final design
- style Project Video to final design
- style DEV-only tools beyond inherited global tokens
- integrate real project renders/media
- change hotspot coordinates
- change data
- change routes
- add new features
- add a CSS framework
- add icon libraries
- add web fonts
- add dependencies
- deploy to a host
- begin the next IMP

## 14. Required validation

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

Manual production/staging browser checks:

### Flow 1
Home -> hover/focus A/B/C -> B -> Home.

### Flow 2
Home -> B -> B-301 -> close Quick Card -> Home.

### Flow 3
Switch TR -> EN -> RU on Home and Block without route change.

Also verify:

- forward transition
- reverse transition
- 320 / 390 / 1280
- 320 Russian
- no new console error/warning
- no scene/SVG alignment regression
- no horizontal overflow

## 15. Completion report

Create:

`docs/IMP-022-COMPLETION-REPORT.md`

Return the report in Turkish and include:

1. Özet.
2. Oluşturulan / değiştirilen dosyalar.
3. Görsel tasarım token yaklaşımı.
4. Typography yaklaşımı.
5. AppShell sonucu.
6. Dil seçici sonucu.
7. Masterplan sonucu.
8. Exterior hotspot sonucu.
9. Block sayfası sonucu.
10. Transition presentation sonucu.
11. 320 / 390 / 768 / 1280 / 1440 responsive sonucu.
12. TR / EN / RU görsel regression sonucu.
13. Accessibility/focus sonucu.
14. Scene/SVG alignment sonucu.
15. Staging regression sonucu.
16. Çalıştırılan komutlar.
17. Tüm zorunlu kontrol sonuçları.
18. Eklenen bağımlılık varsa listesi.
19. Bilinen görsel sınırlar / proof-media etkileri.
20. Uyarılar / çözülmemiş konu / mimari çelişki.
21. Sonraki IMP'ye başlama.

## Acceptance criteria

IMP-022 passes only if:

- AppShell / language selector / Masterplan / Block exterior experience is visibly presentation-ready compared with the development styling
- a coherent reusable token layer exists
- scene remains dominant
- 1920×1440 logical geometry and hotspot alignment remain unchanged
- forward/reverse transition behavior remains unchanged
- TR/EN/RU behavior remains intact
- 320/390/768/1280/1440 checks pass
- Russian 320px check passes
- no horizontal overflow is introduced
- accessibility/focus remains intact
- media preload/lazy behavior does not regress
- staging verification passes
- no new dependency is added
- baseline documents remain unchanged
- no later IMP is started
