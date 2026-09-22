# SceneStage — IMP-004

`SceneStage`, `label` (erişilebilir grup adı), `base`, isteğe bağlı
`interaction` ve `overlay` React içeriklerini alır. Katman sırası sırasıyla
0, 1 ve 2'dir. Boş katmanlar alttaki içeriğin işaretçi olaylarını engellemez.
Hotspot veya geçiş davranışı içermez.

Her katman 1920 × 1440 mantıksal piksel alanını kullanır. İçerikleri normal
CSS piksel koordinatlarıyla konumlandırın. ResizeObserver, kapsayıcının
genişlik ve yüksekliğine göre tek bir contain ölçeği hesaplar; bütün
katmanlar birlikte ölçeklenir ve ortalanır. Varsayılan alan genişliğe göre
4:3'tür. Yüksekliği sınırlandırmak için üst kapsayıcıya açık bir yükseklik
verilebilir; bu durumda kalan alan boş bırakılır, sahne kırpılmaz.

`SceneStageImage`, `src` ve zorunlu `alt` ile sağlanan görseli katmana
yerleştirir. Dekoratif görseller için `alt=""` kullanılır. Görsel oranı
4:3 değilse `object-fit: contain` ile kırpılmadan gösterilir; alanı tamamen
dolduracak dış sahne görselleri 4:3 olmalıdır. Medya URL'si merkezi sahne /
medya verisinden gelmelidir.

Geçici `SceneStageProof` örneği IMP-030 legacy audit sırasında kaldırılmıştır.
Production Home ve Block sahneleri bu bileşimi gerçek exterior medya ve canonical
polygon kaynaklarıyla kullanır. Hotspot API'si için
`../SvgHotspotLayer/README.md` dosyasına bakın.

Doğrulama: 1440 × 1000 viewport'ta sahne 768 × 576; 390 × 844 viewport'ta
342 × 256,5 piksel. Her ikisinde merkez sapması (0, 0), oran 4:3; yatay
taşma ve sahne kırpılması yok. Home, Block, Unit, Details, Tour ve Video
yer tutucuları ile dönüş bağlantıları tarayıcıda kontrol edildi; konsolda
hata veya uyarı gözlenmedi.
