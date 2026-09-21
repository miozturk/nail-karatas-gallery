# IMP-029 — Real Unit Plan Integration & Content Cleanup Completion Report

Tarih: 2026-09-21

## 1. Özet

Beş mevcut plan PNG'si, canonical UnitType kimliğini anahtar kabul eden tek production eşlemesi üzerinden Quick Card ve Details yüzeylerine bağlandı. İki yüzey aynı `UnitPlan` bileşenini ve aynı resolver'ı kullanır. Planlar sabit kare frame içinde `object-fit: contain` ile gösterilir; bugünkü farklı portre oranları veya yarın aynı dosya adlarıyla gelecek kare sürümler stretch, anlamlı crop ya da layout shift üretmez. A-003 mevcut `A-T03` ilişkisi üzerinden `plan-ticari.png` dosyasını normal production medya olarak gösterir. Yalnızca IMP-029 uygulandı.

## 2. Değişen dosyalar

- `public/media/plans/project/plan-bc-t01.png`
- `public/media/plans/project/plan-bc-t01-m.png`
- `public/media/plans/project/plan-bc-t02.png`
- `public/media/plans/project/plan-bc-t02-m.png`
- `public/media/plans/project/plan-ticari.png`
- `src/media/unitPlanMedia.ts`: canonical UnitType → plan yolu eşlemesi ve güvenli resolver.
- `src/features/units/UnitPlan.tsx`, `UnitPlan.css`: Quick Card ve Details'ın ortak plan sunumu.
- `src/features/units/UnitQuickCard.tsx`, `UnitQuickCard.css`: yapay plan proof'u kaldırılarak ortak gerçek plan bileşeni bağlandı.
- `src/features/units/UnitDetailsDrawer.tsx`, `UnitDetailsDrawer.css`: plan placeholder'ı kaldırılarak aynı ortak bileşen bağlandı.
- `src/i18n/translations/tr.ts`, `en.ts`, `ru.ts`: gerçek plan metinleri, alt metin ve unmapped fallback parity'si.
- `scripts/verify-staging.mjs`: beş PNG için staging MIME/range doğrulaması.
- `docs/IMP-029-COMPLETION-REPORT.md`: bu rapor.

## 3. Plan media audit

Dosyalar görev sırasında crop, resize, recompress, rename, convert veya regenerate edilmedi. Başlangıç ve final SHA-256 değerleri birebir aynı kaldı.

| Dosya | Boyut | Piksel | SHA-256 |
| --- | ---: | ---: | --- |
| `plan-bc-t01.png` | 571989 byte | 659×809 | `4DA5A4F0DDAC7FA902AB3885F4682D414360077A127EF5A117163320B5293322` |
| `plan-bc-t01-m.png` | 571238 byte | 655×882 | `DD1A18A73AA551A332D9F0724C3092C5889EA4202D3A872CE228AD46ECE107C5` |
| `plan-bc-t02.png` | 430284 byte | 528×661 | `B2BCBD548A3C8538E3E6DFEDF2EC2D6ABE58ADA15F8D6153501E8D1256269F6F` |
| `plan-bc-t02-m.png` | 436382 byte | 533×675 | `82414286329C7275DE3C5381C939C7571263F58B4F164891A2C5E249E61CE331` |
| `plan-ticari.png` | 3409 byte | 533×675 | `E1E1FCB6BDAA1007FC0A7BFFE8A3AC9E806CF1E6C8A2FAF3CB3B27C8B7C6545F` |

## 4. Canonical plan-media mapping yeri

Tek eşleme `src/media/unitPlanMedia.ts` içindedir. Kapalı `UnitPlanUnitTypeId` union'ı ve `satisfies Record<...>` exact anahtar kümesini TypeScript düzeyinde korur. `getUnitPlanMedia(unitTypeId)` bilinmeyen ID'yi güvenli biçimde `undefined` olarak döndürür. Componentlerde plan dosya adı literal'i yoktur.

## 5. UnitType → plan eşleme tablosu

| Canonical UnitType ID | Plan yolu | İlgili demo Unit örnekleri |
| --- | --- | --- |
| `A-T03` | `/media/plans/project/plan-ticari.png` | A-003 |
| `BC-T01` | `/media/plans/project/plan-bc-t01.png` | B-304, C-401 |
| `BC-T01-M` | `/media/plans/project/plan-bc-t01-m.png` | B-301 |
| `BC-T02` | `/media/plans/project/plan-bc-t02.png` | B-303, C-402, C-404 |
| `BC-T02-M` | `/media/plans/project/plan-bc-t02-m.png` | B-302, C-403 |

## 6. A-003 ticari plan çözümlemesi

Seed/domain ilişkisi `A-003.unitTypeId === "A-T03"` değeridir. Resolver bu canonical UnitType kimliğini `/media/plans/project/plan-ticari.png` yoluna bağlar. Piksel içeriği incelenerek kimlik çıkarımı veya siyah-piksel/placeholder algılama yapılmaz. Dosya gizlenmez, unavailable durumuna çevrilmez ve normal `<img>` production varlığı olarak Quick Card ile Details'ta gösterilir.

