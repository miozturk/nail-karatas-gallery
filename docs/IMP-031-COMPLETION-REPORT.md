# IMP-031 Completion Report

## 1. Özet ve kapsam

IMP-031, Cuma müşteri demosunun mevcut exterior geçişlerini ve route/overlay akışını sağlamlaştırdı. Home ↔ A/B/C geçişlerinde ilk kare, video oynatımı, route commit, hedef WebP boyaması ve video katmanının kaldırılması tek bir kalıcı lifecycle altında yönetiliyor. Block sahnesi Unit ve Details child route değişimlerinde mount edilmiş kalıyor; Quick Card ve Details viewport içinde overlay olarak açılıyor. Exterior SceneStage 4:3 geometrisi kullanılabilir viewport yüksekliğine uyarlanmış durumda. Yeni özellik, premium/final ürün tasarımı veya IMP-032 çalışması yapılmadı.

Son insan kabulü: gerçek Chrome’da exterior ve Block → Unit → Details → Quick Card → Block geçişleri flash/flicker olmadan **PASS**. Cuma demosu için sonuç **PASS**; sunum laptopunda **F11 tam ekran kullanılacak**. 1920×1080 fiziksel ekranda normal Chrome’un yaklaşık 1920×929 sayfa viewport’undaki kompozisyon hâlâ ideal değil ve demo sonrası görsel polish olarak ertelendi.

## 2. Başlangıç repository durumu

IMP-030 uygulama checkpoint’i `65e2f03 — IMP-030 Presentation Polish Real Video` idi. IMP-031 hazırlık commit’leri `8f9ea18` ve `2d89620` sonrasında uygulama çalışmasına temiz `main` üzerinde başlandı. Human baseline, görev dosyasına önceden işlenmişti; Phase A tekrarlanmadı. Bu rapor sırasında mevcut implementasyonda yeni kod değişikliği yapılmadı.

## 3. Önceden tamamlanan human baseline

Alt sahne navigasyon kontrolleriyle yapılan beşer **çift yönlü tur** içinden en az bir flash/glitch görülen turlar:

| Tur | Glitch görülen tur |
| --- | ---: |
| Home ↔ A | 4/5 |
| Home ↔ B | 3/5 |
| Home ↔ C | 2/5 |

Sahne polygon/hotspot’larıyla yapılan ek 10 denemede de benzer rastlantısal flash görüldü. Sorun kontrol türüne, tek bir bloğa veya yöne özgü değildi; başlangıçta ya da bitişte ortaya çıkabiliyordu. Bu değerler yön başına oran değil, çift yönlü tur gözlemidir.

## 4. Kök neden ve transition handoff

Önceki TransitionLayer, Home/Block route içindeki SceneStage overlay’i olarak yaratılıyor ve route değişiminde o sahneyle birlikte sökülüyordu. Video katmanı ilk görünür video karesi hazır olmadan açılabiliyor; hedef WebP’nin `Image.decode()` tamamlanması ise yeni hedef `<img>` ve ölçeklenmiş SceneStage’in gerçekten boyandığını garanti etmiyordu. Video terminal karesi ile route commit/katman temizliği aynı görsel sınırda yarışabildiği için geçici kaynak/hedef karesi veya küçük video → WebP pop’u mümkündü. Bu, medya içeriğinden ziyade lifecycle/paint handoff sorunu olarak değerlendirildi.

AppShell düzeyindeki `ExteriorTransitionProvider`, route değişiminden bağımsız video katmanını koruyor. Video yalnız ilk sunulabilir kare sinyalinden sonra görünür oluyor (`requestVideoFrameCallback`, desteklenmeyen durumda `playing` + animation-frame). Terminal kare, hedef route mount olurken üstte kalıyor. Hedef WebP’nin gerçek DOM `<img>` yüklenmesi ve `data-ready` SceneStage ölçeği bekleniyor; hedef bir boyama çevrimi video altında tamamlandıktan sonra video gizleniyor, sonraki karede temizleniyor. Decode/oynatım aksarsa 10 saniyelik medya ve 1,5 saniyelik hedef-readiness güvenlik sınırları navigasyonu kilitlemiyor. Reduced-motion doğrudan navigasyonu koruyor. Siyah/beyaz maske, keyfî fade ve medya yeniden kodlaması yok.

