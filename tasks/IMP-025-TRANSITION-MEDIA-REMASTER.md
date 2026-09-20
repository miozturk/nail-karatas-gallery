# IMP-025 — Transition Media Remaster & Browser Delivery

Status: **READY**

## Objective

Fix the two delivery-quality problems found in IMP-024 before the customer demo:

1. Forward transition MP4 files are AV1 and show severe green/magenta color distortion in Chromium.
2. Reverse transition MP4 files contain a visible `clideo.com` watermark.

Create browser-safe H.264 delivery versions for all six exterior transitions while preserving the current interaction architecture.

This is a media-delivery remediation task, not a UI or routing task.

## Required reading

Follow `AGENTS.md` and read all locked baseline documents.

Also read:

- `docs/IMP-024-COMPLETION-REPORT.md`
- `src/media/exteriorMedia.ts`
- `src/components/TransitionLayer/README.md`
- `docs/STAGING-QA-CHECKLIST.md`

Relevant locked decisions:

- Forward and reverse transitions remain separate MP4 files.
- Browser playback must never depend on negative `playbackRate`.
- Scene frame remains 1920 × 1440, 4:3.
- Transition duration target remains approximately 1 second.
- Source/master media remain outside Git; web-delivery media live in `public/media`.
- Current intent-based preload/lifecycle behavior must not change.

## 1. Tool preflight

Check whether `ffmpeg` and `ffprobe` are available in the environment.

Record versions.

If unavailable:
- do not install an npm dependency,
- do not download a binary into the repository,
- stop media conversion work and report the exact blocker.

## 2. Source audit

Use the current forward project MP4 files as candidate conversion sources:

```text
public/media/transitions/project/home-to-a.mp4
public/media/transitions/project/home-to-b.mp4
public/media/transitions/project/home-to-c.mp4
```

Audit with `ffprobe`:
- codec
- pixel format
- color primaries / transfer / matrix
- frame rate
- dimensions
- duration
- audio streams
- bit depth if available

Inspect current reverse files only as references; do not reuse their watermarked pixels for the new reverse delivery files.

## 3. Corrected forward delivery encode

Create new browser-safe forward MP4 delivery assets by transcoding each forward source to H.264.

Target characteristics:
- H.264 / AVC
- 1920 × 1440
- 24 fps
- approximately 1 second
- `yuv420p`
- no audio unless an intentional audio track is discovered
- `+faststart`
- explicit BT.709-compatible color signaling for normal SDR Chromium playback
- visually high quality, reasonable web size

Use a quality-oriented encode. Do not resize or crop.

If the AV1 source lacks or contains suspicious color metadata, use an explicit color conversion/signaling strategy and document the exact ffmpeg command.

## 4. Chromium color QA gate

Before replacing production references, test each corrected forward file directly in Chromium.

Acceptance gate:
- no severe green/magenta cast
- static first/last frames visually resemble the corresponding Home / Block WebP colors
- no obvious decode corruption
- no crop / stretch

If a corrected encode still shows the same severe color distortion:
- do not pretend it is fixed
- preserve the current repository state
- report that higher-quality source frames / original render sequence are required

## 5. Reverse delivery generation

If corrected forward files pass the color QA gate, generate clean reverse MP4 files from the corrected forward delivery sources offline.

Requirements:
- time-reversed encoded file, not browser negative playback
- H.264
- `yuv420p`
- 1920 × 1440
- 24 fps
- approximately 1 second
- BT.709-compatible signaling
- `+faststart`
- no watermark
- no added branding
- no audio unless intentionally required

The new reverse files must not contain pixels from the current Clideo-watermarked reverse files.

## 6. Output-path strategy

Keep production URL stability if practical.

Preferred final production paths:

```text
public/media/transitions/project/home-to-a.mp4
public/media/transitions/project/home-to-b.mp4
public/media/transitions/project/home-to-c.mp4
public/media/transitions/project/a-to-home.mp4
public/media/transitions/project/b-to-home.mp4
public/media/transitions/project/c-to-home.mp4
```

It is acceptable to replace the current delivery binaries at those paths because this task explicitly remasters web-delivery assets.

Do not commit temporary encode intermediates.

## 7. Production manifest

`src/media/exteriorMedia.ts` should continue to resolve the same logical A/B/C mapping.

If file paths remain unchanged, avoid unnecessary manifest churn.

## 8. Deterministic validation

