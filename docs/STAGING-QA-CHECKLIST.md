# Staging QA Checklist

Bu liste, root path altında sunulan müşteri-demo production build'inin elle doğrulanması içindir. Gerçek medya, hosting sağlayıcısı, DNS/CDN ve production operasyonları bu kapsamda değildir.

## Hazırlık

- [ ] Temiz checkout sonrasında `npm install`, `npm run staging:build` ve `npm run staging:verify` başarılı.
- [ ] `npm run staging:serve` ile açılan URL kullanılıyor; test boyunca tarayıcı konsolu ve Network paneli izleniyor.
- [ ] Kullanılan medya sentetik `DEVELOPMENT-ONLY` proof varlıkları olarak kabul ediliyor; müşteriye gerçek proje medyası diye sunulmuyor.

## Ana müşteri akışı

- [ ] Home doğru render oluyor; A/B/C hotspot ve eşleşen kontroller hover, focus ve seçim durumunda senkron.
- [ ] Home → B forward transition çalışıyor ve oynatma sırasında tekrar etkileşim kilitli.
- [ ] B → Home reverse transition çalışıyor; reduced-motion açıkken güvenli doğrudan yönlendirme sürüyor.
- [ ] B-301 seçimi Unit Quick Card'ı açıyor; plan alanı, özet ve aksiyonlar kullanılabilir.
- [ ] Details açılıyor; `Quick Card'a Dön` ve `Bloğa Dön` doğru bağlama dönüyor.
- [ ] B-301 için Virtual Tour açılıyor; ilk kullanım yardımı ilk girişte gösterilip kapatılabiliyor ve tekrar girişte kapalı kalıyor.
- [ ] Tour oda menüsü, panorama hotspotu, minimap aktif noktası ve minimap daralt/aç davranışı senkron.
- [ ] `Daireye Dön` seçili Unit bağlamına geri dönüyor.
- [ ] Tour'u olmayan birim açık unavailable durumu gösteriyor; panorama motoru/canvas başlatılmıyor.
- [ ] Project Video yalnızca `/video` rotasında yükleniyor; native oynat/duraklat ve Home dönüşü çalışıyor.

## Routing ve production izolasyonu

- [ ] Browser Back / Forward; Details, Quick Card, Tour, Block, Home ve Video arasında tutarlı.
- [ ] `/`, `/block/b`, `/block/b/unit/B-301`, `/block/b/unit/B-301/details`, `/block/b/unit/B-301/tour` ve `/video` doğrudan açılıp yenilenebiliyor.
- [ ] Geçersiz bir rota uygulamanın `Sayfa bulunamadı` görünümünü gösteriyor.
- [ ] `/__dev/hotspot-editor` ve `/__dev/panorama-spike` production build'de `Sayfa bulunamadı` gösteriyor; DEV araç arayüzleri erişilebilir değil.

## Medya ve görünüm

- [ ] Forward/reverse transition MP4, üç panorama JPG ve project-video MP4 istekleri başarılı; content type değerleri doğru.
- [ ] Doğrudan Tour rotasında lazy JS/CSS ile panorama varlığı; doğrudan Video rotasında video varlığı doğru root-relative URL'den yükleniyor.
- [ ] 390 px viewportta Home, Block, Quick Card, Details, Tour ve Video kullanılabilir; yatay taşma yok.
- [ ] 1280 px viewportta aynı rotalar kullanılabilir; sahne/overlay hizası ve 4:3 exterior oranı korunuyor.
- [ ] Tam akış: Home → B → B-301 → Details → Quick Card → Tour → Daireye Dön → Block → Home → Video.
- [ ] Tam akış, direct refresh ve Back/Forward boyunca yeni console error/warning yok.

## Hosting devri notu

- [ ] Host, dosya olmayan uygulama URL'lerini `index.html`'e düşürecek SPA fallback ile yapılandırılacak.
- [ ] `index.html` kısa/no-cache veya revalidation-friendly; hashed JS/CSS uzun immutable cache alacak.
- [ ] Production medya ancak versioned dosya adı/yolu varsa uzun cache alacak; mutable/unversioned medya revalidation-friendly olacak.
- [ ] Uygulama şu anda host root'u (`/`) varsayıyor; subdirectory hosting ayrı bir base-path kararı gerektiriyor.
