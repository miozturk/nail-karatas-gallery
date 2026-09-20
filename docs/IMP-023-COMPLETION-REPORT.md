# IMP-023 — Customer UI Polish: Unit / Tour / Video Completion Report

Tarih: 2026-09-20

1. **Özet:** Unit Quick Card, Unit Details drawer, Virtual Tour shell, oda kontrolleri, minimap, first-use yardım diyaloğu, Project Video ve yerelleştirilmiş NotFound yüzeyi IMP-022’de kurulan sıcak nötr / bronz aksanlı görsel dile taşındı. Çalışma yalnızca sunum ve CSS sınıflarıyla sınırlandı; rota, domain/seed veri, hotspot koordinatları, panorama adapter semantiği, scene graph, medya lifecycle ve lazy-load davranışı değiştirilmedi. Gerçek Nail Karataş medyası eklenmedi.

2. **Oluşturulan / değiştirilen dosyalar:**
   - `src/styles/index.css`
   - `src/app/AppShell.tsx`
   - `src/app/NotFoundPage.tsx`
   - `src/app/router.tsx`
   - `src/features/units/UnitQuickCard.tsx`
   - `src/features/units/UnitQuickCard.css`
   - `src/features/units/UnitDetailsDrawer.tsx`
   - `src/features/units/UnitDetailsDrawer.css`
   - `src/features/tours/TourPage.tsx`
   - `src/features/tours/TourPage.css`
   - `src/features/tours/VirtualTour.tsx`
   - `src/features/tours/TourHelp.tsx`
   - `src/features/video/VideoPage.tsx`
   - `src/features/video/VideoPage.css`
   - `docs/IMP-023-COMPLETION-REPORT.md` (bu rapor)

3. **Quick Card görsel sonucu:** Kart, yükseltilmiş sıcak yüzey, ince güçlü sınır, kontrollü overlay gölgesi ve net başlık/geri dönüş hiyerarşisi aldı. Plan alanı kırık medya izlenimi yerine şematik plan motifi, başlık ve açık DEVELOPMENT-ONLY notuyla kasıtlı proof içerik olarak sunuluyor. Metadata satırlarında etiket/değer ayrımı ve ayırıcılar güçlendirildi. `Sanal Tur` birincil bronz aksiyon, `Detayları Gör` ikincil aksiyon oldu; kapatma/bloğa dönüş bağlantısı 44 px hedefi koruyor. Seçili Unit’in sahnedeki mevcut aktif SVG durumu değişmedi.

4. **Details drawer görsel sonucu:** Drawer, Quick Card ile aynı yüzey/radius/sınır/gölge ve action diline geçti. Metadata masaüstünde iki kolonlu, dar ekranda tek kolonlu; değerler okunaklı biçimde hizalı. Plan ve galeri alanları sakin şematik yüzeylerle intentional placeholder olarak sunuluyor. `Quick Card'a Dön`, `Sanal Tur` ve header’daki `Bloğa Dön` erişilebilir kaldı. Panel sabit/fixed yapılmadı; sahnenin alt kenarında kalıp belgeyle dikey kaydığı için küçük ekranda sahne bağlamını kapatmıyor.

5. **Tour shell sonucu:** Panorama ana görsel alan olmaya devam ediyor. Header, route bağlamı, DEVELOPMENT-ONLY notu ve `Daireye Dön` aksiyonu ortak hiyerarşiye bağlandı. Viewer ince sınır/radius/subtle shadow aldı. Unavailable yüzeyi 390 px’te A-003 rotasında doğrulandı; sıfır canvas ile açık ve tutarlı panel gösterdi. Başlatma, hata ve route-level lazy fallback metinlerine ortak status/panel sunumu verildi; adapter ve lazy import kodu değiştirilmedi.

