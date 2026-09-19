# IMP-019 — Media Loading / Performance Completion Report

Tarih: 2026-09-19

1. **Özet:** Tour ve Video route'ları ayrı JS/CSS chunk'larına taşındı. Geçiş videosu için kullanıcı niyetine bağlı, aynı video elemanını kullanan preload eklendi. Project Video'nun unmount temizliği açık hale getirildi. Production preview ve DEV akışları doğrulandı. Yalnızca IMP-019 uygulandı.

2. **Oluşturulan / değiştirilen dosyalar:**
   - `src/app/router.tsx`: Tour/Video lazy import ve görünür, nötr `role="status"` fallback.
   - `src/components/TransitionLayer/TransitionLayer.tsx`: `preloadRequested`, gecikmeli hazırlık, reduced-motion kontrolü ve kaynak temizliği.
   - `src/features/masterplan/MasterplanPage.tsx`: mevcut blok hover/focus durumundan forward preload isteği.
   - `src/features/blocks/BlockPage.tsx`: contextual Home pointer/focus olayından reverse preload isteği.
   - `src/features/video/VideoPage.tsx`: mount'ta kaynak bağlama; unmount'ta pause, src kaldırma ve load ile bırakma.
   - `src/styles/index.css`: 320 px viewportta klasik dikey scrollbar nedeniyle oluşan yatay taşmayı engellemek için body minimum genişliği kaldırıldı.
   - `scripts/inspect-media-loading.mjs`: yalnızca yerel geliştirme doğrulaması için Vite medya/chunk istek günlüğü. Backend veya deployment yapılandırması değildir.
   - `docs/IMP-019-COMPLETION-REPORT.md`: bu rapor.

3. **Değişiklik öncesi production build:** Uygulama değişikliklerinden önce `npm run build` çıktısı kaydedildi; 82 modül. Ana JS `index-B9BRz7Kj.js` 293,87 kB (gzip 90,84); ana CSS `index-BNejXu3J.css` 8,00 kB (gzip 2,10). Pannellum zaten dinamik import ile ayrılmıştı: JS 58,20 kB (gzip 18,42), CSS 9,50 kB (gzip 2,54). Tour arayüzü, yardım, tur konfigürasyonu ve Video arayüzü ana bundle içindeydi; motor Home'da oluşturulmuyordu. DEV editör/spike adları ve route dizeleri production asset taramasında bulunmadı.

4. **Route-level kararlar:** Tour ve Video lazy yüklendi; AppShell/global navigasyon fallback sırasında görünür kalır. Production ilk Tour girişinde “Sanal tur sayfası yükleniyor…” durumu gözlendi. Home, Block, Unit ve Details eager kaldı: dış sahne ve Quick Card ana akışın ortak küçük bileşenleri; Details route'u aynı BlockPage'e `showDetails` ile bağlanan küçük bir wrapper. Bunu tek başına bölmek, BlockPage'in zaten import ettiği drawer'ı ayırmaz ve anlamlı kazanç sağlamaz. Route doğrulama guard'ları lazy içerikten önce korunuyor. DEV araçlarının mevcut `import.meta.env.DEV` + lazy sınırı değişmedi.

5. **Panorama runtime / medya:** `createPanoramaAdapter()` içindeki dinamik Pannellum import'u korundu; adapter semantiği değişmedi. Motor CSS'i motor chunk'ında kaldı. Mevcut `VirtualTour` yalnızca kullanılabilir Tour için mount edilir. Mevcut async dispose koruması, unsubscribe ve destroy korunuyor. Home/Block/Video motor oluşturmaz. İlk Tour girişinde yalnızca `living-room.jpg`; Hol ve Yatak Odası seçilince ilgili görseller istenir. Üç panoramayı startup'ta veya tur girişinde topluca indiren mekanizma eklenmedi. Pannellum'un mevcut yükleme/hata görünümü ve uygulamanın başlatma/hata metinleri korundu.

