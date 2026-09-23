# Virtual Tour UI

## IMP-032 (güncel durum)

- `projectTour.ts` tek canonical `BC-T01` Tour tanımını ve dört proje JPG
  sahnesini içerir. B-304 ile C-401 aynı tanımı kullanır; diğer UnitType'lar
  eşleşmez ve mevcut tur-yok durumuna gider.
- Oda menüsü dört sahnenin tamamına erişir. Minimap'teki düğmeler ölçülmüş
  plan koordinatları değil, dört bakış noktası için temsili seçim alanıdır.
- Oda içindeki altı hotspot yalnızca Phase B'de verilen insan koordinatlarını
  kullanır; tüm sahnelere erişim için oda menüsü korunur.
- Pannellum sahne hotspot'ları adapter içinde hedef oda adıyla `aria-label`,
  `role=button`, klavye odağı ve Enter/Space etkinleştirmesi kazanır.
- DEV Tour'da panorama üzerinde Shift+tık, Pannellum adapter'ının
  `mouseEventToCoords` yöntemiyle `sourceSceneId`, `pitch` ve `yaw` gösterir.
  Production build'de authoring arayüzü bulunmaz.
- `bathroom.jpg` Phase B öncesinde kullanıcı tarafından 7000×3500 olarak
  düzeltildi; dört JPG'nin tamamı 2:1'dir. Entegrasyon sırasında dosyalar
  değiştirilmedi.

## IMP-015 tarihsel uygulama kaydı

## Uygulama

- TourPage, mevcut router guard'larını koruyarak Block → Unit → UnitType
  ilişkisini çözer. Yanlış blok/Unit eşleşmesi NotFound'dur.
- `developmentTours.ts` DEVELOPMENT-ONLY eşlemesidir. Snapshot'ta
  `sourceTourMarkedAvailable=true` olan BC-T01, BC-T01-M, BC-T02 ve BC-T02-M
  aynı sentetik sahne grafiğini paylaşır. B-301'in tipi BC-T01-M'dir.
  Kaynak işareti üretim tourId'sine dönüştürülmez; seed dosyaları değişmez.
- Eşlemesiz geçerli Unit (ör. A-003) için “Sanal tur henüz mevcut değil”
  gösterilir. Daireye Dön bağlantısı bu durumda da korunur.
- Feature yalnızca PanoramaAdapter sözleşmesini kullanır. Motor ve CSS,
  `src/panorama/createPanoramaAdapter.ts` fabrikasında dinamik yüklenir;
  turu olmayan rotalarda motor oluşturulmaz.
- Effect tek adapter oluşturur; scene/error aboneliklerini cleanup sırasında
  kaldırır ve destroy çağırır. Geç biten import unmount sonrasında viewer
  oluşturamaz. Unit kimliği key olarak lifecycle ve yerel state'i sıfırlar.
- Salon ↔ Hol ↔ Yatak Odası hotspot grafiği, harici menü ve minimap aynı
  adapter'ı kullanır. Aktif React state yalnızca onSceneChange'den gelir.
- Minimap masaüstünde sağ altta; dar ekranda panorama altında bulunur.
  Noktalar sentetik şemadır, gerçek plan veya kamera yönü değildir.
  Daraltma yalnızca yerel state'tir; depolama/persistence yoktur.
- Daireye Dön açık Unit Quick Card URL'sine gider; ters video oynatmaz.
  Tarayıcı geçmişi standart Link davranışıdır. Tur içi oda değişimi geçmişe
  kayıt eklemez. AppShell Tour rotasında doğrudan global Home'u gizler.
- Başlatma metni role=status; hatalar role=alert ile sunulur. onSceneChange
  görüntünün tamamen yüklendiği anlamına gelmez; medya yükleme göstergesi
  motorun mevcut göstergesidir. Hata halinde oda kontrolleri kapanır,
  Daireye Dön kullanılabilir kalır. Retry yoktur; ilk kullanım yardımı IMP-016'da eklenmiştir.
