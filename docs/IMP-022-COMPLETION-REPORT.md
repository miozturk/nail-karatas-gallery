# IMP-022 — Visual Design Foundation & Exterior Polish Completion Report

Tarih: 2026-09-20

1. **Özet:** Production AppShell, dil seçici, Masterplan/Home, Block exterior sahneleri, SVG hotspot sunumu ve transition çerçevesi için küçük ve tekrar kullanılabilir bir görsel temel oluşturuldu. Sıcak nötr yüzeyler, ölçülü bronz aksan, editoryal tipografi hiyerarşisi, ince sınırlar ve düşük yoğunluklu gölgeler kullanıldı. Route, veri, hotspot koordinatları, transition lifecycle, medya preload/lazy-load ve localization davranışları değiştirilmedi. Gerçek Nail Karataş medyası eklenmedi.

2. **Oluşturulan / değiştirilen dosyalar:**
   - `src/styles/index.css`: CSS tokenları, typography temeli, AppShell, global navigasyon, dil seçici, focus ve reduced-motion sunumu.
   - `src/app/AppShell.tsx`: sunum amaçlı header iç kabı, sınıf adları ve yalnızca exterior bağlamına uygulanan içerik genişliği sınıfı.
   - `src/features/masterplan/MasterplanPage.tsx`
   - `src/features/masterplan/MasterplanPage.css`: giriş hiyerarşisi, sahne çerçevesi, selector ve durum kompozisyonu.
   - `src/features/blocks/BlockPage.tsx`
   - `src/features/blocks/BlockPage.css`: Block başlık/meta/Home/feedback hiyerarşisi ve exterior sahne çerçevesi.
   - `src/components/SvgHotspotLayer/SvgHotspotLayer.css`: inactive, hover/focus/active/disabled polygon sunumu.
   - `src/components/TransitionLayer/TransitionLayer.css`: sahneyle eşleşen geçiş arka plan rengi.
   - `docs/IMP-022-COMPLETION-REPORT.md`: bu rapor.

3. **Görsel tasarım token yaklaşımı:** `:root` altında sayfa/metin/muted/surface/elevated-surface/border/accent/accent-hover/inverse/focus/scene renkleri; 8 basamaklı spacing; üç radius; subtle/overlay shadow; iki duration, ortak easing; focus ring ve exterior content max-width tokenları tanımlandı. Ayrı bir design-system framework veya component library kurulmadı. Son marka renkleri geldiğinde tek katmandan ayarlanabilecek yapı korundu.

4. **Typography yaklaşımı:** Harici font isteği veya font dosyası yoktur. `Segoe UI Variable`, `Segoe UI`, `Noto Sans`, Arial ve sans-serif fallback zinciri kullanıldı. H1/H2/H3, body, metadata, control ve küçük açıklamalar için ağırlık/boyut/harf aralığı hiyerarşisi kuruldu. TR/EN/RU ve Kiril içerikleri aynı sistem stack ile güvenli render oldu. Copy değiştirilmedi; 320 px Rusça satırları kırpılmadan sarıldı.

5. **AppShell sonucu:** Header tam genişlikte sakin bir yüzey ve ince alt sınır alırken içeriği exterior max-width ile hizalandı. Proje kimliği, global Home/Video navigasyonu ve locale grubu tek kompozisyona alındı. Aktif route alt çizgi + renk ile belirgin; production `/video` üzerinde aktif Rusça `Видео` bağlantısı doğrulandı. Header 320 px'te iki kontrollü sıraya ayrılıyor, 44 px hedefleri koruyor ve sahneyi baskılamıyor. Tour tam genişliği ve Video/NotFound önceki içerik genişliği korundu; geniş exterior sınıfı yalnızca Home/Block/Unit/Details bağlamına uygulanıyor.

6. **Dil seçici sonucu:** Mevcut TR/EN/RU düğmeleri bayraksız, kompakt segmentli yüzeye taşındı. Aktif locale aksan yüzeyi/inverse metin ve `aria-pressed=true` ile; pasif/hover/focus durumları ayrı sunuluyor. Her düğme en az 44 × 44 CSS px. Locale değişimi Home ve B Block URL'sini korudu; Browser Back/Forward testi locale değişiminin history girdisi eklemediğini gösterdi.

7. **Masterplan sonucu:** Başlık ile açıklama masaüstünde editoryal iki kolon, dar ekranda tek kolon oldu. Sahne radius/outline/subtle shadow ile ayrıştırıldı ancak logical koordinat katmanına dokunulmadı. A/B/C kontrolleri üç kolonlu tek selector olarak 320 px dahil kullanılabilir kaldı. Pointer hover denetiminde B kontrolü ve B polygonu çift yönlü senkron vurgulandı; klavye focus denetiminde A/B/C kontrolü ile karşılık gelen polygon ayrı ayrı senkron kaldı. Forward seçimde status/video görünür, üç kontrol disabled oldu.

