# IMP-013 — Panorama Technology Spike

Status: **READY**

## Objective

Run a focused technology spike for the first panorama-engine candidate: **Pannellum**.

The goal is to decide whether Pannellum is suitable for the Nail Karataş virtual-tour requirements before locking it behind the panorama adapter in IMP-014.

This task must prove, with local development assets:

- equirectangular panorama rendering,
- multi-scene navigation,
- scene-to-scene hotspots,
- external room/menu navigation,
- active-scene synchronization,
- a simple floor-plan/minimap proof,
- mobile/narrow-screen usability,
- cleanup/unmount behavior.

This is a technology spike, not the production Virtual Tour UI.

## Required reading

Follow `AGENTS.md` and read all baseline documents before starting.

Relevant locked decisions:

- Panorama engine must remain replaceable behind an adapter in later work.
- Pannellum is the first candidate, not yet permanently locked.
- Virtual Tour must eventually support:
  - room-to-room hotspots,
  - external room/menu navigation,
  - minimap / floor-plan viewpoint synchronization,
  - active viewpoint indication,
  - mobile usability,
  - first-use help later,
  - visible return-to-Unit later.
- IMP-014 owns the formal panorama adapter.
- IMP-015 owns production Virtual Tour UI.
- IMP-016 owns first-use tour help.

## Approved development assets

This preparation package includes three DEVELOPMENT-ONLY local equirectangular proof images:

- `public/media/panoramas/dev/living-room.jpg`
- `public/media/panoramas/dev/hall.jpg`
- `public/media/panoramas/dev/bedroom.jpg`

They are synthetic test assets, not Nail Karataş interiors.

Do not present them as project content.

## Required work

### 1. Pannellum spike only

Evaluate Pannellum as the first engine candidate.

You may add the Pannellum runtime dependency required for the spike.

Do not add multiple competing panorama libraries in this task.

If package-level integration proves impossible or materially unsuitable, document the blocker clearly and stop before inventing a second engine implementation.

### 2. Development-only spike route

Expose the spike on a development-only route such as:

`/__dev/panorama-spike`

Requirements:

- available only when `import.meta.env.DEV` is true,
- not present in normal global navigation,
- production build/preview must not expose a usable spike route.

Reuse the same dev-route isolation approach established by IMP-012 where practical.

### 3. Three-scene tour proof

Create exactly three local scenes:

- `living-room`
- `hall`
- `bedroom`

Use the supplied development panorama files.

The scene graph must provide at least:

- Living Room -> Hall
- Hall -> Living Room
- Hall -> Bedroom
- Bedroom -> Hall

Scene-change hotspots must be visible and usable.

### 4. External scene navigation

Add a simple development-only room/menu control outside the panorama viewport.

It must allow direct navigation to all three scenes.

The external menu and panorama must stay synchronized:

- selecting a menu item changes the panorama scene,
- using an in-panorama hotspot updates the externally displayed active scene.

Do not build final tour navigation styling.

### 5. Active-scene event proof

The spike must demonstrate reliable scene-change notification.

Maintain React-visible state for the active scene.

The state must update when navigation occurs through:

- external menu,
- panorama hotspot.

This behavior is essential for the later adapter and minimap.

### 6. Minimap / floor-plan synchronization proof

Create a simple DEVELOPMENT-ONLY minimap/floor-plan proof.

Requirements:

- no real architectural plan,
- one marker/control for each of the three scenes,
- current scene is visibly active,
- activating a minimap viewpoint changes the panorama scene,
- a hotspot-driven scene change updates the minimap active viewpoint.

A simple CSS diagram is sufficient.

Do not implement the final collapsible minimap UI yet.

### 7. Engine lifecycle

The spike must prove safe engine lifecycle behavior.

At minimum:

- initialize exactly one viewer instance,
- avoid duplicate initialization during normal React rendering,
- destroy / clean up viewer on unmount,
- avoid leaving event listeners behind,
- handle scene changes without recreating the whole page unnecessarily.

Document any React-specific integration caveats found.

### 8. Panorama sizing and responsiveness

Verify:

- desktop wide viewport,
- narrow/mobile-size viewport,
- panorama remains usable,
- room menu remains reachable,
- minimap proof remains usable,
- no horizontal page overflow caused by the spike.

The panorama viewport does not need to preserve the exterior 4:3 SceneStage ratio.