- Menü/noktalarda aria-pressed, minimap'te aria-expanded/aria-controls,
  viewer'da region/erişilebilir ad ve kontrollerde görünür focus kullanılır.

## 2026-09-19 doğrulaması

| Kontrol | Sonuç |
| --- | --- |
| B-301 doğrudan Tour, ilk Salon | PASS |
| Salon → Hol → Yatak Odası → Hol → Salon hotspot zinciri | PASS |
| Menü ve minimap'ten üç odaya erişim; aktif state eşleşmesi | PASS |
| Menü Enter, minimap Enter, toggle Space/Enter, dönüş Enter | PASS |
| Minimap aç/kapat; 390px altında kontrol erişimi | PASS |
| Daireye Dön → doğru Quick Card; canvas 1 → 0 | PASS |
| Quick Card → Tour → Browser Back/Forward, tek canvas | PASS |
| A-003 unavailable → Daireye Dön; canvas yok | PASS |
| Yanlış /block/a/unit/B-301/tour ve geçersiz blok → NotFound | PASS |
| 1280px / 390px: yatay taşma yok; panorama 4:3'e bağlı değil | PASS |
| Home → B ileri video/kilit → B, Unit hotspot → Quick Card | PASS |
| A-003 Details ve Home ters video/kilit → Home | PASS |
| Hotspot Editor açılışı; panorama spike ve Hall seçimi | PASS |
| Production preview B-301 ve C-401 turu / doğru dönüş | PASS |
| Tarayıcı warn/error kayıtları | Boş |
| Feature'da doğrudan motor import/API/event bağımlılığı | Yok |

Çalıştırılan komutlar:

- `npm run validate:data`: PASS (3 Block, 10 UnitType, 78 Unit, 9 demo Unit).
- `npm run build`: PASS. İlk sandbox denemesinde esbuild spawn EPERM;
  izinli tekrar ve CSS düzeltmesinden sonraki son build başarılı.
- `npm run lint`: PASS.
- `node scripts/test-panorama-adapter.mjs`: PASS (mapping, navigation,
  validation, unsubscribe, replacement, destroy ve üç remount).
- `git diff --check`: PASS.
- `rg -n 'pannellum|Pannellum|scenechange|loadScene|window\.' src/features/tours -g '*.tsx' -g '*.ts'`:
  eşleşme yok.
- `npm run dev -- --host 127.0.0.1`: 5173; ilk sandbox EPERM sonrası izinli.
- `npm run preview -- --host 127.0.0.1`: 4173.

Dosyalar: AppShell.tsx ve TourPage.tsx değişti; VirtualTour.tsx,
TourPage.css, developmentTours.ts, bu README ve panorama fabrikası eklendi.
Yeni bağımlılık, yeni medya veya baseline/seed değişikliği yoktur.

Sınırlar: Mobil doğrulama Chromium viewport testidir; fiziksel cihaz/Safari
testi yapılmadı. Sentetik medya gerçek proje performansını kanıtlamaz.
Medya hatası UI yolu mevcut adapter onError sözleşmesine dayanır; bu görevde
tarayıcıda bozuk medya enjekte edilmedi. Mimari çelişki veya açık uygulama
engeli yoktur. IMP-016 başlatılmadı.

## IMP-016 — İlk kullanım yardımı (2026-09-19)

- `TourHelp.tsx` yalnızca mevcut tur eşlemesi bulunan Unit için render edilir.
  Doğrudan URL ile giriş de aynı davranışı kullanır.
- `tourHelpStorage.ts`, ürün genelindeki `nail-karatas-tour-help-v1` anahtarına
  `dismissed` yazar. Unit başına anahtar yoktur. İlk ziyarette dialog açılır;
  kapatma sonrası başka Unit, yeniden giriş ve yenilemede kapalı kalır.
- Storage nesnesine erişim, getItem ve setItem try/catch ile korunur.
  Okuma hatasında yardım açılır; kapatma bellekte de tutulur. Yazma hatasında
  aynı sayfa oturumundaki rota değişimleri yardımı tekrar açmaz; tam yenilemede
  kalıcı kayıt yoksa yeniden açılabilir. Tur kullanımı engellenmez.