## 7. Quick Card entegrasyonu

Eski CSS çizimli DEVELOPMENT-ONLY proof kaldırıldı. Quick Card artık `UnitPlan` üzerinden route'un doğruladığı `unit` ve `unitType` nesnelerini kullanır. Production Chromium'da A-003, B-301, C-401 ve ek matris rotalarında doğru plan yolu, decode edilmiş doğal boyut, mevcut Unit metadata, Sanal Tur/Detaylar ve kapatma davranışı doğrulandı.

## 8. Details entegrasyonu

Eski plan placeholder'ı kaldırıldı. Details aynı `UnitPlan` bileşenine aynı `unitType.id` değerini verir. B-302 ve C-404 Details rotalarında beklenen mirrored/non-mirrored yollar doğrulandı. Quick Card ve Details'ta B-302 için kaynak iki yüzeyde de `/media/plans/project/plan-bc-t02-m.png` kaldı; satış/availability bilgileri ve route davranışı değişmedi.

## 9. Ortak component/resolver açıklaması

`UnitPlan.tsx`, locale-aware alt metin ve başlık dışında bütün medya çözümleme/render davranışını paylaşır. `getUnitPlanMedia()` tek mapping kaynağıdır. Quick Card `compact`, Details `detail` varyantını seçer; ikisi de aynı frame/image markup'ını üretir. Mapping dışı UnitType için üç dilde dürüst unavailable fallback vardır; A-003 bu kola düşmez.

## 10. Görsel frame / object-fit yaklaşımı

Frame `aspect-ratio: 1`, sabit border/padding ve `overflow: hidden` kullanır. Resim frame içerik kutusuna `position:absolute; inset:0; width/height:100%` ile sabitlenir ve `object-fit: contain` uygulanır. Final tarayıcı ölçümünde resim `clientWidth/clientHeight` ile frame içerik kutusu birebir eşitti; anlamlı plan içeriği crop edilmedi ve intrinsic PNG oranı layout geometrisini değiştirmedi.

## 11. Aynı dosya adları üzerine yeni plan yazıldığında neden kod değişikliği gerekmediği

Resolver yalnız sabit public URL'leri bilir; piksel boyutlarına, hash'e, renk içeriğine veya bugünkü crop'a göre dallanmaz. Kullanıcı aynı beş dosya yolunu koruyarak PNG içeriklerini overwrite ettiğinde Vite/public sunumu ve UnitType eşlemesi aynı kalır. Kare frame + `contain`, yeni doğal ölçü/oranı layout sözleşmesine uyarlar.

## 12. 320 / 390 / 768 / 1280 / 1440 responsive sonuçları

Production Chromium viewport simülasyonudur.

| Viewport | Quick Card frame | Details frame | SceneStage X/Y/W/H | Route anchor delta | Yatay overflow |
| --- | ---: | ---: | --- | ---: | --- |
| 320×844 | 215×215 | 215×215 | `16 / 411 / 273 / 204.75` | 0 px | Yok |
| 390×844 | 285×285 | 285×285 | `16 / 411 / 343 / 257.25` | 0 px | Yok |
| 768×1024 | 230×230 | 281.5×281.5 | `24 / 319 / 705 / 528.75` | 0 px | Yok |
| 1280×800 | 230×230 | 297×297 | `96.5 / 319 / 1072 / 804` | 0 px | Yok |
| 1440×900 | 230×230 | 297×297 | `176.5 / 319 / 1072 / 804` | 0 px | Yok |

Beş viewportun her birinde A-003 Quick Card, B-301 Quick Card, B-302 Details, C-401 Quick Card ve C-404 Details ölçüldü. Toplam 25 kombinasyonda kaynak eşleşmesi, kare frame, `contain`, decode ve `scrollWidth <= clientWidth` doğrulandı. İlk QA turunda intrinsic resim kutusunun grid frame'i aşabildiği görüldü; absolute inset düzeltmesi sonrası final içerik kutuları birebir oldu.

## 13. TR / EN / RU sonucu

Localization testi TR/EN/RU için 119 anahtar parity'siyle PASS oldu. B-302 Details üzerinde locale sırasıyla `tr`, `en`, `ru` seçildi; alt metinler çevrildi, route `/block/b/unit/B-302/details` ve medya yolu `/media/plans/project/plan-bc-t02-m.png` değişmedi. Eski yanlış DEVELOPMENT-ONLY plan metinleri üç sözlükten birlikte kaldırıldı.

## 14. Browser Back/Forward ve route regression

390×844 production Chromium akışı:

- Home → B (gerçek transition) → B-301 (Enter) → Quick Card → Details → Quick Card → kapat → Block doğru çalıştı.
- B-302 Quick Card → Details sonrası Browser Back Quick Card'a, Forward Details'a döndü.
- Quick Card kapatma `/block/:blockId` bağlamına döndü.
- Geçersiz `/block/b/unit/A-003` ilişkisi lokalize NotFound verdi ve plan render etmedi.
- Tarayıcı console warning/error listesi boştu.

