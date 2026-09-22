# IMP-031 — Human-Assisted Demo Hardening & Transition Handoff

Status: READY — FINAL REVISED 2026-09-22

## 0. Task mode

This is a **human-assisted demo-hardening task** for the Friday 12:00 customer demo.

The work is deliberately split:

- **Codex owns:** diagnosis, implementation, automated/technical validation, staging/build checks, limited Chromium smoke testing and documentation.
- **User owns:** repeated human-eye transition testing after the fix, final responsive visual review and the final demo rehearsal.

The human baseline test has ALREADY been completed. Do not repeat it.

No new product feature.
No full-bleed redesign.
No glass UI.
No premium final shell.
No Nail Karataş host-site integration work.
Those belong only after the job is awarded.

---

# 1. Required reading

Follow `AGENTS.md` and all mandatory locked baseline documents.

Also read:

- `docs/IMP-026-COMPLETION-REPORT.md`
- `docs/IMP-027-COMPLETION-REPORT.md`
- `docs/IMP-028-COMPLETION-REPORT.md`
- `docs/IMP-029-COMPLETION-REPORT.md`
- `docs/IMP-030-COMPLETION-REPORT.md`
- current transition implementation
- current router/AppShell/SceneStage layout
- `docs/STAGING-QA-CHECKLIST.md`

Start by confirming the repository is at the clean IMP-030 checkpoint.

---

# 2. Known-good starting point

IMP-030 implementation commit:

`65e2f03 — IMP-030 Presentation Polish Real Video`

Expected starting working tree before IMP-031 prep files are committed:

clean `main`.

Known production media:

- four exterior WebP scenes
- six H.264 transition MP4s
- five 1:1 plan PNGs
- final project video at `public/media/video/project/video-animation.mp4`
- current Tour demo/sample panoramas

Final project video contract:

- H.264 High
- yuv420p
- 1280×720
- 30 fps
- TV range
- BT.709 color space / primaries
- SHA-256: `7AE7FBDD4DDA2071D9C04CAD5B634D48CDD88A31656B98F7339CF24092245469`
- user manually verified correct colors in Chrome

Do not modify any production media in IMP-031.

---

# 3. HUMAN BASELINE — ALREADY COMPLETED

Do **not** spend quota repeating this baseline.

The user tested current transition behavior manually in Chrome before IMP-031 implementation.

## Navigation-button baseline

Using the bottom scene-navigation controls (`A Blok`, `B Blok`, `C Blok`, `Genel Görünüme Dön`), five round-trip cycles were tested for each block:

| Round-trip | Cycles where at least one flash/glitch was seen |
| --- | ---: |
| Home ↔ A | 4 / 5 |
| Home ↔ B | 3 / 5 |
| Home ↔ C | 2 / 5 |

These values describe the round-trip cycle as a whole. They do not claim the defect belongs only to the forward or reverse direction.

## Additional hotspot/polygon baseline

The user then performed an additional set of 10 tests using the in-scene block polygons/hotspots instead of the bottom navigation controls.

Result:

- similar random flash behavior
- not specific to navigation buttons
- not specific to polygon/hotspot activation
- not specific to one block
- not specific to one direction

## Important visual observation

The flash can appear:

- sometimes near transition **start**
- sometimes near transition **end**

Therefore, do not assume this is only an end-of-video teardown problem.

Treat the whole transition visual lifecycle as suspect:

1. transition layer creation / first visible frame
2. video playback
3. navigation / route commit
4. destination scene readiness / paint
5. transition layer release / teardown

Use the human baseline above as the official Phase-A evidence.

---

# 4. Primary objective — transition flash/compositor glitch

The remaining presentation-critical issue is a non-deterministic flash/glitch around exterior transitions.

Known history from earlier IMPs:

- SceneStage route geometry is stable.
- Destination WebP readiness already uses `Image.decode()`.
- Successful transition no longer rewinds the video to `currentTime = 0` before handoff.
- Transition media itself has already been normalized to browser-safe H.264.
- Flash remains random.
- It occurs on different blocks and in both round-trip directions.
- Human baseline shows it can appear at transition start or end.