6. **Room controls sonucu:** Oda menüsü wrap eden sakin yüzeylerden oluşuyor; aktif oda bronz/inverse durumla açıkça ayırt ediliyor. Inactive/hover/focus durumları ayrı. 320 px Rusça’da hedefler 44 px yüksek kaldı ve üçüncü oda güvenli biçimde yeni satıra geçti. Enter ile `Hall/Hol/Холл` seçimi çalıştı; aktif düğmede ölçülen focus halkası `3px solid rgb(40, 93, 120)`, offset `3px`. Pannellum-native kontrollere görsel yeniden tasarım uygulanmadı.

7. **Minimap sonucu:** Minimap daha hafif yarı opak yüzey, ince sınır ve sakin gölge aldı. Aktif bakış noktası bronz dolgu ve dolu nokta; inactive noktalar beyaz yüzey ve boş nokta ile okunuyor. Uzun etiketler `white-space: normal` ile güvenli sarılıyor. 320 px’te genişletilmiş minimap 281 px, daraltılmış durum 281 × 62 px; üç viewpoint hedefi 44 px. Masaüstünde panorama üzerinde kompakt overlay, 600 px altı ve kısa landscape’te normal akış yerleşimi korunuyor. Veri, scene ID ve şematik konumlar değişmedi.

8. **First-use help sonucu:** Native dialog; güçlü başlık, muted giriş, bronz marker’lı kompakt talimat listesi ve birincil `Turu Keşfet` aksiyonu aldı. 320 × 844 ölçümünde TR 267 × 653,77 px, EN 267 × 607,39 px, RU 267 × 795,69 px; üçünde de yatay taşma yok ve aksiyon 44 px. Escape kapatma sonrası odak `Daireye Dön / Return to Unit / Вернуться к помещению` bağlantısına döndü. Dismissal persistence değişmedi; aynı origin’de locale değişimleri yardımı yeniden açmadı.

9. **Project Video sonucu:** `/video` için exterior token genişliğiyle hizalı, image-first 16:9 oynatıcı kompozisyonu oluşturuldu. Heading, DEVELOPMENT-ONLY notu, framed native player, loading/ready/error status satırı ve Home dönüşü aynı sistemde. `controls=true`, `autoplay=false`, `preload="metadata"` ve mevcut unmount cleanup aynen korundu. Native oynat/duraklat 390 ve 1280 px’te çalıştı; route’a Back ile yeniden girişte video `paused=true`, `currentTime=0` idi.

10. **NotFound sonucu:** Lokalize NotFound içeriği centered sıcak yüzey, ince aksan çizgisi, editoryal heading ve belirgin birincil Home aksiyonuna taşındı. TR/EN/RU heading’leri ve Home dönüşü doğrulandı. `/__dev/hotspot-editor` ile `/__dev/panorama-spike` production’da aynı NotFound yüzeyini ve sıfır canvas gösterdi.

11. **Shared token/style reuse sonucu:** IMP-022 renk, spacing, radius, shadow, duration ve focus tokenları yeniden kullanıldı. `ui-action` primary/secondary/quiet, `ui-notice`, `ui-status` ve `route-loading` küçük ortak sunum sınıfları eklendi; ayrı component library veya framework kurulmadı. Quick Card, Details, Tour, Video ve NotFound aynı action/focus/surface sözlüğünü kullanıyor.

