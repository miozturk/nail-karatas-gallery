# IMP-015 — Virtual Tour UI

Status: **READY**

## Objective

Wire the real Unit Tour route into the engine-neutral panorama layer created in IMP-014.

A route such as:

`/block/b/unit/B-301/tour`

must render a functional development-quality Virtual Tour experience using the existing PanoramaAdapter contract.

The experience must prove the core Nail Karataş tour behavior:

- panorama viewer,
- room navigation menu,
- scene-to-scene hotspots,
- active-scene synchronization,
- floor-plan/minimap proof,
- collapsible minimap,
- visible return-to-Unit control,
- browser Back coherence.

This task is functional UI, not final visual design.

Do not implement first-use instructions yet. That belongs to IMP-016.

## Required reading

Follow `AGENTS.md` and read all baseline documents before starting.

Also read:

- `src/panorama/README.md`
- `src/features/devtools/panorama-spike/README.md`

Relevant locked decisions:

- `/block/:blockId/unit/:unitId/tour` is the Unit tour route.
- Panorama is full responsive viewport content and is not constrained to the exterior 4:3 SceneStage.
- Panorama navigation supports both visual hotspots and an external room/menu control.
- A floor-plan/minimap appears at lower right.
- The active panorama viewpoint is visibly distinguished.
- The minimap can be collapsed.
- A visible `Daireye Dön` control is required.
- Browser Back must remain coherent.
- First-use help is IMP-016.
- Real interior design / production panorama media is not yet available.

## Development media policy

Reuse the existing DEVELOPMENT-ONLY local panoramas created for IMP-013:

- `/media/panoramas/dev/living-room.jpg`
- `/media/panoramas/dev/hall.jpg`
- `/media/panoramas/dev/bedroom.jpg`

They are temporary proof assets only.

Do not add real Nail Karataş panorama media in IMP-015.

## Required work

### 1. Production Tour route integration

Replace the existing Tour placeholder behavior so that valid Unit tour routes use the Virtual Tour UI.

At minimum:

- resolve Block,
- resolve Unit,
- verify Unit belongs to Block,
- resolve UnitType,
- resolve a development Tour definition for the Unit / UnitType,
- render NotFound for invalid Block / Unit relationships.

Do not bypass existing route validation.

### 2. DEVELOPMENT-ONLY Tour assignment

Create an isolated development Tour mapping under the tour feature or another clearly appropriate development-data location.

Requirements:

- use real Unit or UnitType IDs as mapping keys,
- do not write temporary tour data into production Unit records,
- clearly label the mapping DEVELOPMENT-ONLY,
- reuse the same three panorama scenes where appropriate,
- keep all scene IDs stable and engine-neutral.

Prefer reusing a Tour definition by UnitType where multiple Units share the same architectural type.

Do not duplicate identical tour scene graphs per Unit unless there is a clear reason.

### 3. Tour availability

Respect the existing factual model where available.

If a valid Unit has no development tour assignment:

- render a clear neutral `Sanal tur henüz mevcut değil` state,
- keep a visible `Daireye Dön` control,
- do not invent a production tour.

Do not turn a valid Unit route into NotFound merely because temporary tour media is absent.

### 4. Panorama adapter usage

Tour UI must use the engine-neutral panorama layer from `src/panorama/`.

Feature/UI code must not:

- import `pannellum`,
- call `pannellum.viewer`,
- use Pannellum event names,
- use Pannellum viewer objects.

If needed, add a small factory/composition helper inside `src/panorama/` so the feature can request a `PanoramaAdapter` without knowing the concrete engine class.

Do not add another panorama dependency.

### 5. Viewer lifecycle

The Tour UI must:

- mount one adapter instance,
- load the resolved Tour,
- subscribe to active-scene changes,
- cleanly unsubscribe and destroy on unmount,
- not duplicate viewers on normal React re-render,
- correctly handle direct navigation between Tour routes.

No viewer should continue running after leaving the Tour route.

### 6. External room navigation

Provide an external room/menu control outside the panorama viewport.

For the three development scenes, use user-facing labels:

- Salon
- Hol
- Yatak Odası

Requirements:

- all scenes are reachable directly,
- current room is visibly active,
- clicking / activating a room calls the adapter's scene navigation,
- hotspot-driven scene changes update the active room control.

Use neutral development styling only.

### 7. Scene hotspot navigation

The development tour must preserve scene-to-scene hotspot navigation:

- Salon -> Hol
- Hol -> Salon
- Hol -> Yatak Odası
- Yatak Odası -> Hol

Hotspot navigation must update:

- adapter active scene,
- React active-scene state,
- room menu,
- minimap active marker.

### 8. Minimap / floor-plan proof

Add a simple DEVELOPMENT-ONLY minimap / floor-plan overlay.

Requirements:

- lower-right placement on desktop where practical,
- clearly labeled as DEVELOPMENT-ONLY,
- three viewpoint markers / controls,
- active viewpoint visibly distinguished,
- clicking a viewpoint changes panorama scene,
- hotspot / room-menu navigation updates active viewpoint,
- minimap can be collapsed and expanded,
- collapse state is local UI state.

Do not add a real architectural plan.

Do not persist minimap collapsed state across sessions in IMP-015.

### 9. Return-to-Unit behavior

Provide a visible control labeled:

`Daireye Dön`

It must navigate to:

