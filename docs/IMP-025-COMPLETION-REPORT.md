# IMP-025 — Transition Delivery Validation Completion Report

Tarih: 2026-09-21

## 1. Özet

Önceden remaster edilip production path'lerine yerleştirilmiş altı exterior transition MP4 dosyası yeniden encode edilmeden doğrulandı. Altı dosyanın tamamı H.264/AVC, `yuv420p`, 1920 × 1440, 24 fps ve 1,000 saniyedir. Chromium tabanlı production/staging akışında yeşil/mor renk bozulması, `clideo.com` veya başka bir filigran, decode corruption, crop/stretch ya da layout flash görülmedi. Exterior media validator H.264 browser-delivery profilini zorunlu kılacak ve AV1'i reddedecek şekilde güncellendi. Yalnızca IMP-025 uygulandı; sonraki IMP'ye başlanmadı.

## 2. Oluşturulan / değiştirilen dosyalar

- `scripts/validate-exterior-media.mjs`: transition MP4'ler için yaklaşık 1 saniye, 24 fps, H.264/`avc1` ve SPS üzerinden 8-bit 4:2:0/`yuv420p` doğrulaması eklendi. `av01` final delivery olarak reddediliyor.
- `docs/IMP-025-COMPLETION-REPORT.md`: bu rapor.
- Altı production MP4 bu görev sırasında değiştirilmedi veya yeniden encode edilmedi.
- Çalışma başlangıcında zaten silinmiş görünen `tasks/IMP-025-TRANSITION-MEDIA-REMASTER.md` kullanıcıya ait mevcut çalışma ağacı değişikliği olarak korundu; geri getirilmedi veya tarafımdan değiştirilmedi.

## 3. FFmpeg / FFprobe preflight sonucu

`ffmpeg` ve `ffprobe` PATH üzerinde değildi; mevcut WinGet kurulumu salt-okunur aramayla bulundu. Herhangi bir kurulum veya indirme yapılmadı.

- Binary dizini: `C:\Users\miozt\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.1-full_build\bin`
- `ffmpeg`: `9.0.1-full_build-www.gyan.dev`
- `ffprobe`: `9.0.1-full_build-www.gyan.dev`
- Build: GCC 16.1.0 / MSYS2

## 4. Final altı MP4 metadata tablosu

| Dosya | Byte | Codec / profil | Pixel format | Ölçü | FPS | Süre | Range | Space | Transfer | Primaries | Audio |
| --- | ---: | --- | --- | --- | ---: | ---: | --- | --- | --- | --- | ---: |
| `home-to-a.mp4` | 4.089.723 | H.264 High | `yuv420p` | 1920×1440 | 24 | 1,000 sn | `tv` | `bt709` | `iec61966-2-1` | `bt709` | 0 |
| `home-to-b.mp4` | 6.102.580 | H.264 High | `yuv420p` | 1920×1440 | 24 | 1,000 sn | `tv` | `bt709` | `iec61966-2-1` | `bt709` | 0 |
| `home-to-c.mp4` | 5.651.110 | H.264 High | `yuv420p` | 1920×1440 | 24 | 1,000 sn | `tv` | `bt709` | `iec61966-2-1` | `bt709` | 0 |
| `a-to-home.mp4` | 4.135.027 | H.264 High | `yuv420p` | 1920×1440 | 24 | 1,000 sn | `tv` | `bt709` | `iec61966-2-1` | `bt709` | 0 |
| `b-to-home.mp4` | 6.388.586 | H.264 High | `yuv420p` | 1920×1440 | 24 | 1,000 sn | `tv` | `bt709` | `iec61966-2-1` | `bt709` | 0 |
| `c-to-home.mp4` | 6.056.877 | H.264 High | `yuv420p` | 1920×1440 | 24 | 1,000 sn | `tv` | `bt709` | `iec61966-2-1` | `bt709` | 0 |

Altı dosya da beklenen browser-delivery profilini karşılıyor. Color space ve primaries `bt709`; transfer alanı altısında da tutarlı biçimde sRGB/`iec61966-2-1`. Bu nüans Chromium'da renk bozulmasına yol açmadı ve medya değişikliği gerektirmedi.

## 5. Exterior media validator güncellemesi

Validator bağımlılıksız kalmıştır. Mevcut MP4 box okumasına şunlar eklendi:

- `stsz` sample count / container süresinden 24 fps doğrulaması,
- 1,000 saniye için ±0,05 saniye toleransı,
- yalnızca H.264/AVC `avc1` kabulü; `av01` ve bilinmeyen codec reddi,
- `avcC` içindeki SPS bitstream'inden chroma format ve bit-depth çözümü,
- yalnızca 8-bit 4:2:0 `yuv420p` kabulü.

`npm run validate:exterior-media` dört WebP ve altı MP4 için PASS verdi.

## 6. Production mapping doğrulaması