This strongly suggests a visual lifecycle / paint / compositor / overlay handoff problem rather than a hotspot-coordinate or media-encoding issue.

---

# 5. Preferred engineering direction

Investigate the complete transition lifecycle before changing code.

Preferred architectural direction, if confirmed by code inspection:

- the transition presentation layer should be persistent enough that route changes cannot expose an unintended intermediate frame
- the first transition frame must not reveal a blank/source/destination pop before the video is actually ready to present
- transition video remains visually above route content through the navigation handoff
- destination route/scene may mount and paint behind it
- overlay release happens only after destination readiness and a suitable post-commit paint boundary
- reverse transition follows the same coherent lifecycle
- no stale overlay
- no double playback
- no input deadlock after completion

A route-independent/persistent transition overlay is acceptable if it is the smallest robust solution.

Do not add broad state management or a new dependency.

## Forbidden masking tricks

Do not “solve” the bug by:

- adding black frames
- adding white frames
- hiding it with an arbitrary fade
- re-encoding transition videos again
- globally covering the page with a color layer

The fix must improve the actual handoff lifecycle.

---

# 6. Codex implementation scope

Codex should:

1. inspect the current transition lifecycle end-to-end
2. document the likely root cause
3. implement the smallest robust fix
4. keep current route semantics
5. preserve Browser Back behavior
6. preserve forward and reverse transition semantics
7. preserve existing production media
8. perform a small Chromium smoke test only
9. run technical regression checks
10. then STOP for human post-fix validation

Do not burn quota performing dozens of repeated human-eye loops.

---

# 7. REQUIRED HUMAN CHECKPOINT AFTER IMPLEMENTATION

When the implementation and initial technical smoke checks are ready, **do not finalize IMP-031 yet**.

Respond clearly with:

`POST-FIX HUMAN TEST READY`

and provide no more than the minimal run instruction needed for the user to test the implementation.

The user will then manually test the following in Chrome:

- Home → A: 10 repetitions
- A → Home: 10 repetitions
- Home → B: 10 repetitions
- B → Home: 10 repetitions
- Home → C: 10 repetitions
- C → Home: 10 repetitions

The user will report for each direction:

- flashes/glitches out of 10
- any black/white frame
- any source/destination frame escape
- any stale overlay
- any double-play
- whether flash is still seen at start or end

Do not invent or simulate these human results.

After the user provides them, continue in the SAME IMP-031 task.

If the post-fix human test is clean, proceed to final validation/report closure.

If a reproducible visual defect remains, make only the smallest justified follow-up correction and ask for another targeted human retest if necessary.

---

# 8. Home vertical scrollbar — secondary only

At desktop sizes such as 1280×800, the Home page may still have vertical document overflow because shell content plus 4:3 SceneStage exceeds viewport height.

This is **not presentation-blocking**.

Only change it if all of the following are true:

- fix is small
- low risk
- principled
- no global `overflow: hidden`
- no clipped customer content
- no SceneStage/hotspot misalignment
- no route-anchor regression

If a correct fix broadens scope, leave the scrollbar unchanged and document that decision.

Do not sacrifice transition stability for scrollbar polish.

---

# 9. SceneStage stability contract

Preserve IMP-026 route consistency across Home / Block / Unit / Details.

Reference values:

| Viewport | `(x, documentY, width, height)` |
| --- | --- |
| 320 × 844 | `(16, 411, 273, 204.75)` |
| 390 × 844 | `(16, 411, 343, 257.25)` |
| 768 × 1024 | `(24, 319, 705, 528.75)` |
| 1280 × 800 | `(96.5, 319, 1072, 804)` |
| 1440 × 900 | `(176.5, 319, 1072, 804)` |

Do not casually alter these values.

If any intentional low-risk scrollbar fix changes desktop stage sizing, it must:

- preserve 4:3
- remain identical across relevant routes in the same viewport
- preserve hotspot alignment
- be explicitly documented

Otherwise leave stage geometry unchanged.

---

# 10. Codex-owned technical validation

Codex owns:

- clean repository-start confirmation
- transition implementation inspection
- transition implementation technical smoke test
- SceneStage route-consistency measurement
- hotspot alignment regression
- horizontal-overflow check
- Quick Card viewport-safety technical check
- Browser Back/Forward smoke validation
- direct `/video` refresh
- final project-video playback smoke check
- lazy-loading regression
- staging/media validation
- console-error check on a normal smoke path
- required command suite

Codex does NOT need to repeat exhaustive human-eye visual testing.

---

# 11. User-owned visual validation after transition fix

After transition post-fix testing is accepted, the user will visually review:

- 390×844 or equivalent narrow viewport
- 1280×800
- actual presentation laptop viewport if different

Focus:

- header/layout
- Home
- Block B
- Quick Card
- Details
- Tour
- Video
- obvious clipping/overflow

The user then performs one complete demo rehearsal:

`Genel Görünüm`
→ `B`
→ `B-301`
→ Quick Card
→ Details
→ Quick Card
→ Tour
→ room switch
→ Daireye Dön
→ Block
→ Genel Görünüm
→ Video
→ play
→ Browser Back

Also quick-check:

- A-003
- C-401

Codex should record the user's report rather than consuming quota to duplicate subjective visual review.

---

# 12. Production media and architecture lock

Do not alter:

- four exterior WebPs
- six production transition MP4 contents
- five plan PNG contents
- final project-video contents
- panorama media
- Masterplan hotspot coordinates
- Unit hotspot coordinates
- Unit / UnitType identity
- route schema
- panorama adapter architecture
- locked baseline docs

No new dependency.

---

# 13. Explicitly forbidden scope

Do not:

- add full-bleed design
- add glass UI
- create premium final shell
- redesign Nail Karataş host-site integration
- add backend
- add Availability
- add Favorites
- add lead forms
- add analytics
- add new customer routes
- regenerate render media
- regenerate transition media
- re-encode project video
- begin post-sale/final-product implementation
- begin IMP-032

The current clay-render/demo visual language is intentional for Friday. Final media/UI redesign happens only if the job is awarded.

---

# 14. Required commands

Run:

- `npm run validate:exterior-media`
- `npm run validate:data`
- `npm run build`
- `npm run lint`
- `npx tsc -b`
- `npm run test:localization`
- `node scripts/test-panorama-adapter.mjs`
- `node scripts/test-tour-help-storage.mjs`
- `npm run staging:verify`
- `git diff --check`

Use existing media-loading inspection tooling where relevant.

Known environment note:

A first sandbox `npm run build` may fail with `spawn EPERM`; a permitted rerun is acceptable and must be documented.

---

# 15. Completion report

After human post-fix validation and final user rehearsal feedback are supplied, create:

`docs/IMP-031-COMPLETION-REPORT.md`

Write in Turkish and include:

1. Özet
2. Başlangıç repository durumu
3. Human baseline matrix from this task
4. Baseline qualitative observations
5. Root-cause analysis
6. Implemented handoff strategy
7. Changed files
8. Technical smoke validation
9. Human post-fix 6-direction × 10 matrix
10. Any remaining transition anomaly
11. Home scrollbar decision and rationale
12. SceneStage geometry regression
13. Browser Back/Forward result
14. Video result
15. Tour result
16. Media-loading regression
17. Staging result
18. Console result
19. Required command results
20. Dependency changes
21. User responsive visual review
22. User final demo rehearsal result
23. Remaining known demo limitations
24. Friday demo readiness
25. Confirmation that no post-sale premium work and no IMP-032 was started

---

# 16. Acceptance criteria

IMP-031 can PASS only if:

- it started from the clean IMP-030 checkpoint
- this embedded human baseline is used and not unnecessarily reproduced
- the transition handoff is materially improved without new regression
- the user supplies the post-fix six-direction human test
- no black/white masking trick is introduced
- SceneStage/hotspot alignment remains correct
- Quick Card / Details / Tour / Video remain functional
- final H.264 project video remains correct
- required automated checks pass
- the user completes final visual review/rehearsal or explicitly reports remaining issues
- no new dependency is added
- no premium/post-sale feature work begins
- IMP-032 is not started
