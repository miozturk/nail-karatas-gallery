# IMP-026 — Exterior Layout Stability & Transition Handoff Completion Report

Tarih: 2026-09-21

## 1. Özet

Customer-facing exterior akışta route'a göre değişen header, yatay içerik ve SceneStage geometrisi ölçülerek kararlı bir layout sözleşmesine bağlandı. Standards-based `scrollbar-gutter: stable`, breakpoint bazlı ortak exterior intro slot'u, semantik olarak gizli kalan global Home alanı için yalnızca görsel yer tutucu ve native `Image.decode()` tabanlı hedef sahne hazırlığı eklendi. Transition başarı yolunda videonun ilk kareye geri sarılması kaldırıldı; terminal kare hedef route commit'ine kadar korunuyor. Route şeması, domain/seed veri, hotspot koordinatları, WebP/MP4 dosyaları ve panorama mimarisi değiştirilmedi.

## 2. Oluşturulan / değiştirilen dosyalar

- `src/styles/index.css`: stable scrollbar gutter, exterior intro-slot değişkenleri, header/nav geometrisi.
- `src/app/AppShell.tsx`: contextual route'larda semantiği değiştirmeden Home bağlantısı genişliğini rezerve eden görsel placeholder.
- `src/features/masterplan/MasterplanPage.tsx`, `MasterplanPage.css`: ortak intro slot'u ve hedef Block WebP readiness bilgisi.
- `src/features/blocks/BlockPage.tsx`, `BlockPage.css`: ortak intro slot'u ve Home WebP readiness bilgisi.
- `src/components/TransitionLayer/TransitionLayer.tsx`: hedef görsel predecode ve terminal-kare handoff davranışı.
- `src/components/TransitionLayer/README.md`: destination readiness ve güncel başarı/failure cleanup sözleşmesi.
- `docs/IMP-026-COMPLETION-REPORT.md`: bu rapor.

## 3. Baseline layout ölçüm tablosu

Değişiklikten önce production Chromium üzerinde `getBoundingClientRect()` ile ölçüldü. Değerler `X / Y / W / H` CSS px biçimindedir.

| Viewport / route | Header | Header inner | Intro/header region | SceneStage | client / scroll width | Dikey scroll |
| --- | --- | --- | --- | --- | --- | --- |
| 1280×800 Home | `0 / 0 / 1265 / 75` | `72.5 / 0 / 1120 / 74` | `96.5 / 123 / 1072 / 143.34` | `96.5 / 298.34 / 1072 / 804` | `1265 / 1265` | Var |
| 1280×800 Block B | `0 / 0 / 1265 / 75` | `72.5 / 0 / 1120 / 74` | `96.5 / 123 / 1072 / 195.5` | `96.5 / 342.5 / 1072 / 804` | `1265 / 1265` | Var |
| 1280×800 Unit / Details | aynı | aynı | aynı | `96.5 / 342.5 / 1072 / 804` | `1265 / 1265` | Var |
| 1280×800 Video | `0 / 0 / 1280 / 75` | `80 / 0 / 1120 / 74` | — | — | `1280 / 1280` | Yok |
| 390×844 Home | `0 / 0 / 390 / 115` | `0 / 0 / 390 / 114` | `16 / 147 / 358 / 110.86` | `16 / 281.86 / 358 / 268.5` | `390 / 390` | Yok |
| 390×844 Block B | aynı | aynı | `16 / 147 / 358 / 255.2` | `16 / 426.2 / 358 / 268.5` | `390 / 390` | Yok |
| 390×844 Unit / Details | `0 / 0 / 375 / 115` | `0 / 0 / 375 / 114` | `16 / 147 / 343 / 255.2` | `16 / 426.2 / 343 / 257.25` | `375 / 375` | Var |
| 320×844 Home | `0 / 0 / 320 / 115` | `0 / 0 / 320 / 114` | `16 / 147 / 288 / 103.02` | `16 / 274.02 / 288 / 216` | `320 / 320` | Yok |
| 320×844 Block B | aynı | aynı | `16 / 147 / 288 / 247.36` | `16 / 418.36 / 288 / 216` | `320 / 320` | Yok |
| 320×844 Unit / Details | `0 / 0 / 305 / 155` | `0 / 0 / 305 / 154` | `16 / 187 / 273 / 263.02` | `16 / 474.02 / 273 / 204.75` | `305 / 305` | Var |

1280 Home→Block sahne Y farkı `44.16 px`, 390 farkı `144.34 px` idi. 320 Unit route'unda scrollbar kaynaklı daralma ayrıca header'ı `40 px` büyütüyordu.