`/block/:blockId/unit/:unitId`

Requirements:

- no Block -> Home reverse transition is played,
- leaving the Tour destroys the panorama viewer,
- selected Unit Quick Card route is restored.

Browser Back from Tour must also behave coherently according to browser history.

### 10. Global navigation / shell behavior

Do not let the existing global Home control bypass context in a confusing way.

Review current AppShell matching for:

- Block
- Unit
- Details
- Tour

If needed, extend the existing contextual-Home suppression so the Tour route does not expose an unintended direct Home bypass while the tour is active.

Do not redesign global navigation.

### 11. Loading and failure state

Provide small neutral states for:

- viewer initializing,
- tour unavailable,
- adapter / media error.

A failure must not strand the user.

`Daireye Dön` must remain available when practical.

Do not build retry orchestration or production error screens yet.

### 12. Accessibility

At minimum:

- `Daireye Dön` is keyboard reachable,
- room menu controls are keyboard reachable,
- minimap toggle is keyboard reachable,
- minimap scene controls are keyboard reachable,
- active room / viewpoint has a programmatically understandable selected/current state,
- loading / error status is exposed accessibly,
- panorama container has an appropriate accessible label.

Do not implement the IMP-016 first-use help overlay.

### 13. Responsive behavior

Verify desktop and narrow/mobile-size layouts.

Requirements:

- panorama remains usable,
- room menu remains reachable,
- minimap remains usable and collapsible,
- `Daireye Dön` remains visible,
- no horizontal page overflow,
- panorama is not forced into the exterior 4:3 SceneStage ratio.

Do not perform final visual polish.

### 14. Development-only data separation

Temporary tour data must remain isolated.

Do not:

- write temporary media paths into Unit domain seed records,
- write development tour data into Availability data,
- treat the three synthetic panoramas as production content.

### 15. Regression safety

Existing functionality must remain intact:

- Masterplan forward transition,
- Block reverse transition,
- Unit hotspots,
- Quick Card,
- Details drawer,
- Hotspot Editor,
- Panorama spike,
- route validation.

### 16. Validation

Required checks:

- `npm run validate:data`
- `npm run build`
- `npm run lint`
- `git diff --check`

Also verify source boundaries so Tour feature code has no direct Pannellum API dependency.

Manual browser verification must confirm at least:

#### Residential tour example
Use an approved demo Unit that has 360-tour availability in the seed inventory, for example B-301 if its resolved UnitType is tour-enabled.

Verify:

- direct Tour route loads the development panorama,
- Salon is initially active,
- Salon -> Hol hotspot works,
- Hol -> Yatak Odası hotspot works,
- reverse hotspot navigation works,
- room menu can reach all three scenes,
- active room follows hotspot navigation,
- minimap active viewpoint follows room/hotspot navigation,
- minimap controls drive scene navigation,
- minimap collapse / expand works,
- `Daireye Dön` returns to the Unit Quick Card route,
- Browser Back behaves coherently,
- viewer is destroyed after leaving the route.

#### No-tour example
Use a valid Unit / UnitType without development tour availability.

Verify:

- route remains a valid Unit context,
- neutral unavailable state appears,
- `Daireye Dön` works,
- no fake tour is created.

Also verify:

- invalid Block / Unit combinations remain NotFound,
- 1280px and 390px layouts have no horizontal overflow,
- no existing route regresses,
- browser console has no new runtime errors.

## Explicitly forbidden in IMP-015

Do not:

- implement first-use tour instructions,
- store first-use state in localStorage,
- add real Nail Karataş panoramas,
- add real floor plans,
- implement final visual design,
- implement Availability UI,
- add lead forms,
- add tour analytics,
- add a second panorama engine,
- add Redux / Zustand / MobX,
- add backend persistence,
- alter locked baseline documents,
- begin IMP-016.

## Acceptance criteria

IMP-015 passes only if:

- valid Unit Tour routes render a Virtual Tour UI over real Unit context,
- development Tour data is isolated from production Unit seed data,
- Tour feature code uses the panorama adapter boundary,
- room menu and scene hotspots both drive navigation,
- active scene stays synchronized across panorama / menu / minimap,
- minimap is collapsible,
- `Daireye Dön` restores the correct Unit Quick Card route,
- viewer lifecycle cleanup is verified,
- valid Units without a tour receive a neutral unavailable state rather than fabricated content,
- responsive behavior is usable,
- no first-use help is implemented yet,
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
3. Tour route / Unit context çözümleme yaklaşımı.
4. DEVELOPMENT-ONLY Tour assignment yaklaşımı.
5. Tour availability / unavailable-state davranışı.
6. PanoramaAdapter kullanım sınırı.
7. Viewer lifecycle yaklaşımı.
8. Room menu / hotspot / active-scene senkronizasyonu.
9. Minimap / collapse davranışı.
10. `Daireye Dön` ve Browser Back davranışı.
11. Loading / error davranışı.
12. Responsive / accessibility doğrulaması.
13. No-tour Unit doğrulaması.
14. Regression tarayıcı kontrolleri.
15. Source-boundary kontrolü.
16. Çalıştırılan komutlar.
17. `validate:data`, build, lint ve `git diff --check` sonuçları.
18. Eklenen bağımlılık varsa listesi.
19. Uyarılar / çözülmemiş konu / mimari çelişki.
20. IMP-016'ya başlama.