İkinci flash kaynağı farklıydı: eski `/block/:blockId/unit/:unitId` ve `/details` route elementleri ayrı `BlockPage` üretiyor, child route değişiminde arka plan SceneStage sökülüp yeniden yaratılıyordu. `BlockPage` artık kalıcı pathless route-layout; Quick Card ve Details `Outlet` içindeki nested overlay elementleri. URL’ler, durable route semantiği ve Browser Back/Forward korunuyor. Tour kendi tam genişlikli sibling route’u olarak kaldı.

## 5. Değişen dosyalar

- Kalıcı transition lifecycle: `src/app/AppShell.tsx`, `src/components/TransitionLayer/ExteriorTransitionContext.ts`, `ExteriorTransitionProvider.tsx`, `useExteriorTransition.ts`, `TransitionLayer.tsx`, `TransitionLayer.css`, `README.md`.
- Nested Block/Unit/Details route ve overlay: `src/app/router.tsx`, `src/features/blocks/BlockPage.tsx`, `BlockPage.css`, `src/features/units/UnitDetailsDrawer.tsx`, `UnitDetailsDrawer.css`. Tekrar BlockPage yaratan eski `UnitPage.tsx` ve `UnitDetailsPage.tsx` kaldırıldı.
- Ortak SceneStage readiness ve height-aware/compact exterior yerleşimi: `src/components/SceneStage/SceneStage.tsx`, `src/features/masterplan/MasterplanPage.tsx`, `MasterplanPage.css`, `src/styles/index.css`.
- Bu kapanışta yalnız `docs/IMP-031-COMPLETION-REPORT.md` eklendi; kullanıcı kabulünden sonra kaynak kod değiştirilmedi.

## 6. Teknik smoke ve regresyon

Önceki uygulama turundaki sınırlı Chromium/production-build smoke testinde Home/Block geçişleri, C-403 Quick Card ↔ Details, Browser Back/Forward ve doğrudan B-301 Tour rotası çalıştı; geçersiz route NotFound verdi. Normal smoke yolunda console warning/error yoktu. Bu teknik testler, fiziksel cihazda insan gözüyle yapılan kabulün yerine geçirilmedi.

SceneStage/route geometrisi aynı viewport’ta Home, Block, Unit ve Details için eş ölçüldü:

| Viewport | Ortak SceneStage `(x, y, genişlik, yükseklik)` | Alt kontrol / overflow |
| --- | --- | --- |
| 1920×929 (normal Chrome sayfa viewport simülasyonu) | `(558.06, 215, 788.88, 591.66)` | Home alt `913`, Block alt `901`; yatay overflow `0` |
| 1920×1080 (F11 viewport simülasyonu) | `(507.05, 272.84, 890.91, 668.17)` | Home alt `1064`, Block alt `1052`; yatay overflow `0` |
| 1280×800 | `(323.83, 215, 617.33, 462.98)` | Home alt `784.33`; yatay overflow `0` |
| 390×844 | `(16, 411, 343, 257.25)` | SVG hizası doğru; yatay overflow `0` |

4:3 oranı ve hotspot/SVG ortak koordinat hizası korundu. 390×844’te Details drawer viewport içinde `(12, 12, 351, 820)` ölçüldü; uzun içerik kart içinde scroll ediyor. Quick Card da viewport-safe. Bu rakamlar Chromium ölçümüdür; fiziksel laptopun estetik kabulü ayrıca aşağıdadır. Global `overflow:hidden` kullanılmadı.

## 7. Human post-fix test turları ve final kabul

**İlk post-fix turu:** Kullanıcı Home ↔ A, Home ↔ B ve Home ↔ C için sırasıyla `0/10`, `0/10`, `0/10` bildirdi; büyük flash giderilmişti. Bu sonuçlar çift yönlü akış başlıkları altında verildi; yönlere ayrı ayrı dağıtılmış sayılar değildir. Ardından uzak masaüstü olmadan yapılan gerçek bilgisayar testinde, video → statik WebP handoff’unda ara sıra küçük flicker/pop fark edildi. Bu nedenle ilk turun sayısal sonucu nihai kusursuzluk iddiası sayılmadı; terminal kare/hedef boyama handoff’u güçlendirildi.

