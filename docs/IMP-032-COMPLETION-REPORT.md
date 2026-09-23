# IMP-032 Tamamlanma Raporu

## 1. Özet

**IMP-032 PASS.** Human-assisted 2+1 panorama entegrasyonu teknik doğrulamadan ve kullanıcının gerçek Chrome/F11 human visual review kontrolünden geçti. Tek canonical `BC-T01` Tour'u dört proje panoramasını ve kullanıcı tarafından verilen tam altı oda geçiş noktasını içeriyor. B-304 ile C-401 aynı Tour tanımını kullanıyor. Diğer tiplere Tour atanmadı. Oda menüsü dört sahnenin tamamına erişim sağlıyor; minimap, aktif sahne, Daireye Dön ve tarayıcı geçmişi korundu.

## 2. Başlangıç repository durumu

Çalışmaya `main` dalında, tamamlanmış IMP-032 Phase A değişiklikleri bulunan çalışma ağacında başlandı. Dört `public/media/panoramas/project/*.jpg` dosyası kullanıcı girdisi olarak untracked durumdaydı. Phase A sonunda `bathroom.jpg` 7078×3500 ölçüsündeydi. Kullanıcı Phase B öncesinde bu dosyayı kendisi 7000×3500 olarak düzeltti. Mevcut çalışma ağacı değişiklikleri ve kullanıcı medyası korundu; bu görev için commit oluşturulmadı.

## 3. Kullanıcı panoramalarının denetimi

System.Drawing ile dört JPEG açılıp ölçüldü; tamamı 7000×3500, yani tam 2:1. Pannellum `equirectangular` sahne ayarında dört görsel de tarayıcıda açıldı. Phase B başlangıcı ve final SHA-256 değerleri aynı kaldı:

| Dosya | Boyut | SHA-256 |
| --- | ---: | --- |
| `living-room.jpg` | 6.901.047 B | `C5BF9C709A0E7A51F55E5EE69F5A16425F86EE1B69FC50FE8267720B41B6C537` |
| `bedroom-master.jpg` | 7.025.781 B | `DC6D41D6C6158CCAA2AE1393069D2D498AC264314914CC4A423F02A85D4DF21B` |
| `bedroom-single.jpg` | 7.157.883 B | `42579A1971A4838020F4CD73182B341E8F65F32694319FAF7CB5FD8F3635FDFD` |
| `bathroom.jpg` | 14.961.791 B | `A7007DD505BE5139AE97E51D41C863936E48600E17C8846441F6578ABB376A80` |

## 4. Canonical Tour eşlemesi

`src/features/tours/projectTour.ts` içinde `bc-t01-project-tour` kimlikli, typed `Tour` tanımı bulunur. `unitTypeId` yalnızca `BC-T01`'dir; `getProjectTour` yalnız bu tip için aynı `scenes` dizisini döndürür. Renderer başlangıcı `living-room` sahnesidir. Seed `UnitType` kayıtları ve inventory snapshot değiştirilmedi.

## 5. Tour'u kullanan Unit'ler

Demo Unit'lerinden B-304 ve C-401, Block → Unit → UnitType çözümlemesi üzerinden aynı Tour'a ulaşır. Her ikisinin doğrudan `/tour` rotası tarayıcıda açıldı ve panorama canvas'ı oluştu. Kullanıcı human visual review'da iki Tour'un da açıldığını doğruladı.

## 6. Hariç tutulan tipler

`BC-T01-M`, `BC-T02`, `BC-T02-M` ve ticari `A-T01`, `A-T02`, `A-T03`, `A-T03-M`, `A-T04`, `A-T04-M` Tour'a bağlanmaz. B-301, B-302, B-303 ve A-003 doğrudan Tour rotalarında mevcut “Sanal tur henüz mevcut değil” durumunu gösterdi; canvas sayısı sıfırdı. Mevcut Quick Card Tour CTA'sı bu durum sayfasına gider.

## 7. Sahne adları ve medya yolları

| Sahne ID | TR | EN | RU | Medya yolu |
| --- | --- | --- | --- | --- |
| `living-room` | Salon / Yaşam Alanı | Living Room / Living Area | Гостиная / жилая зона | `/media/panoramas/project/living-room.jpg` |
| `bedroom-master` | Ebeveyn Yatak Odası | Master Bedroom | Главная спальня | `/media/panoramas/project/bedroom-master.jpg` |
| `bedroom-single` | Oda | Bedroom | Комната | `/media/panoramas/project/bedroom-single.jpg` |
| `bathroom` | Banyo | Bathroom | Ванная | `/media/panoramas/project/bathroom.jpg` |

