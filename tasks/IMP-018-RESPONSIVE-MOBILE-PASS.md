# IMP-018 — Responsive / Mobile Pass

Status: **READY**

## Objective

Perform a focused application-wide responsive and mobile usability pass across the current demo.

The goal is not final visual design.

The goal is to make the existing functional experience reliably usable across narrow mobile, tablet-like, and desktop viewport sizes without breaking the locked interaction architecture.

This task must improve:
- layout containment
- touch-target usability
- text readability
- stage / panel coexistence
- mobile navigation reachability
- panorama controls
- project-video layout
- development-tool overflow safety

Do not begin final branding / visual polish.

## Required reading

Follow `AGENTS.md` and read all baseline documents before starting.

Also review the current implementation of:
- `AppShell`
- Masterplan
- Block scene
- Unit Quick Card
- Unit Details drawer
- Virtual Tour
- Tour first-use help
- Project Video
- Hotspot Editor
- Panorama Spike

Relevant locked decisions:
- Exterior SceneStage remains 1920 x 1440 logical / 4:3 and scales without crop.
- Panorama is independently responsive and is not constrained to 4:3.
- Quick Card and Details are contextual overlays/panels over the Block scene.
- Minimap remains collapsible.
- `Daireye Dön` remains visible in Tour UI.
- Final visual design comes later.
- No UI framework is part of the baseline.

## Target viewport set

At minimum verify:
- 320 x 568 portrait
- 390 x 844 portrait
- 768 x 1024 portrait / tablet-like
- 1280 x 800 desktop
- 1440 x 900 desktop

Also perform one landscape mobile check where practical, for example:
- 844 x 390

## Required work

### 1. App shell / global layout

Review the application shell for responsive behavior.

Requirements:
- no horizontal page overflow
- header / global navigation remain readable and reachable
- contextual Home suppression from Block / Unit / Details / Tour continues to behave correctly
- text does not collide or wrap into unusable layouts
- page content has sensible narrow-screen padding
- keyboard focus remains visible

Do not redesign the brand/header.

### 2. Masterplan

Verify and improve narrow-screen behavior without changing the interaction model.

Requirements:
- 4:3 SceneStage scales within viewport width
- A/B/C hotspot alignment remains correct
- A/B/C matching controls remain reachable
- controls do not create horizontal overflow
- hover/focus/activation behavior remains synchronized
- forward transition remains aligned and does not cause layout jump

Do not add real project geometry or media.

### 3. Block scene / Unit hotspots

Requirements:
- SceneStage remains 4:3 with no crop
- Unit hotspots stay aligned at all target widths
- contextual Home control remains reachable
- development status text does not force overflow
- Unit activation remains usable on narrow screens
- reverse transition remains aligned
- interaction locking still works

Do not alter the Unit data model or hotspot geometry.

### 4. Unit Quick Card

Improve mobile containment / readability.

Requirements:
- card content fits within viewport
- no horizontal overflow
- plan placeholder remains visible
- factual data remains readable
- `Sanal Tur`, `Detayları Gör`, and close/return controls remain reachable
- controls meet a practical touch target size (approximately 44 CSS px minimum where feasible)
- selected Unit active-state behavior remains unchanged

Do not perform final card visual design.

### 5. Unit Details drawer

Improve narrow-screen usability.

Requirements:
- drawer/panel does not exceed viewport width
- content can scroll vertically if required
- development plan / gallery placeholders remain contained
- `Quick Card'a Dön`, `Sanal Tur`, and `Bloğa Dön` remain reachable
- no fixed-width content causes overflow
- Home reverse-transition interaction lock remains intact

Do not convert this into a full production Unit Details page.

### 6. Virtual Tour

Review mobile interaction carefully.

Requirements:
- panorama remains usable at narrow portrait and mobile landscape sizes
- `Daireye Dön` remains visible/reachable
- room menu remains usable without horizontal overflow
- minimap remains usable and collapsible
- minimap does not cover an unreasonable amount of the panorama on 320/390 widths
- first-use help fits on screen and its dismiss action remains reachable
- native pointer / touch-oriented panorama interaction is not blocked after help dismissal
- loading/error/unavailable states fit narrow screens

Do not alter adapter architecture or add final styling.

### 7. Project Video

Requirements:
- 16:9 player remains contained
- native controls remain usable
- page heading / development notice / Home return remain readable
- no horizontal overflow
- lifecycle behavior remains unchanged

### 8. Development tools

Development-only tools must not regress.

At minimum:

#### Hotspot Editor
- controls remain usable on 390px width
- SceneStage remains correctly scaled
- coordinate mapping remains correct
- JSON output area does not cause horizontal overflow

#### Panorama Spike
- room controls and minimap proof remain usable on narrow viewports
- no duplicate viewer / canvas behavior is introduced

Do not polish dev tools beyond basic containment.

### 9. Touch / pointer target pass

Review user-facing buttons / links in current demo flows.