**İkinci post-fix turu:** Kullanıcı exterior A/B/C ↔ Home flash/flicker probleminin artık tamamen çözülmüş göründüğünü **PASS** olarak bildirdi. Bu turda yeni Block → Quick Card ↔ Details route flash’ı ve normal Chrome kompozisyon sorunu saptandı. Block route-layout/overlay düzeltmesi yapıldı; düşük yükseklikte 4:3 stage fit ve compact exterior yerleşimi teknik olarak doğrulandı. Kullanıcının talebiyle normal Chrome kompozisyonunda daha fazla oynama yapılmadı.

**Final insan kabulü:** Gerçek Chrome’da exterior Home ↔ A/B/C tekrar test edildi; flash/flicker görülmedi (**PASS**). Block → C-403 → Details → Quick Card → Block ve ters yönleri test edildi; route/overlay flash’ı yok (**PASS**). Block SceneStage’in child route’lar arasında kalıcı kaldığı görsel olarak doğrulandı. Quick Card, Details, Tour/minimap, final H.264 Video ve header/ana akış demo için kabul edildi.

Görevde istenen altı yönün durum matrisi aşağıdadır. Kullanıcı ilk turdaki 0/10 sonuçlarını üç çift yönlü başlıkla, sonraki turları nitel PASS olarak verdi; **ayrı yönsel 10-deneme sayıları bildirilmediği için uydurulmadı**.

| Yön | İlk turdaki çift yönlü sayı | İkinci tur / final kabul |
| --- | ---: | --- |
| Home → A | Home ↔ A: 0/10 | PASS / PASS |
| A → Home | Home ↔ A: 0/10 | PASS / PASS |
| Home → B | Home ↔ B: 0/10 | PASS / PASS |
| B → Home | Home ↔ B: 0/10 | PASS / PASS |
| Home → C | Home ↔ C: 0/10 | PASS / PASS |
| C → Home | Home ↔ C: 0/10 | PASS / PASS |

Final kullanıcı testinde kalan exterior veya child-route transition anomalisi bildirilmedi. Siyah/beyaz kare, stale overlay veya double-play için ayrı sayısal döküm verilmedi; final görsel kabul PASS’tir.

## 8. Diğer müşteri akışları ve demo provası

- Browser Back/Forward teknik smoke testinde Unit/Details URL’leri ve overlay durumları doğru geri/ileri taşındı; final kullanıcı da Quick Card/Details/Block ve ters yön akışını flash’sız kabul etti.
- `/video` doğrudan refresh ve H.264 oynatımı önceki teknik smoke testinde çalıştı. Final proje videosu kullanıcı tarafından yeniden “düzgün” kabul edildi. Dosya SHA-256 değeri `7AE7FBDD4DDA2071D9C04CAD5B634D48CDD88A31656B98F7339CF24092245469` olarak tekrar doğrulandı.
- Tour/minimap kullanıcı tarafından düzgün kabul edildi; B-301 Tour doğrudan teknik smoke testinde açıldı. Panorama adapter ve yardım/persistence testleri geçti.
- 390×844 ve 1280×800 Chromium kontrollerinde belirgin yatay clipping yoktu; kullanıcı gerçek sunum laptopunda header ve ana müşteri akışında bariz clipping/horizontal overflow olmadığını bildirdi. Dar viewport Quick Card/Details uygundur.
- Görevde tariflenen tam `Genel Görünüm → B → B-301 → Quick Card → Details → Quick Card → Tour → room switch → Daireye Dön → Block → Genel Görünüm → Video → play → Browser Back` prova zincirinin **her adımı için ayrı insan sonucu raporlanmadı**. Kullanıcı final post-fix doğrulamayı tamamlayıp ilgili ana akış bileşenlerini kabul etti; bu rapor ayrıntılı prova skorları üretmiyor. A-003/C-401 için de ayrı final skor bildirilmedi.

## 9. Medya yükleme ve staging

