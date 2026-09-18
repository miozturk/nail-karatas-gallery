# IMP-013 — Panorama Technology Spike

SPIKE RESULT: PASS

2026-09-18: Pannellum **2.5.7** (`pannellum`, MIT) mevcut motor adayı olarak
kilitlenmeye uygundur. Bu sonuç aşağıdaki yerel sentetik varlıklar ve Chromium
tarayıcı kontrolleri kapsamındadır. Kilitli baseline belgeleri değiştirilmedi;
IMP-014 adapter'ı ve IMP-015 üretim arayüzü uygulanmadı.

## Çalıştırma ve izolasyon

`npm run dev` → `/__dev/panorama-spike`.
IMP-012 ile aynı `import.meta.env.DEV` + `lazy` route yaklaşımı kullanılır.
Global menü bağlantısı yoktur. Pannellum JS/CSS yalnızca spike modülünden
yüklenir; üretim bundle'ından elenir. Production preview (4174 portu) bu
adreste “Sayfa bulunamadı” gösterdi; canvas sayısı 0 idi.
Vite public kopyalaması nedeniyle sentetik JPG dosyaları dist içinde kalır;
route izolasyonu bu dosyaları gizlemeyi amaçlamaz.

## Entegrasyon ve veri

Paket tarayıcı globali `window.pannellum` oluşturur; side-effect import ve
paketin CSS'i kullanılır. Yalnızca spike için küçük TypeScript bildirimleri
vardır; bunlar genel panorama adapter sözleşmesi değildir.

`scenes.ts` yolları ve ayarları merkezileştirir. Tam olarak üç yerel
equirectangular JPG kullanılır: `public/media/panoramas/dev/` altındaki
`living-room.jpg`, `hall.jpg`, `bedroom.jpg`. Bunlar sağlanan DEVELOPMENT-ONLY
sentetik test görselleridir; gerçek proje iç mekânı veya mimari plan yoktur.

Graf: **living-room ↔ hall ↔ bedroom**. Pannellum'un yerleşik `scene`
hotspot'ları kullanılır. Oda menüsü ve şematik minimap `loadScene` çağırır;
aktif React state yalnızca motorun `scenechange` olayıyla güncellenir.
İlk değer `firstScene` ile aynıdır. Seçili düğmeler `aria-pressed` ve renk/
işaret ile gösterilir. Sahne değişimi viewer'ı yeniden yaratmaz.

`scenechange` hedef seçildiğinde gelir; görüntünün yüklenmesinin tamamlandığı
anlamına gelmez. Sonraki adapter çalışmasında yükleme hazır durumu için `load`,
hata durumu için `error` ayrıca ele alınmalıdır. Spike hataları React içinde
metin olarak gösterir. Aynı sahneye tekrar seçim gereksiz yükleme başlatmaz.

## Lifecycle

Boş bağımlılık listeli effect her mount için bir viewer oluşturur; render veya
sahne state güncellemeleri yeni viewer oluşturmaz. Cleanup iki uygulama event
listener'ını `off` ile kaldırır, `destroy()` çağırır ve ref'i boşaltır.
Paketin destroy uygulaması renderer'ı, eklediği document/window listener'larını
ve container içeriğini temizler. React StrictMode geliştirmede kasıtlı olarak
setup → cleanup → setup yapar; bunu engelleyen bir initialized bayrağı yoktur.
Aynı anda tek yaşayan instance vardır.

Üç unmount/remount döngüsünde DOM canvas sayısı her seferinde **0 → 1** oldu.
İlk StrictMode mount, sahne navigasyonu ve route üzerinden ayrılma sonrasında
duplicate viewer veya yeni konsol hatası gözlenmedi.

## Tarayıcı doğrulaması

Codex Chromium tarayıcısında gerçekleştirildi:

| Kontrol | Sonuç |
| --- | --- |
| Living Room ilk render, üç yerel sahne | PASS |
| Living Room → Hall → Bedroom → Hall → Living Room hotspot zinciri | PASS |
| Oda menüsünden üç sahneye doğrudan erişim | PASS |
| Minimap'ten üç sahneye erişim | PASS |
| Hotspot ve menü sonrası aktif metin + menü + minimap eşleşmesi | PASS |
| İşaretçi sürükleyerek bakış ve yerleşik + zoom | PASS |
| Desktop, yaklaşık 1265 × 712 | PASS |
| 390 × 844: menü, hotspot, minimap erişimi | PASS |
| 390px ve 320px: yatay sayfa taşması yok | PASS |
| Tekrarlı unmount/remount ve hata konsolu | PASS |
| Production preview dev route izolasyonu | PASS |
| Home → A ileri video / etkileşim kilidi → blok | PASS |
| A-003 hotspot → Quick Card → Details → reverse video → Home | PASS |
| B/C blokları, Tour ve Video yer tutucuları | PASS |
| Geçersiz blok, yanlış block/unit eşleşmesi, /availability → not found | PASS |
| Hotspot Editor route ve kontrollerinin yüklenmesi | PASS |

Mobil sonucu viewport boyutu doğrulamasıdır; fiziksel iOS/Android, gerçek
dokunmatik sürükleme/pinch, cihaz yön sensörü ve Safari doğrulanmadı. Motorun
kendi kontrolleri kullanılır; özel WebGL veya inertia kontrolü eklenmedi.
Dar ekranda minimap dikey yerleşir, sayfa dikey kaydırılır; dış sahnenin 4:3
kısıtı panoramaya uygulanmaz. Sentetik görseller gerçek yüksek çözünürlüklü
proje panoramalarının bellek/GPU performansını kanıtlamaz. Yerleşik hotspot'ların
klavye erişilebilirliği ve nihai stilleri sonraki UI çalışmasında değerlendirilmelidir.

## Komutlar ve sonuçlar

- `npm install pannellum`: başarılı; tek yeni bağımlılık `pannellum@2.5.7`.
  İlk sandbox denemesi ENOTCACHED verdi, izinli tekrar başarılı oldu.
- `npm run validate:data`: PASS (3 Block, 10 UnitType, 78 Unit, 9 demo Unit).
- `npm run build`: PASS. İlk sandbox denemesi esbuild `spawn EPERM` verdi;
  izinli tekrar başarılı oldu.
- `npm run lint`: PASS.
- `git diff --check`: PASS.
- `npm run dev -- --host 127.0.0.1`: 5173 üzerinde tarayıcı kontrolleri.
- `npm run preview -- --host 127.0.0.1`: 4173 dolu olduğu için 4174 kullanıldı.

Mimari çelişki ve açık uygulama engeli yoktur. IMP-014'e başlanmadı.