Hotspot etiketleri hedef sahnenin aynı dildeki adından üretiliyor. Pannellum sahne hotspot'ları adapter içinde hedef oda adıyla `aria-label`, `role=button`, odak ve Enter/Space etkinleştirmesi kazanıyor; görünür tooltip stili korunuyor. TR/EN/RU dil değişiminde aktif sahne ve URL korundu.

## 8. DEV koordinat hazırlama yöntemi

DEV Tour'da panorama üzerinde Shift+tık, adapter sınırındaki Pannellum `mouseEventToCoords` sonucunu `sourceSceneId`, `pitch` ve `yaw` olarak gösterir. Bu araç yalnız `import.meta.env.DEV` koşuluyla render edilir. Production build'de `.unit-tour__authoring` sayısı sıfır ölçüldü; staging bundle kontrolü authoring başlığını dışlar. Yeni dependency eklenmedi.

## 9. İnsan koordinatları ve hedef grafiği

Aşağıdaki altı koordinat kullanıcıdan geldi ve aynen işlendi. Başka geçiş noktası eklenmedi. `node scripts/test-project-tour.mjs` tam grafı ve sayıyı denetler.

| Kaynak | Hedef | Pitch | Yaw |
| --- | --- | ---: | ---: |
| `living-room` | `bedroom-master` | -4.9493 | 155.0516 |
| `bedroom-master` | `living-room` | -0.7370 | -119.5104 |
| `living-room` | `bathroom` | -1.2952 | 123.4208 |
| `bathroom` | `living-room` | 2.2864 | 176.3229 |
| `living-room` | `bedroom-single` | -0.0138 | 105.6953 |
| `bedroom-single` | `living-room` | 10.2664 | 128.6045 |

B-304'te altı hotspotun her biri gerçek panorama görünümünde seçildi ve hedef sahneye geçti. Salon → Oda için Enter, Oda → Salon için Space ayrıca çalıştı. Hotspotlar URL geçmişine ayrı kayıt eklemez; sahne seçimi Tour içinde transient state'tir.

## 10. Oda menüsü

Dört sahne menüden doğrudan seçilebilir. Phase A'da dört JPG'nin menü üzerinden açıldığı görsel olarak doğrulandı. Phase B'de C-401 menüsüyle Banyo'ya, minimap ile Salon'a dönüş tekrar doğrulandı. Hotspot bulunmayan doğrudan oda çiftleri için menü eksiksiz geçiş yoludur.

## 11. Minimap ve aktif sahne

Minimap ölçülmüş daire planı olarak sunulmuyor; dört bakış noktası için temsili seçim alanıdır. Altı hotspot geçişinde ve C-401 menü/minimap kontrolünde aktif oda metni, menü `aria-pressed` ve minimap `aria-pressed` birlikte güncellendi.

Human visual review'da minimap iç ızgarasının karttan sağa taştığı görüldü. Ön düzeltme DOM ölçümünde ızgara `content-box` nedeniyle kartın sağ kenarını 5 px aşıyor, kartta `scrollWidth` değeri `clientWidth` değerinden 6 px büyük kalıyordu. Yalnız `.unit-tour__map` için `box-sizing: border-box` eklendi. Sonrasında dört oda butonu ve daraltma butonu kart sınırları içinde ölçüldü. Banyo seçilince aktif oda metni ile menü/minimap `aria-pressed` değerleri birlikte güncellendi. Daraltma/açma düğmesinin `aria-expanded` ve erişilebilir adı iki durumda doğru kaldı; geniş görünümde kart `.unit-tour__stage` sağ ve alt kenarından 16'şar px içeride kaldı.

Kullanıcı son görsel kabulde minimap aç/kapat, oda butonları ve hotspot geçişlerinin düzgün çalıştığını; görsel taşma veya clipping görmediğini bildirdi: **PASS**.

## 12. Tarayıcı Back/Forward ve Daireye Dön

C-401 Tour → Daireye Dön, `/block/c/unit/C-401` Quick Card rotasına gitti. Browser Back Tour'a, Forward Unit rotasına döndü. B-304'te aynı akış Phase A'da doğrulanmıştı.

## 13. Lazy loading ve medya yükleme

Production preview'de temiz Home yüklemesinin varlık listesi yalnız entry JS, entry CSS, `masterplan.webp` ve favicon içerdi; Tour chunk'ı veya panorama JPG'si istenmedi. B-304 Tour açılınca panorama yüklemesi başladı. Tour/Pannellum lazy route sınırı korundu.

## 14. Responsive ve sunum laptopu

