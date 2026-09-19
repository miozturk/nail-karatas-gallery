# IMP-020 — Staging Build Readiness

Status: **READY**

## Objective

Prepare the current Nail Karataş demo for a reliable staging deployment without yet choosing or coupling the repository to a specific hosting provider.

The result must be a static-production build that can be served from a typical SPA-capable static host and opened directly on every application route.

This task proves:

- production build integrity,
- SPA deep-link fallback behavior,
- production-only route behavior,
- static media availability,
- cache/versioning readiness documentation,
- environment/config hygiene,
- staging QA checklist,
- repeatable local staging verification.

This task does **not** deploy to a third-party provider yet and does not add real project media or final visual polish.

## Required reading

Follow `AGENTS.md` and read all locked baseline documents.

Also read:

- `docs/IMP-018-COMPLETION-REPORT.md`
- `docs/IMP-019-COMPLETION-REPORT.md`

Relevant locked decisions:

- App is React + TypeScript + Vite.
- Staging must support static deployment.
- Product routes are real browser URLs and must survive direct navigation / refresh.
- DEV-only tools must remain unavailable in production.
- Optimized web media lives under `public/media`.
- Source PNG sequences / master assets remain outside the repository.
- Hosting provider is still an open decision.
- Final visual design and real-media integration are later work.

## Required work

### 1. Production build audit

Run a clean production build and document:

- build output location,
- generated JS/CSS chunks,
- presence of expected DEVELOPMENT-ONLY media,
- absence of source/master media,
- absence of DEV-only tool chunks / route strings where practical.

Do not optimize bundle sizes again unless a staging-specific issue is discovered.

### 2. SPA deep-link fallback proof

The staging build must support direct navigation / refresh for all current production routes.

At minimum verify direct requests for:

- `/`
- `/block/b`
- `/block/b/unit/B-301`
- `/block/b/unit/B-301/details`
- `/block/b/unit/B-301/tour`
- `/video`

must serve the application shell and allow React Router to render the correct route.

Invalid routes must still render the application's NotFound UI after the SPA shell loads.

Do not solve this by converting the app to hash routing.

### 3. Provider-neutral staging server

Add a very small local staging server / verification script under `scripts/` if needed.

It may use only Node built-ins.

Requirements:

- serve `dist/`,
- serve existing files normally,
- fall back unknown non-file routes to `dist/index.html`,
- preserve correct basic MIME types for HTML / JS / CSS / JSON / SVG / JPG / PNG / WEBP / MP4 / map files if served,
- no backend business logic,
- no API routes,
- no new dependency.

This script is for repeatable staging verification only.

Do not turn it into the production backend.

### 4. Build-and-serve commands

Add explicit npm scripts if useful, for example:

- `staging:build`
- `staging:serve`

Keep naming simple.

Requirements:

- existing `build`, `dev`, `preview`, test commands remain intact,
- staging verification must be repeatable from a clean checkout after `npm install`.

Do not introduce a task runner framework.

### 5. Base-path readiness

Review Vite asset paths and routing assumptions.

For the demo baseline:

- staging is expected at a host root such as `https://example-host/`,
- do not introduce a non-root base path unless required,
- static media URLs must resolve correctly on production build.

Document that subdirectory hosting would require an explicit future base-path decision.

### 6. Production route isolation

Verify in the staging build:

- `/__dev/hotspot-editor` is not usable,
- `/__dev/panorama-spike` is not usable,
- DEV-only feature chunks / route strings are absent from production assets where practical.

Do not remove the development tools from DEV mode.

### 7. Media verification

Verify all current web media referenced by production demo flows are reachable from the staging build:

- forward transition proof MP4,
- reverse transition proof MP4,
- panorama proof JPGs,
- project-video proof MP4.

Requirements:

- correct HTTP success status,
- correct basic content type,
- stable URL paths,
- no accidental filesystem paths,
- no source PNG sequences.

Do not add real Nail Karataş media in IMP-020.

### 8. Direct-route media behavior

From direct production URLs, verify media still resolves.

Examples:

- direct Tour URL loads its lazy chunks / panorama assets,
- direct Video URL loads project-video media only when appropriate,
- direct Block route can perform Home reverse transition,
- direct Unit route can open Details / Tour.

### 9. Cache / headers readiness documentation

Do not configure provider-specific headers in this task.

Document recommended categories for the eventual host:

- `index.html`: short/no-cache or revalidation-friendly,
- hashed JS/CSS assets: long immutable caching,
- versioned production media: long cache only when filenames/paths are versioned,
- unversioned mutable media: revalidation-friendly.

This is documentation only.

Do not claim headers are active until the actual host is configured.

### 10. Environment hygiene

Verify:

- no secrets are required for the current static build,
- no localhost URLs are hard-coded into production app code,
- no local filesystem paths are shipped,
- no development server ports are embedded into production output.

