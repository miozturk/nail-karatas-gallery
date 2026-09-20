# IMP-024 — Real Exterior Media Integration Completion Report

Tarih: 2026-09-20

1. **Özet:** Müşteri-facing production exterior akışındaki sentetik sahne ve geçiş proof medyaları, repository'ye önceden kopyalanmış gerçek Nail Karataş WebP/MP4 dosyalarıyla değiştirildi. Home ve A/B/C sahneleri ile her bloğun ayrı forward/reverse geçişi tek merkezi manifestten çözülüyor. 1920 × 1440 SceneStage, SVG hotspot koordinatları, route/domain/panorama/staging mimarileri ve mevcut preload/lifecycle davranışı korunmuştur. Yalnızca IMP-024 uygulanmıştır.

2. **Oluşturulan / değiştirilen dosyalar:**
   - `src/media/exteriorMedia.ts`: gerçek exterior sahne ve A/B/C forward/reverse medya manifesti.
   - `src/features/masterplan/MasterplanPage.tsx`, `MasterplanPage.css`: gerçek Masterplan görseli ve hedefe göre ayrı forward MP4.
   - `src/features/blocks/BlockPage.tsx`, `BlockPage.css`: gerçek A/B/C görselleri ve bloğa göre ayrı reverse MP4.
   - `src/i18n/translations/tr.ts`, `en.ts`, `ru.ts`: artık doğru olmayan exterior proof-media metinlerinin temizliği; 120 anahtarlı parity korunmuştur.
   - `scripts/validate-exterior-media.mjs`, `package.json`: bağımlılıksız deterministic dosya/format/ölçü/süre/codec kontrolü.
   - `scripts/verify-staging.mjs`: dört WebP, altı proje MP4'ü ve mevcut panorama/project-video proof varlıkları için 14 medya doğrulaması; proof exterior URL'lerinin production bundle'da bulunmama kontrolü.
   - `docs/STAGING-QA-CHECKLIST.md`, `src/components/TransitionLayer/README.md`: güncel gerçek/proof medya ayrımı ve IMP-024 mapping kaydı.
   - `docs/IMP-024-COMPLETION-REPORT.md`: bu rapor.
   - Sağlanan gerçek medya dosyaları değiştirilmemiş, yeniden encode edilmemiş ve yeniden boyutlandırılmamıştır.

3. **Real-media preflight tablosu:** Dosya varlığı ve byte boyutu doğrudan dosya sistemiyle; ölçü/süre/codec yeni validator ve Windows medya metadata'sıyla; decode/play durumu production Chromium/native medya yüzeyiyle kontrol edildi. Tüm dosyalar 4:3 logical sahneyle ölçü bakımından uyumludur.

   | Path | Byte | Ölçü / süre | Codec | Durum |
   | --- | ---: | --- | --- | --- |
   | `scenes/project/masterplan.webp` | 323.534 | 1920×1440 | WebP VP8 | Var, Chromium decode PASS |
   | `scenes/project/block-a.webp` | 130.642 | 1920×1440 | WebP VP8 | Var, Chromium decode PASS |
   | `scenes/project/block-b.webp` | 324.358 | 1920×1440 | WebP VP8 | Var, Chromium decode PASS |
   | `scenes/project/block-c.webp` | 293.604 | 1920×1440 | WebP VP8 | Var, Chromium decode PASS |
   | `transitions/project/home-to-a.mp4` | 4.187.746 | 1920×1440 · 1,000 sn · 24 fps | AV1 / `av01` | Decode/play PASS; renk uyarısı var |
   | `transitions/project/home-to-b.mp4` | 5.003.943 | 1920×1440 · 1,000 sn · 24 fps | AV1 / `av01` | Decode/play PASS; renk uyarısı var |
   | `transitions/project/home-to-c.mp4` | 4.838.632 | 1920×1440 · 1,000 sn · 24 fps | AV1 / `av01` | Decode/play PASS; renk uyarısı var |
   | `transitions/project/a-to-home.mp4` | 4.655.563 | 1920×1440 · 1,000 sn · 24 fps | H.264 / `avc1` | Decode/play PASS; filigran uyarısı var |
   | `transitions/project/b-to-home.mp4` | 7.363.726 | 1920×1440 · 1,000 sn · 24 fps | H.264 / `avc1` | Decode/play PASS; filigran uyarısı var |
   | `transitions/project/c-to-home.mp4` | 6.871.375 | 1920×1440 · 1,000 sn · 24 fps | H.264 / `avc1` | Decode/play PASS; filigran uyarısı var |

