# IMP-016 — Virtual Tour First-Use Help

Status: **READY**

## Objective

Add the first-use instruction overlay to the functional Virtual Tour UI created in IMP-015.

The help must explain the essential tour interactions without blocking experienced users on every visit.

It must:
- appear automatically the first time a user opens an available Virtual Tour,
- explain look/drag, hotspot navigation, room menu, minimap, and `Daireye Dön`,
- be dismissible,
- remember dismissal in `localStorage`,
- remain accessible and responsive,
- never strand the user if storage is unavailable.

This task is only the first-use help behavior. Do not begin final visual polish.

## Required reading

Follow `AGENTS.md` and read all baseline documents before starting.

Also read:
- `src/features/tours/README.md`
- `src/panorama/README.md`

Relevant locked decisions:
- First-use instruction overlay belongs to IMP-016.
- Help state is stored in `localStorage`.
- The Virtual Tour must remain usable without the help after dismissal.
- Panorama scene/menu/minimap synchronization from IMP-015 must not regress.
- Final visual design is later work.

## Required work

### 1. First-use help state

Implement a small, isolated first-use state mechanism for the Virtual Tour.

Requirements:
- use `localStorage`,
- use a clear, versioned storage key such as `nail-karatas-tour-help-v1`,
- first visit with no stored dismissal -> help opens automatically,
- dismissing help persists the dismissed state,
- subsequent Tour visits in the same browser -> help stays closed,
- storage access failure must fall back safely without crashing the Tour.

Do not create a global state library.

### 2. Scope of remembered state

The first-use help is product-level, not per-Unit.

Dismiss once -> stay dismissed across different Unit tours for the same help version.

Do not create a separate storage key per Unit.

### 3. Help overlay / panel

Implement a neutral development-quality overlay or modal-like panel over the Tour UI.

It must clearly explain, in Turkish, at minimum:
- panorama view can be dragged to look around,
- in-panorama hotspots move between rooms,
- room menu can jump directly to another room,
- minimap viewpoint buttons can move between viewpoints,
- minimap can be collapsed/expanded,
- `Daireye Dön` returns to the selected Unit.

Keep copy concise.

Do not add marketing copy.

### 4. Dismiss behavior

Provide a clearly visible action such as `Turu Keşfet`.

On activation:
- close the help,
- persist dismissal,
- return interaction to the Tour.

A secondary close icon/button is optional, but if present it must perform the same persisted dismissal behavior.

### 5. Accessibility

The help overlay must:
- use appropriate dialog semantics,
- have an accessible name/title,
- expose concise instructional content,
- provide a keyboard-reachable dismiss action,
- show visible keyboard focus,
- prevent accidental interaction with underlying tour controls while open,
- restore focus to a sensible Tour control after dismissal where practical.

Use native dialog semantics or an equivalent accessible pattern.

Do not over-engineer a complex focus trap if a simple robust modal pattern is sufficient.

### 6. Interaction lock while help is open

While the help is visible:
- underlying panorama room controls must not activate,
- minimap controls must not activate,
- `Daireye Dön` must not accidentally trigger behind the overlay,
- panorama drag interaction should be effectively blocked by the overlay.

Closing the help restores normal Tour interaction.

### 7. Unavailable-tour behavior

For a valid Unit with no Tour assignment:
- do not show first-use Tour help,
- retain the existing `Sanal tur henüz mevcut değil` state,
- retain `Daireye Dön`.

Help is only for an actually available Virtual Tour.

### 8. Direct-route behavior

The help logic must work when a user directly loads a Tour URL.

Example:
`/block/b/unit/B-301/tour`

With empty storage:
- Tour loads,
- help appears automatically,
- dismissal persists.

Do not rely on arriving from Quick Card first.

### 9. Browser history

Opening / dismissing help must not add browser-history entries.

Browser Back / Forward must remain route-driven exactly as in IMP-015.

Do not encode help visibility into the URL.

### 10. Safe storage helper

Prefer a small reusable helper for storage read/write rather than scattered direct calls.

Requirements:
- tolerate `localStorage.getItem` / `setItem` throwing,
- no exception should break Tour rendering,
- document the fallback behavior.

No dependency is required.