## 4. Tespit edilen unintended layout-shift kök nedenleri

1. Dikey scrollbar bazı route'larda görünürken diğerlerinde görünmiyor, efektif layout genişliği 15 px değişiyordu.
2. 320 px'te bu daralma brand + locale satırını ikinci satıra taşıyıp header yüksekliğini 115 px'ten 155 px'e çıkarıyordu.
3. Home intro ile Block header + feedback toplam yüksekliği farklıydı; SceneStage document-space Y değeri route'a göre değişiyordu.
4. Contextual Home davranışında global Home link'i DOM'dan kaldırılınca Video link'i nav içinde yatay hareket ediyordu.
5. Transition başarı yolunda `currentTime=0` hedef route callback'inden önce çalışıyor, overlay kaldırılmadan ilk karenin kısa süre görünme ihtimalini doğuruyordu.
6. Hedef static WebP route değişiminden önce açıkça decode edilmiyordu; soğuk cache'te sahne arka planının kısa süre açığa çıkma ihtimali vardı.

## 5. Exterior layout contract yaklaşımı

`--exterior-intro-slot-height` masaüstünde `10.75rem`, 600 px ve altında `15rem`; `--exterior-stage-gap` ise `var(--space-5)` olarak tanımlandı. Home ve Block/Unit/Details aynı `.exterior-intro-slot` ve aynı stage gap'i kullanıyor. Slot yalnızca exterior route'lara uygulanıyor; Tour ve Video geometrisi bu sözleşmeye alınmadı. Yeni bir layout framework veya büyük wrapper mimarisi oluşturulmadı.

## 6. Scrollbar-gutter / horizontal alignment sonucu

`:root { scrollbar-gutter: stable; }` scrollbar'ın var/yok durumunda aynı layout gutter'ını rezerve ediyor; kalıcı çizilmiş scrollbar zorlanmıyor. Scroll olmayan route'larda Chromium `clientWidth` değerini nominal viewport olarak raporlasa da render edilen header/main genişliği gutter alanını kullanmıyor ve scroll olan route'la aynı X/W değerini koruyor. Tüm matris boyunca `scrollWidth <= clientWidth`; yatay overflow yok.

## 7. Header stability sonucu

Header 320/390 px'te 115 px, 768/1280/1440 px'te 75 px olarak route'lar arasında sabit kaldı. Mobil brand alanı `7.75rem` ile sınırlandı, locale selector `flex: none` oldu ve üst sıra wrap etmiyor. Contextual route'larda Home link'i accessibility tree'den kaldırılmaya devam ederken aynı metin genişliğinde `aria-hidden`, `visibility:hidden` placeholder kullanılıyor. Böylece Video link'i dahil sağ nav alanı değişmiyor. 44 px link ve locale hedefleri korundu.

## 8. Exterior intro-slot sonucu

Home title/intro ve Block category/title/contextual Home/feedback içeriği breakpoint'e göre ortak slotta tutuluyor. TR/EN/RU ve özellikle 320 px Rusça içerik slot içinde kırpılmadan sarılıyor; absolute positioning veya overlap kullanılmadı. Unit ve Details aynı `BlockPage` kompozisyonunu kullandığından aynı slot sözleşmesini otomatik olarak koruyor.

## 9. SceneStage X/Y/W/H before/after karşılaştırması

| Viewport | Önce Home | Önce Block | Önce Unit/Details | Sonra tüm exterior route'lar | Maks. route delta |
| --- | --- | --- | --- | --- | ---: |
| 320×844 | `16 / 274.02 / 288 / 216` | `16 / 418.36 / 288 / 216` | `16 / 474.02 / 273 / 204.75` | `16 / 411 / 273 / 204.75` | `0 px` |
| 390×844 | `16 / 281.86 / 358 / 268.5` | `16 / 426.2 / 358 / 268.5` | `16 / 426.2 / 343 / 257.25` | `16 / 411 / 343 / 257.25` | `0 px` |
| 1280×800 | `96.5 / 298.34 / 1072 / 804` | `96.5 / 342.5 / 1072 / 804` | aynı | `96.5 / 319 / 1072 / 804` | `0 px` |

Her route'ta scene image ve SVG rect'i SceneStage ile birebir eşleşti. 4:3 oranı korundu; logical 1920×1440 ve hotspot koordinat dosyaları değişmedi.

## 10. Transition handoff kök neden analizi