4. **Exterior media configuration yaklaşımı:** `exteriorMedia` Home kaynağını ve `a/b/c` için `scene`, `forwardTransition`, `reverseTransition` alanlarını tek yerde tutar. `getExteriorBlockMedia()` yalnızca canonical `a/b/c` kimliklerini kabul eder. Component'lerde project-media URL tekrarı yoktur. Eski proof config dosyaları repository'de kalabilir, fakat production customer akışında import edilmez ve production bundle taraması proof transition URL'lerini reddeder.

5. **Masterplan gerçek medya sonucu:** Home, `SceneStageImage` üzerinden `masterplan.webp` gösterir. Logical 1920 × 1440 katman, `object-fit: contain`, A/B/C yapay hotspot koordinatları ve control/polygon senkronu değişmedi. Görsel içerik crop veya distortion olmadan stage ile aynı rect'te render edildi.

6. **Block A/B/C gerçek medya sonucu:** A=`block-a.webp`, B=`block-b.webp`, C=`block-c.webp` mapping'i production rotalarında doğrulandı. Her görüntü aynı SceneStage ve SVG rect'ini paylaşır. Unit hotspot dosyası değiştirilmedi. Mevcut yapay Unit dikdörtgenlerinin gerçek cephelerle belirgin biçimde uyuşmaması beklenen authoring borcudur ve caption uyarısı korunmuştur; IMP-024 içinde koordinat düzeltilmedi.

7. **Forward transition mapping sonucu:** Home → A/B/C sırasıyla `home-to-a.mp4`, `home-to-b.mp4`, `home-to-c.mp4` istedi ve doğru Block rotasında tamamlandı. Oynatma sırasında tüm seçimler disabled oldu; ikinci aktivasyon kilidi, ended/error/timeout fail-safe ve reduced-motion kodu değiştirilmedi. Negatif playbackRate kullanılmadı.

8. **Reverse transition mapping sonucu:** A/B/C → Home sırasıyla `a-to-home.mp4`, `b-to-home.mp4`, `c-to-home.mp4` istedi. B-301 Quick Card kapatıldıktan sonra contextual Home, yalnızca B reverse dosyasını kullandı. Unit/Details route bağlamındaki aynı BlockPage yolu korundu. Browser Back özel olarak yakalanmadı veya reverse videoya çevrilmedi.

9. **Visual continuity / first-last-frame gözlemleri:** A/B/C forward ve reverse akışları 1280 px'te gerçek oynatma sırasında izlendi. Video, statik scene ve SVG katmanı aynı 4:3 rect'te kaldı; CSS kaynaklı crop, scale değişimi, beyaz/siyah layout flash veya yanlış A/B/C mapping görülmedi. Pixel-perfect karşılaştırma yapılmadı ve iddia edilmez. Sağlanan üç AV1 forward dosya hem uygulamada hem doğrudan Chromium native player'da belirgin yeşil/mor renk kayması gösteriyor; bu, CSS/overlay dışında da tekrarlandığı için medya encode/codec-renk metadata kaynaklı uyarı olarak kaydedildi. Üç H.264 reverse dosyanın tamamında sağ altta görünür `clideo.com` filigranı var. Bunlar kodla maskelenmedi ve dosyalar görev gereği yeniden encode edilmedi.

