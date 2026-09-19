# IMP-015 — Virtual Tour UI

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
  Daireye Dön kullanılabilir kalır. Retry veya ilk kullanım yardımı yoktur.
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
