# IMP-011 — Unit Details Drawer

Status: **READY**

## Objective

Implement the initial Unit Details experience as a larger drawer/panel over the same Block scene.

A route such as:

`/block/b/unit/B-301/details`

must preserve the Block scene, keep the selected Unit visually active, and replace the compact Quick Card with a larger development-quality Details drawer.

This is still not a full production Unit Detail page.

Do not implement panorama rendering, real galleries, lead forms, PDF generation, or Availability.

## Required reading

Follow `AGENTS.md` and read all baseline documents before starting.

Relevant locked decisions:

- Unit routes preserve the Block scene context.
- Quick Card exists at `/block/:blockId/unit/:unitId`.
- Details route is `/block/:blockId/unit/:unitId/details`.
- Initial Details experience is a larger drawer/panel, not a separate standalone sales page.
- Selected Unit is durable URL state.
- Real plan/gallery media is not yet integrated.
- Panorama belongs to later tasks.

## Required work

### 1. Preserve the shared Block scene

Refactor only as much as necessary so that:

- `/block/:blockId`
- `/block/:blockId/unit/:unitId`
- `/block/:blockId/unit/:unitId/details`

all use the same underlying Block scene implementation.

On the Details route:

- the selected Unit polygon remains active,
- the compact Quick Card is not shown simultaneously,
- the Details drawer is shown over the scene.

Avoid copying the Block scene into a second implementation.

### 2. Route validation

For the Details route:

- resolve Block,
- resolve Unit,
- verify Unit belongs to Block,
- resolve UnitType.

Invalid or mismatched data must render existing NotFound behavior.

Do not invent fallback data.

### 3. Unit Details drawer

Implement a reusable feature component, for example:

`src/features/units/UnitDetailsDrawer.tsx`

The drawer should be larger than the Quick Card but remain clearly an overlay/panel over the Block scene.

Display factual seed data where available, including at least:

- Unit ID,
- official independent-section number,
- floor,
- UnitType name,
- category,
- rooms if present,
- net area if present,
- orientation if present,
- availability if present.

Do not display made-up values.

### 4. Development-only media placeholders

Because real media is not yet integrated, include clearly labeled DEVELOPMENT-ONLY placeholders for:

- larger floor-plan area,
- gallery/image area.

Do not create fake architectural drawings or fake sales imagery.

Do not add real Nail Karataş plan/gallery files in IMP-011.

### 5. Drawer actions

Provide these contextual actions:

- `Quick Card'a Dön`
- `Sanal Tur`

Behavior:

`Quick Card'a Dön`
-> `/block/:blockId/unit/:unitId`

`Sanal Tur`
-> `/block/:blockId/unit/:unitId/tour`

Do not implement Tour UI beyond the existing placeholder route.

A visible close/return-to-Block action is also required:

`Bloğa Dön`
-> `/block/:blockId`

This close does not play the Block -> Home reverse transition.

### 6. Browser Back

Verify coherent history behavior:

- Quick Card -> Details -> browser Back returns to Quick Card.
- Details -> `Bloğa Dön` returns directly to Block.
- Block -> in-app Home still uses the existing reverse transition.

Do not hijack browser Back.

### 7. Selected Unit / hotspot behavior

While Details is open:

- the selected Unit polygon remains visually active,
- other Unit hotspots may remain inspectable,
- activating another Unit hotspot should navigate to that Unit's Quick Card route, not silently mutate the current Details route.

The route remains the source of truth.

### 8. Home reverse-transition regression

The in-app Home control must continue to work from the Details route.

If Home is activated while Details is open:

- use the existing reverse transition implementation,
- lock competing Unit / drawer interaction while transition is active,
- navigate to `/` only after normal completion,
- preserve existing failure and reduced-motion fallbacks.

Do not duplicate transition logic.

### 9. Accessibility

The Details drawer must:

- use a meaningful labeled region/dialog-like structure,
- have keyboard-reachable actions,
- keep visible focus styling,
- expose the selected Unit identity in accessible text,
- become inert or otherwise non-interactive while Home reverse transition is active.

Do not add focus-trap complexity unless naturally required by the existing architecture.

### 10. Responsive behavior

At narrow widths:

- drawer content remains readable,
- no horizontal page overflow,
- actions remain reachable,
- SceneStage geometry underneath remains aligned.

Do not implement final branded responsive design.

### 11. Styling

Use neutral development styling only.

Do not add:

- final branding,
- sales-polished art direction,
- real media,
- animations beyond existing transition behavior,
- lead capture,
- download/PDF behavior.

### 12. Validation

Required checks:

- `npm run validate:data`
- `npm run build`
- `npm run lint`
- `git diff --check`

Manual browser verification must confirm at least:

#### A
- `/block/a/unit/A-003/details`
- A Block scene remains visible underneath.
- A-003 remains active.
- Details drawer shows factual available data.

#### B
- `/block/b/unit/B-301/details`
- `Quick Card'a Dön` returns to `/block/b/unit/B-301`.
- `Sanal Tur` routes to `/block/b/unit/B-301/tour`.
- activating B-302 hotspot routes to `/block/b/unit/B-302`.

#### C
- `/block/c/unit/C-404/details`
- C-404 remains active and correct data is shown.

Also verify:

- `Bloğa Dön` returns to the correct Block route without reverse video,
- browser Back Details -> Quick Card is coherent,
- Home reverse transition works from Details,
- drawer interaction is locked during Home reverse transition,
- invalid Block/Unit combinations still render NotFound,
- wide and narrow layouts have no horizontal overflow,
- browser console has no new runtime errors.

## Explicitly forbidden in IMP-011

Do not:

- implement panorama rendering,
- add Pannellum or another panorama engine,
- add real plan images,
- add real gallery images,
- add real Block renders,
- add real Unit hotspot coordinates,
- add real production transition videos,
- implement Availability UI,
- implement hotspot editor,
- implement lead forms,
- implement PDF/brochure generation,
- add Favorites,
- add Redux / Zustand / MobX,
- add a backend,
- alter locked baseline documents,
- begin IMP-012.

## Acceptance criteria

IMP-011 passes only if:

- Details route preserves the shared Block scene,
- selected Unit remains route-driven and visually active,
- Quick Card and Details drawer are not shown simultaneously,
- Details drawer shows only factual seed data,
- development plan/gallery placeholders are clearly marked,
- `Quick Card'a Dön`, `Sanal Tur`, and `Bloğa Dön` route correctly,
- browser Back remains coherent,
- Home reverse transition still works from Details,
- drawer/Unit interaction is locked during Home reverse playback,
- no real media or panorama implementation is introduced,
- no new dependency is added,
- `npm run validate:data` passes,
- `npm run build` passes,
- `npm run lint` passes,
- `git diff --check` passes,
- baseline documents remain unchanged.

## Completion report

Return the report in Turkish:

1. Özet.
2. Oluşturulan / değiştirilen dosyalar.
3. Details route'un ortak Block sahnesine bağlanma yaklaşımı.
4. Unit / UnitType veri çözümleme yaklaşımı.
5. Details drawer içeriği.
6. DEVELOPMENT-ONLY plan/gallery placeholder yaklaşımı.
7. Selected Unit ve hotspot active-state davranışı.
8. `Quick Card'a Dön`, `Sanal Tur`, `Bloğa Dön`, Browser Back davranışları.
9. Home reverse-transition regression doğrulaması.
10. Responsive ve accessibility doğrulaması.
11. Çalıştırılan komutlar.
12. `validate:data`, build, lint ve `git diff --check` sonuçları.
13. Eklenen bağımlılık varsa listesi.
14. Uyarılar / çözülmemiş konu / mimari çelişki.
15. IMP-012'ye başlama.