12. **320 / 390 / 768 / 1280 / 1440 / landscape sonucu:** In-app Chromium production staging build üzerinde `scrollWidth === clientWidth` ölçütü kullanıldı. Dikey scrollbar bulunan exterior/Tour sayfalarında nominal viewport yerine gerçek `clientWidth` esas alındı.

   | Viewport | Quick Card | Details | Tour viewer / minimap | Video | NotFound | Yatay taşma |
   | --- | --- | --- | --- | --- | --- | --- |
   | 320 × 844 RU | 273 px | 273 px | 283 × 466,19 / 281 px | 286 × 160,88; 16:9 | 288 px | Yok |
   | 390 × 844 RU | 343 px | 343 px | 353 × 466,19 / 351 px | 356 × 200,25; 16:9 | 358 px | Yok |
   | 768 × 1024 RU | 304 px overlay | 673 px | 723 × 667,59 / 320 px | 718 × 403,88; 16:9 | 670,16 px | Yok |
   | 1280 × 800 RU | 304 px overlay | 704 px | 1235 × 522 / 320 px | 1070 × 601,88; 16:9 | 674 px | Yok |
   | 1440 × 900 RU | 304 px overlay | 704 px | 1395 × 587 / 320 px | 1070 × 601,88; 16:9 | 674 px | Yok |
   | 844 × 390 Tour | — | — | 799 × 275 / 797 px normal akış | — | — | Yok |

   Tüm essential custom kontroller en az 44 px. 320 ve 390’da kart/drawer aksiyonları tam genişlikte ve sayfa dikey kaydırmasıyla erişilebilir. Landscape Tour’da room menu, panorama, minimap collapse/expand ve Unit dönüşü çalıştı.

13. **TR / EN / RU regression sonucu:** 390 px’te Quick Card, Details, Tour, Video ve NotFound üç locale için ayrı ayrı render edildi; doğru heading ve `html lang` değeri görüldü, hiçbirinde yatay taşma oluşmadı. Locale seçimi `/block/b/unit/B-301` ve `/video` URL’sini değiştirmedi. `/video` üzerinde EN seçildikten sonra Back doğrudan `/`, Forward doğrudan `/video` verdi; locale history girdisi oluşmadı. Tour’da Hol seçiliyken RU → EN değişiminde aktif scene `Hall` olarak korundu, tek canvas kaldı ve dismissed help yeniden açılmadı. Localization testi 122 key parity ile geçti; yeni çeviri anahtarı gerekmedi.

14. **Accessibility/focus sonucu:** Semantic link/button/nav/section/dialog yapısı korundu. NotFound ve paneller `aria-labelledby`, Tour status/error semantiği, minimap `aria-expanded`/`aria-controls`, locale `aria-pressed` ve oda `aria-pressed` sözleşmelerini koruyor. Custom aksiyonlar ve viewpoint kontrolleri en az 44 px; klavye focus halkası görünür. Dialog modal semantiği, Escape davranışı ve focus return geçti. Global reduced-motion kuralı ile transition reduced-motion kodu değiştirilmedi. Native video semantiği ve kontrolleri korundu; redundant ARIA eklenmedi.

15. **Performance/lifecycle regression sonucu:** Production istek günlüğünde temiz Home yalnızca hash’li index JS/CSS istedi; panorama, Pannellum, Tour, Video veya project-video medyası istemedi. Doğrudan Tour; Tour CSS/JS, Pannellum CSS/JS ve yalnızca `living-room.jpg` istedi. Doğrudan Video; Video CSS/JS ile `project-video-proof.mp4` istedi. Üç Tour mount/unmount döngüsünün her birinde canvas `1 → 0`; 320/390/1280/landscape dönüşlerinde de Unit rotasında canvas 0. Flow C’de Video geri girişte duraklatılmış ve zamanı sıfırlanmıştı. Yeni eager import, dependency veya medya yolu eklenmedi.

16. **Staging regression sonucu:** `npm run staging:verify`; dokuz SPA route shell’i, hash’li iki entry asset, altı medya/MIME/range isteği, eksik asset 404, DEV bundle izolasyonu ve localhost/filesystem hijyeni için PASS verdi. Production DEV rotaları tarayıcıda localized NotFound ve sıfır canvas gösterdi. Test edilen production akışlarının tarayıcı konsolunda warning/error yoktu.

17. **Çalıştırılan komutlar:** `npm run validate:data`; `npm run build` (sandbox denemesi ve izinli tekrar); `npm run lint`; `npx tsc -b`; `npm run test:localization`; `node scripts/test-panorama-adapter.mjs`; `node scripts/test-tour-help-storage.mjs`; `npm run staging:verify`; `npm run staging:serve -- --host 127.0.0.1 --port 4199`; ek first-use origin’i için aynı sunucu port 4200; `node scripts/inspect-media-loading.mjs` (sandbox denemesi ve izinli tekrar); `git diff --check`; `git diff --stat`; `git status --short`; kaynak/package/locked-baseline diff auditleri. Ayrıca production in-app Chromium ile Flow A–D, locale, responsive, focus, medya isteği ve lifecycle kontrolleri çalıştırıldı.

