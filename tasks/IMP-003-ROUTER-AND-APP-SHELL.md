# IMP-003 — Router and App Shell

Status: **READY**

## Objective

Implement the baseline application routing structure, AppShell, and minimal placeholder route views.

This task establishes navigation semantics only. It must not implement the visual scene engine, SVG hotspots, transition videos, unit cards, panorama functionality, or production styling.

## Required reading

Follow `AGENTS.md` and read all baseline documents before starting.

Relevant locked route intent:

- `/`
- `/block/:blockId`
- `/block/:blockId/unit/:unitId`
- `/block/:blockId/unit/:unitId/details`
- `/block/:blockId/unit/:unitId/tour`
- `/video`

`/availability` remains future scope and must not be implemented in IMP-003.

## Required work

### 1. Router

Create the application router under `src/app/`.

Use React Router already installed by IMP-001.

Required routes:

- `/` → Home placeholder
- `/block/:blockId` → Block placeholder
- `/block/:blockId/unit/:unitId` → Unit Quick Card route placeholder
- `/block/:blockId/unit/:unitId/details` → Unit Details placeholder
- `/block/:blockId/unit/:unitId/tour` → Virtual Tour placeholder
- `/video` → Project Video placeholder
- catch-all not-found route

Do not add future routes such as Availability, Brochure, Location, Contact, Amenities, or Favorites.

### 2. AppShell

Create a reusable `AppShell` under `src/app/`.

The shell must:

- provide the persistent application frame,
- render a minimal global navigation area,
- render the active route through React Router's outlet mechanism,
- remain visually simple and neutral.

The global navigation shell should expose only currently authorized destinations:

- Home
- Video

Do not implement the final hamburger menu, animation, responsive drawer, or visual design yet.

### 3. Placeholder route views

Create minimal route components in the appropriate feature folders.

Suggested locations:

- `src/features/masterplan/MasterplanPage.tsx`
- `src/features/blocks/BlockPage.tsx`
- `src/features/units/UnitPage.tsx`
- `src/features/units/UnitDetailsPage.tsx`
- `src/features/tours/TourPage.tsx`
- `src/features/video/VideoPage.tsx`
- a minimal not-found page in an appropriate location

Placeholders may display:

- route name,
- current `blockId`,
- current `unitId`,
- simple navigation links useful for verifying routing.

Do not render real project scenes, real media, floor plans, panorama content, or production cards.

### 4. Data-aware route validation

Use the existing IMP-002 seed data to prevent obviously invalid entity routes.

At minimum:

- `/block/:blockId` must recognize only `a`, `b`, `c`.
- Unit routes must verify that:
  - the Unit exists,
  - the Unit belongs to the route's Block.

If the route references an unknown block or unit, render the not-found experience rather than silently accepting invalid data.

Keep this validation simple and local. Do not introduce a global state library.

### 5. Navigation semantics

Navigation must use React Router navigation primitives (`Link`, `NavLink`, `useNavigate`, etc.), not raw full-page reload anchors for internal routes.

Browser Back / Forward must remain coherent.

The application must remain directly loadable on each route while running under Vite dev mode.

### 6. Styling

Keep styling minimal.

You may add small AppShell / placeholder styles under the existing CSS structure.

Do not introduce:
- Tailwind,
- Bootstrap,
- Material UI,
- animation libraries,
- design system packages.

### 7. Validation

Add no new dependency unless absolutely necessary. No new dependency is expected.

Required checks:

- `npm run validate:data`
- `npm run build`
- `npm run lint`

Also manually verify, using the development server, that these routes render without runtime errors:

- `/`
- `/block/a`
- `/block/b/unit/B-301`
- `/block/b/unit/B-301/details`
- `/block/b/unit/B-301/tour`
- `/video`

And verify these invalid routes resolve to the not-found experience:

- `/block/x`
- `/block/a/unit/B-301`
- `/block/b/unit/DOES-NOT-EXIST`

## Explicitly forbidden in IMP-003

Do not:

- implement `SceneStage`,
- implement SVG hotspots,
- implement transition videos,
- add project media,
- implement Unit Quick Card UI beyond a placeholder route view,
- implement Unit Detail drawer behavior,
- add the hotspot editor,
- add Pannellum or another panorama engine,
- implement Availability UI,
- add future global-menu destinations,
- add Redux / Zustand / MobX,
- add a backend,
- change locked baseline documents,
- begin IMP-004.

## Acceptance criteria

IMP-003 passes only if:

- Router structure matches the required routes.
- `AppShell` uses an outlet-based nested routing structure or equivalent clean React Router composition.
- Home and Video global navigation works without full-page reloads.
- Valid block and unit routes render.
- Invalid block/unit combinations render not-found.
- Browser Back / Forward works coherently.
- No unauthorized feature has been implemented.
- No forbidden dependency has been added.
- `npm run validate:data` passes.
- `npm run build` passes.
- `npm run lint` passes.
- Baseline documents remain unchanged.

## Completion report

Return the report in Turkish:

1. Özet.
2. Oluşturulan / değiştirilen dosyalar.
3. Route tablosu.
4. AppShell ve navigation yapısı.
5. Geçerli / geçersiz route doğrulama sonuçları.
6. Çalıştırılan komutlar.
7. `validate:data`, build ve lint sonuçları.
8. Eklenen bağımlılık varsa listesi.
9. Uyarılar / çözülmemiş konu / mimari çelişki.
10. IMP-004'e başlama.