### 11. Optional development reset

A visible production reset control is not required.

If useful for manual validation, document a browser-console command or DEV-only method to remove the storage key.

Do not add a normal user-facing reset button in IMP-016.

### 12. Responsive behavior

Verify the help overlay at:
- desktop width,
- approximately 390px width,
- approximately 320px width.

Requirements:
- no horizontal overflow,
- content remains readable,
- dismiss action remains reachable,
- underlying panorama layout does not jump.

Do not implement final visual polish.

### 13. Regression safety

The following IMP-015 behavior must remain intact after help is dismissed:
- room menu navigation,
- hotspot navigation,
- active-scene synchronization,
- minimap synchronization,
- minimap collapse / expand,
- `Daireye Dön`,
- Browser Back / Forward,
- viewer cleanup,
- available/unavailable Tour handling.

Other existing flows must also remain intact:
- Masterplan transition,
- Block reverse transition,
- Unit hotspots,
- Quick Card,
- Details drawer,
- Hotspot Editor,
- panorama spike,
- route validation.

### 14. Validation

Required checks:
- `npm run validate:data`
- `npm run build`
- `npm run lint`
- `git diff --check`

Run existing adapter tests if they are part of the repository's validation workflow.

Manual browser verification must confirm:

#### First visit
- clear the help storage key,
- open an available Unit Tour,
- help appears automatically,
- underlying Tour controls are not interactive,
- dismiss action closes help,
- dismissal state is stored.

#### Subsequent visit
- leave Tour and reopen any available Unit Tour,
- help does not appear again.

#### Cross-Unit behavior
- dismiss on one available Unit,
- open another available Unit,
- help stays dismissed.

#### Storage failure
- simulate or otherwise verify guarded storage behavior,
- Tour still renders and remains usable,
- no uncaught exception occurs.

#### Unavailable Tour
- valid Unit with no Tour assignment does not show help,
- unavailable state remains correct.

Also verify:
- 1280px, 390px, and 320px layouts,
- room/menu/minimap behavior after dismissal,
- Browser Back / Forward,
- `Daireye Dön`,
- no console errors,
- no regression in existing app routes.

## Explicitly forbidden in IMP-016

Do not:
- implement final visual design,
- add animation-heavy onboarding,
- add multi-step tutorial pagination unless strictly necessary,
- add real Nail Karataş panorama media,
- add real floor plans,
- implement Availability UI,
- add analytics,
- add lead forms,
- add backend persistence,
- add Redux / Zustand / MobX,
- alter locked baseline documents,
- begin IMP-017.

## Acceptance criteria

IMP-016 passes only if:
- first available Tour visit shows help automatically,
- dismissal persists via a versioned product-level localStorage key,
- subsequent available Tour visits stay dismissed,
- different Units share the same dismissal state,
- storage failure cannot crash the Tour,
- help does not appear for unavailable Tours,
- underlying Tour controls are blocked while help is open,
- dismissing help restores normal Tour interaction,
- Browser history is not modified by help visibility,
- responsive behavior is usable at desktop / 390px / 320px,
- no new dependency is added,
- IMP-015 behavior remains intact after dismissal,
- `npm run validate:data` passes,
- `npm run build` passes,
- `npm run lint` passes,
- `git diff --check` passes,
- baseline documents remain unchanged.

## Completion report

Return the report in Turkish:

1. Özet.
2. Oluşturulan / değiştirilen dosyalar.
3. Storage key ve localStorage yaklaşımı.
4. İlk ziyaret / sonraki ziyaret davranışı.
5. Cross-Unit dismissal davranışı.
6. Storage failure fallback davranışı.
7. Help overlay içeriği ve dismiss akışı.
8. Accessibility / interaction-lock yaklaşımı.
9. Unavailable Tour davranışı.
10. Browser history doğrulaması.
11. Responsive doğrulama.
12. IMP-015 regression doğrulaması.
13. Diğer app regression kontrolleri.
14. Çalıştırılan komutlar.
15. `validate:data`, build, lint ve `git diff --check` sonuçları.
16. Eklenen bağımlılık varsa listesi.
17. Uyarılar / çözülmemiş konu / mimari çelişki.
18. IMP-017'ye başlama.