Video ve source image aynı SceneStage katmanında zaten eşitti; asıl layout problemi destination route'un farklı stage Y değeri ve scrollbar kaynaklı X/W değişimiydi. Lifecycle incelemesi ayrıca başarı callback'inden hemen önce videonun `currentTime=0` yapılmasını bir-frame ilk-kare kaçışı adayı olarak gösterdi. Soğuk hedef WebP için route öncesi decode garantisi yoktu. IMP-025 medya ölçüleri/codec/frame continuity sonuçları geçerli kaldı; kaynak medya değiştirilmedi.

## 11. Destination-image readiness çözümü

`TransitionLayer` opsiyonel `destinationImageSrc` alıyor. Active geçiş başladığında native `Image` oluşturulup target WebP `src` atanıyor ve `decode()` transition ile paralel yürütülüyor. `ended` olayı navigation callback'ini decode promise'i çözüldükten sonra çalıştırıyor. Decode hatası yakalanıp güvenli biçimde navigation'a devam ediliyor; timeout/error fail-safe kullanıcıyı kilitlemiyor. Home yalnızca seçilen Block görselini, reverse akış yalnızca Masterplan görselini aktivasyon anında hazırlıyor.

## 12. Ek handoff çözümü ve gerekçesi

Yeni overlay mimarisi veya fade eklenmedi. En küçük ek lifecycle düzeltmesi olarak başarı yolundaki erken `currentTime=0` kaldırıldı; video terminal karesi callback ve route commit'e kadar kalıyor. Unmount/cleanup hâlâ pause, source temizliği ve reset yapıyor; failure yolunda mevcut reset korunuyor.

## 13. "Dancing elements" audit sonucu

| Eleman | Önceki hareket | Sınıf | Sonuç |
| --- | --- | --- | --- |
| Header bottom | 320 Unit'te +40 px | Unintended | Sabit |
| Project identity / locale | Scrollbar daralmasında wrap ve Y kayması | Unintended | Sabit |
| Global nav / Video | Home link suppression ile X kayması | Unintended | Placeholder ile sabit |
| Exterior title/meta | Route içeriği değişiyor | Intentional content change | Ortak slot içinde |
| Contextual Home | Yalnız Block bağlamında görünür | Intentional content change | Slot anchor'ını değiştirmiyor |
| SceneStage | Route'a göre X/Y/W/H değişimi | Unintended | Tüm exterior route'larda 0 px delta |
| Status / selector | Home selector stage altında, Block feedback slot içinde | Intentional composition | Stage anchor'ını değiştirmiyor |

## 14. Responsive ölçüm sonucu

Production Chromium viewport simülasyonudur.

| Viewport | Header H | Intro slot `X/Y/W/H` | SceneStage `X/Y/W/H` | Home/Block/Unit/Details delta | Yatay overflow |
| --- | ---: | --- | --- | ---: | --- |
| 320×844 | 115 | `16 / 147 / 273 / 240` | `16 / 411 / 273 / 204.75` | 0 px | Yok |
| 390×844 | 115 | `16 / 147 / 343 / 240` | `16 / 411 / 343 / 257.25` | 0 px | Yok |
| 768×1024 | 75 | `24 / 123 / 705 / 172` | `24 / 319 / 705 / 528.75` | 0 px | Yok |
| 1280×800 | 75 | `96.5 / 123 / 1072 / 172` | `96.5 / 319 / 1072 / 804` | 0 px | Yok |
| 1440×900 | 75 | `176.5 / 123 / 1072 / 172` | `176.5 / 319 / 1072 / 804` | 0 px | Yok |

320 px Rusça görsel incelemede brand, locale, nav, Block Home, status, caption ve scene kırpılmadı.

## 15. A/B/C forward-reverse transition regression sonucu

390×844 ve 1280×800 production akışlarında:

- A: `home-to-a.mp4` → `/block/a`; `a-to-home.mp4` → `/`.
- B: `home-to-b.mp4` → `/block/b`; `b-to-home.mp4` → `/`.
- C: `home-to-c.mp4` → `/block/c`; `c-to-home.mp4` → `/`.
- Oynatma sırasında Home'da üç selector + üç hotspot; Block'ta contextual Home + mevcut Unit hotspotları disabled oldu.
- Image/SVG/video rect'leri aynı kaldı; pointer akışında destination rect'i de birebir eşleşti.
- Orta kare görsel denetiminde yeşil/magenta corruption, filigran, crop/stretch veya UI kaynaklı beyaz/siyah flash görülmedi.
- Console warning/error boştu.

## 16. Quick Card / Details stage-anchor sonucu

390 px Flow D `Home → B → B-301 → Quick Card kapat → Home` boyunca SceneStage sürekli `16 / 411 / 343 / 257.25` kaldı. Details direct-route ölçümü aynı rect'i verdi. Quick Card/Details mevcut mobile/desktop sunumunu korudu ve sahne anchor'ını değiştirmedi.

