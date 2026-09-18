# IMP-006 — Masterplan Scene

Status: **READY**

## Objective

Implement the data-driven Home / Masterplan interaction behavior for Blocks A, B and C using the reusable SceneStage and SvgHotspotLayer primitives.

This task proves synchronized block hover / focus / activation and matching block navigation controls.

Do not implement transition-video playback yet. Do not add final production hotspot coordinates yet unless explicitly supplied as approved data.

## Required reading

Follow `AGENTS.md` and read all baseline documents before starting.

Relevant locked decisions:

- Home / Masterplan contains Blocks A, B and C.
- Hovering a block in the scene highlights the corresponding block control.
- Hovering / focusing the corresponding block control highlights the scene block.
- Clicking either representation goes to the same Block destination.
- Block routes are `/block/a`, `/block/b`, `/block/c`.
- Exterior scene geometry uses the shared 1920 x 1440 logical stage.
- Transition playback belongs to IMP-007, not this task.

## Required work

### 1. Masterplan feature structure

Implement the Masterplan feature under:

`src/features/masterplan/`

Create a clear feature-level composition that uses:

- `SceneStage`
- `SvgHotspotLayer`
- project Block seed data
- React Router navigation

Do not duplicate the generic SceneStage or hotspot primitives.

### 2. Masterplan interaction model

The Masterplan view must represent exactly three Blocks:

- A
- B
- C

The feature must keep one shared interaction state for the currently highlighted block.

The same highlighted state must drive both:

- the SVG hotspot visual state,
- the matching block navigation control visual state.

Pointer / keyboard interaction must be synchronized in both directions.

Examples:

- pointer enters Block B polygon -> Block B control highlights,
- pointer leaves Block B polygon -> highlight clears unless another source currently owns the interaction,
- pointer enters / focuses Block C control -> Block C polygon highlights,
- activating either Block A polygon or Block A control navigates to `/block/a`.

Keep the state model simple and local to the Masterplan feature.

### 3. Block navigation controls

Add minimal development-quality controls for A, B and C.

Requirements:

- accessible names,
- pointer hover synchronization,
- keyboard focus synchronization,
- activation navigates through React Router,
- active / highlighted state is visually inspectable.

Do not create final branded buttons or final page layout.

### 4. Masterplan hotspot data

Create a Masterplan-specific hotspot configuration mapping each block ID to a polygon.

Because final project polygons are not yet approved, use clearly labeled DEVELOPMENT-ONLY placeholder polygons for A, B and C.

Requirements:

- keep the placeholder hotspot configuration isolated in the Masterplan feature,
- name/comment it so it cannot be mistaken for approved production geometry,
- do not encode it into Block domain entities as final data,
- do not claim it represents the actual building silhouettes.

This placeholder geometry will later be replaced by authored project coordinates.

### 5. Visual base

Continue using the existing neutral / development SceneStage visual proof or an equivalent neutral base.

Do not add the real Nail Karataş masterplan render in IMP-006.

The goal is behavior and synchronization, not production presentation.

### 6. Navigation behavior

Activating a block polygon or matching navigation control must navigate to:

- A -> `/block/a`
- B -> `/block/b`
- C -> `/block/c`

Do not play any transition media yet.

Existing Block placeholder pages remain the destination.

Browser Back must return to the Masterplan route coherently.

### 7. Accessibility

The synchronized interaction must remain usable with keyboard.

At minimum verify:

- Tab can reach each block control and each SVG hotspot target according to the existing hotspot primitive.
- Focus on a block representation makes the counterpart visibly highlighted.
- Enter / Space activation works where appropriate.
- No duplicate inaccessible click-only behavior is introduced.

Avoid unnecessary ARIA duplication. Use native semantics where practical.

### 8. Development proof cleanup

The generic IMP-005 hotspot proof may be reduced or moved so that the Home page demonstrates the Masterplan behavior instead of two competing demos.

Do not delete useful generic component documentation.

Keep implementation-focused proof code clearly separated from production-ready data.

### 9. Validation

Required checks:

- `npm run validate:data`
- `npm run build`
- `npm run lint`
- `git diff --check`

Manual browser verification must confirm:

- Home renders three development block regions and three matching controls.
- Hovering A/B/C polygon highlights only its matching control.
- Hovering A/B/C control highlights only its matching polygon.
- Keyboard focus synchronizes the counterpart.
- Polygon activation navigates to the correct block route.
- Control activation navigates to the same correct block route.
- Browser Back returns to Home.
- invalid routes from IMP-003 still resolve correctly.
- wide and narrow viewport scaling preserves hotspot alignment.
- browser console has no new runtime errors.

## Explicitly forbidden in IMP-006

Do not:

- add real Nail Karataş hotspot coordinates,
- add the real masterplan render,
- implement transition video playback,
- implement reverse transitions,
- implement Block-scene Unit selection,
- implement Unit Quick Card UI,
- implement the hotspot editor,
- add Pannellum or another panorama engine,
- implement Availability UI,
- add Redux / Zustand / MobX,
- add a backend,
- change locked baseline documents,
- begin IMP-007.

## Acceptance criteria

IMP-006 passes only if:

- Home has exactly three block interaction targets and controls: A, B, C.
- SVG and control hover/focus state is synchronized in both directions.
- activating either representation navigates to the same block route.
- local feature state is used; no global state dependency is added.
- placeholder geometry is explicitly isolated and labeled development-only.
- no real project media or production polygon claim is introduced.
- existing routing / data validation remains intact.
- no new dependency is added.
- `npm run validate:data` passes.
- `npm run build` passes.
- `npm run lint` passes.
- `git diff --check` passes.
- baseline documents remain unchanged.

## Completion report

Return the report in Turkish:

1. Özet.
2. Oluşturulan / değiştirilen dosyalar.
3. Masterplan component yapısı.
4. A/B/C hotspot ve kontrol senkronizasyon yaklaşımı.
5. Navigation davranışı.
6. Placeholder hotspot geometrisinin nerede ve nasıl izole edildiği.
7. Pointer / keyboard doğrulama sonuçları.
8. Responsive tarayıcı doğrulama sonuçları.
9. Çalıştırılan komutlar.
10. `validate:data`, build, lint ve `git diff --check` sonuçları.
11. Eklenen bağımlılık varsa listesi.
12. Uyarılar / çözülmemiş konu / mimari çelişki.
13. IMP-007'ye başlama.