6. **Transition preload politikası:**
   - Home açılışında kaynak bağlanmaz ve transition isteği yoktur. A/B/C polygon veya kontrol hover/focus'u forward hazırlığı ister. Mevcut üç hedef tek DEVELOPMENT-ONLY klibi paylaşır; üç ayrı indirme yapılmaz.
   - Block/Unit/Details açılışında reverse kaynak bağlanmaz. Contextual Home pointer/focus'u yalnızca reverse klibini hazırlar; o BlockPage ömrü boyunca hazırlık isteği tutulur.
   - Hazırlık 150 ms ertelenir; Home'daki kısa pointer geçişi veya unmount timer'ı iptal edebilir. Video `muted`, `playsInline`, `preload="auto"` ve oynatma dışındayken gizlidir. Hazırlık `play()` çağırmaz ve UI'ı bekletmez.
   - Hazırlık ve oynatma aynı video elemanını/buffer'ını kullanır. Aynı src yeniden atanmaz; ayrı gizli preload oynatıcısı veya global medya yöneticisi yoktur. Hazırlık yapılmadan tıklanırsa kaynak hemen bağlanır; mevcut ended/error/timeout güvenli yönlendirmesi korunur.
   - Reduced-motion durumunda idle kaynak bağlanmaz; tercih idle sırasında değişirse kaynak bırakılır. Mevcut Home/Block aktivasyonu videoyu atlayarak yönlendirir. Bu dal kod incelemesiyle doğrulandı; tarayıcı araçlarında reduced-motion emülasyonu çalıştırılmadı.
   - Unmount'ta timer ve matchMedia listener'ı, oynatma listener'ları ve timeout temizlenir; pause + src kaldırma + load kaynağı bırakır. Yeniden route girişleri yeni eleman oluşturabilir; global indirme kaydı veya kalıcı preload cache'i eklenmedi.

7. **Project Video:** `preload="metadata"`, native controls ve autoplay kapalı durumu korundu. MP4 yalnızca `/video` ziyaretinde istenir. Üç DEV Video → Home → Video döngüsünde oynatma başladı, Home'da proje oynatıcısı ve oynayan video sayısı 0 oldu, dönüşte oyuncu duraklatılmış ve currentTime=0 idi. Production'da oynatma sırasında Home'a çıkış, Browser Back ile temiz video ve Forward ile Home dönüşü doğrulandı. Metadata bir tarayıcı ipucudur; küçük MP4'ün tamamının indirilmesini kesin olarak engellediği iddia edilmez.

8. **Medya / cache hijyeni:** Feature konfigürasyonları merkezi yolların kaynağı olarak korundu. Medya dosyaları değiştirilmedi; mevcut küçük sentetik JPEG/MP4'leri yeniden sıkıştırmanın anlamlı yararı gösterilemediğinden kalite kaybı veya yeni format kopyası eklenmedi. Source PNG sequence/master, büyük base64 medya, object URL, runtime timestamp/query cache-buster, service worker eklenmedi. Sabit `/media/...` URL'leri kullanılır. Uzun süreli immutable cache header'ları ve gerçek medya versiyonlama/deployment politikası IMP-020 konusudur; burada uygulanmadı.

   | Yerel DEVELOPMENT-ONLY medya | Boyut (byte) |
   | --- | ---: |
   | `panoramas/dev/living-room.jpg` | 30.829 |
   | `panoramas/dev/hall.jpg` | 30.342 |
   | `panoramas/dev/bedroom.jpg` | 31.168 |
   | `transitions/dev-transition-proof.mp4` | 39.302 |
   | `transitions/dev-reverse-transition-proof.mp4` | 40.706 |
   | `video/dev/project-video-proof.mp4` | 551.564 |

9. **DEV-only production izolasyonu:** Production preview'da `/__dev/hotspot-editor` ve `/__dev/panorama-spike` NotFound, canvas sayısı 0. Son `dist/assets` taramasında araç adları/route dizeleri bulunmadı; bu araçlara ait chunk üretilmedi. Pannellum chunk'ı gerçek Tour rotası tarafından kullanılmaya devam eder. DEV'de iki araç erişilebilir: editörde üç köşe ve `imp-019-proof` ID'si JSON'a kaydedildi; spike oda/minimap durumu ve viewer unmount/remount 0 → 1 çalıştı.

