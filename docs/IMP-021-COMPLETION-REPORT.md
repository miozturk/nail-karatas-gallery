# IMP-021 — TR / EN / RU Localization Foundation Completion Report

Tarih: 2026-09-19

1. **Özet:** Müşteri-facing production demo arayüzü için bağımlılıksız, tip güvenli TR / EN / RU yerelleştirme temeli eklendi. Locale çalışma anında değişiyor, güvenli biçimde saklanıyor ve route/domain/media/panorama adapter/staging mimarileri korunuyor. Final görsel tasarım yapılmadı.

2. **Oluşturulan / değiştirilen dosyalar:**
   - `src/i18n/locale.ts`
   - `src/i18n/I18nContext.ts`
   - `src/i18n/I18nProvider.tsx`
   - `src/i18n/useI18n.ts`
   - `src/i18n/formatters.ts`
   - `src/i18n/translations/tr.ts`
   - `src/i18n/translations/en.ts`
   - `src/i18n/translations/ru.ts`
   - `src/main.tsx`
   - `src/app/AppShell.tsx`
   - `src/app/router.tsx`
   - `src/app/NotFoundPage.tsx`
   - `src/features/masterplan/MasterplanPage.tsx`
   - `src/features/blocks/BlockPage.tsx`
   - `src/features/units/UnitQuickCard.tsx`
   - `src/features/units/UnitDetailsDrawer.tsx`
   - `src/features/tours/TourPage.tsx`
   - `src/features/tours/VirtualTour.tsx`
   - `src/features/tours/TourHelp.tsx`
   - `src/features/tours/TourPage.css`
   - `src/features/video/VideoPage.tsx`
   - `src/styles/index.css`
   - `scripts/test-localization.mjs`
   - `package.json`
   - `docs/IMP-021-COMPLETION-REPORT.md`

3. **i18n mimarisi:** `I18nProvider`, React Context ve `useI18n` hook'u kullanılıyor. Türkçe sözlük canonical key shape'i tanımlıyor; EN/RU sözlükleri `satisfies TranslationDictionary` ile aynı key setine derleme zamanında bağlanıyor. Bileşenler yalnızca tipli `t()` çağrısı kullanıyor. Development'ta beklenmeyen key açık hata üretir; production'ta key metniyle güvenli sonuç döner. Yeni global state veya localization framework eklenmedi.

4. **Locale persistence / fallback:** Desteklenen set tam olarak `tr`, `en`, `ru`; varsayılan `tr`. Sürümlemeli `nail-karatas-locale-v1` anahtarı kullanılıyor. Unsupported/boş değer ve storage getter/read/write hataları `try/catch` ile TR'ye güvenli düşüyor; yazma engellense de oturum içi locale çalışıyor. Temiz origin varsayılan TR verdi. EN seçimi direct `/video` yenilemesinden sonra geri geldi. Geçici, sonradan silinen local test harness'i ile `de` değeri storage'a yazıldı; uygulama `/` açılışında `tr`, Türkçe aktif düğme ve Türkçe Home ile güvenli fallback gösterdi.

5. **Dil seçici:** AppShell'e bayraksız TR / EN / RU düğmeleri eklendi. Tam dil adları accessible name, aktif seçim `aria-pressed=true` ve görsel aktif stil ile belirtiliyor. Düğmeler 44 px minimum hedefe, görünür focus'a ve wrapping yerleşime sahip. Locale tıklaması URL değiştirmiyor veya navigation çağırmıyor.

6. **TR / EN / RU dictionary kapsamı:** 122 canonical key; AppShell, route fallback'leri, Masterplan, Block, Quick Card, Details, Tour, minimap, help, Project Video ve NotFound kapsamını içeriyor. Otomatik test üç dictionary'nin aynı ve boş olmayan key setine sahip olduğunu doğruladı.

7. **Domain-data / presentation formatter yaklaşımı:** Block/Unit/UnitType/scene kimlikleri, route parametreleri, resmi unit numaraları ve seed kayıtları değiştirilmedi/çoğaltılmadı. Category, availability, bilinen floor/orientation tokenları, mevcut UnitType sunum adları, alan sayıları ve DEVELOPMENT-ONLY oda adları presentation formatter'larında çevriliyor. Alan sayıları locale-aware `Intl.NumberFormat` ile yazılıyor ve `m²` korunuyor. Tanınmayan freeform değer çevrilmeden canonical metin olarak kalıyor.

8. **AppShell / Masterplan / Block:** Global navigasyon, dil seçici, Home/Video; Masterplan başlığı, giriş, sahne/hotspot accessible adları, blok kontrolleri ve transition durumları; Block başlığı, category, Home dönüşü, status, scene/hotspot/transition etiketleri ve DEVELOPMENT-ONLY açıklamalar üç dilde çalışıyor. 1920 × 1440 sahne ve SVG geometrisi değişmedi.

9. **Quick Card / Details:** Başlıklar, kapatma/dönüşler, field adları, category/floor/type/orientation/availability sunumları, plan/galeri placeholder'ları ve tüm aksiyonlar çevrildi. Unit ID, resmi numara, rooms ve ham numeric domain değerleri canonical kaldı. 320 px Rusça Quick Card/Details genişliği 273 px; aksiyonlar en az 44 px ve yatay taşma yok.

10. **Tour / minimap / help:** Başlık/dönüş, unavailable/loading/error/status, oda menüsü, active room, viewer accessible adı, minimap/toggle/nokta adları ve first-use yardım bütünü çevrildi. Adapter sözleşmesi değişmedi; localized scene/hotspot adları aynı scene ID graph'ı üzerinden sunuluyor. Locale değişiminde viewer güvenli dispose/remount olurken aktif scene ID korunuyor; Hall/Hol değişim sonrası aynı kaldı. Help dismissal anahtarı `nail-karatas-tour-help-v1` ve session fallback'i değiştirilmedi; EN/RU değişimlerinde yardım yeniden açılmadı.