If environment-variable support is unnecessary, do not invent `.env` files.

### 11. Staging QA checklist

Create:

`docs/STAGING-QA-CHECKLIST.md`

Include concise manual checks for the customer-demo build:

- Home render,
- A/B/C interaction,
- forward/reverse transition,
- Unit Quick Card,
- Details,
- available Virtual Tour,
- unavailable Tour state,
- Tour first-use help,
- minimap / room / hotspot,
- Project Video,
- Browser Back / Forward,
- 390px responsive check,
- 1280px desktop check,
- direct-route refreshes,
- invalid route,
- console error check.

Do not include final production operational procedures.

### 12. Completion report

Create:

`docs/IMP-020-COMPLETION-REPORT.md`

Record:

- files changed,
- build output,
- local staging server approach,
- direct-route test matrix,
- media test results,
- DEV-route production isolation,
- environment findings,
- cache/header recommendations,
- QA checklist location,
- known limitations.

### 13. Regression safety

All current behavior must remain intact:

- Masterplan A/B/C sync,
- forward transition,
- Block reverse transition,
- Unit hotspots,
- Quick Card,
- Details,
- Virtual Tour,
- first-use help,
- Project Video,
- responsive behavior from IMP-018,
- media loading behavior from IMP-019,
- DEV Hotspot Editor / Panorama Spike in development mode,
- Browser Back / Forward.

### 14. Validation

Required checks:

- `npm run validate:data`
- `npm run build`
- `npm run lint`
- `node scripts/test-panorama-adapter.mjs`
- `node scripts/test-tour-help-storage.mjs`
- `git diff --check`

If a staging server script is added, validate it directly.

Manual staging-browser verification must include:

#### Direct-route refresh matrix
Open / refresh each:

- `/`
- `/block/b`
- `/block/b/unit/B-301`
- `/block/b/unit/B-301/details`
- `/block/b/unit/B-301/tour`
- `/video`
- one invalid route

#### Media
Verify successful loads for:

- transition proof videos,
- panorama proof images,
- project-video proof.

#### Production isolation
Verify:

- both DEV routes resolve to application NotFound,
- no DEV tool UI is accessible.

#### Regression
At least one complete customer flow:

Home -> B -> B-301 -> Details -> Quick Card -> Tour -> Daireye Dön -> Block -> Home -> Video.

Also verify:

- Browser Back / Forward,
- 390px and 1280px,
- no horizontal overflow,
- no new console runtime errors.

## Explicitly forbidden in IMP-020

Do not:

- deploy to Vercel / Netlify / Cloudflare / another provider,
- choose the final hosting provider,
- configure DNS or custom domain,
- add a CDN,
- add a backend,
- add authentication,
- add real Nail Karataş media,
- implement final visual design,
- implement localization,
- implement Availability / Brochure / Location / Contact,
- add analytics,
- add Redux / Zustand / MobX,
- add new dependencies unless absolutely required and explicitly justified,
- alter locked baseline documents,
- begin a later IMP.

## Acceptance criteria

IMP-020 passes only if:

- clean production build passes,
- a repeatable provider-neutral static staging verification exists,
- all production routes survive direct navigation / refresh,
- invalid routes still produce app NotFound behavior,
- current production media resolves correctly from staging build,
- DEV-only routes remain production-isolated,
- no localhost / filesystem / secret contamination exists in production output,
- cache/header deployment recommendations are documented but not falsely claimed active,
- `docs/STAGING-QA-CHECKLIST.md` exists,
- `docs/IMP-020-COMPLETION-REPORT.md` exists,
- current app behavior does not regress,
- no new dependency is added unless explicitly justified,
- `validate:data` passes,
- build passes,
- lint passes,
- panorama adapter test passes,
- tour-help storage test passes,
- `git diff --check` passes,
- locked baseline documents remain unchanged.

## Completion report

Return the report in Turkish and also write it to:

`docs/IMP-020-COMPLETION-REPORT.md`

Include:

1. Özet.
2. Oluşturulan / değiştirilen dosyalar.
3. Production build sonucu.
4. Provider-neutral staging server / verification yaklaşımı.
5. Direct-route refresh matrisi.
6. Media erişim / content-type doğrulaması.
7. DEV-only production izolasyonu.
8. Environment / localhost / filesystem hijyeni.
9. Cache/header önerileri (yalnızca dokümantasyon).
10. Staging QA checklist özeti.
11. 390px / 1280px tarayıcı doğrulaması.
12. Tam demo akışı regression sonucu.
13. Browser Back / Forward sonucu.
14. Çalıştırılan komutlar.
15. `validate:data`, build, lint, adapter test, storage test ve `git diff --check` sonuçları.
16. Eklenen bağımlılık varsa listesi.
17. Bilinen sınırlar / açık staging kararları.
18. Uyarılar / çözülmemiş konu / mimari çelişki.
19. Sonraki IMP'ye başlama.
