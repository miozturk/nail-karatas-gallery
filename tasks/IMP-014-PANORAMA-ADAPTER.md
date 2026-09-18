# IMP-014 — Panorama Adapter

Status: **READY**

## Objective

Formalize the panorama abstraction layer after the successful IMP-013 Pannellum spike.

The application must stop depending directly on Pannellum from feature/UI code.

Implement a replaceable panorama adapter with the locked conceptual API:

- `mount(element)`
- `loadTour(tour)`
- `goToScene(sceneId)`
- `getActiveScene()`
- `onSceneChange(callback)`
- `destroy()`

Then refactor the existing development panorama spike to use the adapter instead of calling Pannellum directly.

This task does **not** implement the production Virtual Tour UI.

## Required reading

Follow `AGENTS.md` and read all baseline documents before starting.

Also read:

`src/features/devtools/panorama-spike/README.md`

Relevant decisions:

- IMP-013 result is `SPIKE RESULT: PASS`.
- Current engine candidate is `pannellum@2.5.7`.
- Pannellum must remain replaceable.
- UI / feature code must not know Pannellum-specific APIs.
- Production Virtual Tour UI belongs to IMP-015.
- First-use help belongs to IMP-016.

## Required work

### 1. Adapter location

Implement the panorama abstraction under:

`src/panorama/`

A reasonable structure is:

- `PanoramaAdapter.ts`
- `PannellumAdapter.ts`
- `types.ts`
- optional engine-specific declaration/helper files
- `README.md`

Equivalent structure is acceptable if the separation is clear.

### 2. Engine-neutral adapter contract

Define a UI-independent interface equivalent to:

```ts
interface PanoramaAdapter {
  mount(element: HTMLElement): void
  loadTour(tour: PanoramaTourDefinition): void
  goToScene(sceneId: string): void
  getActiveScene(): string | null
  onSceneChange(callback: (sceneId: string) => void): () => void
  destroy(): void
}
```

Exact TypeScript syntax may vary.

Requirements:

- consumers must not receive Pannellum viewer objects,
- consumers must not use Pannellum-specific event names,
- `onSceneChange` returns an unsubscribe function,
- `destroy()` must be safe to call more than once.

### 3. Tour definition

Inspect the existing domain types first.

If the existing `Tour`, `PanoramaScene`, and `TourHotspot` types already contain the engine-neutral information required by the adapter, reuse them.

If a thin adapter input type is still necessary:

- keep it engine-neutral,
- do not duplicate product/domain entities unnecessarily,
- document why it exists.

The adapter input must support at least:

- stable scene ID,
- local panorama source,
- initial scene,
- scene-to-scene hotspots,
- hotspot pitch/yaw or equivalent view coordinates,
- optional initial yaw/pitch/FOV if required by the renderer.

No Pannellum-specific configuration objects should leak into feature code.

### 4. PannellumAdapter implementation

Implement the adapter using `pannellum@2.5.7`.

All Pannellum-specific logic must stay inside the panorama implementation layer.

At minimum:

- initialize one viewer for the mounted element,
- map engine-neutral tour data to Pannellum scene config,
- support scene-to-scene hotspots,
- track current active scene,
- notify adapter subscribers on scene changes,
- support programmatic `goToScene`,
- clean up listeners/viewer on `destroy`.

Do not add another panorama dependency.

### 5. Lifecycle rules

Required behavior:

- `mount()` stores / prepares the target host.
- `loadTour()` creates or replaces the viewer deterministically.
- loading a second tour must cleanly dispose the previous viewer first.
- `goToScene()` must reject or clearly fail for an unknown scene ID.
- `getActiveScene()` returns the current scene after engine-driven or programmatic navigation.
- `destroy()` clears the viewer, subscriptions, references, and active scene.
- no duplicate canvas/viewer instances after remount.

Choose clear error semantics and document them.

### 6. Refactor the IMP-013 spike

Keep the existing development route:

`/__dev/panorama-spike`

Refactor its feature/UI code so that it uses only the `PanoramaAdapter` contract.

The spike feature must no longer:

- import `pannellum`,
- call `pannellum.viewer`,
- subscribe to Pannellum event names,
- call Pannellum viewer methods directly.

It may instantiate `PannellumAdapter` at the composition boundary, but all runtime interaction must go through the adapter interface.

### 7. Preserve proof behavior