Update `scripts/validate-exterior-media.mjs` so the six final transition MP4s are validated as browser-delivery files.

Require at minimum:
- file exists
- 1920 × 1440
- approximately 1 second
- 24 fps
- H.264 / AVC
- acceptable 4:2:0 browser pixel format where reliably detectable

The validator should reject AV1 final transition delivery files after this task.

Do not add a third-party Node package.

## 9. Watermark QA

Manually inspect all three new reverse files in Chromium.

Required:
- no `clideo.com` watermark
- no obvious alternate watermark
- no green/magenta corruption
- correct reverse motion
- first/last visual continuity is sensible

Document the result explicitly.

## 10. First/last frame continuity

For all six final transition files, inspect:

Forward:
Home static WebP -> first transition frame
last transition frame -> target Block WebP

Reverse:
Block static WebP -> first reverse frame
last reverse frame -> Home WebP

Do not claim pixel-perfect identity unless actually measured.

## 11. Loading / lifecycle regression

Do not modify `TransitionLayer` preload/playback architecture unless a genuine compatibility issue requires a minimal fix.

Verify:
- clean Home does not fetch all transition MP4s
- intent preload remains selective
- forward playback completes
- reverse playback completes
- interaction lock remains correct
- reduced-motion path remains unchanged
- Browser Back remains history navigation
- no duplicate request storm

## 12. Staging verification

All six corrected transition files must pass:
- HTTP success / range support
- `video/mp4`
- stable root-relative path

Existing scene, panorama and project-video verification must continue to pass.

## 13. Browser / responsive regression

Verify production/staging at:
- 390 × 844
- 1280 × 800

Flows:
- Home -> A -> Home
- Home -> B -> Home
- Home -> C -> Home
- Home -> B -> B-301 -> close Quick Card -> Home

Check:
- correct transition mapping
- correct colors
- no watermark
- no layout flash
- no console warning/error
- no horizontal overflow

## 14. Repository hygiene

Do not commit:
- source PNG sequences
- temporary extracted frames
- ffmpeg binaries
- conversion scratch files
- alternate duplicate encodes with unclear purpose

The final repository should contain only the delivery MP4s required by production.

## 15. Required automated checks

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

## 16. Completion report

Create:

`docs/IMP-025-COMPLETION-REPORT.md`

Return the report in Turkish and include:

1. Özet.
2. Oluşturulan / değiştirilen dosyalar.
3. ffmpeg / ffprobe preflight sonucu.
4. Eski forward codec/color metadata tablosu.
5. Kullanılan forward encode komutları / stratejisi.
6. Chromium color QA sonucu.
7. Reverse generation stratejisi.
8. Final altı MP4 medya tablosu: path, codec, pix_fmt, resolution, fps, duration, byte.
9. Watermark QA sonucu.
10. First/last frame continuity gözlemleri.
11. Exterior validator sonucu.
12. Loading/preload/lifecycle regression sonucu.
13. Staging sonucu.
14. 390 / 1280 browser flow sonucu.
15. Çalıştırılan komutlar.
16. Tüm zorunlu kontrol sonuçları.
17. Dependency değişikliği varsa listesi.
18. Kaynak-media nedeniyle çözülemeyen görsel sorun varsa açık açıklama.
19. Uyarılar / mimari çelişki / blocker.
20. Sonraki IMP'ye başlama.

## Explicitly forbidden

Do not:
- use the Clideo reverse pixels as the final reverse source
- depend on negative playbackRate
- change routes
- change hotspot coordinates
- change seed/domain data
- change localization architecture
- change panorama architecture
- redesign UI
- integrate floorplans/panoramas/project-video real media
- add npm dependencies
- commit ffmpeg binaries
- add backend/analytics
- deploy to a provider
- begin the next IMP

## Acceptance criteria

IMP-025 passes only if:

- all three final forward transitions are H.264 browser-safe delivery files
- severe Chromium green/magenta distortion is gone
- all three final reverse transitions are clean H.264 files
- no final reverse contains the Clideo watermark
- six final files remain 1920 × 1440 and approximately 1 second / 24 fps
- final production mapping remains correct
- preload/lifecycle behavior does not regress
- exterior media validator rejects AV1 transition delivery after the task
- staging verification passes
- browser flows pass at 390 and 1280
- no new dependency is added
- no source sequence or temporary media is committed
- baseline documents remain unchanged
- no later IMP is started