`src/media/exteriorMedia.ts` değiştirilmeden aşağıdaki mapping'i koruyor:

| Akış | Production path |
| --- | --- |
| Home → A | `/media/transitions/project/home-to-a.mp4` |
| Home → B | `/media/transitions/project/home-to-b.mp4` |
| Home → C | `/media/transitions/project/home-to-c.mp4` |
| A → Home | `/media/transitions/project/a-to-home.mp4` |
| B → Home | `/media/transitions/project/b-to-home.mp4` |
| C → Home | `/media/transitions/project/c-to-home.mp4` |

Gerçek uygulama akışında aktif video elementinin `src` değeri altı mapping için ayrı ayrı doğrulandı; hedef route ve hareket yönü doğruydu.

## 7. Chromium renk QA sonucu

Production build, Chromium tabanlı Codex in-app browser yüzeyinde 390×844 ve 1280×800 viewport'larında test edildi. Altı klibin oynatma ortasındaki görüntüsü gözlendi. Önceki ağır yeşil/mor distortion tekrarlanmadı. Renkler static WebP'lerle aynı genel nötr/gri-mavi render paletinde kaldı; decode corruption görülmedi.

## 8. Reverse watermark QA sonucu

`a-to-home.mp4`, `b-to-home.mp4` ve `c-to-home.mp4` hem 390 hem 1280 akışında gözlendi. `clideo.com` filigranı veya başka görünür filigran bulunmadı. Video yüzeyi CSS ile maskelenmedi; gözlem doğrudan SceneStage ile aynı video rect'i üzerinde yapıldı.

## 9. First/last-frame continuity gözlemleri

FFmpeg yalnızca decode/frame extraction amacıyla kullanılarak repository dışındaki geçici dizinde A/B/C için ayrı contact sheet üretildi. Her sheet şu sırayla görsel olarak karşılaştırıldı:

- Home WebP → forward ilk kare,
- forward son kare → ilgili Block WebP,
- Block WebP → reverse ilk kare,
- reverse son kare → Home WebP.

Üç blokta da belirgin source-level framing, renk veya kadraj sıçraması görülmedi. Pixel-perfect eşitlik ölçülmedi ve iddia edilmez. Geçici PNG'ler inceleme sonrasında silindi; repository'ye kare eklenmedi.

## 10. Loading / preload / lifecycle regression sonucu

- Temiz Home'da video `src` değeri yoktu ve gözlenen tek `/media/` kaynağı `masterplan.webp` idi; transition MP4'ler eager yüklenmedi.
- Home → A/B/C sırasında yalnızca seçilen bloğun forward path'i aktif video `src` oldu.
- A/B/C Block sayfasına ulaşıldığında reverse video `src` değeri `null` kaldı; contextual Home aktivasyonu yalnızca mevcut bloğun reverse path'ini hazırlayıp oynattı.
- Forward ve reverse oynatmalar `readyState=4` ile tamamlanıp doğru route'a geçti.
- Oynatma sırasında kontrol kilidi etkin; B-301 Quick Card kapatıldıktan sonra B reverse akışı doğru çalıştı.
- Video ve SceneStage rect'leri eşitti; unmount sonrasında önceki video elementi/source'u yeni sayfaya taşınmadı.
- Browser Back `/block/a` → `/` history navigasyonu olarak kaldı ve transition oynatmadı.
- Aktif video elementinde tek, doğru source gözlendi; duplicate request storm veya source flip görülmedi.
- `TransitionLayer`, reduced-motion ve route/lifecycle kodları değiştirilmedi.

## 11. Staging sonucu

`npm run staging:verify` PASS verdi:

- 9 SPA route shell,
- 2 entry asset,
- 4 exterior WebP,
- 6 production transition MP4,
- 3 DEVELOPMENT-ONLY panorama JPG,
- 1 DEVELOPMENT-ONLY Project Video MP4,
- missing-file 404,
- DEV route bundle izolasyonu,
- localhost/port/filesystem hijyeni.

Altı transition URL'sinin tamamı HTTP 206, `video/mp4` ve doğru `Content-Range` ile doğrulandı. URL'ler sabit root-relative production path'leridir.

## 12. 390 / 1280 browser flow sonucu

| Viewport | Akış | Sonuç |
| --- | --- | --- |
| 390×844 | Home → A → Home | PASS: doğru iki dosya, doğru hareket, renk/filigran/crop sorunu yok |
| 390×844 | Home → B → Home | PASS: doğru iki dosya, renk/filigran/crop sorunu yok |
| 390×844 | Home → C → Home | PASS: doğru iki dosya, renk/filigran/crop sorunu yok |
| 390×844 | Home → B → B-301 → kartı kapat → Home | PASS: Quick Card açıldı/kapandı, `b-to-home.mp4` oynadı |
| 1280×800 | Home → A → Home | PASS |
| 1280×800 | Home → B → Home | PASS |
| 1280×800 | Home → C → Home | PASS |
| 1280×800 | Home → B → B-301 → kartı kapat → Home | PASS |