Önceki son kaynak değişikliği sonrasındaki production-build ağ izinde `/block/c` → C-403 Quick Card → Details → Back sırasında Block C WebP için yalnız **bir** GET ve plan PNG için yalnız **bir** GET görüldü; child route geçişinde Block sahnesi tekrar indirilmedi. İlk medya trace’inde Home yalnız entry JS/CSS/masterplan medyasını; B geçişi yalnız block-b WebP ve ilgili Home→B MP4’ünü; Video route’u lazy Video chunk ve proje videosunu; Tour ise lazy Tour/Pannellum chunk’larını ve ilk panoramayı yükledi. Bugün `inspect-media-loading.mjs` üretim preview sunucusu başlatılarak kontrol edildi; bu script kendi başına PASS/FAIL testi değil, canlı istek izi için açık kalan sunucudur. Yeni bir ağ izi oluşturulmadı; yukarıdaki kayıt son kod değişikliklerinden sonraki önceki teknik smoke kanıtıdır.

Bugünkü `npm run staging:verify` **PASS**: 9 SPA route, 2 entry asset, 19 medya için doğru MIME ve `206` range yanıtı; missing/proof-file `404`, DEV route bundle izolasyonu ve localhost/port/dosya-yolu hijyeni doğrulandı. Bu yerel static-build doğrulamasıdır, dış deployment kanıtı değildir.

## 10. Final automated validation

2026-09-23’te mevcut kaynak durumuyla yeniden çalıştırılanlar:

| Komut | Sonuç |
| --- | --- |
| `npm run validate:exterior-media` | PASS — dört 1920×1440 WebP, altı 1920×1440/1 s/24 fps `avc1`/`yuv420p` MP4 |
| `npm run validate:data` | PASS — 3 Block, 10 UnitType, 78 Unit, 9 demo Unit, snapshot parity |
| `npm run build` | PASS — 94 modül; ilk sandbox denemesi `spawn EPERM`, izinli tekrar başarılı |
| `npm run lint` | PASS |
| `npx tsc -b` | PASS |
| `npm run test:localization` | PASS — TR/EN/RU, 116 parity key |
| `node scripts/test-panorama-adapter.mjs` | PASS |
| `node scripts/test-tour-help-storage.mjs` | PASS |
| `npm run staging:verify` | PASS — 9 route, 2 asset, 19 medya/range |
| `git diff --check` | PASS — yalnız Windows LF→CRLF bilgilendirme uyarıları |

`node scripts/inspect-media-loading.mjs` ilk sandbox denemesinde aynı `spawn EPERM` ile durdu; izinli yeniden başlatma preview sunucusunu açtı. Script sürekli çalışan teşhis sunucusu olduğundan kontrollü olarak kapatıldı; bağımsız “PASS” iddiası yok. Gerekli komutların tamamı başarılıdır. Yeni dependency eklenmedi; `package.json` ve lockfile değişmedi. Production medya dosyaları değişmedi; proje video hash’i yukarıdaki sözleşmeyle aynı.

## 11. Bilinen sınırlamalar, Home scrollbar ve Cuma kararı

1920×1080 fiziksel sunum laptopunda normal Chrome sayfa viewport’u yaklaşık 1920×929 olduğunda sahne/kontrol geometrisi viewport içinde kalsa da exterior kompozisyon estetik olarak ideal değil: stage küçük algılanıyor ve üst boşluk fazla. Kullanıcı bu aşamada düşük-yükseklik desktop kompozisyonunun değiştirilmemesini istedi. **Known limitation / deferred polish:** normal Chrome yerleşimi, demo sonrası veya iş alınırsa final ürün görsel polish aşamasına bırakıldı. Cuma demosunda **F11 tam ekran** kullanılacak; kullanıcı bu modu demo için kabul etti. Bu koşul saklanarak Friday demo readiness **PASS** değerlendirildi.

Home dikey scrollbar konusu transition stabilitesinden düşük öncelikliydi. Height-aware 4:3 stage fit ile ölçülen 1280×800 ve 1920×929 alt kontroller viewport içinde kaldı; global overflow gizleme veya içerik kırpma eklenmedi. Normal Chrome’daki kalan görsel kompozisyonu scrollbar adına geniş çaplı değiştirme kararı alınmadı.

Sanal Tur’un browser genişliğine yayılması mevcut demo için kullanıcı tarafından kabul edildi. Tam adım-adım final prova sayıları ve yön başına 10’lu döküm eksikliği raporun kanıt sınırıdır; final kullanıcı PASS kabulünü değiştiren yeni bir kusur bildirimi değildir. Siyah/beyaz masking/fade, production medya yeniden kodlama, premium/final shell, ana-site entegrasyonu, yeni özellik, yeni bağımlılık veya IMP-032 çalışması yapılmadı.