After the refactor, the development spike must still prove:

- three scenes,
- bidirectional scene hotspots,
- external room navigation,
- active-scene React state synchronization,
- minimap synchronization,
- drag/look and zoom,
- unmount/remount cleanup,
- production route isolation.

The visible behavior from IMP-013 should remain equivalent.

### 8. Dependency boundary check

Search the source tree for direct Pannellum usage.

Expected result:

- Pannellum-specific imports/API usage exist only inside `src/panorama/` engine implementation files and any strictly necessary local TypeScript declaration file.
- `src/features/` must not directly import the Pannellum package or use Pannellum viewer API.

Pannellum CSS handling may live in the panorama implementation layer or another clearly engine-specific file, but not in product feature code.

### 9. Documentation

Create / update:

`src/panorama/README.md`

Document:

- adapter contract,
- lifecycle order,
- scene-change subscription semantics,
- error behavior,
- Pannellum mapping boundary,
- current engine version,
- why features must not use the engine directly,
- known limitations from IMP-013,
- intended use by IMP-015.

Do not modify locked baseline documents.

### 10. Production isolation

The development panorama-spike route must remain DEV-only and unavailable in production preview.

The adapter implementation itself may be production-buildable because IMP-015 will use it next.

### 11. Regression safety

Existing functionality must remain intact:

- Masterplan forward transition,
- Block reverse transition,
- Unit hotspots,
- Quick Card,
- Details drawer,
- Hotspot Editor,
- route validation.

### 12. Validation

Required checks:

- `npm run validate:data`
- `npm run build`
- `npm run lint`
- `git diff --check`

Also perform a source-boundary search proving that feature code no longer directly depends on Pannellum.

Manual browser verification must confirm:

- panorama spike still opens at `/__dev/panorama-spike`,
- Living Room -> Hall -> Bedroom navigation works,
- reverse hotspot navigation works,
- external room navigation works,
- React active-scene state follows hotspot and programmatic navigation,
- minimap stays synchronized,
- viewer survives at least three unmount/remount cycles without duplicate canvases,
- production preview still returns NotFound for the spike route,
- no existing app route regresses,
- browser console has no new runtime errors.

## Explicitly forbidden in IMP-014

Do not:

- implement final Virtual Tour UI,
- wire `/block/:blockId/unit/:unitId/tour` to the panorama yet,
- implement first-use help,
- add real Nail Karataş panorama media,
- add real floor plans,
- add final minimap styling,
- add a second panorama engine,
- add backend persistence,
- add Redux / Zustand / MobX,
- alter locked baseline documents,
- begin IMP-015.

## Acceptance criteria

IMP-014 passes only if:

- an engine-neutral `PanoramaAdapter` contract exists,
- `PannellumAdapter` implements it,
- feature code does not directly depend on the Pannellum viewer API,
- adapter supports mount/load/goToScene/getActiveScene/onSceneChange/destroy,
- scene-change unsubscribe works,
- destroy is idempotent,
- replacing / remounting the viewer does not duplicate instances,
- the IMP-013 proof still behaves equivalently through the adapter,
- Pannellum remains the only panorama dependency,
- no new dependency is added,
- development spike remains production-isolated,
- `npm run validate:data` passes,
- `npm run build` passes,
- `npm run lint` passes,
- `git diff --check` passes,
- baseline documents remain unchanged.

## Completion report

Return the report in Turkish:

1. Özet.
2. Oluşturulan / değiştirilen dosyalar.
3. PanoramaAdapter interface yapısı.
4. Tour definition / mevcut domain tiplerini yeniden kullanım yaklaşımı.
5. PannellumAdapter mapping yaklaşımı.
6. mount / loadTour / goToScene / getActiveScene / onSceneChange / destroy davranışları.
7. Error ve lifecycle semantiği.
8. Spike feature refactor sonucu.
9. Direct Pannellum dependency boundary kontrolü.
10. Scene/menu/minimap senkronizasyon doğrulaması.
11. Unmount/remount cleanup doğrulaması.
12. Production isolation doğrulaması.
13. Regression tarayıcı kontrolleri.
14. Çalıştırılan komutlar.
15. `validate:data`, build, lint ve `git diff --check` sonuçları.
16. Eklenen bağımlılık varsa listesi.
17. Uyarılar / çözülmemiş konu / mimari çelişki.
18. IMP-015'e başlama.