Chromium viewport simülasyonunda 390×844 için Tour viewer 353×466 px, minimap 351 px genişlikle panorama altında kaldı. 1920×1080 F11 boyutu simülasyonunda viewer 1875×704 px ve minimap sağ altta ölçüldü. Human visual review sonrası düzeltmenin DOM sınır ölçümleri:

| Viewport | Belge `scrollWidth/clientWidth` | Minimap `scrollWidth/clientWidth` | İç ızgara ve 5 buton kart içinde |
| --- | ---: | ---: | --- |
| 390×844 | 375/375 | 349/349 | Evet |
| 1280×800 | 1265/1265 | 318/318 | Evet |
| 1920×1080 F11 simülasyonu | 1905/1905 | 318/318 | Evet |

Rusça uzun oda adları ayrıca 390×844 ve 1920×1080 boyutlarında taşmadan sığdı. İngilizce etiketlerde 390×844 boyutunda beş butonun kendi `scrollWidth=clientWidth` ve `scrollHeight=clientHeight` değerleri ölçüldü. Bu tablo Chromium viewport simülasyonu ölçümüdür. Kullanıcı ayrıca gerçek Chrome/F11 görünümünde minimap düzeltmesini kontrol etti ve taşma/clipping olmadan **PASS** bildirdi.

## 15. Staging sonucu

Minimap CSS düzeltmesinden sonra yeniden alınan production build üzerinde `npm run staging:verify` PASS: 9 SPA route shell, 2 entry asset ve 20 medya için doğru MIME ile `206` byte-range yanıtı. Dört proje JPG'si bu 20 medyaya dahil. Missing/proof-file `404`, DEV route bundle izolasyonu ve localhost/dosya yolu hijyeni kontrolü de PASS. Önceki production B-304 Tour kontrolünde tek canvas, üç yerelleştirilmiş hotspot etiketi, sıfır DEV authoring alanı ve sıfır belge yatay overflow görüldü; konsolda entegrasyon kaynaklı error/warning yoktu.

## 16. Komut sonuçları

| Komut | Sonuç |
| --- | --- |
| `npm run validate:data` | PASS; snapshot parity |
| `npm run build` | PASS; minimap CSS düzeltmesi sonrası 94 modül. Sandbox içindeki ilk deneme `spawn EPERM` verdi, izinli aynı komut başarılı oldu. |
| `npm run lint` | PASS |
| `npx tsc -b` | PASS |
| `npm run test:localization` | PASS; TR/EN/RU 119 anahtar |
| `node scripts/test-panorama-adapter.mjs` | PASS; lifecycle, koordinat seçimi ve erişilebilir hotspot süslemesi |
| `node scripts/test-tour-help-storage.mjs` | PASS |
| `node scripts/test-project-tour.mjs` | PASS; tam altı insan koordinatı, kapsam ve etiketler |
| `npm run staging:verify` | PASS; 9 route, 20 medya |
| `git diff --check` | PASS; yalnız Windows LF→CRLF bilgilendirmeleri |

## 17. Bağımlılık değişiklikleri

Yeni bağımlılık yoktur; `package.json` ve lockfile değiştirilmedi. Panorama motoru mevcut adapter sınırında kaldı.

## 18. Kalan demo sınırları ve mimari çatışma

Panoramalar temsili/AI üretimi demo içeriğidir; müşteri metni bunları nihai iç mekân teslimi olarak tanıtmaz. Minimap ölçülmüş kat planı değildir. Graf yalnız insanın seçtiği altı yönü içerir; diğer geçişler oda menüsüyle yapılır. Gerçek Chrome/F11 görsel kabulü kullanıcı tarafından tamamlandı; Safari doğrulaması bu kapsamda yapılmadı. Kilitli baseline ile mimari çatışma bulunmadı.

## 19. Medya dosyalarının korunması

Dört production JPG Phase B entegrasyonu sırasında açma/ölçme/hash ve tarayıcı görüntüleme dışında işlenmedi. Başlangıç/final hash değerleri Bölüm 3 ile aynıdır. `bathroom.jpg` düzeltmesi kullanıcı tarafından çalışma başlamadan önce yapıldı.

## 20. Kapsam kapanışı

Yalnız IMP-032 Phase B kodu ve minimap taşma düzeltmesi uygulandı. Kullanıcı gerçek Chrome/F11 human visual review sonucunu PASS olarak bildirdi; gerekli teknik doğrulamalarla birlikte **IMP-032 tamamlandı: PASS**. Exterior/Unit hotspotları, geçiş videoları, planlar ve proje videosu değiştirilmedi. IMP-033'e başlanmadı.
