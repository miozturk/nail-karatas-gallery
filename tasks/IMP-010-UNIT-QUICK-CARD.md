# IMP-010 — Unit Quick Card

Status: **READY**

## Objective

Implement the Unit Quick Card interaction on top of the existing Block scene.

A Unit route such as `/block/b/unit/B-301` must render the same Block scene context with the selected Unit visibly active and a compact Unit Quick Card over the scene.

The Quick Card is not a full Unit Details page.

It must provide:
- a compact development plan preview area
- short factual Unit information from the approved seed data
- `Sanal Tur` action
- `Detayları Gör` action
- close / return-to-Block behavior

Do not implement the full Details drawer in this task. Do not implement the panorama experience.

## Required reading

Follow `AGENTS.md` and read all baseline documents before starting.

Relevant locked decisions:
- Unit selection opens a Quick Card over the same Block scene.
- Unit route is `/block/:blockId/unit/:unitId`.
- `Detayları Gör` uses `/block/:blockId/unit/:unitId/details`.
- `Sanal Tur` uses `/block/:blockId/unit/:unitId/tour`.
- Full Details behavior belongs to IMP-011.
- Panorama UI belongs to later tasks.
- One approved data source must drive façade selection, Quick Card, Details, and future Availability.

## Required work

### 1. Preserve Block scene context on Unit routes

Refactor only as much as necessary so that:
- `/block/:blockId` renders the Block scene
- `/block/:blockId/unit/:unitId` renders the same Block scene
- the Unit route additionally opens the Quick Card
- the selected Unit hotspot remains visibly active while the Quick Card is open

Avoid duplicating the whole Block scene implementation between BlockPage and UnitPage.

A small shared Block scene composition component is acceptable if it makes the behavior clear.

### 2. Route validation

On a Unit route:
- resolve the Block from approved Block seed data
- resolve the Unit from approved Unit seed data
- verify the Unit belongs to the route Block
- resolve the UnitType referenced by the Unit

If any required record is invalid or mismatched, render the existing NotFound behavior.

Do not invent fallback production data.

### 3. Unit Quick Card component

Implement a reusable feature component under an appropriate Unit feature location, for example:

`src/features/units/UnitQuickCard.tsx`

It should be a compact overlay/panel, not a full page.

At minimum show approved factual data already present in the seed model where available, such as:
- Unit ID
- official independent-section number
- floor
- UnitType name / label
- UnitType category / room label if present
- net area if present

Do not display made-up values.

### 4. Development plan preview

The Quick Card must contain a small plan-preview region.

Because real plan media is not yet integrated:
- use a clearly labeled DEVELOPMENT-ONLY placeholder
- do not create a fake architectural plan that could be mistaken for production content
- do not add real Nail Karataş plan images in IMP-010

The placeholder can be a neutral box / geometric proof with text such as `Plan önizleme alanı`.

### 5. Quick Card actions

Provide exactly these primary actions:
- `Sanal Tur`
- `Detayları Gör`

Behavior:

`Sanal Tur`
-> navigate to `/block/:blockId/unit/:unitId/tour`

`Detayları Gör`
-> navigate to `/block/:blockId/unit/:unitId/details`

Do not implement the destination UIs beyond their existing placeholder behavior in this task.

### 6. Close behavior

Provide a clearly visible close / return control.

Closing the Quick Card must navigate to `/block/:blockId` without playing the Block -> Home reverse transition.

This is a Unit-context close operation, not a Home operation.

Browser Back from the Unit route must also return coherently to the Block route.

### 7. Selected Unit state

While the Quick Card is open:
- the corresponding Unit polygon must remain visibly active
- other demo Unit hotspots may still be hoverable unless this creates an interaction conflict
- activating another Unit hotspot should navigate to that Unit route and update the Quick Card to the newly selected Unit without leaving the Block context

Do not add global state.

The route is the durable selected-Unit state.

### 8. Home behavior regression

The in-app Home control from IMP-008 must continue to work on both:
- `/block/:blockId`
- `/block/:blockId/unit/:unitId`