10. **Exterior DEVELOPMENT-ONLY label cleanup sonucu:** Gerçek sahne/video için kullanılan “geliştirme sahnesi”, “geliştirme videosu” ve “temsili görsel/video gerçek medya değildir” metinleri TR/EN/RU'dan kaldırıldı veya nötrleştirildi. Yapay Masterplan/Unit hotspot geometrisine ait DEVELOPMENT-ONLY uyarıları korundu. Unit plan, galeri, panorama, minimap ve Project Video proof uyarıları değiştirilmedi.

11. **Loading/preload/network regression sonucu:** Temiz production Home isteğinde yalnızca hash'li entry JS/CSS ve `masterplan.webp` görüldü; transition, panorama ve Project Video istenmedi. Klavye focus intent'i ilgili forward dosyasını hazırladı; A ardından B'ye focus traversal doğal olarak iki ayrı kullanıcı intent'i oluşturdu. Home → A/B/C akışlarında yalnızca hedef forward ve target scene; A/B/C contextual Home'da yalnızca o bloğun reverse dosyası istendi. Unrelated Block transition, panorama veya project-video isteği; request storm veya kod kaynaklı tekrar görülmedi. Sabit root-relative URL ve aynı video elemanını kullanan mevcut preload politikası korundu.

12. **Staging verifier/media sonucu:** `npm run staging:verify`, 9 SPA route, 2 entry asset ve 14 medya için PASS verdi. Dört WebP ve altı gerçek MP4 root-relative URL'de HTTP 206, doğru MIME ve `Content-Range` aldı. Üç panorama JPG ile proof Project Video MP4 doğrulaması kaldı. Missing-file 404, DEV bundle izolasyonu, localhost/port/filesystem hijyeni ve production bundle'da iki proof exterior transition URL'sinin bulunmaması geçti.

13. **320 / 390 / 768 / 1280 / 1440 geometry-responsive sonucu:** Chromium viewport simülasyonudur; fiziksel cihaz/Safari testi değildir. Home ve A/B/C'nin tamamında image/stage/SVG rect değerleri birebir eşitti, `object-fit: contain`, oran 1,3333 ve `scrollWidth === clientWidth` kaldı.

   | Viewport | Home stage | A/B/C stage | clientWidth / scrollWidth | Sonuç |
   | --- | ---: | ---: | ---: | --- |
   | 320×844 | 288×216 | 288×216 | 320 / 320 | PASS |
   | 390×844 | 358×268,5 | 358×268,5 | 390 / 390 | PASS |
   | 768×1024 | 720×540 | 720×540 | 768 / 768 | PASS |
   | 1280×800 | 1072×804 | 1072×804 | 1265 / 1265 | PASS |
   | 1440×900 | 1072×804 | 1072×804 | 1425 / 1425 | PASS |

14. **TR / EN / RU regression sonucu:** 320×844 Home ve B Block, TR/EN/RU için ayrı ayrı doğrulandı. Heading'ler sırasıyla Home'da `Ana Sayfa / Vaziyet Planı`, `Home / Masterplan`, `Главная / Генплан`; Block'ta `B Blok`, `Block B`, `Блок B` oldu. `<html lang>` `tr/en/ru`, URL aynı route ve yatay taşma yoktu. Rusça 320 px header/navigation kullanılabilir kaldı. Otomatik test 120 anahtar parity ile geçti.

15. **Browser Back/Forward sonucu:** Rusça 320 px kontrolünde `/block/b` → Back `/` ve `Главная / Генплан`; Forward `/block/b` ve `Блок B` verdi. Locale seçimi history girdisi eklemedi. Transition navigasyonu ve doğrudan history davranışı birbirine karıştırılmadı.

16. **Çalıştırılan komutlar:** `npm run validate:exterior-media`; `npm run validate:data`; `npm run build` (sandbox denemesi ve izinli tekrar); `npm run lint`; `npx tsc -b`; `npm run test:localization`; `node scripts/test-panorama-adapter.mjs`; `node scripts/test-tour-help-storage.mjs`; `npm run staging:verify`; `node scripts/inspect-media-loading.mjs` (sandbox denemesi ve izinli tekrar); `git diff --check`; `git status --short`; `git diff --stat`; medya boyutu/Windows metadata kontrolleri ve production Chromium manuel akış/viewport/console kontrolleri.