10. **Resource cleanup:** Production ve DEV Tour çıkış/girişlerinde üçer tamamlanmış döngüde canvas sayısı 0 → 1 kaldı; ilk yardım kapatıldıktan sonra yeniden açılmadı. Bir DEV ölçümü route render'ı tamamlanmadan alınmıştı; geçiş tamamlanması beklendiğinde tekrar edilen üç ölçümün tamamı 0 → 1 oldu. Tour adapter testi listener unsubscribe, viewer replacement, idempotent destroy ve üç remount'u doğruladı. Transition timer/media/matchMedia listener temizliği kaynak koddan kontrol edildi; tekrarlı navigasyonda birikme belirtisi görülmedi. Heap/GPU bellek profili veya native listener sayımı yapılmadı. Object URL kullanılmıyor. Video cleanup sonucu yukarıda belirtilmiştir.

11. **Son production build:** 82 modül; başlangıç JS 5,39 kB, başlangıç CSS yaklaşık 2,58 kB azaldı. Bu, ilk yükleme sınırının iyileştirilmesidir; tüm chunk toplamının aynı oranda küçüldüğü veya gerçek kullanıcı hızının ölçüldüğü anlamına gelmez.

   | Son asset | kB | gzip kB |
   | --- | ---: | ---: |
   | `index-1PCJDHbR.js` | 288,48 | 88,93 |
   | `index-BHGXl570.css` | 5,42 | 1,58 |
   | `TourPage-DCw84yV2.js` | 5,58 | 2,39 |
   | `TourPage-bAQSjnHi.css` | 2,29 | 0,84 |
   | `VideoPage-BQX1ise5.js` | 1,44 | 0,79 |
   | `VideoPage-CeU97_Gq.css` | 0,28 | 0,21 |
   | `PannellumAdapter-BgI0kzNn.js` | 58,20 | 18,42 |
   | `PannellumAdapter-CN2-yKHH.css` | 9,50 | 2,54 |

12. **İstek gözlemleri:** In-app Chromium DOM kontrolleri ve `scripts/inspect-media-loading.mjs` Vite sunucu isteği günlüğü birlikte kullanıldı; browser Resource Timing API'si bu araç yüzeyinde erişilebilir değildi. Preview `127.0.0.1:4189`, DEV `127.0.0.1:5189` üzerinde doğrulandı. Günlük istekleri gösterir; cache hit/304/transfer byte ayrımı veya HAR kaydı değildir.

   | Akış | Gözlem |
   | --- | --- |
   | Temiz Home | Yalnızca index JS/CSS; panorama, proje MP4 veya transition isteği yok. Canvas=0; video src=null, paused=true. |
   | Home B kontrolüne klavye odağı | Tek `dev-transition-proof.mp4`, `Range: bytes=0-`; paused=true ve hazır video. Aktivasyon sırasında ek forward isteği oluşmadı. |
   | Block / Quick Card / Details | Kullanıcı Home'a yönelene kadar reverse preload yok; bu akışta panorama/proje videosu isteği yok. |
   | Tour'a ilk giriş | Tour JS/CSS → Pannellum JS/CSS → `living-room.jpg`. |
   | Oda/hotspot/minimap | Hol seçilince `hall.jpg`, Yatak Odası seçilince `bedroom.jpg`; aktif oda ve minimap birlikte güncellendi. Yeniden sahne/tur girişlerinde aynı sabit URL için yeni istek/revalidation görülebilir; tüm seti global indiren istek fırtınası gözlenmedi. |
   | Doğrudan A-003 no-tour | Index ve Tour JS/CSS; Pannellum CSS/runtime veya panorama isteği yok, canvas=0. |
   | Video | Video JS/CSS ve proje MP4 isteği yalnızca route ziyaretinde; `bytes=0-` ve `bytes=524288-551563` range istekleri görüldü. Autoplay=false. |