18. **Tüm zorunlu kontrol sonuçları:**

   | Kontrol | Sonuç |
   | --- | --- |
   | `npm run validate:data` | PASS: 3 Block, 10 UnitType, 78 Unit, 9 exact demo Unit, valid references ve snapshot parity |
   | `npm run build` | PASS: izinli tekrar, 90 modül ve production chunk’ları |
   | `npm run lint` | PASS: repo geneli |
   | `npx tsc -b` | PASS |
   | `npm run test:localization` | PASS: tr/en/ru, 122 parity key, invalid/storage-failure fallback |
   | `node scripts/test-panorama-adapter.mjs` | PASS: mapping/navigation/validation/lifecycle ve 3 remount |
   | `node scripts/test-tour-help-storage.mjs` | PASS: first visit/persistence/reload/storage failure/session fallback |
   | `npm run staging:verify` | PASS |
   | Flow A, 390 / 1280 | PASS: Home → B → B-301 → Quick Card → Details → Quick Card → Block → reverse Home |
   | Flow B, 390 / 1280 | PASS: oda menüsü → hotspot → minimap collapse/expand → Unit dönüşü; canvas cleanup 0 |
   | Tour, 320 / 844 × 390 | PASS: aynı oda/hotspot/minimap/Unit dönüşü etkileşimleri, taşma yok |
   | Flow C, 390 / 1280 | PASS: native play/pause → Home → Back Video temiz state → Forward Home |
   | Flow D, 390 / 1280 | PASS: localized NotFound → Home |
   | Responsive / 320 RU / TR-EN-RU / focus / console | PASS; ayrıntılar 12–16. maddelerde |
   | `git diff --check` | PASS; yalnızca Windows LF/CRLF normalizasyon uyarıları |

19. **Eklenen dependency:** Yok. `package.json` ve `package-lock.json` değişmedi; CSS/UI framework, icon library, web font veya başka paket eklenmedi.

20. **Bilinen görsel sınırlar / proof-media etkileri:** Exterior sahne, SVG polygon, panoramalar, minimap şeması ve proje videosu mevcut sentetik DEVELOPMENT-ONLY proof içerikleridir; gerçek Nail Karataş medyası değildir. Gerçek plan/render/video geldiğinde crop, ton, contrast ve panel-overlay ayarları yeniden görsel QA gerektirebilir. Testler in-app Chromium viewport simülasyonudur; fiziksel telefon, Safari, yüksek DPR ekran veya gerçek büyük medya/ağ testi değildir. Ağ hatası zorlanmadı; mevcut error yollarının semantiği korunup yeni görsel stilleri kaynak koddan doğrulandı.

21. **Uyarılar / çözülmemiş konu / mimari çelişki:** İlk sandbox `npm run build` ve `node scripts/inspect-media-loading.mjs` denemeleri Vite/esbuild alt sürecinde `spawn EPERM` verdi; her ikisi de izinli bağlamda başarıyla tekrarlandı. `git diff --check` yalnızca LF/CRLF normalizasyon uyarıları yazdı, whitespace hatası vermedi. Açık işlevsel sorun, çözülmemiş kabul kriteri veya baseline/mimari çelişki bulunmadı. Locked baseline belgeleri, `CURRENT_TASK.md`, görev dosyası, seed/domain verisi, hotspot koordinatları, panorama adapter ve medya dosyaları değişmedi.

22. **Kapsam kapanışı:** Yalnızca IMP-023 uygulandı. Gerçek medya, rota/veri değişikliği, yeni ürün özelliği, backend/analytics/deploy/provider çalışması yapılmadı. Sonraki IMP’ye başlanmadı.
