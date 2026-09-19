# IMP-018 — Completion Report

Tarih: 2026-09-19

1. **Özet:** Mevcut demo için responsive/mobil kullanılabilirlik düzenlemeleri tamamlandı. Final tasarım, yeni rota, veri veya medya eklenmedi.

2. **Değişen dosyalar:**
   - src/styles/index.css
   - src/features/blocks/BlockPage.tsx
   - src/features/blocks/BlockPage.css
   - src/features/units/UnitQuickCard.css
   - src/features/units/UnitDetailsDrawer.css
   - src/features/tours/TourPage.css
   - src/features/video/VideoPage.css
   - src/features/devtools/hotspot-editor/HotspotEditor.css
   - src/features/devtools/panorama-spike/PanoramaSpike.css
   - docs/IMP-018-COMPLETION-REPORT.md (bu rapor)

3. **AppShell:** Dar ekran içerik boşlukları azaltıldı; uzun metinlerin satır kırması güvenli hale getirildi. Global bağlantılar en az 44 × 44 CSS px. Contextual Home suppression değişmedi ve Block/Unit/Details/Tour akışlarında doğrulandı.

4. **Masterplan / Block:** Mantıksal 1920 × 1440 sahne ve hotspot geometrileri değişmedi. 320 px'te sahne 288 × 216; masaüstünde 768 × 576 ölçüldü. A/C sahneleri ile SVG sınırları altı viewportta 1 px tolerans içinde eşleşti. B sahnesi üç ana akışta doğrulandı. Block durum metnine ayrılan alan sayesinde 320 px'te reverse geçiş öncesi/sırasında sahnenin belge içi üst konumu aynı kaldı (454.453125 px); durum alanı her iki halde 72 px. Klavye odağı B kontrolü ile B hotspot vurgusunu eşitledi; forward/reverse sırasında kontroller kilitlendi.

5. **Quick Card:** Bilgi satırları küçülebilen iki sütunlu grid oldu. Plan yer tutucusu, bilgiler, Sanal Tur, Detayları Gör ve kapatma bağlantıları dar ekranlarda kullanılabilir. Seçili Unit davranışı korunuyor.

6. **Details:** Dar ekrandaki negatif üst boşluk kaldırıldı; panel aynı Block kompozisyonunda sahnenin altına yerleşiyor. Plan/galeri yer tutucuları sınırlar içinde; sayfa dikey kaydırılarak Quick Card'a Dön, Sanal Tur ve Bloğa Dön bağlantılarına erişiliyor.

7. **Virtual Tour / minimap / help:** Daireye Dön bağlantısına açık 44 px yükseklik; minimap düğmelerine 44 px minimum genişlik verildi. Dar portrede mevcut sahne-altı minimap korunuyor. 900 px altı ve 500 px'ten kısa ekranlarda minimap sahnenin altına taşınıyor; panorama 70dvh, en az 240 px. 320 × 568 production yardım diyaloğu 267 × 536 px, kapatma düğmesi 44 px ölçüldü; kaydırılabilir modal kapatılabildi. Tekrar girişte yardım açılmadı. Kapatma sonrası panorama sürüklemesi hotspot ekran konumlarını değiştirdi. Adapter mimarisi değişmedi.

8. **Project Video:** Home dönüş bağlantısı 44 px yüksekliğe çıkarıldı. Native kontroller ve lifecycle değişmedi. Oynat/duraklat doğrulandı. 320 px'te 288 × 162, masaüstünde 768 × 432 ölçüldü (16:9).

9. **Development tools:** Hotspot Editor giriş/geri dönüş alanları büyütüldü; textarea yalnızca dikey yeniden boyutlandırılabilir. 390 px'te 343 × 257.25 sahnede üç tıklama beklenen mantıksal [963,722], [481,363], [1439,363] koordinatlarını üretti; polygon JSON'a kaydedildi, taşma yok. Spike oda/minimap senkronizasyonu çalıştı; üç unmount/mount döngüsünde canvas sayısı 0 → 1, taşma yok.