8. **Exterior hotspot sonucu:** Koordinatlar ve hit geometry değiştirilmeden yalnızca CSS fill/stroke dili güncellendi. Inactive durum düşük kontrastlı ve unobtrusive; hover bronz aksanlı; seçili/active daha güçlü fakat neon olmayan dolguya sahip; focus 5 px mavi kesikli stroke; disabled durum düşük yoğunluklu kesikli sınırdır. Normal desktop/mobile akışta ağır SVG filter/blur eklenmedi.

9. **Block sayfası sonucu:** Category/development metadata, Block başlığı ve contextual Home kontrolü sunum hiyerarşisine alındı. Status ve aktif Unit bilgisi sabit feedback alanında tutuldu. Scene ana odak olarak geniş exterior ölçüsünü kullanıyor. Home kontrolü 320–1440 matrisinde 44 px yüksek kaldı. B-301 seçiminde Quick Card mobilde sahneden 12 px sonra yerleşti; aktif hotspot doğru kaldı, kart kapandı ve reverse Home çalıştı. Quick Card/Details final styling kapsamına girilmedi.

10. **Transition presentation sonucu:** Video `object-fit: contain`, aynı SceneStage frame'i, mevcut preload isteği, play/error/ended/timeout ve reduced-motion kodları değiştirilmedi. Yalnızca transition arka planı scene tokenıyla eşleştirilerek beyaz flash riski azaltıldı. Production Flow 1 ve Flow 2'de forward/reverse video görünürken ilgili kontrol ve hotspotlar kilitlendi; tamamlanınca doğru route'a geçildi. Gözle görülür scene ölçüsü/layout sıçraması oluşmadı.

11. **Responsive sonucu:** In-app Chromium viewport simülasyonu kullanıldı; her ölçüm production staging build üzerinde Home ve B Block için tekrarlandı.

   | Viewport | Scene ölçüsü | Oran | Masterplan selector min. | Block Home | Yatay taşma |
   | --- | ---: | ---: | ---: | ---: | --- |
   | 320 × 844 | 288 × 216 | 1,3333 | 52 px | 44 px | Yok |
   | 390 × 844 | 358 × 268,5 | 1,3333 | 56 px | 44 px | Yok |
   | 768 × 1024 | 720 × 540 | 1,3333 | 56 px | 44 px | Yok |
   | 1280 × 800 | 1072 × 804 | 1,3333 | 56 px | 44 px | Yok |
   | 1440 × 900 | 1072 × 804 | 1,3333 | 56 px | 44 px | Yok |

   1280/1440 görünümde exterior max-width sahneyi 1072 px içerik genişliğinde sınırlar; kontroller dikey kaydırmayla erişilebilir kalır. 320 px Rusça Home ve B Block ayrıca görsel olarak incelendi; header, selector, başlık, açıklama ve caption clipping üretmedi.

12. **TR / EN / RU görsel regression sonucu:** 390 px production Home üzerinde sırasıyla `Home / Masterplan`, `Главная / Генплан`, `Ana Sayfa / Vaziyet Planı`; B Block üzerinde `Block B`, `Блок B`, `B Blok` aynı URL üzerinde render oldu. Her dilde tek locale düğmesi `aria-pressed=true`; route değişmedi ve yatay taşma oluşmadı. 320 px worst-case Rusça ölçümünde `scrollWidth === clientWidth` kaldı. Locale persistence mevcut sürümlü storage sözleşmesi üzerinden devam ediyor.

13. **Accessibility / focus sonucu:** Semantic button/link yapısı ve native nav/header/main/figure yapısı korundu. Locale, global nav ve contextual Home pratik 44 px hedefleri koruyor. Klavye Tab kontrolünde locale düğmesinin focus halkası `3px solid rgb(40, 93, 120)`; Unit hotspot focus kararlı durumda 5 px aynı focus rengi ve `12 6` dash oldu. A/B/C control focus → polygon senkronu geçti. B control ve B-301 hotspot Enter ile aktive edildi. `aria-pressed`, `aria-disabled`, translated accessible labels ve reduced-motion davranışı korunuyor.

14. **Scene / SVG alignment sonucu:** SceneStage ve SVG viewBox/1920 × 1440 katman kodu ile polygon koordinat dosyaları değiştirilmedi. Beş viewportta sahne oranı tam 4:3 ölçüldü. Base, SVG interaction ve transition video aynı SceneStage coordinate layer içinde kalıyor; outline/radius/shadow element dış geometrisini veya logical transform hesabını değiştirmiyor.