## 17. Browser Back/Forward sonucu

390 px'te forward transition ile `/block/b` açıldıktan sonra Browser Back doğrudan `/`, Forward doğrudan `/block/b` verdi. İki history hareketinde de aktif transition video sayısı `0`; reverse video yalnız contextual Home kontrolüyle oynuyor.

## 18. TR / EN / RU sonucu

320 px Home ve Block B üzerinde TR/EN/RU ayrı ayrı ölçüldü. Locale değişimi URL'yi değiştirmedi; `<html lang>` doğru oldu. Üç locale için header `0 / 0 / 305 / 115`, SceneStage `16 / 411 / 273 / 204.75` kaldı. `scrollWidth <= clientWidth`; Rusça metinler kullanılabilir ve kırpılmamıştı.

## 19. Loading/preload regression sonucu

Yeni temiz production Home sekmesinde gözlenen varlıklar yalnız hash'li entry JS/CSS ve `masterplan.webp` idi. DOM'daki tek transition video elementinin `src=null`, `currentSrc=""` olduğu doğrulandı. Panorama, Project Video, Block sahnesi veya transition MP4 eager istenmedi. Mevcut 150 ms intent preload kodu değiştirilmedi. Destination WebP hazırlığı yalnız active transition sırasında ve yalnız hedef dosya için çalışıyor; global media manager, all-block preload, duplicate video elementi veya request storm eklenmedi.

## 20. Staging sonucu

`npm run staging:verify` 9 route shell, 2 entry asset, 14 gerçek/proof medya, missing-file 404, DEV bundle izolasyonu ve localhost/port/filesystem hijyenini PASS etti. Production `/__dev/hotspot-editor` ve `/__dev/panorama-spike` route'ları lokalize NotFound ve `0` canvas verdi.

## 21. Çalıştırılan komutlar

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
- `git status --short`
- Production Chromium `getBoundingClientRect()` ölçümleri ve 320/390/768/1280/1440 route matrisi.

## 22. Tüm zorunlu kontrol sonuçları

| Kontrol | Sonuç |
| --- | --- |
| `npm run validate:exterior-media` | PASS: 4 WebP + 6 H.264/yuv420p MP4 |
| `npm run validate:data` | PASS: 3 Block, 10 UnitType, 78 Unit, 9 exact demo Unit, snapshot parity |
| `npm run build` | PASS: 90 modül, production chunk'ları |
| `npm run lint` | PASS |
| `npx tsc -b` | PASS |
| `npm run test:localization` | PASS: tr/en/ru, 120 parity key, storage fallback |
| `node scripts/test-panorama-adapter.mjs` | PASS: mapping/navigation/validation/lifecycle ve 3 remount |
| `node scripts/test-tour-help-storage.mjs` | PASS: first visit/persistence/reload/storage failure/session fallback |
| `npm run staging:verify` | PASS |
| `git diff --check` | PASS; yalnız LF/CRLF bilgilendirmeleri |

## 23. Dependency değişikliği

Yok. `package.json` ve `package-lock.json` değişmedi; yeni paket eklenmedi.

## 24. Kalan görsel belirsizlik / insan gözü review notu

Chromium viewport simülasyonunda transition orta kareleri ve handoff gözle incelendi; flash/layout jump görülmedi. Fiziksel telefon, Safari, farklı GPU/decoder ve düşük hızlı gerçek ağ testi yapılmadı. Hedef image decode hatası bilinçli olarak fail-safe navigation'a düşer; çok yavaş/bozuk ağda kaynak medya arızası yine kullanıcıya yansıyabilir. Son müşteri kabulünde gerçek cihazda bir insan gözü review'u önerilir.

## 25. Uyarılar / blocker / mimari çelişki

İlk pre-change `npm run build` sandbox içinde Vite/esbuild `spawn EPERM` verdi; izinli aynı kaynak tekrarında ve final build'de PASS alındı. Playwright'ın transformed SVG polygon semantic click'i elementi ayrıca scroll ettiği için screen-space handoff ölçümü gerçek pointer koordinatıyla tekrarlandı; gerçek pointer akışında source/video/destination rect'i eşitti. Açık blocker veya locked baseline ile mimari çelişki bulunmadı. Locked baseline belgeleri, görev dosyası, domain/seed data, hotspot koordinatları ve medya dosyaları değişmedi.

## 26. Kapsam kapanışı

Yalnızca IMP-026 uygulandı. Hotspot authoring yapılmadı, IMP-027'ye veya başka sonraki göreve başlanmadı.
