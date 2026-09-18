# IMP-012 — Hotspot Editor v1

Status: **READY**

## Objective

Implement a development-only in-browser hotspot authoring tool for the shared 1920 x 1440 exterior coordinate system.

The tool is for producing polygon coordinates that can later replace DEVELOPMENT-ONLY placeholder geometry.

It must let a developer:

- place polygon vertices by clicking on the logical scene,
- inspect exact logical coordinates,
- preview the current polygon,
- manage a small in-memory set of polygons,
- export clean JSON coordinate data.

The editor must not modify production source files automatically and must not replace runtime hotspot data in this task.

## Required reading

Follow `AGENTS.md` and read all baseline documents before starting.

Relevant locked decisions:

- Exterior scenes use a fixed 1920 x 1440 logical coordinate system.
- Runtime hotspots are SVG polygons in the same logical coordinate system.
- Real Masterplan / Unit polygon coordinates are not yet approved.
- Authoring tooling must remain separate from runtime domain data.
- No backend is part of the current architecture.

## Required work

### 1. Development-only editor page

Implement the editor under an appropriate development-tool feature location, for example:

`src/features/devtools/hotspot-editor/`

Expose it on a clearly development-only route such as:

`/__dev/hotspot-editor`

Requirements:

- route is available only when `import.meta.env.DEV` is true,
- route is not added to the normal global navigation,
- production build must not expose a usable editor route,
- existing application routes must remain unchanged.

### 2. Shared logical canvas

Use the existing `SceneStage` infrastructure.

The editor canvas must:

- use the same 1920 x 1440 logical coordinate system,
- preserve 4:3 responsive scaling,
- show a neutral DEVELOPMENT-ONLY background by default,
- optionally support a developer-supplied image URL/path for preview if this can be done without adding project media.

Do not add real Nail Karataş renders in this task.

### 3. Coordinate capture

Pointer interaction must convert screen/pointer position into logical 1920 x 1440 coordinates.

Requirements:

- clicking inside the stage appends one vertex,
- coordinates are clamped to stage bounds,
- current pointer logical X/Y is inspectable,
- stored/exported coordinates are deterministic integers,
- responsive scaling must not change logical coordinates for the same visual point.

Do not use viewport pixels as persisted polygon data.

### 4. Current polygon editing

Support at minimum:

- polygon ID / key input,
- append vertex,
- undo last vertex,
- clear current polygon,
- live polygon/polyline preview,
- visible vertex markers,
- current vertex list.

A polygon may be committed only when it has at least three vertices and a non-empty unique ID.

### 5. In-memory polygon set

Allow multiple polygons to be authored in one editor session.

At minimum support:

- add/commit current polygon,
- list committed polygon IDs,
- select a committed polygon for inspection,
- delete a committed polygon,
- prevent duplicate IDs.

Editing an already committed polygon in-place is optional for v1. If not implemented, document the workflow clearly.

### 6. JSON export

Provide a deterministic export representation suitable for later manual integration.

Preferred shape:

```json
{
  "A": [[100, 200], [300, 220], [280, 500]],
  "B": [[...]]
}
```

or an equivalently simple typed structure.

Requirements:

- output contains only polygon IDs and logical coordinates,
- output ordering is stable,
- pretty-printed JSON is visible in the UI,
- provide a Copy JSON action when browser clipboard API is available,
- clipboard failure must not break the editor; the visible text remains the fallback.

Do not write source files automatically.

### 7. Optional JSON import

If implementation remains small and clear, support pasting the same JSON shape back into the editor.

If implemented:

- validate shape,
- require at least three points per polygon,
- reject malformed/out-of-bounds coordinate data with a visible message,
- do not mutate runtime application data.

This section is optional and must not jeopardize the required v1 scope.

### 8. Accessibility

Editor controls must be keyboard reachable.

At minimum:

- form inputs have labels,
- buttons have clear names,
- status/errors are exposed accessibly,
- canvas interaction has explanatory text because vertex placement itself is pointer-centric.

Do not build a full keyboard geometry editor in v1.

### 9. Separation from runtime features

The editor must not:

- modify `developmentHotspots.ts`,
- modify `developmentUnitPolygons.ts`,
- write coordinates into `blocks`, `units`, or `unitTypes`,
- change current Masterplan / Block interaction behavior,
- add production media,
- add backend persistence.

A README in the editor folder should explain how exported JSON is intended to be manually reviewed and later integrated.

### 10. Regression safety

Existing flows must remain intact:

- Masterplan forward transition,
- Block reverse transition,
- Unit hotspots,
- Quick Card,
- Details drawer,
- route validation,
- browser Back behavior.

### 11. Validation

Required checks:

- `npm run validate:data`
- `npm run build`
- `npm run lint`
- `git diff --check`

Manual browser verification must confirm:

- `/__dev/hotspot-editor` works in Vite development mode,
- editor route is absent/unusable in production preview/build behavior,
- wide and narrow viewport scaling preserves coordinate mapping,
- clicking stage corners / center maps approximately to:
  - top-left -> 0,0
  - center -> 960,720
  - bottom-right -> 1920,1440 within expected pointer-boundary tolerance
- adding vertices updates preview,
- undo works,
- clear works,
- polygon cannot commit with fewer than three points,
- duplicate ID is rejected,
- multiple polygons can be committed,
- delete works,
- exported JSON is deterministic and valid,
- Copy JSON works or fails gracefully with visible JSON fallback,
- no existing application route regresses,
- browser console has no new runtime errors.

## Explicitly forbidden in IMP-012

Do not:

- replace DEVELOPMENT-ONLY runtime polygons with real coordinates,
- add real Nail Karataş renders,
- add real plan/gallery media,
- implement automatic source-file writing,
- add a backend,
- implement Availability UI,
- implement panorama rendering,
- add Pannellum or another panorama engine,
- add Redux / Zustand / MobX,
- add an admin/auth system,
- alter locked baseline documents,
- begin IMP-013.

## Acceptance criteria

IMP-012 passes only if:

- a development-only hotspot editor exists,
- it uses the shared 1920 x 1440 logical coordinate system,
- pointer coordinates are correctly converted from responsive stage coordinates,
- vertices can be appended, undone, and cleared,
- valid polygons can be committed with unique IDs,
- multiple polygons can be managed in memory,
- deterministic JSON can be exported and inspected,
- runtime data files remain untouched,
- production app does not expose the development editor route,
- no new dependency is added unless explicitly justified and approved,
- `npm run validate:data` passes,
- `npm run build` passes,
- `npm run lint` passes,
- `git diff --check` passes,
- baseline documents remain unchanged.

## Completion report

Return the report in Turkish:

1. Özet.
2. Oluşturulan / değiştirilen dosyalar.
3. Development-only route yaklaşımı.
4. Screen -> 1920 x 1440 logical coordinate dönüşüm yaklaşımı.
5. Polygon oluşturma / undo / clear / commit davranışı.
6. In-memory polygon yönetimi.
7. JSON export ve clipboard davranışı.
8. Varsa JSON import yaklaşımı.
9. Production-build izolasyonu.
10. Regression tarayıcı doğrulamaları.
11. Responsive coordinate doğrulaması.
12. Çalıştırılan komutlar.
13. `validate:data`, build, lint ve `git diff --check` sonuçları.
14. Eklenen bağımlılık varsa listesi.
15. Uyarılar / çözülmemiş konu / mimari çelişki.
16. IMP-013'e başlama.
