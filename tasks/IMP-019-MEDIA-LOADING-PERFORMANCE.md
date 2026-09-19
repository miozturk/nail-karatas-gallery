# IMP-019 — Media Loading / Performance

Status: **READY**

## Objective

Perform a focused loading and performance pass on the current demo before staging work.

The goal is to make the application load media deliberately rather than eagerly, while preserving all current behavior.

This task must improve and prove:

- route-level code splitting where appropriate,
- selective preload behavior,
- lazy loading of heavy panorama/runtime media,
- clean project-video loading,
- transition-video readiness without wasteful eager loading,
- predictable cleanup of media resources,
- production-build chunk / asset visibility,
- regression safety.

This is not final visual design and not staging deployment.

## Required reading

Follow `AGENTS.md` and read all locked baseline documents.

Also review the current implementation of:

- router / route composition,
- TransitionLayer,
- Masterplan development media,
- Block reverse media,
- panorama adapter and Virtual Tour,
- Tour first-use help,
- Project Video,
- DEV-only Hotspot Editor / Panorama Spike,
- existing Vite build output.

Relevant locked decisions:

- exterior transition media should be selectively preloaded, not globally loaded indiscriminately,
- panoramas should be lazy-loaded,
- source PNG sequences / master media remain outside the web repo,
- optimized web media lives under `public/media`,
- static deployment must remain possible,
- production behavior must not depend on a backend.

## Required work

### 1. Establish a production-build baseline

Before optimization, capture the current production build output in a development report.

Record at least:

- JS chunks and approximate sizes,
- CSS output size,
- major local media files relevant to the demo,
- whether the Tour / panorama code is part of initial app JS or route-loaded later,
- whether DEV-only features appear in production chunks.

Do not create an artificial numeric performance score.

The purpose is to compare "before" and "after" architecture, not to game a benchmark.

### 2. Route-level loading review

Review current route imports.

Where appropriate, lazy-load feature routes that are not required for initial Home rendering, especially heavier feature areas such as:

- Virtual Tour,
- Project Video,
- Unit Details if beneficial,
- DEV-only tools in development.

Requirements:

- preserve route validation behavior,
- preserve direct-route loading,
- provide a small neutral loading fallback if React lazy loading creates a visible wait,
- do not split tiny code blindly if it makes architecture noisier without meaningful benefit.

Document which routes remain eagerly loaded and why.

### 3. Panorama dependency isolation / lazy loading

The initial Home route should not eagerly execute or instantiate panorama runtime behavior.

Verify and improve so that:

- `pannellum` runtime code is only needed when a panorama-capable route / component is loaded,
- Virtual Tour initializes the adapter only when the Tour is actually available,
- unavailable Tour state must not create a panorama viewer,
- leaving Tour releases the viewer and listeners as already required,
- production app Home / Block / Video routes do not instantiate panorama code.

If Pannellum CSS must be bundled with the panorama chunk, keep that dependency boundary clean.

Do not replace Pannellum or alter adapter semantics.

### 4. Panorama image loading behavior

For the three DEVELOPMENT-ONLY panoramas:

- do not fetch all panorama images globally at app startup,
- loading should begin only when entering an available Tour,
- loading next-scene assets opportunistically after the current Tour is mounted is acceptable,
- do not implement aggressive speculative downloading.

Document observed request behavior in the browser/network tooling if practical.

Do not add a service worker in IMP-019.

### 5. Transition media preload policy

Review forward and reverse transition media loading.

Implement a small, explicit preload strategy rather than relying on accidental browser behavior.

Requirements:

- Home may preload only the transition media needed for likely A/B/C navigation when appropriate,
- Block may preload only the reverse transition needed for Home return,
- transition media must not begin audible playback,
- preload must not block initial UI,
- duplicate preload requests should be avoided,
- reduced-motion users should not be forced to download unnecessary transition media if a clean skip is possible.

A tiny reusable preload helper is acceptable if it remains media-generic.

Do not create a global media manager unless truly necessary.

### 6. Project Video loading

The Project Video page must keep conservative loading behavior.

Verify:

- no project-video MP4 request from Home solely because the route exists,
- `/video` uses `preload="metadata"` or equivalent conservative behavior,
- navigation away still stops / releases the player,
- returning creates a clean instance.

Do not preload the Project Video globally.

### 7. Media path / configuration hygiene

Review temporary development media paths.

Requirements:

- media paths remain centralized in feature / development-media configuration modules,
- no duplicated hard-coded URLs proliferate across components,
- no source PNG sequences are introduced,
- no base64-embedded large media is added to JS/CSS.

Do not replace the current development media with production content.

### 8. Browser cache-friendly static assets

Without adding a server/backend:

- keep media referenced as stable static URLs,
- do not generate random/query-string cache busters at runtime,
- do not append timestamps to media URLs,
- document that long-term immutable cache headers are a staging/deployment concern for IMP-020.

Do not implement deployment headers yet.

### 9. Loading states / UX regression

Route or media lazy loading must not create blank screens.

Where a route chunk or panorama is loading:

- show the existing neutral loading state or add a small neutral fallback,
- essential navigation should remain understandable,
- do not add final branded skeletons/spinners.