15. **Staging regression sonucu:** `npm run staging:verify` route shell, hash'li asset, altı proof medya/MIME/range, missing-file 404, DEV bundle izolasyonu ve localhost/filesystem hijyenini geçti. Production tarayıcıda `/block/z`, `/__dev/hotspot-editor` ve `/__dev/panorama-spike` Rusça NotFound, sıfır canvas ve taşmasız görünüm verdi. B-301 Tour bir canvas ile `app-main--tour` bağlamında açıldı; `/video` lazy yüklendi, tek native kontrollü video ve `autoplay=false` verdi. Final production konsolunda warning/error yoktu.

16. **Çalıştırılan komutlar:** `npm run validate:data`; `npm run build` (sandbox denemesi ve izinli tekrar); `npm run lint`; `npx tsc -b`; `npm run test:localization`; `node scripts/test-panorama-adapter.mjs`; `node scripts/test-tour-help-storage.mjs`; `npm run staging:verify`; `npm run staging:serve -- --host 127.0.0.1 --port 4197`; `git diff --check`; `git diff --stat`; `git status --short`; ayrıca development ve production in-app Chromium akış/viewport/focus/console kontrolleri.

17. **Tüm zorunlu kontrol sonuçları:**

   | Kontrol | Sonuç |
   | --- | --- |
   | `npm run validate:data` | PASS: 3 Block, 10 UnitType, 78 Unit, 9 exact demo Unit, valid references ve snapshot parity |
   | `npm run build` | PASS: izinli tekrar, 90 modül ve production chunk'ları |
   | `npm run lint` | PASS: repo geneli |
   | `npx tsc -b` | PASS |
   | `npm run test:localization` | PASS: tr/en/ru, 122 key parity, invalid/storage failure fallback |
   | `node scripts/test-panorama-adapter.mjs` | PASS: mapping/navigation/validation/lifecycle ve 3 remount |
   | `node scripts/test-tour-help-storage.mjs` | PASS: first visit/persistence/reload/storage failure/session fallback |
   | `npm run staging:verify` | PASS |
   | Flow 1: Home → B → Home | PASS: pointer/keyboard, forward/reverse ve transition lock |
   | Flow 2: Home → B → B-301 → Quick Card kapat → Home | PASS |
   | Flow 3: TR → EN → RU, Home ve Block | PASS: route/context/history korundu |
   | Responsive / 320 Rusça / alignment / console | PASS: tabloda ölçülen beş viewport, 4:3, taşma yok, warning/error yok |
   | `git diff --check` | PASS; yalnızca LF/CRLF çalışma ağacı uyarıları |

18. **Bağımlılıklar:** Eklenmedi. `package.json` ve `package-lock.json` değişmedi; CSS framework, icon library, web font veya başka paket eklenmedi.

19. **Bilinen görsel sınırlar / proof-media etkileri:** Exterior sahneler, polygonlar ve MP4'ler mevcut sentetik `DEVELOPMENT-ONLY` proof varlıklarıdır; gerçek Nail Karataş render/cephe/panorama/video medyası değildir. Bu nedenle renk/kontrast tokenları final production renderlarıyla yeniden ayarlanabilir. Gerçek medya crop/ton/ilk-son frame uyumu bu görevden çıkarılamaz. Testler in-app Chromium viewport simülasyonudur; fiziksel telefon, Safari veya yüksek/DPR ekran testi değildir. Quick Card, Details, Tour/minimap/help, Project Video ve DEV araçları final görsel tasarıma taşınmadı.

20. **Uyarılar / çözülmemiş konu / mimari çelişki:** İlk sandbox `npm run build` denemesi Vite/esbuild alt sürecinde `spawn EPERM` verdi; aynı final kaynak izinli bağlamda başarıyla build edildi. `git diff --check` yalnızca Windows LF/CRLF normalizasyon uyarıları verdi, whitespace hatası yoktur. Açık işlevsel sorun veya baseline/mimari çelişki bulunmadı. Locked baseline belgeleri, `CURRENT_TASK.md`, görev dosyası, seed data, hotspot koordinatları, medya ve dependency dosyaları değişmedi.

21. **Kapsam kapanışı:** Yalnızca IMP-022 uygulandı. Gerçek medya entegrasyonu, route/veri değişikliği, yeni özellik, deploy/host seçimi veya kapsam dışı sayfaların final tasarımı yapılmadı. Sonraki IMP'ye başlanmadı.