13. **Responsive / regression:** 320×800, 390×800, 1280×800 viewportlarda Home, B Block, B-301 Quick Card, Details, Tour ve Video ölçüldü. Son durumda her rotada scrollWidth=clientWidth; yatay taşma yok. 320 viewportta klasik scrollbar ile içerik alanı 305 px; dış sahne 273×204,75 px. 390'da scrollbar olan Block sahnesi 343×257,25; masaüstünde 768×576. 4:3 korunuyor. İlk testte mevcut body min-width=320 kuralının sebep olduğu 15 px taşma bulundu ve küçük CSS düzeltmesiyle giderildi. A/B/C forward/reverse akışları üç genişlikte de çalıştı. B-301 hotspot, Quick Card, Details, Tour hotspot/oda/minimap ve daralt/aç çalıştı. 320×568'de Tour menü/minimap etkileşimleri ile Daireye Dön ve Browser Back/Forward doğrulandı. Video Back/Forward da geçti. Her iki modda kontrol edilen akışlarda konsol error/warn listesi boştu. Bunlar Chromium viewport simülasyonudur; fiziksel cihaz/Safari testi değildir.

14. **Çalıştırılan komutlar:** `npm run build` (önce ve sonra), `npm run validate:data`, `npm run lint`, `node scripts/test-panorama-adapter.mjs`, `node scripts/test-tour-help-storage.mjs`, `git diff --check`, `git status --short`, `git diff --stat`, production asset/DEV dizesi ve medya hijyeni için `rg`, medya dosya boyutları için `Get-ChildItem`, `node scripts/inspect-media-loading.mjs`, `node scripts/inspect-media-loading.mjs --dev`. Ayrıca yukarıdaki tarayıcı akışları çalıştırıldı.

15. **Final doğrulamalar:**

   | Kontrol | Sonuç |
   | --- | --- |
   | `npm run validate:data` | PASS: 3 Block, 10 UnitType, 78 Unit, tam demo seti ve snapshot parity |
   | `npm run build` | PASS: son CSS düzeltmesi dahil, 82 modül |
   | `npm run lint` | PASS: repo geneli, tanı betiği dahil |
   | `node scripts/test-panorama-adapter.mjs` | PASS |
   | `node scripts/test-tour-help-storage.mjs` | PASS |
   | `git diff --check` | PASS |
   | Production preview + DEV | Yukarıda belirtilen route, medya, cleanup ve responsive kontrolleri geçti |
   | Kilitli baseline dosyaları | Değişmedi |

16. **Bağımlılıklar:** Yeni bağımlılık yok; package/lock dosyaları değişmedi. Yeni framework, servis veya global state/medya yöneticisi eklenmedi.

17. **Ölçüm sınırları:** Medya sentetik ve küçük DEVELOPMENT-ONLY içeriktir; gerçek Nail Karataş varlıkları değildir. Gerçek büyük panorama/video, düşük bant genişliği, fiziksel telefon, Safari, GPU bellek tüketimi veya gerçek kullanıcı performansı için sonuç çıkarılmaz. Sayısal performans skoru üretilmedi. Cache transfer tasarrufu ölçülmedi. Reduced-motion dalı kaynak incelemesiyle doğrulandı; bu çalışmada emülasyonla medya indirme testi yapılmadı. Zorlanmış ağ hatası/timeout testi tekrar edilmedi; mevcut fallback yolları korundu.

18. **Uyarılar / çözülmemiş konu / mimari çelişki:** İlk build ortamın esbuild alt süreç kısıtı nedeniyle `spawn EPERM` verdi; izinli çalıştırma başarılı oldu. İlk tanı portu 4175 doluydu; script 4189/5189 kullanıyor. İlk DEV sunucu başlatma denemesinde otomatik onay incelemesi kullanım limiti nedeniyle tamamlanamadı; devam oturumunda aynı izinli başlatma başarılı oldu ve blokaj kalmadı. Git yalnızca LF/CRLF normalizasyon uyarıları verdi. İşlevsel doğrulamalarda açık hata veya mimari çelişki bulunmadı; ölçüm sınırları yukarıda açıkça listelendi.

19. **Kapsam kapanışı:** IMP-020'ye başlanmadı. Staging deploy, hosting seçimi, CDN/backend veya deployment cache header'ları uygulanmadı. Kilitli baseline belgeleri, CURRENT_TASK ve görev tanımı değiştirilmedi.