11. **Project Video / NotFound:** Heading, DEVELOPMENT-ONLY notice, accessible video adı, HTML5 fallback, loading/ready/error status ve Home dönüşü çevrildi. Native video kontrol chrome'u çevrilmedi. Geçersiz genel rota ve iki production DEV rotası locale'e göre NotFound gösterdi; DEV UI/canvas oluşmadı.

12. **`<html lang>` / accessibility:** Provider her locale değişiminde `document.documentElement.lang` değerini `tr` / `en` / `ru` yapıyor. Navigasyon, dil grubu, scene/hotspot, card/detail action, panorama/minimap ve video adları yerelleştirildi. Klavye testinde Tour Hol seçimi Enter, minimap collapse Space ile çalıştı. Dialog focus/modal/dismissal davranışı korundu.

13. **Responsive sonucu:** In-app Chromium viewport simülasyonu kullanıldı; fiziksel cihaz/Safari testi değildir. 390 × 844 ve 1280 × 800'de TR/EN/RU için Home, Quick Card, Details, Tour ve Video; 1280'de ayrıca Block ve NotFound ölçüldü, hiçbirinde `scrollWidth > clientWidth` olmadı. 320 × 844 Rusça kontrolde header içerik alanı 305 px, selector 140 px, Quick Card/Details/Tour minimap 273 px; oda ve viewpoint düğmeleri 44 px yükseklikteydi. Rusça first-use dialog 267 × 714,14 px ve aksiyon 44 px; içerik kullanılabilir ve yatay taşmasızdı.

14. **Route / refresh / Back-Forward:** 390 px Türkçe tam akış Home → B → B-301 → Quick Card → Details → Tour → Daireye Dön → reverse Home → Video geçti. İngilizce aynı ana akışta Quick Card, Details ve Tour'a devam etti. Rusça final build üzerinde Home → B → Quick Card → Details → Tour → Unit → reverse Home → Video geçti. Locale değişimi Tour ve Video route'larında URL'yi korudu. EN direct reload'da geri geldi. EN switch sonrası Back `/` ve Forward `/video` verdi; araya locale history girdisi eklenmedi. RU Tour'da EN ve tekrar RU geçişi URL'yi ve aktif Hol sahnesini korudu.

15. **Staging regression:** `npm run staging:verify` final build'de route shell, hash'li entry assetleri, altı medya/MIME/range, missing asset 404, DEV bundle izolasyonu ve localhost/filesystem hijyenini geçti. Production `/__dev/hotspot-editor` ve `/__dev/panorama-spike` Rusça NotFound ve sıfır canvas gösterdi. Test edilen tarayıcı akışlarında console warn/error listesi boştu.

16. **Çalıştırılan komutlar:** `npm run validate:data`; `npm run build`; `npm run lint`; `npx tsc -b`; `node scripts/test-panorama-adapter.mjs`; `node scripts/test-tour-help-storage.mjs`; `npm run test:localization`; `npm run staging:verify`; yerel `npm run staging:serve` portlarıyla production browser kontrolleri; `git diff --check`; `git status --short`; `git diff --stat`; locked/seed/package-lock diff auditleri.

17. **Doğrulama sonuçları:**

   | Kontrol | Sonuç |
   | --- | --- |
   | `npm run validate:data` | PASS: 3 Block, 10 UnitType, 78 Unit, 9 exact demo Unit, snapshot parity |
   | `npm run build` | PASS: 90 modül, production chunk'ları oluştu |
   | `npm run lint` | PASS: repo geneli |
   | `npx tsc -b` | PASS |
   | `node scripts/test-panorama-adapter.mjs` | PASS: mapping/navigation/validation/lifecycle ve 3 remount |
   | `node scripts/test-tour-help-storage.mjs` | PASS: persistence/reload/storage failure/session fallback |
   | `npm run test:localization` | PASS: tr/en/ru, 122 key parity, invalid/storage-failure fallback |
   | `npm run staging:verify` | PASS |
   | Browser flow / responsive / console | PASS; ayrıntılar 12–15. maddelerde |
   | `git diff --check` | PASS |

18. **Bağımlılıklar:** Eklenmedi. `package-lock.json` değişmedi; i18n yalnızca React/TypeScript ve browser API'leriyle uygulandı.

19. **Çevrilemeyen freeform içerik / sınırlar:** Tanınmayan domain freeform değerleri yanlış çeviri uydurulmaması için aynen gösterilir. Canonical IDs ve resmi numaralar çevrilmez. Pannellum'un kendi `Loading...` / kontrol metinleri ve native video control chrome görev gereği çevrilmedi. DEVELOPMENT-ONLY sentetik medya gerçek Nail Karataş içeriği değildir.

20. **Uyarılar / çözülmemiş konu / mimari çelişki:** İlk sandbox build denemesi Vite/esbuild `spawn EPERM` ile durdu; izinli bağlamdaki tekrar ve son final build başarıyla geçti. Git yalnızca LF/CRLF normalizasyon uyarıları verdi; whitespace hatası yok. Fiziksel telefon/Safari testi yapılmadı. Açık işlevsel sorun veya baseline/mimari çelişki bulunmadı. Kilitli baseline, task, seed ve `package-lock.json` dosyaları değişmedi.

21. **Kapsam kapanışı:** Yalnızca IMP-021 uygulandı. Route schema/URL locale, backend, global state, localization framework, gerçek medya, final visual design, hosting sağlayıcısı veya Availability/Brochure/Location/Contact eklenmedi. Sonraki IMP'ye başlanmadı.