## 15. Tour / unavailable regression

B-301 Tour route'u bir panorama canvas'ı oluşturdu ve Return to Unit hedefi `/block/b/unit/B-301` kaldı. A-003 Tour route'u lokalize “Virtual Tour henüz mevcut değil” durumunu gösterdi ve canvas sayısı `0` oldu. Panorama adapter/mimari kodu değiştirilmedi.

## 16. IMP-026 SceneStage anchor regression

Home, Block B, B-301 Quick Card ve B-302 Details rotaları beş viewportta document-space olarak ölçüldü. Her viewport içinde SceneStage X/Y/W/H maksimum route delta değeri `0 px` oldu. 1920×1440 logical alan, 4:3 oran, hotspot koordinatları ve IMP-026 intro/stage anchor sözleşmesi değişmedi.

## 17. Staging/media serving

`npm run staging:verify` 9 SPA shell route'u, 2 hashed entry asset'i ve 19 medyayı PASS etti. Beş plan dosyasının tamamı byte-range isteğine `206` ve tam `image/png` MIME ile yanıt verdi. Missing-file 404, DEV-route bundle izolasyonu ve localhost/port/filesystem hijyeni geçti. Home asset audit'inde plan varlığı yoktu; B-301 yüzeyinde yalnız `/media/plans/project/plan-bc-t01-m.png` gözlendi. Bu provider-neutral yerel staging kanıtıdır; deploy yapılmadı.

## 18. Çalıştırılan komutlar

- `npm run validate:exterior-media`
- `npm run validate:data`
- `npm run build` (sandbox denemesi ve izinli final tekrarları)
- `npm run lint`
- `npx tsc -b`
- `npm run test:localization`
- `node scripts/test-panorama-adapter.mjs`
- `node scripts/test-tour-help-storage.mjs`
- `npm run staging:verify`
- `git diff --check`
- PowerShell `System.Drawing` boyut/pixel-format ve `Get-FileHash -Algorithm SHA256` audit'i.
- Production Chromium 25 route/viewport plan matrisi, SceneStage anchor matrisi, route/history/locale/tour/loading/console kontrolleri.

## 19. Zorunlu kontrol sonuçları

| Kontrol | Sonuç |
| --- | --- |
| `npm run validate:exterior-media` | PASS: 4 WebP + 6 H.264/yuv420p MP4 |
| `npm run validate:data` | PASS: 3 Block, 10 UnitType, 78 Unit, 9 exact demo Unit, snapshot parity |
| `npm run build` | PASS: 93 modül, production chunk'ları |
| `npm run lint` | PASS |
| `npx tsc -b` | PASS |
| `npm run test:localization` | PASS: TR/EN/RU, 119 parity key |
| `node scripts/test-panorama-adapter.mjs` | PASS: mapping/navigation/validation/lifecycle ve 3 remount |
| `node scripts/test-tour-help-storage.mjs` | PASS: first visit/persistence/storage failure/session fallback |
| `npm run staging:verify` | PASS: 9 route, 2 entry asset, 19 medya |
| `git diff --check` | PASS; yalnız mevcut LF/CRLF bilgilendirmeleri |

## 20. Dependency değişiklikleri

Yok. `package.json` ve `package-lock.json` değiştirilmedi; yeni paket eklenmedi.

## 21. İnsan gözü review notu

390×844 görünümde A-003 siyah ticari PNG'si istenen şekilde normal plan alanında gösterildi; renk/piksel analizi veya placeholder mesajı yoktu. B-301 gerçek konut planı frame içinde bütünüyle görünür, stretch/crop olmadan incelendi. 1280×800 B-302 Details'ta plan ve mevcut galeri placeholder'ı yan yana, taşmasız görüntülendi. Bugünkü konut dosyaları PDF capture kaynağı nedeniyle son kare teslim kadar temiz olmayabilir; fiziksel telefon/Safari ve yarın overwrite edilecek nihai dosyalar için son insan gözü review'u önerilir.

## 22. Uyarılar / blocker / mimari çelişki

İlk `npm run build` sandbox içinde Vite/esbuild `spawn EPERM` verdi; izinli final çalıştırma başarılı oldu. İlk responsive QA intrinsic `<img>` kutusunun grid frame'den uzun hesaplanabildiğini yakaladı; absolute inset + `contain` ile giderildi ve final matris yeniden PASS oldu. Açık blocker veya locked baseline ile mimari çelişki bulunmadı. Locked baseline belgeleri, route şeması, Unit/UnitType kimlikleri, hotspot koordinatları, exterior WebP/MP4 ve panorama mimarisi değiştirilmedi.

## 23. Sonraki IMP'ye başlanmadığı teyidi

Yalnızca IMP-029 uygulandı. IMP-030 veya başka bir sonraki göreve başlanmadı; deploy yapılmadı.
