# Hotspot Editor v1 (IMP-012 / IMP-028 Phase A)

`npm run dev` sonrasında `/__dev/hotspot-editor` adresini açın. Route yalnızca
`import.meta.env.DEV` koşulunda tanımlanır; lazy import production çıktısından elenir.
Global menüde bağlantısı yoktur.

SceneStage ortak 1920 × 1440 koordinat uzayını ve 4:3 ölçeklemeyi sağlar.
Editör taban katmanında merkezi exterior medya manifestindeki gerçek Block
görsellerini kullanır:

- Block A: `/media/scenes/project/block-a.webp`
- Block B: `/media/scenes/project/block-b.webp`
- Block C: `/media/scenes/project/block-c.webp`

Block selector yalnız taslak boşken değiştirilebilir. Kayıtlı her Unit polygonu
çizildiği `blockId` ile birlikte tutulur; sahne değiştirmek kayıtlı bir Unit'i
başka Block'a taşımaz. Her sahnede yalnız o Block'a ait kayıtlı polygonlar görünür.
Görsel ve SVG çizim yüzeyi aynı SceneStage koordinat katmanında birebir hizalanır.
SVG bounding rectangle üzerinden `(clientX - left) / width * 1920` ve
`(clientY - top) / height * 1440` hesaplanır; sonuç sınırlara kırpılır ve en yakın
tamsayıya yuvarlanır. Letterbox boşlukları çizim yüzeyine dahil değildir.

İşaretçiyle köşeleri ekleyin, gerekirse son köşeyi geri alın veya taslağı temizleyin.
Unit ID alanı serbest metin kabul etmez; seçili Block için yalnız IMP-028 kapsamındaki
izinli ID'leri sunar. En az üç köşe ve daha önce kaydedilmemiş bir ID ile kaydedin.
Kayıtlı polygon ID düğmesi polygonu ve koordinatlarını incelemeye açar.
Yerinde düzenleme yoktur: gerektiğinde polygonu silip yeniden çizin.
Silme taslağı etkilemez; taslak temizleme kayıtlı polygonları etkilemez.
Tüm veri yerel React belleğindedir; sayfadan ayrılınca kaybolur.

JSON her kayıtlı Unit ID altında `blockId` ve tamsayı `points` koordinatlarını içerir.
ID'ler karşılaştırma sırasıyla sıralanır; köşeler çizim sırasını korur. Taslak dışa
aktarılmaz. Bu şema Unit/Block ilişkisinin operatör çıktısında açık kalmasını sağlar.
Clipboard mevcutsa kopyalama düğmesi görünür; hata halinde görünür JSON alanı
elle kopyalama için kullanılabilir. JSON import ve özel görsel yükleme v1'e dahil değildir.

Çıktıyı elle kopyalayın ve gerçek render ile hizasını ayrıca gözden geçirin.
Onaylanan koordinatlar IMP-028 Phase B başlamadan önce aynı Codex konuşmasına
eksiksiz yapıştırılmalıdır. Phase A customer-facing Unit geometrisini değiştirmez.
Editör kaynak dosyası yazmaz, runtime polygonları değiştirmez, backend kullanmaz.
Araç DEVELOPMENT-ONLY kalır; gerçek Block görselleri yalnız authoring referansıdır.
