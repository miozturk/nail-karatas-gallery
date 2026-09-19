# IMP-017 — Project Video

Status: **READY**

## Objective

Replace the existing `/video` placeholder with a functional project-video experience.

This task proves:

- local HTML5 project-video playback,
- responsive 16:9 presentation,
- direct route usability,
- browser history coherence,
- accessible playback controls,
- clean loading / failure behavior,
- separation between DEVELOPMENT-ONLY media and future production media.

This is functional UI only. Do not perform final visual design.

## Required reading

Follow `AGENTS.md` and read all baseline documents before starting.

Relevant locked decisions:

- `Video` is part of the initial demo's global navigation.
- `/video` already exists as a top-level route.
- Production media is not yet being integrated.
- Static deployment must remain possible.
- Final UI polish is later work.

## Approved development asset

This preparation package includes:

`public/media/video/dev/project-video-proof.mp4`

It is a local **DEVELOPMENT-ONLY** silent 16:9 proof clip.

Rules:

- It is not Nail Karataş production media.
- It exists only to prove the Project Video feature.
- Do not rename or present it as final project content.
- Do not add real Nail Karataş promotional video in this task.

## Required work

### 1. Replace the Video placeholder

Update the existing Video feature so that `/video` renders a real project-video page.

Use the supplied local development clip.

The page must include at minimum:

- a clear page heading,
- a short DEVELOPMENT-ONLY notice,
- a responsive video player,
- a visible way to return to Home.

Do not redesign global navigation.

### 2. Video configuration separation

Keep the development media source isolated in a small configuration module under the Video feature.

Example:

`src/features/video/developmentMedia.ts`

Requirements:

- do not scatter literal file paths,
- clearly label the source DEVELOPMENT-ONLY,
- do not write temporary media paths into domain seed data.

A single-source configuration is sufficient.

### 3. HTML5 player behavior

Use the native HTML5 `<video>` element.

Required:

- `controls`,
- `playsInline`,
- no autoplay,
- no forced looping,
- preload should be conservative (`metadata` is preferred),
- preserve aspect ratio,
- no distorted stretching.

Do not add a third-party video-player dependency.

### 4. Loading / ready state

Provide a small neutral status area that distinguishes at least:

- player/media loading,
- ready/playable,
- playback/media error.

The user must never be left with a blank unexplained area if media fails.

Do not add retry orchestration.

### 5. Error behavior

If the development video fails to load:

- show a visible neutral error message,
- keep navigation usable,
- do not crash the app,
- do not retry infinitely.

### 6. Responsive behavior

The video must remain usable at:

- wide desktop,
- approximately 390px width,
- approximately 320px width.

Requirements:

- 16:9 content is contained without distortion,
- no horizontal page overflow,
- native controls remain reachable,
- heading / notice / Home action remain readable.

Do not implement final branded responsive styling.

### 7. Accessibility

At minimum:

- the page has a meaningful heading,
- the video has an accessible label/title or nearby semantic description,
- native controls remain enabled,
- loading/error status is exposed accessibly,
- Home return control is keyboard reachable,
- visible keyboard focus remains clear.

Do not build custom playback controls in IMP-017.

### 8. Browser history / navigation

Verify:

- direct load of `/video` works,
- Home -> Video works from global navigation,
- Browser Back returns coherently,
- explicit Home return navigates to `/`,
- no special transition video is played when leaving `/video`.

Do not hijack browser Back.

### 9. Lifecycle

When navigating away from `/video`:

- playback must stop because the player unmounts,
- no background audio/video activity remains,
- returning to `/video` creates a clean player instance.

Do not persist playback position in IMP-017.

### 10. Production isolation

The development proof clip must remain clearly separated from future production media.

Do not:

- overwrite transition assets,
- reuse a transition clip as if it were the project film,
- add real Nail Karataş media,
- introduce a media backend or streaming service.

### 11. Regression safety

Existing functionality must remain intact:

- Masterplan forward transition,
- Block reverse transition,
- Unit hotspots,
- Quick Card,
- Details drawer,
- Virtual Tour,
- Tour first-use help,
- Hotspot Editor,
- panorama spike,
- route validation.

### 12. Validation

Required checks:

- `npm run validate:data`
- `npm run build`
- `npm run lint`
- `git diff --check`

Run existing adapter / tour-help tests if they are part of the repository's validation workflow.

Manual browser verification must confirm:

- `/video` loads the local proof clip,
- autoplay does not start,
- native controls are visible,
- play / pause works,
- seek works,
- fullscreen control is available if provided by the browser,
- ready/loading status behaves coherently,
- forced media error shows a neutral error state without crashing,
- explicit Home return works,
- Browser Back works,
- leaving the route stops/removes the player,
- 1280px, 390px, and 320px layouts have no horizontal overflow,
- production preview can render `/video`,
- no existing route regresses,
- browser console has no new runtime errors.

## Explicitly forbidden in IMP-017

Do not:

- add real Nail Karataş promotional video,
- implement custom video controls,
- add autoplay,
- add a third-party video player,
- implement final visual design,
- implement Availability UI,
- implement Brochure / Location / Contact,
- add analytics,
- add backend persistence,
- add Redux / Zustand / MobX,
- alter locked baseline documents,
- begin IMP-018.

## Acceptance criteria

IMP-017 passes only if:

- `/video` is a functional project-video page rather than a placeholder,
- the local DEVELOPMENT-ONLY proof clip plays through native HTML5 controls,
- autoplay is disabled,
- the player is responsive and preserves aspect ratio,
- loading / ready / failure states are visible and safe,
- direct route / Home / Browser Back behavior is coherent,
- leaving the route cleans up playback,
- no custom player dependency is added,
- development media is isolated from production/domain data,
- no real production media is introduced,
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
3. DEVELOPMENT-ONLY video media/config yaklaşımı.
4. HTML5 video player davranışı.
5. Loading / ready / error state yaklaşımı.
6. Home / Browser Back davranışı.
7. Lifecycle / playback cleanup sonucu.
8. Responsive doğrulama.
9. Accessibility doğrulaması.
10. Production-preview doğrulaması.
11. Regression tarayıcı kontrolleri.
12. Çalıştırılan komutlar.
13. `validate:data`, build, lint ve `git diff --check` sonuçları.
14. Eklenen bağımlılık varsa listesi.
15. Uyarılar / çözülmemiş konu / mimari çelişki.
16. IMP-018'e başlama.
