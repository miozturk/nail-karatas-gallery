# IMP-021 — TR / EN / RU Localization Foundation

Status: **READY**

## Objective

Add a lightweight, typed localization layer for the customer-facing application and support:

- Turkish (`tr`)
- English (`en`)
- Russian (`ru`)

The current application must remain architecturally unchanged: routes, domain data, media behavior, panorama adapter, transitions and staging behavior must continue to work.

This task creates localization infrastructure and translates the current customer-facing demo UI. It is **not** final visual design.

## Required reading

Follow `AGENTS.md` and read all locked baseline documents.

Also read:

- `docs/IMP-018-COMPLETION-REPORT.md`
- `docs/IMP-019-COMPLETION-REPORT.md`
- `docs/IMP-020-COMPLETION-REPORT.md`
- `docs/STAGING-QA-CHECKLIST.md`

Relevant decisions:

- React + TypeScript + Vite.
- No global state library baseline.
- No backend required.
- Browser history / route semantics must remain unchanged.
- Current production app is staging-ready.
- Final visual design comes after localization/content integration.
- Domain IDs and canonical seed data must not be translated or mutated.

## Core implementation decision

Prefer a small in-repo typed localization layer using React Context/hooks and TypeScript dictionaries.

Do **not** add `i18next`, `react-intl`, FormatJS or another localization dependency unless an unavoidable blocker is found and explicitly documented.

Recommended conceptual shape:

```text
src/i18n/
  locale.ts
  translations/
    tr.ts
    en.ts
    ru.ts
  I18nProvider.tsx
  useI18n.ts
  formatters.ts
```

Exact file names may vary if the repository has a better existing convention.

## Locale behavior

Supported locales:

- `tr`
- `en`
- `ru`

Requirements:

- default locale: `tr`
- user can switch locale from customer-facing global UI
- selection persists in `localStorage`
- a bad / unsupported stored value safely falls back to `tr`
- storage read/write failure must not crash the app
- locale change must update the current screen immediately without navigation
- locale selection must survive normal route changes and Browser Back / Forward
- page reload should restore the stored supported locale
- update the document `<html lang>` attribute to the active locale

Use a versioned, product-specific storage key, for example:

`nail-karatas-locale-v1`

Do not put locale in the URL in IMP-021.

## Translation key safety

Create a single canonical key shape.

Requirements:

- TR / EN / RU dictionaries must expose the same key set
- TypeScript should catch missing/invalid keys where practical
- no arbitrary string-key access scattered through components
- no silent fallback that hides missing translation keys in development
- production must still fail safely if an unexpected key reaches runtime

A tiny automated dictionary parity check is encouraged.

## Customer-facing UI coverage

Translate current user-facing production UI comprehensively.

At minimum cover:

### App shell / navigation
- Home
- Video
- global labels
- loading / fallback copy
- route-level loading text

### Masterplan
- title / intro text
- A/B/C block controls
- Explore / open wording
- transition / status text

### Block
- block headings
- Home / return controls
- development proof/status labels that are visible in the customer demo
- Unit hotspot accessible labels where applicable

### Unit Quick Card
- field labels
- category labels
- floor
- independent section number
- type
- net area
- rooms where shown
- `Sanal Tur`
- `Detayları Gör`
- close / return controls
- plan placeholder copy

### Unit Details
- headings
- field labels
- plan/gallery placeholder copy
- `Quick Card'a Dön`
- `Sanal Tur`
- `Bloğa Dön`
- loading/error/empty-state text

### Virtual Tour
- Tour heading
- `Daireye Dön`
- room/menu labels
- minimap controls
- minimap collapse/expand labels
- available/unavailable Tour messaging
- loading/error states
- panorama hotspot accessible labels where application-controlled

### First-use Tour help
Translate all help copy and controls in TR / EN / RU.

The existing product-level dismissal persistence must remain independent from locale. Changing language must **not** cause the help to reappear after it was already dismissed.

### Project Video
- heading
- development notice
- Home return
- loading / ready / error status text
- relevant accessible labels

### NotFound
Translate production NotFound copy and navigation.

## Domain / seed data rules

Do not duplicate or translate canonical identifiers:

- Block IDs
- Unit IDs
- official unit numbers
- UnitType IDs
- route params
- panorama scene IDs

Do not create language-specific copies of Unit / UnitType records.

For enum-like presentation values currently stored in Turkish, add presentation-layer formatters / maps instead of rewriting seed data.

Examples that may need localized presentation:

- category: residential / commercial
- availability values if currently displayed
- floor labels such as ground / numbered floor
- orientation terms such as garden / road / north / south / east / west

If a value is genuinely freeform content rather than a known enum/token, do not invent translations. Document it instead.

## Numbers / units

Use locale-aware formatting where it materially improves presentation.

At minimum:

- area values should remain numerically correct
- `m²` is acceptable in all locales
- avoid changing canonical raw numeric data

Do not introduce currency formatting in this task unless current UI already displays currency.

## Language switcher

Add a small functional language selector in the customer-facing shell.

Requirements:

- TR / EN / RU clearly identifiable
- keyboard accessible
- visible focus
- suitable for 390px and 1280px
- no horizontal overflow
- not final visual design
- active locale clearly indicated semantically and visually
- do not show the selector inside DEV-only tools unless it naturally inherits the shell and causes no issue

Do not create flags. Use language codes or language names.

## Accessibility

Requirements:

- `<html lang>` follows active locale
- translated button/link accessible names
- aria labels / status messages localized where application-owned
- keyboard operation preserved
- modal/help focus behavior preserved
- Russian text must not be clipped due to longer labels

Do not attempt to translate browser-native Pannellum or `<video>` control chrome.

## Responsive safety

Verify at:

- 390 × 844
- 1280 × 800

For all three locales.

Additionally verify Russian at 320px for:

- global navigation / language selector
- Quick Card
- Details
- Tour help
- Tour room/minimap controls

Requirements:

- no horizontal overflow
- no clipped essential action
- text wraps safely
- touch target improvements from IMP-018 remain intact

## Routing / persistence regression

Verify:

- locale switch does not alter URL
- route stays exactly where it is when locale changes
- Browser Back / Forward history is not polluted by language changes
- direct-route refresh restores the stored locale
- invalid route renders localized NotFound

## Staging compatibility

The provider-neutral staging build from IMP-020 must continue to pass.

No environment variable should be required for locale support.

No host/provider configuration change is allowed.

## Development tools

DEV-only Hotspot Editor and Panorama Spike must continue to work.

They do not need complete TR/EN/RU translation in IMP-021 unless they render shared customer-facing components.

Do not spend scope translating authoring/debug copy.

## Tests / validation

Add a small automated localization test if useful. At minimum validate:

- supported locale set is exactly TR / EN / RU
- dictionary key parity
- invalid stored locale fallback
- localStorage failure fallback if implemented in a testable helper

Required existing checks:

- `npm run validate:data`
- `npm run build`
- `npm run lint`
- `node scripts/test-panorama-adapter.mjs`
- `node scripts/test-tour-help-storage.mjs`
- `npm run staging:verify`
- `git diff --check`

Run any new localization test too.

## Manual browser validation

At minimum in production/staging mode verify:

### Turkish
Home -> B -> B-301 -> Quick Card -> Details -> Tour -> Daireye Dön -> Home -> Video.

### English
Without leaving the current route, switch TR -> EN and verify translated content. Continue across the same main flow.

### Russian
Switch to RU and verify the same main flow.

Also verify:

- locale survives refresh
- locale survives Back / Forward
- no extra history entries from language switching
- Tour help dismissal remains dismissed across locale switches
- unsupported manually injected storage value falls back safely to TR
- no new console errors/warnings
- 390px / 1280px all locales
- 320px Russian critical screens
- DEV routes remain production NotFound

## Completion report

Create:

`docs/IMP-021-COMPLETION-REPORT.md`

Report in Turkish:

1. Özet.
2. Oluşturulan / değiştirilen dosyalar.
3. i18n mimarisi.
4. Locale persistence / fallback davranışı.
5. Dil seçici davranışı.
6. TR / EN / RU dictionary kapsamı.
7. Domain-data / presentation formatter yaklaşımı.
8. AppShell / Masterplan / Block çeviri sonucu.
9. Quick Card / Details çeviri sonucu.
10. Tour / minimap / help çeviri sonucu.
11. Project Video / NotFound çeviri sonucu.
12. `<html lang>` ve accessibility sonucu.
13. 390 / 1280 ve 320 RU responsive sonucu.
14. Route / refresh / Back-Forward persistence sonucu.
15. Staging regression sonucu.
16. Çalıştırılan komutlar.
17. `validate:data`, build, lint, adapter, help-storage, staging, localization test ve `git diff --check` sonuçları.
18. Eklenen bağımlılık varsa listesi.
19. Çevrilemeyen freeform içerik veya bilinen sınırlar.
20. Uyarılar / çözülmemiş konu / mimari çelişki.
21. Sonraki IMP'ye başlama.

## Explicitly forbidden in IMP-021

Do not:

- change route schema
- add locale to URLs
- mutate or duplicate domain seed data by locale
- add a backend
- add a global state library
- add a localization framework without explicit necessity
- add real Nail Karataş media
- perform final visual design
- implement Availability / Brochure / Location / Contact
- deploy to a third-party hosting provider
- change staging provider decisions
- alter locked baseline documents
- begin the next IMP

## Acceptance criteria

IMP-021 passes only if:

- TR / EN / RU can be switched at runtime
- locale persists safely
- default / invalid fallback is TR
- `<html lang>` updates
- current customer-facing production UI is localized comprehensively
- domain IDs / seed records remain canonical and unchanged
- Tour help dismissal behavior does not reset on locale change
- language switching does not change URL or pollute history
- 390 / 1280 all-locales checks pass
- critical Russian 320px checks pass
- no horizontal overflow regression
- staging verification passes
- no new dependency is added unless explicitly justified
- existing tests and build/lint checks pass
- baseline documents remain unchanged
- no later IMP work is started
