# IMP-005 — SVG Hotspot Layer

Status: **READY**

## Objective

Implement the reusable SVG polygon hotspot layer that will later be used for both block selection on the Masterplan scene and independent-unit selection on Block scenes.

This task is about the interaction primitive only.

Do not implement real Nail Karataş block/unit hotspot data, route transitions, transition videos, Quick Cards, or production visual design.

## Required reading

Follow `AGENTS.md` and read all baseline documents before starting.

Relevant locked decisions:

- Exterior scenes use a 1920 x 1440 logical coordinate system.
- SVG overlays use the same 1920 x 1440 coordinates.
- Hotspots are polygon based.
- Home and Block scenes will share reusable interaction infrastructure.
- Real project hotspot coordinates are not yet authored.

## Required work

### 1. Reusable SVG hotspot layer

Implement under:

`src/components/SvgHotspotLayer/`

At minimum provide:

- a reusable SVG overlay component,
- `viewBox="0 0 1920 1440"`,
- polygon rendering from logical point coordinates,
- pointer interaction without changing the underlying SceneStage geometry.

The layer must scale exactly with SceneStage.

### 2. Hotspot data shape

Create the minimum reusable hotspot view model needed by the component.

It should support at least:

- stable hotspot id,
- polygon points,
- accessible label,
- disabled state,
- hovered / active visual state as appropriate,
- callbacks for hover / leave / click.

Do not duplicate the domain `Unit` or `Block` entity models.

This is an interaction/presentation primitive.

### 3. Interaction behavior

A hotspot must support:

- pointer enter,
- pointer leave,
- click / activation.

Keyboard accessibility must also be supported.

A hotspot should be focusable and activatable with keyboard controls appropriate for a button-like target.

Do not implement navigation inside the hotspot component itself.

The parent supplies callbacks.

### 4. Visual states

Implement only neutral development styling for:

- default,
- hover,
- focus-visible,
- active/selected,
- disabled.

The default hotspot may be visually subtle or transparent, but development verification must make polygon boundaries inspectable.

Do not implement Nail Karataş final highlight colors.

### 5. SceneStage integration proof

Extend the existing SceneStage development proof on the Masterplan placeholder with a small set of fake development polygons.

Use simple logical shapes such as:

- one rectangle-like polygon,
- one irregular polygon,
- one second independent region.

Requirements:

- no real Nail Karataş coordinates,
- hovering one region visibly highlights only that region,
- clicking a region updates a small development-only text indicator,
- keyboard focus and activation work,
- center-coordinate proof from IMP-004 must remain valid.

### 6. Event boundaries

Ensure the SVG overlay:

- does not distort SceneStage dimensions,
- covers the logical stage exactly,
- only interactive hotspot regions capture pointer input,
- non-hotspot SVG area should not unnecessarily block the base visual.

### 7. API quality

Keep the API generic enough for later use in:

- Masterplan block hotspots,
- Block-scene Unit hotspots.

Avoid architecture for future features that are not needed now.

### 8. Validation

Required checks:

- `npm run validate:data`
- `npm run build`
- `npm run lint`
- `git diff --check`

Manual browser verification must confirm:

- development polygons align and scale with SceneStage,
- hover works,
- pointer leave resets hover,
- click callback works,
- keyboard focus is visible,
- Enter/Space activation works,
- disabled hotspot cannot activate,
- non-hotspot SVG area does not block expected page/stage interaction,
- wide and narrow viewport scaling preserves alignment,
- existing IMP-003 routes remain operational,
- browser console has no new runtime errors.

## Explicitly forbidden in IMP-005

Do not:

- use real Nail Karataş hotspot coordinates,
- wire Block or Unit data to hotspots,
- implement Masterplan block selection,
- implement Block-scene Unit selection,
- implement transition video playback,
- add real project media,
- implement Unit Quick Card UI,
- implement the hotspot editor,
- add Pannellum or another panorama engine,
- implement Availability UI,
- add Redux / Zustand / MobX,
- add a backend,
- alter locked baseline documents,
- begin IMP-006.

## Acceptance criteria

IMP-005 passes only if:

- a reusable SVG hotspot layer exists,
- it uses the same 1920 x 1440 logical coordinate system as SceneStage,
- polygon coordinates remain aligned while responsive scaling occurs,
- hover / leave / click callbacks work,
- keyboard focus and activation work,
- disabled state prevents activation,
- non-hotspot SVG area does not incorrectly capture interaction,
- only neutral development styling is introduced,
- no real project hotspots or later product features are implemented,
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
3. SvgHotspotLayer API / veri şekli.
4. Pointer ve keyboard etkileşim davranışı.
5. 1920 x 1440 responsive hizalama doğrulaması.
6. Tarayıcı doğrulama sonuçları.
7. Çalıştırılan komutlar.
8. `validate:data`, build, lint ve `git diff --check` sonuçları.
9. Eklenen bağımlılık varsa listesi.
10. Uyarılar / çözülmemiş konu / mimari çelişki.
11. IMP-006'ya başlama.
