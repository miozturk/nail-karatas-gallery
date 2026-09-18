# IMP-008 — Block Scenes and Home Return

Status: **READY**

## Objective

Implement reusable A / B / C Block scene behavior and the application-level Home return flow using the existing SceneStage and TransitionLayer infrastructure.

This task proves:

- data-driven Block scene rendering,
- block-route validation remains intact,
- visible Home return control,
- reverse transition playback before returning to `/`,
- interaction locking during the reverse transition,
- safe reduced-motion / failure fallback.

Do not implement Unit hotspots or Unit selection yet.

## Required reading

Follow `AGENTS.md` and read all baseline documents before starting.

Relevant locked decisions:

- Block routes are `/block/a`, `/block/b`, `/block/c`.
- A block is commercial; B and C are residential.
- Block views use the same 1920 x 1440 SceneStage infrastructure.
- Returning from a Block to Home uses a separately encoded reverse transition.
- Browser Back must remain coherent, but the user must have an in-app Home control.
- Unit selection belongs to IMP-009, not this task.

## Approved development asset

This preparation package includes:

`public/media/transitions/dev-reverse-transition-proof.mp4`

It is DEVELOPMENT-ONLY.

Rules:

- It is not Nail Karataş production media.
- It exists only to prove reverse transition behavior.
- Do not present it as production content.
- Do not import real Nail Karataş block renders or reverse videos in this task.

The existing IMP-007 forward proof asset may remain in place.

## Required work

### 1. Block feature composition

Refactor / extend the Block feature under:

`src/features/blocks/`

Create a reusable data-driven Block scene view for A, B and C.

It must:

- read `blockId` from the route,
- resolve the approved Block seed record,
- render the corresponding Block identity,
- use `SceneStage`,
- use only neutral / development placeholder visual content,
- expose a visible application-level Home control.

Do not duplicate three separate page implementations if one data-driven composition is sufficient.

### 2. Block scene placeholder visual

Use a neutral development visual that clearly identifies the current Block (A / B / C) without pretending to be production imagery.

Acceptable examples:

- CSS-generated neutral background,
- development-only label inside the SceneStage,
- simple geometric proof content.

Do not add real project renders yet.

### 3. Home return flow

When the user activates the in-app Home control from a Block route:

1. start the reverse transition overlay,
2. lock the Home control / relevant interaction,
3. play `dev-reverse-transition-proof.mp4`,
4. navigate to `/` only after successful playback completion.

The Block feature owns route navigation; `TransitionLayer` must remain generic.

### 4. Failure fallback

If reverse playback fails or times out:

- clear the lock,
- navigate safely to `/`,
- do not leave background playback running.

No retry UI is required.

### 5. Reduced motion

If `prefers-reduced-motion` is active:

- skip reverse video playback,
- navigate directly to `/`,
- do not leave interaction locked.

Reuse the existing IMP-007 approach where practical rather than duplicating incompatible behavior.

### 6. Duplicate request protection

While the reverse transition is active:

- repeated Home activation must not start another transition,
- no stacked media playback may occur,
- visible development state should make the locked condition inspectable.

### 7. Browser Back behavior

Do not override or hijack browser Back.

Verify:

- Masterplan -> Block through the IMP-007 forward transition,
- browser Back from Block returns to Home coherently,
- in-app Home uses the reverse transition,
- the two mechanisms remain distinct.

Do not attempt to force reverse video playback when the browser's own Back command is used in IMP-008.

### 8. Data use

Use the existing Block seed data.

Do not add Unit hotspot data or create new Unit selection behavior.

A, B, C must remain data-driven and valid through the existing route rules.

### 9. Development media configuration

Keep reverse transition media configuration isolated and clearly marked DEVELOPMENT-ONLY.

Do not scatter literal transition paths through multiple components.

A small Block development media configuration module is acceptable.

Do not create a final production media manifest yet unless a minimal reusable mapping naturally fits the current architecture.

### 10. Responsive behavior

The Block SceneStage must preserve the existing 4:3 behavior on wide and narrow viewports.

The Home control must remain usable on both desktop and narrow mobile-sized layouts.

Do not introduce production mobile design yet.

### 11. Validation

Required checks:

- `npm run validate:data`
- `npm run build`
- `npm run lint`
- `git diff --check`

Manual browser verification must confirm for A, B and C:

- direct Block route renders the correct Block identity,
- Home control is visible and keyboard reachable,
- Home activation starts reverse proof video before navigation,
- navigation to `/` occurs only after normal completion,
- repeated Home activation during playback does not start a second transition,
- reduced-motion path returns Home without playback,
- playback failure / timeout returns Home and clears lock,
- component unmount does not leave playback active,
- browser Back from Block works without being hijacked,
- Masterplan forward transition still works,
- wide and narrow viewports preserve SceneStage geometry,
- invalid Block route behavior from IMP-003 remains correct,
- browser console has no new runtime errors.

## Explicitly forbidden in IMP-008

Do not:

- add real Nail Karataş block renders,
- add real forward or reverse project transition videos,
- implement Unit hotspot polygons,
- implement Unit hover / selection,
- implement Unit Quick Card UI,
- implement Unit Details behavior,
- implement the hotspot editor,
- add Pannellum or another panorama engine,
- implement Availability UI,
- add Redux / Zustand / MobX,
- add a backend,
- alter locked baseline documents,
- begin IMP-009.

## Acceptance criteria

IMP-008 passes only if:

- one reusable data-driven Block scene implementation supports A, B and C,
- each valid Block route shows the correct Block identity,
- SceneStage is used,
- an in-app Home control exists,
- Home uses the reverse proof transition before navigating to `/`,
- duplicate Home activation is locked during playback,
- failure / timeout has a safe Home fallback,
- reduced motion bypasses playback cleanly,
- browser Back remains coherent and is not hijacked,
- forward Masterplan transition behavior remains intact,
- no Unit selection feature has been implemented,
- no real production project media is introduced,
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
3. Block scene component yapısı.
4. A/B/C veri bağlama yaklaşımı.
5. Home reverse-transition akışı.
6. Normal / failure / reduced-motion akışları.
7. Browser Back ile uygulama Home davranışının ayrımı.
8. Responsive tarayıcı doğrulama sonuçları.
9. Çalıştırılan komutlar.
10. `validate:data`, build, lint ve `git diff --check` sonuçları.
11. Eklenen bağımlılık varsa listesi.
12. Uyarılar / çözülmemiş konu / mimari çelişki.
13. IMP-009'a başlama.