390 viewport'ta scene/image/SVG rect'i `358×268,5`; 1280 viewport'ta gerçek `clientWidth=1265` iken rect `1072×804` ölçüldü. Her iki durumda `scrollWidth === clientWidth`, exterior oranı 4:3, transition video SceneStage ile aynı rect ve console warning/error listesi boştu. Test viewport simülasyonudur; fiziksel cihaz veya Safari testi değildir.

## 13. Repository hygiene sonucu

- Transition dizininde yalnızca beklenen altı production MP4 var.
- PNG sequence, extracted frame, FFmpeg binary, scratch encode veya duplicate alternate transition dosyası eklenmedi.
- Geçici continuity PNG'leri repository dışında üretildi ve silindi.
- `package.json` ve `package-lock.json` değişmedi.
- Locked baseline belgeleri değişmedi.
- Production MP4'ler bu görevde yeniden encode edilmedi veya değiştirilmedi.

## 14. Çalıştırılan komutlar

- `ffmpeg -version` ve `ffprobe -version` (mevcut WinGet binary'lerinin tam path'iyle)
- Altı dosya için `ffprobe -v error -show_entries format=duration,size:stream=... -of json`
- `npm run validate:exterior-media`
- `npm run validate:data`
- `npm run build` (sandbox denemesi ve izinli tekrar)
- `npm run lint`
- `npx tsc -b`
- `npm run test:localization`
- `node scripts/test-panorama-adapter.mjs`
- `node scripts/test-tour-help-storage.mjs`
- `npm run staging:verify`
- `npm run staging:serve`
- FFmpeg ile repository dışı geçici first/last-frame contact sheet decode işlemi
- `git diff --check`
- `git status --short`, `git diff --stat` ve repository hygiene taramaları
- Production Chromium'da 390×844 ve 1280×800 manuel/otomasyon destekli akış kontrolleri

## 15. Tüm zorunlu kontrol sonuçları

| Kontrol | Sonuç |
| --- | --- |
| `npm run validate:exterior-media` | PASS: 4 WebP + 6 H.264 MP4; ölçü, süre, 24 fps, `avc1`, `yuv420p` |
| `npm run validate:data` | PASS: 3 Block, 10 UnitType, 78 Unit, 9 exact demo Unit, snapshot parity |
| `npm run build` | PASS: izinli tekrar, 90 modül |
| `npm run lint` | PASS |
| `npx tsc -b` | PASS |
| `npm run test:localization` | PASS: tr/en/ru, 120 parity key ve fallback senaryoları |
| `node scripts/test-panorama-adapter.mjs` | PASS: mapping/navigation/validation/lifecycle ve 3 remount |
| `node scripts/test-tour-help-storage.mjs` | PASS: first visit/persistence/reload/storage failure/session fallback |
| `npm run staging:verify` | PASS: 9 route, 2 asset, 14 medya ve izolasyon/hijyen |
| `git diff --check` | PASS; yalnızca Windows LF/CRLF bilgilendirmesi |

## 16. Dependency değişikliği

Yok. Yeni npm dependency eklenmedi; validator yalnızca Node built-in modüllerini kullanıyor.

## 17. Kalan medya-source görsel sorunu

First/last-frame görsel incelemesinde belirgin bir source mismatch görülmedi. Pixel-diff yapılmadığı için alt-piksel veya sıkıştırma düzeyinde eşitlik iddia edilmez. Altı dosyada transfer metadata'sı literal `bt709` yerine tutarlı `iec61966-2-1` olsa da space/primaries `bt709`, range `tv` ve Chromium renk sonucu düzgündür; yeniden encode gerekçesi oluşmadı.

## 18. Uyarılar / blocker / mimari çelişki

- İlk `npm run build`, sandbox child-process kısıtı nedeniyle Vite/esbuild `spawn EPERM` verdi; izinli bağlamdaki tekrar başarılı oldu.
- FFmpeg araçları PATH üzerinde değildi; mevcut WinGet binary'leri tam path ile kullanıldı. Kurulum/indirme yapılmadı.
- Başlangıçtan mevcut `tasks/IMP-025-TRANSITION-MEDIA-REMASTER.md` silme değişikliği korundu ve bu görevin değişikliği olarak sahiplenilmedi.
- Blocker veya locked baseline ile mimari çelişki bulunmadı.

## 19. Kapsam kapanışı

Yalnızca IMP-025 tamamlandı. Route, hotspot koordinatı, domain/seed veri, localization mimarisi, panorama mimarisi, UI tasarımı, backend/analytics veya deploy/provider kapsamına dokunulmadı. Sonraki IMP'ye başlanmadı.