10. **Touch / focus:** Global nav ve ilgili geri dönüş bağlantıları, editör girdisi ve minimap hedefleri iyileştirildi. Uygulama oda menüsü/minimap/yardım ve kart aksiyonları en az 44 px yüksekliğini koruyor. Global görünür focus kuralı eklendi. Engine'in kendi 26 px panorama hotspotları ve native video kontrol boyutları değiştirilmedi; alternatif oda/minimap kontrolleri 44 px. Dış sahne hotspot geometrileri görev gereği değiştirilmedi.

11. **Viewport doğrulamaları:** In-app Chromium viewport simülasyonunda 320 × 568, 390 × 844, 768 × 1024, 1280 × 800, 1440 × 900 ölçüldü. Home, A/B/C Block, B-301 Quick Card, Details, Tour ve Video rotalarında yatay sayfa taşması görülmedi. Sahne 4:3 ve video 16:9 korundu. Details, tablet Masterplan ve masaüstü Tour ayrıca ekran görüntüsüyle incelendi.

12. **Mobile landscape:** 844 × 390 kontrolü geçti. Tüm ana rota sınıflarında yatay taşma yok. Panorama 273 px yüksekliğinde, minimap normal akışta; panorama sürüklemesi çalışıyor.

13. **Flow A / B / C:**
   | Genişlik | Flow A | Flow B | Flow C |
   | --- | --- | --- | --- |
   | 320 | PASS | PASS | PASS |
   | 390 | PASS | PASS | PASS |
   | 1280 | PASS | PASS | PASS |

   A: Home → B → B-301 → Quick Card → Details → Quick Card → Block → reverse Home.
   B: Home → B → B-301 → Tour → oda menüsü → panorama hotspot → minimap → daralt/aç → Daireye Dön.
   C: Home → Video → native oynat/duraklat → Home → Browser Back → Forward.
   İlk yardım 320 px'te kapatıldı; sonraki tur girişlerinde kapalı durum korundu.

14. **Production preview:** http://127.0.0.1:4173 üzerinde tur/help/daireye dönüş çalıştı. Her iki DEV rotası NotFound; geçersiz Block ve Block/Unit eşleşmesi NotFound. Test edilen akışların tarayıcı konsolunda hata/uyarı yok.

15. **Komutlar:** npm run validate:data; npm run build; npm run lint; node scripts/test-panorama-adapter.mjs; node scripts/test-tour-help-storage.mjs; git diff --check; npm run preview -- --host 127.0.0.1. Mevcut localhost:5173 geliştirme sunucusu tarayıcı doğrulamasında kullanıldı.

16. **Kontrol sonuçları:**
   | Kontrol | Sonuç |
   | --- | --- |
   | validate:data | PASS: 3 Block, 10 UnitType, 78 Unit, snapshot parity |
   | build | PASS: 82 modül |
   | lint | PASS (repo geneli) |
   | panorama adapter testi | PASS |
   | tour help storage testi | PASS |
   | git diff --check | PASS |

17. **Bağımlılıklar:** Eklenmedi; package/lock dosyaları değişmedi.

18. **Uyarılar / sınırlar:** İlk build ve preview denemeleri ortamın esbuild alt süreç kısıtı nedeniyle spawn EPERM verdi; izinli ortamda tekrar çalıştırılarak başarıyla tamamlandı. Git yalnızca LF/CRLF normalizasyon uyarıları verdi; whitespace hatası yok. Testler fiziksel telefon veya Safari testi değildir. Medya hata durumları ayrıca zorla tetiklenmedi; durum metinleri ortak satır kırma kurallarına tabidir. Kilitli baseline belgeleri değişmedi; mimari çelişki bulunmadı.

19. **Kapsam:** Yalnızca IMP-018 uygulandı. IMP-019'a başlanmadı.
