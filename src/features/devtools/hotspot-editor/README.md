# Hotspot Editor v1 (IMP-012)

`npm run dev` sonrasında `/__dev/hotspot-editor` adresini açın. Route yalnızca
`import.meta.env.DEV` koşulunda tanımlanır; lazy import production çıktısından elenir.
Global menüde bağlantısı yoktur.

SceneStage ortak 1920 × 1440 koordinat uzayını ve 4:3 ölçeklemeyi sağlar.
SVG bounding rectangle üzerinden `(clientX - left) / width * 1920` ve
`(clientY - top) / height * 1440` hesaplanır; sonuç sınırlara kırpılır ve en yakın
tamsayıya yuvarlanır. Letterbox boşlukları çizim yüzeyine dahil değildir.

İşaretçiyle köşeleri ekleyin, gerekirse son köşeyi geri alın veya taslağı temizleyin.
En az üç köşe ve trim edilmiş, benzersiz, boş olmayan ID ile kaydedin.
Kayıtlı polygon ID düğmesi polygonu ve koordinatlarını incelemeye açar.
Yerinde düzenleme yoktur: gerektiğinde polygonu silip yeniden çizin.
Silme taslağı etkilemez; taslak temizleme kayıtlı polygonları etkilemez.
Tüm veri yerel React belleğindedir; sayfadan ayrılınca kaybolur.

JSON yalnızca kayıtlı ID ve tamsayı koordinatlarını içerir. ID'ler karşılaştırma
sırasıyla sıralanır (JSON nesnelerinde sayısal anahtarlar JavaScript'in sabit
sayısal sırasını kullanır); köşeler çizim sırasını korur. Taslak dışa aktarılmaz.
Clipboard mevcutsa kopyalama düğmesi görünür; hata halinde görünür JSON alanı
elle kopyalama için kullanılabilir. JSON import ve özel görsel yükleme v1'e dahil değildir.

Çıktıyı elle kopyalayın ve gerçek render ile hizasını ayrıca gözden geçirin.
Onaylanan koordinatların runtime verilerine entegrasyonu ayrı bir görevdir.
Editör kaynak dosyası yazmaz, runtime polygonları değiştirmez, backend kullanmaz.
Varsayılan zemin nötr DEVELOPMENT-ONLY görselidir; proje medyası içermez.
