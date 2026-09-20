# IMP-025 — Transition Delivery Validation

Status: **READY**

## Context

The six exterior transition delivery MP4 files have already been manually remastered before this task was started.

The user has:

- converted the three forward AV1 transition files to H.264,
- verified that the severe green/magenta Chromium color issue disappeared,
- generated the three reverse files locally from the clean H.264 forward files using FFmpeg,
- visually checked all six files,
- confirmed the reverse files no longer contain the Clideo watermark,
- copied the six corrected files over the existing production paths.

Therefore:

**Do not re-encode the media unless deterministic validation proves that a final file is invalid.**

The purpose of IMP-025 is now to validate, document and regression-test the corrected delivery media.

## Expected production paths

```text
public/media/transitions/project/home-to-a.mp4
public/media/transitions/project/home-to-b.mp4
public/media/transitions/project/home-to-c.mp4
public/media/transitions/project/a-to-home.mp4
public/media/transitions/project/b-to-home.mp4
public/media/transitions/project/c-to-home.mp4
```

## Required reading

Follow `AGENTS.md` and read all locked baseline documents.

Also read:

- `docs/IMP-024-COMPLETION-REPORT.md`
- `src/media/exteriorMedia.ts`
- `src/components/TransitionLayer/README.md`
- `docs/STAGING-QA-CHECKLIST.md`

Do not begin any later IMP.

## 1. FFmpeg / FFprobe preflight

Confirm `ffmpeg` and `ffprobe` are available.

Record versions.

Do not install or download anything.

## 2. Final six-file metadata audit

Use `ffprobe` on all six corrected MP4 files.

Record:

- codec
- pixel format
- dimensions
- frame rate
- duration
- color range
- color space
- color transfer
- color primaries
- audio stream presence
- file size

Expected delivery characteristics:

- H.264 / AVC
- 1920 × 1440
- 24 fps
- approximately 1 second
- `yuv420p`
- TV/limited range preferred
- BT.709-compatible color signaling
- no required audio

If one file does not meet the expected delivery profile, report the exact mismatch before making any media change.

## 3. Exterior media validator update

Update `scripts/validate-exterior-media.mjs` so final transition delivery files must be browser-safe H.264 files.

At minimum require:

- file exists
- 1920 × 1440
- approximately 1 second
- 24 fps
- H.264 / AVC
- browser-compatible 4:2:0 pixel format where reliably detectable

The validator must reject AV1 as the final transition delivery codec.

Do not add third-party dependencies.

## 4. Production manifest verification

Verify `src/media/exteriorMedia.ts` still maps:

- Home -> A: `home-to-a.mp4`
- Home -> B: `home-to-b.mp4`
- Home -> C: `home-to-c.mp4`
- A -> Home: `a-to-home.mp4`
- B -> Home: `b-to-home.mp4`
- C -> Home: `c-to-home.mp4`

Do not change paths if they are already correct.

## 5. Chromium visual QA

In production/staging Chromium verify all six corrected files in the real application flow.

Required observations:

- no severe green/magenta cast
- no visible `clideo.com` watermark
- no obvious alternate watermark
- correct forward/reverse motion
- no decode corruption
- no crop/stretch
- no layout flash caused by application styling
- correct A/B/C mapping

Do not claim pixel-perfect first/last-frame equality unless actually measured.

## 6. First/last continuity QA

Visually inspect:

### Forward
Home static WebP -> first video frame
last video frame -> target Block WebP

### Reverse
Block static WebP -> first reverse frame
last reverse frame -> Home WebP

Document any visible source-level mismatch.

Do not modify scene images or transition media merely to hide a source mismatch.

## 7. Loading / preload / lifecycle regression

Preserve IMP-019 and IMP-024 behavior.

Verify:

- clean Home does not eagerly request all transition MP4s
- intent preload remains selective
- correct forward file is requested for A/B/C
- contextual Home only prepares the current Block reverse file
- forward transition completes
- reverse transition completes
- interaction lock remains correct
- reduced-motion implementation is unchanged
- Browser Back remains history navigation
- no duplicate request storm

Do not refactor `TransitionLayer` without a demonstrated issue.

## 8. Staging verification

Update staging verification only if required.

All six corrected transition files must pass:

- HTTP success/range support
- `video/mp4`
- stable root-relative URL

Existing:

- scene WebP verification
- panorama proof verification
- project-video proof verification
- DEV route isolation
- environment hygiene

must remain intact.

## 9. Responsive browser regression

Verify at:

- 390 × 844
- 1280 × 800

Flows:

- Home -> A -> Home
- Home -> B -> Home
- Home -> C -> Home
- Home -> B -> B-301 -> close Quick Card -> Home

Check:

- correct colors
- no watermark
- no horizontal overflow
- no console warning/error
- scene stays 4:3
- transition video remains aligned with SceneStage

## 10. Repository hygiene

Confirm no accidental files were introduced:

- no PNG sequence
- no extracted temporary frames
- no FFmpeg binaries
- no scratch encode files
- no duplicate alternate transition files
- no new dependencies

Only the six production delivery MP4 replacements are expected media changes.

## 11. Required automated checks

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

## 12. Completion report

Create:

`docs/IMP-025-COMPLETION-REPORT.md`

Return the report in Turkish and include:

1. Özet.
2. Oluşturulan / değiştirilen dosyalar.
3. ffmpeg / ffprobe preflight sonucu.
4. Final altı MP4 metadata tablosu.
5. Exterior media validator güncellemesi.
6. Production mapping doğrulaması.
7. Chromium renk QA sonucu.
8. Reverse watermark QA sonucu.
9. First/last-frame continuity gözlemleri.
10. Loading/preload/lifecycle regression sonucu.
11. Staging sonucu.
12. 390 / 1280 browser flow sonucu.
13. Repository hygiene sonucu.
14. Çalıştırılan komutlar.
15. Tüm zorunlu kontrol sonuçları.
16. Dependency değişikliği varsa listesi.
17. Kalan medya-source görsel sorunu varsa açıklama.
18. Uyarılar / blocker / mimari çelişki.
19. Sonraki IMP'ye başlama.

## Explicitly forbidden

Do not:

- re-encode media unless validation proves a final file invalid
- restore the previous AV1 forward files
- restore Clideo reverse files
- depend on negative playbackRate
- change routes
- change hotspot coordinates
- change domain/seed data
- change localization architecture
- change panorama architecture
- redesign UI
- add npm dependencies
- add backend/analytics
- deploy to a provider
- begin the next IMP

## Acceptance criteria

IMP-025 passes only if:

- all six final transitions validate as H.264 browser-delivery files
- Chromium no longer shows the severe green/magenta distortion
- all three reverse transitions are watermark-free
- all six remain 1920 × 1440, 24 fps and approximately one second
- production A/B/C mapping is correct
- preload/lifecycle behavior does not regress
- exterior validator rejects AV1 transition delivery
- staging verification passes
- 390 and 1280 browser flows pass
- no temporary/source media is committed
- no new dependency is added
- locked baseline documents remain unchanged
- no later IMP is started