Where practical:
- primary interactive controls should expose approximately 44 x 44 CSS px minimum tap area
- adjacent controls should not be so tightly packed that accidental activation is likely
- visible focus styling must remain
- do not remove native semantics

This applies especially to:
- A/B/C block controls
- Home contextual controls
- Quick Card actions
- Details actions
- Tour room menu
- minimap toggle / viewpoint controls
- Tour help dismiss
- Project Video Home return

### 10. Typography / wrapping safety

Without doing final typography design:
- prevent very long labels from escaping containers
- allow appropriate wrapping
- avoid viewport-width-fixed font sizes that become absurdly large on narrow screens
- keep development labels readable

Do not choose final fonts or create a branding type scale.

### 11. Safe positioning / layering

Check overlays / panels:
- transition overlay
- Quick Card
- Details drawer
- Tour minimap
- Tour help dialog

Requirements:
- overlays remain above the intended layer
- no mobile layout causes controls to become trapped behind another layer
- no z-index regression
- no interaction leak through modal/help layers

### 12. CSS organization

Prefer local feature CSS changes.

If a small shared responsive rule is genuinely cross-cutting, place it in an existing appropriate global style location rather than duplicating it.

Do not introduce:
- Tailwind
- Bootstrap
- MUI
- CSS framework dependencies

### 13. Do not change product behavior

This task is a responsive/usability pass only.

Do not:
- add new product routes
- change Unit / Tour data
- add real project media
- change transition semantics
- change browser-history semantics
- implement final branding
- implement Availability
- implement new content features

### 14. Regression safety

All existing behavior must remain intact:
- Masterplan synchronized A/B/C interaction
- forward transition
- Block reverse transition
- Unit hotspots
- Quick Card
- Details drawer
- Virtual Tour
- Tour first-use help
- Project Video
- Hotspot Editor
- Panorama Spike
- route validation
- Browser Back / Forward behavior

### 15. Validation

Required checks:
- `npm run validate:data`
- `npm run build`
- `npm run lint`
- `git diff --check`

Also run:
- `node scripts/test-panorama-adapter.mjs`
- `node scripts/test-tour-help-storage.mjs`

Manual browser verification must cover all target viewport classes listed above.

At minimum verify these user flows at 320 / 390 / 1280 widths:

### Flow A
Home -> Block B -> B-301 -> Quick Card -> Details -> Quick Card -> Block -> Home.

### Flow B
Home -> Block B -> B-301 -> Virtual Tour -> dismiss/help state as appropriate -> room menu -> hotspot -> minimap -> Daireye Dön.

### Flow C
Home -> Video -> play/pause -> Home / Browser Back.

Also verify:
- no horizontal overflow on any primary route
- no clipped essential controls
- touch-target sizing is reasonable
- SceneStage hotspot alignment is unchanged
- panorama remains interactive
- first-use help is dismissible at 320px
- browser console has no new runtime errors
- production preview still works
- DEV-only routes remain unavailable in production

## Explicitly forbidden in IMP-018

Do not:
- perform final visual design
- add real Nail Karataş media
- change hotspot geometry
- implement Availability UI
- implement Brochure / Location / Contact
- add analytics
- add backend persistence
- add Redux / Zustand / MobX
- add CSS/UI framework dependencies
- alter locked baseline documents
- begin IMP-019

## Acceptance criteria

IMP-018 passes only if:
- primary demo flows are usable at 320 / 390 / 768 / 1280 / 1440-class widths
- one mobile-landscape check passes
- no primary route has horizontal overflow
- exterior SceneStage / hotspot alignment remains correct
- Quick Card and Details remain usable on narrow screens
- Virtual Tour controls / minimap / help remain usable on narrow screens
- Project Video remains responsive
- practical touch target sizing is improved
- no product behavior or route semantics are changed
- no final branding / visual polish is introduced
- no new dependency is added
- `npm run validate:data` passes
- `npm run build` passes
- `npm run lint` passes
- adapter test passes
- tour-help storage test passes
- `git diff --check` passes
- baseline documents remain unchanged

## Completion report

Return the report in Turkish:

1. Özet.
2. Oluşturulan / değiştirilen dosyalar.
3. AppShell responsive değişiklikleri.
4. Masterplan / Block SceneStage responsive sonucu.
5. Quick Card responsive sonucu.
6. Details drawer responsive sonucu.
7. Virtual Tour / minimap / help responsive sonucu.
8. Project Video responsive sonucu.
9. Development-tools responsive sonucu.
10. Touch-target / focus iyileştirmeleri.
11. 320 / 390 / 768 / 1280 / 1440 viewport doğrulamaları.
12. Mobile-landscape doğrulaması.
13. Flow A / B / C regression sonuçları.
14. Production-preview sonucu.
15. Çalıştırılan komutlar.
16. `validate:data`, build, lint, adapter test, storage test ve `git diff --check` sonuçları.
17. Eklenen bağımlılık varsa listesi.
18. Uyarılar / çözülmemiş konu / mimari çelişki.
19. IMP-019'a başlama.
