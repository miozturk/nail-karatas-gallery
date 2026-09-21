# TransitionLayer — IMP-007

Yönlendirmeden bağımsız, SceneStage overlay slotunda kullanılan HTML5 video katmanı.

- `src`: merkezi medya verisinden gelen kaynak.
- `active`: oynatmayı başlatır; pasifken video gizli ve kaynaksız kalır.
- `preloadRequested`: kullanıcı intent'i sonrasında aynı video elementinde gecikmeli
  kaynak hazırlığı yapar.
- `destinationImageSrc`: active geçişle paralel native `Image.decode()` çalıştırır;
  başarı callback'i hedef görsel hazırlandıktan sonra devam eder. Decode hatası
  navigation'ı engellemez.
- `onComplete`: yalnızca `ended` ile çağrılır.
- `onFailure`: `play()` reddi, senkron hata, medya `error` olayı veya zaman aşımı.
- `label`: erişilebilir video açıklaması; varsayılan geliştirme etiketi.
- `timeoutMs`: yükleme ve oynatma için toplam üst sınır (varsayılan 10000 ms).
  İleride daha uzun klip kullanılırsa bu sınır klibe göre ayarlanmalıdır.

Çağıran bileşen her iki callback'te de `active` değerini kapatmalıdır.
Kaynak/aktiflik/süre sınırı değişince önceki oynatma temizlenir. Callback kimliğinin
değişmesi videoyu yeniden başlatmaz. Her oynatma en fazla bir sonuç üretir.
Başarılı bitişte terminal kare hedef route commit'ine kadar korunur; reset unmount
cleanup'ında yapılır. Hata ve unmount sırasında video durdurulur, zaman sıfırlanır;
olay dinleyicileri ve zamanlayıcı temizlenir. Geç sonuçlanan play promise'i temizlenmiş oturumu etkilemez.
Video muted + playsInline oynar; negatif playbackRate kullanılmaz.

Masterplan hotspot ve düğmeleri aynı `activate` yolunu kullanır. Yerel ref ilk isteği
hemen kilitler; React state düğmeleri ve hotspotları disabled yapar. Normal bitişte
kilit çözülür ve hedef Block rotasına gidilir. Hata durumunda da aynı hedefe doğrudan
gidilmesi kasıtlı fail-safe davranışıdır; retry UI yoktur. Reduced-motion etkinse
video ve kilit atlanır. IMP-024 sonrasında müşteri akışında her blok, merkezi exterior
medya yapılandırmasındaki ayrı forward ve ayrı reverse proje klibini kullanır.

## Tarayıcı doğrulaması (2026-09-18)

Gerçek uygulama Codex tarayıcısında doğrulandı. Hata enjeksiyonu ve olay ölçümü için
geçici HTML test girişinden gerçek uygulama yüklendi; test girişi sonrasında kaldırıldı.

- A/B/C hotspot ve düğmelerinin altı kombinasyonu: tek play, yaklaşık 1 saniye,
  `ended` sırasında Home rotası, ardından doğru Block rotası.
- Oynatma sırasında bütün kontroller/hotspotlar disabled; ikinci düğme/polygon
  aktivasyonu hedefi değiştirmedi ve ikinci play üretmedi.
- Browser Back: Home ve yeniden etkin kontroller.
- `play()` reddi ve medya error enjeksiyonu: hedefe geçiş, paused=true, currentTime=0.
- Çözümlenmeyen play promise'i: yaklaşık 10 saniye sonunda güvenli hedefe geçiş.
- Reduced-motion matchMedia simülasyonu: sıfır play çağrısıyla hedefe geçiş.
- Video oynarken global Video bağlantısıyla unmount: cleanup sonrasında paused=true,
  currentTime=0; gecikmiş Block yönlendirmesi olmadı.
- 1440×1080 ve 390×844 viewport: video sahneyle aynı dikdörtgende, 4:3, kırpılma yok.
  Dar görünümde durum metni kaynaklı scrollbar değişimi min-height ile giderildi;
  tekrar ölçümünde başlangıç/oynatma/bitiş sahne ölçüleri aynı kaldı (327×245 yuvarlatılmış).
- Geçersiz block, başka bloğa ait unit ve /availability: not-found.
- Tarayıcı konsolunda yeni runtime hatası/uyarısı görülmedi.

Bu bölüm IMP-007 doğrulama kaydıdır. Gerçek exterior medya ve ters geçiş entegrasyonu
IMP-024 kapsamında ayrıca doğrulanmıştır.