17. **Tüm zorunlu kontrol sonuçları:**

   | Kontrol | Sonuç |
   | --- | --- |
   | `npm run validate:exterior-media` | PASS: 4 WebP + 6 MP4; varlık, byte, 1920×1440, 1,000 sn ve codec |
   | `npm run validate:data` | PASS: 3 Block, 10 UnitType, 78 Unit, 9 exact demo Unit, snapshot parity |
   | `npm run build` | PASS: izinli tekrar, 90 modül |
   | `npm run lint` | PASS: repo geneli |
   | `npx tsc -b` | PASS |
   | `npm run test:localization` | PASS: tr/en/ru, 120 parity key, invalid/storage-failure fallback |
   | `node scripts/test-panorama-adapter.mjs` | PASS: mapping/navigation/validation/lifecycle ve 3 remount |
   | `node scripts/test-tour-help-storage.mjs` | PASS: first visit/persistence/reload/storage failure/session fallback |
   | `npm run staging:verify` | PASS: 14 gerçek/proof medya dahil |
   | Flow A: Home → A → Home | PASS: mapping, lock, completion |
   | Flow B: Home → B → B-301 → close → Home | PASS |
   | Flow C: Home → C → Home | PASS: mapping, lock, completion |
   | Responsive / localization / history / console | PASS: ayrıntılar 13–15; console warning/error boş |
   | `git diff --check` | PASS; yalnızca Windows LF/CRLF bilgilendirmesi |

18. **Dependency değişikliği:** Yok. `dependencies`, `devDependencies` ve `package-lock.json` değişmedi. Yeni validator yalnızca Node built-in modüllerini kullanır.

19. **Medya kaynaklı görünen hizalama/crop/encode sorunları:** Üç forward AV1 MP4'te Chromium'da güçlü yeşil/mor renk sapması; üç reverse H.264 MP4'te görünür `clideo.com` filigranı var. Forward bulgusu dosya doğrudan native player'da açıldığında da aynıdır. Görüntü/video ölçüleri 4:3 olduğundan layout crop veya aspect sorunu yoktur. Sağlanan gerçek görseller yapay hotspot dikdörtgenleriyle eşleşmez; koordinatlar görev sınırı gereği değiştirilmedi.

20. **Bilinen sınırlar:** İlk/son kareler pixel-diff ile ölçülmedi; görsel QA nitel gözlemdir. Test Chromium viewport simülasyonudur; fiziksel cihaz, Safari ve farklı AV1 decoder matrisi test edilmedi. Reduced-motion dalı değiştirilmemiş mevcut kod sözleşmesi üzerinden korundu, bu turda browser emülasyonuyla tekrar zorlanmadı. Büyük medya transfer hacmi optimize edilmedi; görev açıkça preload mimarisini sırf boyut için değiştirmemeyi ister.

21. **Uyarılar / çözülmemiş konu / mimari çelişki:** İlk `npm run build` ve media trace sunucusu sandbox içinde Vite/esbuild `spawn EPERM` verdi; izinli tekrarlar başarılı oldu. Medya renk sapması ve filigran, yeni kaynak dosya/encode sağlanmadan kod tarafında dürüstçe giderilemez; açık medya-teslim uyarısıdır. Locked baseline ile mimari çelişki bulunmadı. Baseline belgeleri, `CURRENT_TASK.md`, task dosyası, domain/seed veri, hotspot koordinatları ve panorama adapter değiştirilmedi.

22. **Kapsam kapanışı:** Yalnızca IMP-024 uygulandı. Gerçek floorplan/panorama/Project Video, yeni geometry, yeni ürün özelliği, dependency, backend/analytics/deploy/provider çalışması yapılmadı. Sonraki IMP'ye başlanmadı.