If Home is activated while the Quick Card is open:
- use the same reverse transition behavior
- after completion navigate to `/`
- prevent competing Unit activation during transition

Do not create a second reverse-transition implementation.

### 9. Accessibility

Quick Card requirements:
- use an appropriate labeled region / dialog-like semantic structure without overusing ARIA
- close control is keyboard reachable
- `Sanal Tur` and `Detayları Gör` are keyboard reachable
- visible focus styles remain clear
- selected Unit association is understandable from accessible text

Do not add focus-trap complexity in IMP-010 unless the existing architecture naturally requires it.

### 10. Responsive behavior

On narrow screens:
- Quick Card must remain readable
- it must not force horizontal page overflow
- SceneStage geometry must remain aligned underneath
- actions must remain reachable

Do not implement final visual design.

### 11. Styling

Use neutral development styling only.

Do not add:
- final branding
- sales-polished visual design
- animation flourishes
- real project images
- lead forms

### 12. Validation

Required checks:
- `npm run validate:data`
- `npm run build`
- `npm run lint`
- `git diff --check`

Manual browser verification must confirm at least:

#### A
- `/block/a/unit/A-003` shows A Block scene + A-003 Quick Card.
- A-003 polygon remains active.
- Close returns to `/block/a`.

#### B
- `/block/b/unit/B-301` shows B Block scene + B-301 Quick Card.
- activating B-302 while B-301 is open updates route/card to B-302.
- Browser Back returns coherently.

#### C
- `/block/c/unit/C-404` shows C Block scene + C-404 Quick Card.

For valid Unit routes verify:
- factual Unit / UnitType data is shown without invented values
- development plan placeholder is clearly labeled
- `Sanal Tur` routes to the existing Tour placeholder
- `Detayları Gör` routes to the existing Details placeholder
- close returns to the correct Block route
- Home reverse transition still works
- Unit activation is locked while Home reverse transition is active
- invalid block/unit combinations still render NotFound
- wide and narrow layouts do not introduce horizontal overflow
- browser console has no new runtime errors

## Explicitly forbidden in IMP-010

Do not:
- implement the full Unit Details drawer / page behavior
- implement panorama rendering
- add Pannellum or another panorama engine
- add real plan images
- add real Block renders
- add real Unit hotspot coordinates
- add real production transition videos
- implement Availability UI
- implement the hotspot editor
- add favorites
- add lead-capture forms
- add Redux / Zustand / MobX
- add a backend
- alter locked baseline documents
- begin IMP-011

## Acceptance criteria

IMP-010 passes only if:
- Unit routes preserve the Block scene underneath
- selected Unit is driven by the route
- selected Unit polygon remains visibly active
- Quick Card renders factual Unit + UnitType data from the existing seed model
- no production data is invented
- development plan placeholder is clearly marked
- `Sanal Tur` navigates to the correct Tour route
- `Detayları Gör` navigates to the correct Details route
- close returns to the correct Block route
- switching Unit hotspots updates route/card coherently
- Browser Back remains coherent
- Home reverse transition still works from Unit context
- no full Details or panorama implementation is introduced
- no new dependency is added
- `npm run validate:data` passes
- `npm run build` passes
- `npm run lint` passes
- `git diff --check` passes
- baseline documents remain unchanged

## Completion report

Return the report in Turkish:

1. Özet.
2. Oluşturulan / değiştirilen dosyalar.
3. Block ve Unit route'larının ortak sahne kullanım yaklaşımı.
4. Unit / UnitType veri çözümleme yaklaşımı.
5. Quick Card içeriği.
6. Selected Unit ve hotspot active-state davranışı.
7. Kapatma / Unit değiştirme / Browser Back davranışları.
8. `Sanal Tur` ve `Detayları Gör` route davranışları.
9. Home reverse-transition regression doğrulaması.
10. Responsive ve accessibility doğrulaması.
11. Çalıştırılan komutlar.
12. `validate:data`, build, lint ve `git diff --check` sonuçları.
13. Eklenen bağımlılık varsa listesi.
14. Uyarılar / çözülmemiş konu / mimari çelişki.
15. IMP-011'e başlama.
