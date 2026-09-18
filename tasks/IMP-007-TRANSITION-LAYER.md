# IMP-007 — Transition Layer

Status: **READY**

## Objective

Implement the reusable HTML5 transition-video layer and prove deterministic transition behavior from the Masterplan to Block routes.

This task establishes:

- video overlay playback,
- interaction locking during playback,
- completion/failure handling,
- navigation after transition completion.

Do not implement production transition media, reverse transitions, Block-scene unit selection, or production scene imagery yet.

## Required reading

Follow `AGENTS.md` and read all baseline documents before starting.

Relevant locked decisions:

- Exterior navigation uses pre-rendered HTML5 transition videos.
- Forward and reverse transitions are separate web assets.
- Negative `playbackRate` must not be used.
- Scene interaction must be locked while a transition is active.
- Masterplan activation eventually navigates to `/block/a`, `/block/b`, or `/block/c`.
- Reverse transitions belong to the later Block-scene work, not this task.

## Approved development asset

This preparation package includes:

`public/media/transitions/dev-transition-proof.mp4`

It is a **DEVELOPMENT-ONLY** 1-second 4:3 test clip.

Rules:

- It is not Nail Karataş production media.
- It may be reused for A/B/C during IMP-007 purely to prove the transition engine.
- Do not rename or present it as production content.
- Do not create or import real project transition videos in this task.

## Required work

### 1. Reusable TransitionLayer

Implement under:

`src/components/TransitionLayer/`

Create a reusable transition-video component.

At minimum it must support:

- video source,
- active/inactive state,
- muted playback,
- `playsInline`,
- predictable overlay stacking,
- completion callback,
- playback error/failure callback or equivalent fail-safe path,
- optional accessible label / description if needed.

The component must not own application routing.

Routing/navigation remains the responsibility of the feature using the component.

### 2. Playback behavior

When activated:

1. the transition video becomes visible above the base scene,
2. playback starts from the beginning,
3. interaction remains locked until the transition resolves,
4. `onEnded` signals successful completion,
5. the overlay becomes inactive after completion.

The implementation must not use negative playback rate.

Repeated activations while already active must not start parallel playback.

### 3. Playback failure behavior

Handle a rejected `video.play()` call or media playback failure safely.

The app must not remain permanently locked.

For the Masterplan proof, if playback cannot proceed:

- clear the transition lock,
- continue to the requested Block route through a documented fail-safe.

Do not add a retry UI in this task.

### 4. Masterplan integration

Update the Masterplan behavior from IMP-006.

Activation from either:

- SVG block hotspot, or
- matching A/B/C block control

must use the same transition request path.

For IMP-007 only:

- A, B and C may all use `dev-transition-proof.mp4`,
- activation must no longer navigate immediately,
- start the transition first,
- navigate to the requested `/block/:blockId` route only after the transition ends,
- if playback fails, navigate through the defined fail-safe.

### 5. Interaction lock

While a transition is active:

- block hotspots must not activate,
- block controls must not activate,
- a second transition request must not replace or stack on the current one,
- visible development UI should make the locked state inspectable.

Keep lock state local to the Masterplan feature unless a simpler reusable transition hook is clearly justified.

Do not add a global state library.

### 6. Overlay geometry

The TransitionLayer must occupy the same visible SceneStage region as the base scene.

For the development proof:

- video fills the SceneStage without distorting stage geometry,
- 4:3 proof clip aligns with the 4:3 stage,
- no page-level layout jump occurs when transition starts/ends.

Do not redesign SceneStage.

### 7. Reduced motion

Respect the user's `prefers-reduced-motion` setting in a simple, deterministic way.

For reduced motion:

- skip the development transition playback,
- navigate directly to the destination,
- do not leave the UI locked.

Do not add a settings UI.

### 8. Cleanup / lifecycle

Ensure video playback is safely reset when:

- a transition completes,
- a transition fails,
- the component unmounts.

No background playback should continue after navigation.

### 9. Styling

Use only neutral development styling.

Do not add final branding, loading animations, cinematic effects, or production fades.

### 10. Validation

Required checks:

- `npm run validate:data`
- `npm run build`
- `npm run lint`
- `git diff --check`

Manual browser verification must confirm:

- activating A hotspot starts the dev video before navigation,
- activating A control uses the same behavior,
- B and C behave equivalently,
- route changes only after normal video completion,
- transition lasts approximately the 1-second proof clip duration,
- a second click during playback does not trigger a second transition,
- controls/hotspots are visibly and functionally locked during playback,
- after completion interaction is not left locked,
- Browser Back from Block returns to Home,
- reduced-motion path navigates without playing the transition,
- playback failure path does not leave the app locked,
- wide and narrow viewports do not introduce layout jump/crop,
- existing invalid-route behavior still works,
- browser console has no new runtime errors.

## Explicitly forbidden in IMP-007

Do not:

- add real Nail Karataş transition videos,
- add the real masterplan render,
- implement reverse transition playback,
- implement Block-scene Home return behavior,
- implement Block-scene Unit selection,
- add real Unit hotspot polygons,
- implement Unit Quick Card UI,
- implement the hotspot editor,
- add Pannellum or another panorama engine,
- implement Availability UI,
- add Redux / Zustand / MobX,
- add a backend,
- alter locked baseline documents,
- begin IMP-008.

## Acceptance criteria

IMP-007 passes only if:

- reusable `TransitionLayer` exists,
- the proof video plays as a SceneStage overlay,
- Masterplan hotspot/control activation goes through one transition request path,
- route navigation occurs after successful playback completion,
- playback failure has a safe navigation fallback and clears the lock,
- duplicate activation during playback is prevented,
- reduced motion bypasses playback cleanly,
- no negative playback-rate logic exists,
- no real production transition media is introduced,
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
3. TransitionLayer API ve lifecycle yaklaşımı.
4. Masterplan transition request akışı.
5. Interaction-lock davranışı.
6. Normal playback / failure / reduced-motion akışları.
7. Tarayıcı doğrulama sonuçları.
8. Responsive / layout doğrulama sonuçları.
9. Çalıştırılan komutlar.
10. `validate:data`, build, lint ve `git diff --check` sonuçları.
11. Eklenen bağımlılık varsa listesi.
12. Uyarılar / çözülmemiş konu / mimari çelişki.
13. IMP-008'e başlama.
