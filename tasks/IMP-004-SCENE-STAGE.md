# IMP-004 — SceneStage

Status: **READY**

## Objective

Implement the reusable exterior visual stage used by Home / Masterplan and Block scenes.

This task establishes only the responsive 1920 x 1440 logical stage and its layer composition model.

Do not implement real project media, SVG hotspots, transition playback, block selection behavior, or production visual styling in this task.

## Required reading

Follow `AGENTS.md` and read all baseline documents before starting.

Relevant locked decisions:

- Exterior visual navigation is based on static render + SVG + HTML5 transition video.
- Logical exterior stage size is 1920 x 1440.
- Aspect ratio is 4:3.
- Image and interaction layers must share the same logical coordinate system.
- The stage must scale responsively without changing logical coordinates.

## Required work

### 1. SceneStage component

Implement a reusable `SceneStage` component under:

`src/components/SceneStage/`

The component must provide a fixed logical coordinate space of:

- width: 1920
- height: 1440
- aspect ratio: 4:3

The rendered stage must scale responsively to fit its available container while preserving aspect ratio.

No cropping is allowed in IMP-004.

### 2. Layer composition

`SceneStage` must support layered child content in a predictable stacking order.

At minimum provide a clean mechanism for these conceptual layers:

1. base visual layer
2. interaction layer
3. transition / overlay layer

Do not implement the actual hotspot or transition components yet.

The API may use named slots / props or an equivalent simple React composition pattern.

Avoid overengineering.

### 3. Base visual support

Provide a minimal reusable base visual layer that can render a supplied image URL inside the stage.

For IMP-004 validation, use only a neutral placeholder / development asset or CSS-generated placeholder.

Do not add Nail Karataş production media yet.

The base visual must fill the logical stage exactly and preserve the stage geometry.

### 4. Coordinate proof

Add a development-only visual proof inside the existing placeholder pages or a dedicated temporary development route/component showing that:

- the stage is logically 1920 x 1440,
- its visible aspect ratio remains 4:3,
- an absolutely positioned marker placed at a known logical position (for example x=960, y=720) remains at the visual center when the viewport changes.

This proof is temporary development scaffolding, not production UI.

Do not implement SVG polygons in this task.

### 5. Accessibility / semantics

The stage container must have sensible semantics.

Any development image used must have a useful `alt` value or be explicitly decorative as appropriate.

### 6. Styling

Place stage-specific styles with the component, using the project's existing CSS approach.

Do not add a UI framework or styling dependency.

Do not introduce final branding / design.

### 7. Integration

Integrate the SceneStage minimally into the Home / Masterplan placeholder so it can be visually verified.

Do not replace the page with real masterplan behavior.

Do not add block buttons, hover logic, project media, or navigation behavior beyond existing IMP-003 placeholders.

### 8. Validation

Required checks:

- `npm run validate:data`
- `npm run build`
- `npm run lint`
- `git diff --check`

Manual browser verification must confirm:

- stage displays on Home,
- stage preserves 4:3 ratio on a wide desktop viewport,
- stage preserves 4:3 ratio on a narrower viewport,
- center marker remains centered,
- no overflow/cropping of the logical stage,
- existing IMP-003 routes remain operational,
- browser console has no new runtime errors.

## Explicitly forbidden in IMP-004

Do not:

- implement `SvgHotspotLayer`,
- draw block or unit polygons,
- implement hover / click interaction,
- implement transition video playback,
- add real Nail Karataş render images,
- add project animation,
- add panorama functionality,
- add Pannellum,
- implement Unit Quick Card UI,
- implement Availability UI,
- add Redux / Zustand / MobX,
- add a backend,
- alter locked baseline documents,
- begin IMP-005.

## Acceptance criteria

IMP-004 passes only if:

- `SceneStage` exists as a reusable component.
- Logical dimensions are 1920 x 1440.
- Aspect ratio remains 4:3 responsively.
- Stage uses contain-style behavior with no crop.
- Layer composition supports base / interaction / overlay concepts without implementing later features.
- A known center coordinate remains visually centered across tested viewport sizes.
- Masterplan placeholder integrates the stage minimally.
- Existing routes continue to work.
- No unauthorized media or feature is added.
- No new dependency is added.
- `npm run validate:data` passes.
- `npm run build` passes.
- `npm run lint` passes.
- `git diff --check` passes.
- Baseline documents remain unchanged.

## Completion report

Return the report in Turkish:

1. Özet.
2. Oluşturulan / değiştirilen dosyalar.
3. SceneStage API / composition yaklaşımı.
4. 1920 x 1440 koordinat ve 4:3 responsive davranış açıklaması.
5. Tarayıcı doğrulama sonuçları.
6. Çalıştırılan komutlar.
7. `validate:data`, build, lint ve `git diff --check` sonuçları.
8. Eklenen bağımlılık varsa listesi.
9. Uyarılar / çözülmemiş konu / mimari çelişki.
10. IMP-005'e başlama.