Panorama is allowed to use an independent responsive viewport.

### 9. Basic interaction behavior

Verify typical panorama interaction supported by Pannellum:

- pointer/touch drag to look around,
- zoom behavior if provided by the engine,
- hotspot activation.

Do not add custom inertial controls or custom WebGL behavior.

### 10. Local-only media

All three test panoramas must be loaded from local project assets.

Do not depend on remote URLs, CDN-hosted demo panoramas, or external project media for the spike.

### 11. Spike conclusion

Create:

`src/features/devtools/panorama-spike/README.md`

It must record a concise conclusion using exactly one of:

- `SPIKE RESULT: PASS`
- `SPIKE RESULT: FAIL`

A PASS requires all acceptance criteria below to work.

Also document:

- engine/package/version used,
- integration approach,
- scene-change event behavior,
- hotspot behavior,
- mobile result,
- lifecycle/cleanup result,
- any limitations relevant to IMP-014/015,
- whether Pannellum is suitable to lock as the current engine candidate.

Do not modify locked architecture baseline documents in this task.

### 12. Regression safety

Existing functionality must remain intact:

- Masterplan transition,
- Block reverse transition,
- Unit hotspots,
- Quick Card,
- Details drawer,
- Hotspot Editor,
- route validation.

### 13. Validation

Required checks:

- `npm run validate:data`
- `npm run build`
- `npm run lint`
- `git diff --check`

Manual browser verification must confirm:

- development spike route renders the Living Room panorama,
- Living Room -> Hall hotspot works,
- Hall -> Bedroom hotspot works,
- reverse hotspot navigation works,
- external room menu reaches all three scenes,
- active-scene text/state follows both menu and hotspot navigation,
- minimap active marker follows the current scene,
- minimap controls can change scenes,
- panorama drag/look interaction works,
- narrow/mobile layout is usable,
- viewer unmount/remount does not create duplicate viewer artifacts or console errors,
- production preview does not expose a usable panorama-spike route,
- no existing application route regresses,
- browser console has no new runtime errors.

## Explicitly forbidden in IMP-013

Do not:

- implement the formal panorama adapter,
- implement final Virtual Tour UI,
- implement first-use help,
- add the real apartment floor plan,
- add real Nail Karataş panorama images,
- add final hotspot styling,
- add tour analytics,
- add a backend,
- add Redux / Zustand / MobX,
- add a second panorama engine unless the task is explicitly revised,
- alter locked baseline documents,
- begin IMP-014.

## Acceptance criteria

IMP-013 passes only if:

- Pannellum renders the supplied local equirectangular panoramas,
- all three development scenes are usable,
- scene hotspots work in both required directions,
- external navigation works,
- active-scene React state stays synchronized with engine scene changes,
- minimap proof stays synchronized and can drive scene navigation,
- mobile/narrow layout is usable,
- lifecycle cleanup is verified,
- production build does not expose the dev spike route,
- local assets are used,
- README records `SPIKE RESULT: PASS`,
- any new dependency is limited to what the Pannellum spike requires,
- `npm run validate:data` passes,
- `npm run build` passes,
- `npm run lint` passes,
- `git diff --check` passes,
- baseline documents remain unchanged.

If any core requirement cannot be met reliably, record `SPIKE RESULT: FAIL` and explain the blocking limitation. Do not begin IMP-014.

## Completion report

Return the report in Turkish:

1. Özet.
2. Oluşturulan / değiştirilen dosyalar.
3. Kullanılan Pannellum paket/sürüm ve entegrasyon yöntemi.
4. Development-only route izolasyonu.
5. Üç sahneli tour graph yapısı.
6. Hotspot navigation sonucu.
7. External room-menu ve active-scene senkronizasyonu.
8. Minimap/floor-plan proof senkronizasyonu.
9. React lifecycle / destroy / event-cleanup sonucu.
10. Desktop ve mobile tarayıcı doğrulaması.
11. Production-build izolasyonu.
12. Bilinen Pannellum sınırlamaları / entegrasyon notları.
13. `SPIKE RESULT: PASS` veya `SPIKE RESULT: FAIL`.
14. Çalıştırılan komutlar.
15. `validate:data`, build, lint ve `git diff --check` sonuçları.
16. Eklenen bağımlılık listesi.
17. Uyarılar / çözülmemiş konu / mimari çelişki.
18. IMP-014'e başlama.