- Native `dialog.showModal()` arka planı inert yapar; panorama sürükleme,
  oda/minimap ve dönüş kontrolleri modalın arkasında etkileşime kapalıdır.
  Başlık ve kısa giriş erişilebilir ad/açıklama sağlar. İlk odak Turu Keşfet'te,
  görünür focus stili mevcuttur. Kapatma ve Escape aynı kalıcı dismissal yolunu
  izler; odak Daireye Dön'e taşınır. Effect cleanup dialogu kapatır.
- Türkçe metin sürükleme, panorama geçiş noktaları, oda menüsü, minimap bakış
  noktaları, minimap aç/kapat ve Daireye Dön'ü açıklar.
- Dialog normal belge akışının dışındadır; panorama ölçüsünü değiştirmez.
  Dar/yüksekliği az ekranlarda dialog içeriği kaydırılabilir.
- Yardım görünürlüğü URL veya history API kullanmaz.
- Geliştirmede sıfırlama: tarayıcı konsolunda
  `localStorage.removeItem('nail-karatas-tour-help-v1'); location.reload()`.
  Yenileme bellek fallback'ini de sıfırlar. Üretim reset düğmesi eklenmedi.

### Doğrulama

| Kontrol | Sonuç |
| --- | --- |
| Yeni origin B-301 doğrudan giriş: otomatik dialog, ilk odak | PASS |
| Modal açıkken oda tıklama girişimi: Salon değişmedi; AX yalnızca yardım | PASS |
| Turu Keşfet Enter ve Escape; Daireye Dön'e odak dönüşü | PASS |
| Tam reload ve C-401 turu: yardım tekrar açılmıyor | PASS |
| Storage getter/getItem/setItem hataları, bellek fallback ve reload | PASS — Node VM testinde |
| Boş origin A-003: yardım yok, unavailable metni ve dönüş var | PASS |
| 1280×900, 390×844, 320×640: yatay taşma yok, kapatma erişilebilir | PASS — Chromium viewport/DOM ölçümü |
| Menü → Hol; minimap → Yatak Odası; hotspot → Hol, aktif state eşleşmesi | PASS |
| Minimap daralt/aç ve 320px daraltma | PASS |
| Daireye Dön → Quick Card; canvas 1 → 0; yeniden turda 1 | PASS |
| Back/Forward: tur ↔ seçili Unit, yardım tekrar açılmıyor | PASS |
| Masterplan → B ileri video/kilit, Unit hotspot → Quick Card | PASS |
| A-003 Details → Home ters video/kilit | PASS |
| Yanlış Block/Unit tur eşleşmesi → NotFound | PASS |
| DEV Hotspot Editor açılışı; panorama spike Hall seçimi | PASS |
| Tarayıcı warn/error kayıtları | Boş |

Komutlar:
- `npm run validate:data`: PASS.
- `npm run build`: PASS.
- `npm run lint`: PASS.
- `node scripts/test-panorama-adapter.mjs`: PASS.
- `node scripts/test-tour-help-storage.mjs`: PASS.
- `git diff --check`: PASS.
- `npm run dev -- --host 127.0.0.1`: ilk sandbox denemesi spawn EPERM;
  izinli tekrar başarılı, kullanılan port 5174.

Değişiklikler: TourPage.tsx, TourPage.css ve bu README güncellendi;
TourHelp.tsx, tourHelpStorage.ts ve scripts/test-tour-help-storage.mjs eklendi.
Yeni bağımlılık/medya yok; baseline belgeleri ve seed verileri değişmedi.
Storage hatası gerçek tarayıcıya enjekte edilmedi; helper testinde doğrulandı.
Mobil test fiziksel cihaz/Safari testi değildir. Mimari çelişki veya bilinen
açık uygulama sorunu yoktur. IMP-017 başlatılmadı.