### 10. DEV-only feature production isolation

Verify production build does not expose usable:

- Hotspot Editor route,
- Panorama Spike route.

If DEV-only code is still included in production JS despite route isolation and can be reasonably excluded, improve the boundary.

Do not remove development tooling from development mode.

### 11. Resource cleanup review

Confirm there are no obvious leaked resources when repeatedly navigating:

- Home <-> Block transitions,
- Unit <-> Tour,
- Video <-> Home.

At minimum verify:

- no duplicate panorama canvases,
- no continued video playback after route leave,
- no duplicate media listeners after repeated navigation,
- no accumulating object URLs (if none are used, document that).

Do not introduce object URLs unless necessary.

### 12. Production build comparison

After changes, record the production build output again.

Create:

`docs/IMP-019-COMPLETION-REPORT.md`

Include:

- before / after route-chunk behavior,
- relevant bundle/chunk observations,
- relevant media-request observations,
- what is now lazy/eager/preloaded,
- why each preload exists,
- known limits because current media is development-only.

Do not claim real-world production performance that has not been measured with real media.

### 13. Regression safety

All existing behavior must remain intact:

- Masterplan A/B/C interaction,
- forward transitions,
- Block reverse transition,
- Unit hotspots,
- Quick Card,
- Details drawer,
- Virtual Tour,
- first-use help,
- Project Video,
- Hotspot Editor in DEV,
- Panorama Spike in DEV,
- route validation,
- Browser Back / Forward.

### 14. Validation

Required checks:

- `npm run validate:data`
- `npm run build`
- `npm run lint`
- `git diff --check`
- `node scripts/test-panorama-adapter.mjs`
- `node scripts/test-tour-help-storage.mjs`

Manual browser verification must include production preview and development mode.

At minimum verify:

#### Initial Home load
- app renders without Tour viewer creation,
- no project-video MP4 request occurs,
- no panorama image request occurs,
- only intended transition preloads occur, if configured.

#### Block navigation
- forward transition still starts promptly,
- reverse transition remains functional,
- no duplicate media request storm appears.

#### Tour route
- entering an available Tour loads the panorama runtime / images on demand,
- room/hotspot/minimap behavior remains intact,
- leaving destroys the viewer,
- reopening does not duplicate viewer instances.

#### No-tour route
- unavailable state does not initialize panorama viewer or fetch panorama images unnecessarily.

#### Video route
- project-video media is requested when `/video` is visited,
- autoplay remains off,
- leaving the route stops/removes player.

#### Production isolation
- DEV-only routes remain NotFound,
- DEV-only chunks / code are not unnecessarily reachable in production where practical.

Also verify:

- no new console runtime errors,
- 320 / 390 / 1280 responsive behavior from IMP-018 remains intact,
- Browser Back / Forward still works coherently.

## Explicitly forbidden in IMP-019

Do not:

- deploy to staging,
- choose hosting provider,
- configure CDN/backend,
- add service worker / PWA caching,
- add real Nail Karataş media,
- implement final visual design,
- implement Availability,
- implement Brochure / Location / Contact,
- add analytics,
- add backend persistence,
- add Redux / Zustand / MobX,
- add a large media-management framework,
- alter locked baseline documents,
- begin IMP-020.

## Acceptance criteria

IMP-019 passes only if:

- initial Home load does not eagerly initialize panorama runtime,
- panorama media loads only when an available Tour is entered,
- unavailable Tour does not instantiate/fetch panorama content unnecessarily,
- Project Video media is not globally preloaded,
- transition media uses a deliberate, documented preload policy,
- route-level lazy loading is applied where it produces meaningful benefit,
- route/media loading has a safe visible fallback,
- media paths remain centralized and development media remains isolated,
- repeated navigation does not leak viewer/player resources,
- DEV-only tooling remains production-isolated,
- before/after build and loading observations are documented,
- no product behavior regresses,
- no new dependency is added unless explicitly justified,
- `validate:data` passes,
- build passes,
- lint passes,
- panorama adapter test passes,
- tour-help storage test passes,
- `git diff --check` passes,
- baseline documents remain unchanged.

## Completion report

Return the report in Turkish and also write it to:

`docs/IMP-019-COMPLETION-REPORT.md`

Include:

1. Özet.
2. Oluşturulan / değiştirilen dosyalar.
3. Önceki production-build / chunk gözlemleri.
4. Route-level lazy-loading kararları.
5. Panorama runtime / media lazy-loading davranışı.
6. Transition preload politikası.
7. Project Video loading davranışı.
8. Media path/config hijyeni.
9. DEV-only production izolasyonu.
10. Resource cleanup doğrulaması.
11. Son production-build / chunk gözlemleri.
12. Home / Block / Tour / No-tour / Video network davranışı.
13. Responsive / Browser Back regression sonucu.
14. Çalıştırılan komutlar.
15. `validate:data`, build, lint, adapter test, storage test ve `git diff --check` sonuçları.
16. Eklenen bağımlılık varsa listesi.
17. Gerçek production medya olmamasından kaynaklanan ölçüm sınırları.
18. Uyarılar / çözülmemiş konu / mimari çelişki.
19. IMP-020'ye başlama.
