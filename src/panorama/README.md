# Panorama adapter — IMP-014

Motor: mevcut `pannellum@2.5.7`. Yeni bağımlılık yoktur.
Feature kodu yalnızca `PanoramaAdapter` sözleşmesiyle çalışır; somut sınıf
yalnızca composition sınırında oluşturulur. Viewer nesnesi dışarı verilmez.
Paket import'u, CSS, global bildirimi, event isimleri ve config dönüşümü bu
dizinde kalır. Böylece motor değişimi ürün arayüzüne yayılmaz.

## Veri ve mapping

Mevcut `src/types/index.ts` dosyasında Tour tipleri bulunmadığından baseline'ın
`Tour`, `PanoramaScene`, `TourHotspot` tanımları oraya eklendi.
`PanoramaTourDefinition = Pick<Tour, 'scenes'> & { initialSceneId: string }`:
renderer'ın ihtiyaç duymadığı UnitType kimliği / plan verisi zorunlu değildir;
başlangıç seçimi domain sahnelerini çoğaltmadan ayrı belirtilir.
Yerel `panoramaImage` yolları equirectangular kaynağa, `initialView` açı/FOV'a,
hotspot hedefi/etiketi/açıları motorun sahne hotspot config'ine çevrilir.
Kaynakların varlığını adapter önceden indirmez; yükleme hatalarını motor bildirir.

## Sözleşme ve lifecycle

1. Adapter oluştur; `onSceneChange` ve gerekirse `onError` ile abone ol.
2. `mount(element)` boş ve adapter'a ayrılmış host'u saklar. Aynı host tekrar
   verilirse işlem yapmaz; başka host verilirse eski viewer'ı temizler.
3. `loadTour(tour)` önce referansları doğrular, eski viewer/listener'ları kaldırır,
   tek yeni viewer oluşturur. Abonelikler tur değişiminde korunur.
4. `goToScene(id)` aynı sahne için no-op; diğer sahneyi motora yükletir.
5. `getActiveScene()` başlangıçta / destroy sonrası null, yükleme ve navigasyon
   sonrasında seçili sahne kimliğidir.
6. `destroy()` viewer, motor listener'ları, iki abonelik kümesi, host ve aktif
   sahneyi temizler. İdempotenttir. Tekrar kullanım mount + yeni abonelik gerektirir.

`onSceneChange(callback)` unsubscribe döndürür. Abonelik anında replay yapmaz;
mevcut değer getter ile okunur. Her başarılı loadTour ilk seçimi bildirir.
Sonraki bildirimler hotspot veya programatik seçim değişince gelir; aynı seçim
tekrar bildirilmez. Bildirim resmin yüklenmesinin bittiği anlamına gelmez.
Callback'ler senkrondur ve hata fırlatmamalıdır.

`onError(callback)` spike'ın mevcut hata metnini korumak için eklenmiş motor
bağımsız aboneliktir; unsubscribe döndürür. Asenkron medya/render hataları
buraya gelir (motor ayrıca kendi hata görünümünü gösterir). Hazır/yükleniyor
durumu bu sözleşmenin parçası değildir.

## Hata davranışı

Mount öncesi loadTour, yüklenmiş tur olmadan goToScene, bilinmeyen sahne,
boş/tekrarlı ID, bulunmayan başlangıç veya hotspot hedefi senkron Error fırlatır.
Geçersiz tur mevcut viewer'ı bozmaz. Motor kurulum hatası temizlenip yeniden
fırlatılır. Asenkron medya hatasında seçili sahne kimliği korunur; bu bir
yükleme başarısı göstergesi değildir. Host tek adapter tarafından yönetilmelidir.

## Sınırlar ve sonraki kullanım

IMP-013'ün sentetik üç yerel panoraması kullanılır. Fiziksel iOS/Android,
Safari, pinch/sensör ve gerçek yüksek çözünürlüklü proje GPU/bellek performansı
kanıtlanmış değildir. Yerleşik hotspot klavye erişimi/nihai stiller ayrıca
değerlendirilmelidir. Panorama dış sahnenin 4:3 kısıtına bağlı değildir.

IMP-015 bu sözleşmeyi kendi lifecycle'ından kullanabilir; bu görev üretim tour
route'unu, oda menüsünü, minimap'i veya yardım ekranını uygulamaz.
DEV spike lazy route'u korunmuştur; motor bu görevde production bundle'a girmez.

## Doğrulama

`node scripts/test-panorama-adapter.mjs` motor double'ıyla mapping, guard'lar,
iki navigasyon kaynağı, unsubscribe, ikinci tur, destroy ve remount'u sınar.
Gerçek WebGL ve görsel davranış ayrıca tarayıcıda doğrulanır.
