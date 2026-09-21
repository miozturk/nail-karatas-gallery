# IMP-028 — Human-Assisted Real Unit Hotspot Authoring Completion Report

Tarih: 2026-09-21

## 1. Özet

Mevcut DEVELOPMENT-ONLY Hotspot Editor, gerçek Block A/B/C exterior görselleri üzerinde Unit polygonu üretmek üzere Phase A'da hazırlandı ve zorunlu STOP noktasında operatör girdisi beklendi. İdris tarafından editörde üretilip aynı konuşmada sağlanan dokuz Unit polygonu; Unit ID ataması, Block sahipliği, koordinatları ve nokta sırası değiştirilmeden tek canonical production kaynağına entegre edildi. `SceneStage`, `SvgHotspotLayer`, Quick Card, Details, Tour, transition, localization ve IMP-026 stage-anchor sözleşmeleri korundu. Yalnızca IMP-028 uygulandı.

## 2. Değişen dosyalar

- `src/features/devtools/hotspot-editor/HotspotEditor.tsx`: A/B/C gerçek sahne seçimi, Block'a göre izinli Unit ID'leri ve Block ilişkili deterministic export.
- `src/features/devtools/hotspot-editor/HotspotEditor.css`: selector kontrolünün kullanılabilir boyutlandırması.
- `src/features/devtools/hotspot-editor/README.md`: gerçek Block authoring ve export sözleşmesi.
- `src/features/blocks/unitHotspots.ts`: human-authored dokuz production Unit polygonunun tek canonical kaynağı.
- `src/features/blocks/developmentUnitPolygons.ts`: artık yanlış olan yapay geometri kaynağı kaldırıldı.
- `src/features/blocks/BlockPage.tsx`: canonical kaynak, seed-first ve Block sahipliği doğrulaması.
- `src/i18n/translations/tr.ts`, `en.ts`, `ru.ts`: artık yanlış olan DEVELOPMENT-ONLY Unit polygon açıklaması güncellendi.
- `docs/IMP-028-COMPLETION-REPORT.md`: bu rapor.

## 3. Eski DEVELOPMENT-ONLY Unit geometry audit

Eski tek kaynak `src/features/blocks/developmentUnitPolygons.ts` idi:

- A-003: `[[720,480],[1200,480],[1200,960],[720,960]]`
- B-301: `[[240,300],[840,300],[840,660],[240,660]]`
- B-302: `[[1080,300],[1680,300],[1680,660],[1080,660]]`
- B-303: `[[240,780],[840,780],[840,1140],[240,1140]]`
- B-304: `[[1080,780],[1680,780],[1680,1140],[1080,1140]]`
- C-401: `[[240,300],[840,300],[840,660],[240,660]]`
- C-402: `[[1080,300],[1680,300],[1680,660],[1080,660]]`
- C-403: `[[240,780],[840,780],[840,1140],[240,1140]]`
- C-404: `[[1080,780],[1680,780],[1680,1140],[1080,1140]]`

`BlockPage`, seed `units` listesini Block ID ve `demoEnabled` ile filtreleyip bu kaynaktaki geometriyle birleştiriyordu. Coordinate literal tekrarı UI bileşenlerinde yoktu. Eski anahtar tipi `Partial<Record<string, Polygon>>` olduğu için exact Unit ID kümesi type-level olarak kapalı değildi. Unit tıklaması URL'yi `/block/:blockId/unit/:unitId` rotasına taşıyor ve Quick Card açıyordu; Details/Tour rotaları geometriyi doğrudan tüketmiyordu.

## 4. Phase A editor hazırlığı

İkinci editör oluşturulmadı. Mevcut DEV-only editöre `exteriorMedia.blocks` üzerinden A/B/C selector eklendi. Her sahnede yalnız beklenen Unit ID'leri seçilebilir. Taslak köşeleri varken sahne değişimi kilitlenir; kayıtlı polygonlar `blockId + points` ile saklanır ve başka sahneye sessizce taşınmaz. Image ve SVG ortak `1920×1440` SceneStage alanında kalır. Route hâlâ `import.meta.env.DEV` koşullu lazy importtur ve global navigasyonda yoktur.

## 5. Human authoring workflow

Operatör gerçek Block görselini ve izinli Unit ID'sini seçti, görünür Unit bölgesinin çevresini tıklayarak çizdi, her polygonu kaydetti ve `9/9` deterministic JSON export'unun tamamını aynı Codex konuşmasına yapıştırdı. Codex Unit konumu tahmin etmedi, polygon çizmedi ve gelen geometriyi algoritmik olarak iyileştirmedi, yeniden sıralamadı, yumuşatmadı veya basitleştirmedi.

## 6. A-003 coordinates / vertex count

4 köşe: `[[762,742],[757,584],[1039,585],[1037,740]]`

## 7. B-301/302/303/304 coordinates / vertex counts

- B-301 — 4 köşe: `[[1352,621],[1350,717],[1187,731],[1187,634]]`
- B-302 — 4 köşe: `[[1154,760],[965,772],[962,675],[1158,659]]`
- B-303 — 4 köşe: `[[940,677],[938,774],[739,789],[737,693]]`
- B-304 — 4 köşe: `[[701,672],[703,765],[493,787],[484,681]]`

## 8. C-401/402/403/404 coordinates / vertex counts

- C-401 — 4 köşe: `[[387,569],[591,567],[595,666],[385,668]]`
- C-402 — 4 köşe: `[[620,587],[823,584],[816,695],[615,688]]`
- C-403 — 4 köşe: `[[845,587],[1050,589],[1052,690],[841,690]]`
- C-404 — 4 köşe: `[[1077,587],[1280,589],[1275,691],[1073,691]]`

Dokuz ID benzersiz, tam beklenen kümedir. Her polygon en az üç köşeli; bütün X değerleri `0..1920`, Y değerleri `0..1440` içindedir. Block sahiplikleri seed/domain verisiyle eşleşir ve dokuz Unit'in tamamı `demoEnabled: true` kalmıştır.

## 9. Production Unit geometry integration

`unitHotspots.ts`, exact `UnitHotspotId` union'ı, `ExteriorBlockId`, `Polygon`, sabit ID listesi ve `Record<UnitHotspotId, UnitHotspot>` sözleşmesiyle tek canonical kaynaktır. `getUnitHotspot()` bilinmeyen string ID'leri güvenli biçimde reddeder. `BlockPage`, canonical `blockId` ile seed Unit'in `blockId` değerini ayrıca karşılaştırır; başka Block geometrisi render edilemez. `SvgHotspotLayer` API'si ve UI coordinate literal durumu değişmedi.

## 10. Block A QA

Production Chromium'da yalnız A-003 bir kez render edildi. DOM `points` değeri operatör girdisiyle birebir eşleşti. Focus görünümü gerçek ticari cephe bölgesini izledi. Pointer ve Enter aktivasyonu doğru A-003 Quick Card rotasını açtı. Quick Card kapatıldığında `/block/a` bağlamına dönüldü; Block/Unit/Details document-space SceneStage rect'i aynı kaldı.

## 11. Block B QA

B-301/302/303/304 birer kez render edildi ve her `points` değeri operatör girdisiyle birebir eşleşti. Her polygon pointer ve sırayla Enter/Space keyboard aktivasyonuyla kendi Unit Quick Card'ını açtı. Dört polygon focus-visible durumda tek tek gözle incelendi; selector/route ID karışması veya belirgin istenmeyen komşu overlap görülmedi. Kullanıcı geometrisi değiştirilmedi.

## 12. Block C QA

C-401/402/403/404 birer kez render edildi ve her `points` değeri operatör girdisiyle birebir eşleşti. Her polygon pointer ve sırayla Enter/Space keyboard aktivasyonuyla kendi Unit Quick Card'ını açtı. Dört polygon focus-visible durumda tek tek gözle incelendi; selector/route ID karışması veya belirgin istenmeyen komşu overlap görülmedi. Kullanıcı geometrisi değiştirilmedi.

## 13. Quick Card / Details / Tour route regression

- A-003: Quick Card ve Details doğru ID'yi gösterdi; Quick Card/Block dönüşleri doğruydu. Mevcut veride tour ataması olmadığı için Tour rotası açık unavailable mesajı ve `0` canvas verdi.
- B-301: Quick Card → Details → Quick Card, Browser Back/Forward, Tour → Unit akışları doğru; Tour `1` canvas oluşturdu.
- C-401: Quick Card → Details → Quick Card/Block ve Tour → Unit akışları doğru; Tour `1` canvas oluşturdu.
- Üç representative Unit'te geometri başka Block'a sızmadı ve route/domain ilişkisi korundu.

## 14. Responsive geometry result

Production Chromium viewport simülasyonudur.

| Viewport | SceneStage X/Y/W/H | Route max delta | Image/SVG | Oran | Yatay overflow |
| --- | --- | ---: | --- | ---: | --- |
| 320×844 | `16 / 411 / 273 / 204.75` | 0 px | Birebir | 4:3 | Yok |
| 390×844 | `16 / 411 / 343 / 257.25` | 0 px | Birebir | 4:3 | Yok |
| 768×1024 | `24 / 319 / 705 / 528.75` | 0 px | Birebir | 4:3 | Yok |
| 1280×800 | `96.5 / 319 / 1072 / 804` | 0 px | Birebir | 4:3 | Yok |
| 1440×900 | `176.5 / 319 / 1072 / 804` | 0 px | Birebir | 4:3 | Yok |

Her viewportta A/B/C polygon `points` değerleri logical koordinatlarla aynı kaldı; ölçekleme SceneStage tarafından yapıldı.

## 15. IMP-026 stage-anchor regression

Home, Block A/B/C, B-301 Quick Card ve B-301 Details rotaları beş viewportta ölçüldü. Her viewport içindeki document-space SceneStage X/Y/W/H maksimum delta değeri `0 px` oldu. A-003 ve C-401 için Block/Quick Card/Details kontrolleri de aynı anchor'ı verdi. Scroll konumu değişse bile document-space anchor sabittir.

## 16. Accessibility / keyboard

Dokuz polygonun tamamında `role="button"`, lokalize erişilebilir etiket ve `tabIndex=0` korundu. Enter ve Space aktivasyonu birlikte kapsandı. Focus-visible ölçümünde aktif polygon `stroke: rgb(40, 93, 120)`, `stroke-width: 5px`, `stroke-dasharray: 12px 6px` ve belirgin focus dolgusu aldı. Transition sırasında hotspotlar `aria-disabled=true` ve pointer dışı kaldı.

## 17. TR / EN / RU

Block A/B/C sayfaları TR, EN ve RU'da ayrı ayrı doğrulandı. `<html lang>`, Unit/floor erişilebilir etiketleri ve güncellenmiş caption doğru yerelleşti. Locale değişimi route'u veya polygon `points` değerlerini değiştirmedi. Localization parity testi 120 anahtarla geçti.

## 18. Home/Block transition regression

390×844 ve 1280×800'de A/B/C forward ve reverse akışları ayrı ayrı oynatıldı:

- Forward: `home-to-a/b/c.mp4` doğru `/block/a/b/c` rotasına ulaştı.
- Reverse: `a/b/c-to-home.mp4` contextual Home ile `/` rotasına ulaştı.
- Video/SceneStage rect'leri birebir eşleşti.
- Forward sırasında üç selector ve Masterplan hotspotları; reverse sırasında Home ve Unit hotspotları kilitlendi.
- Hedef Block'larda hotspot sayıları A=`1`, B=`4`, C=`4` kaldı.
- Altı MP4, dört WebP ve preload/lifecycle kodu değiştirilmedi.

## 19. DEV editor regression

Temiz DEV sekmesinde A/B/C selector sırasıyla gerçek `block-a.webp`, `block-b.webp`, `block-c.webp` görsellerini `1920×1440` doğal ölçüde yükledi. Image/SVG rect'leri birebir, viewBox `0 0 1920 1440`, Unit ID listeleri doğru ve ilk export `{}` idi. Operatörün başarılı `9/9` export teslimi save/export akışının gerçek kullanım kanıtıdır. Production `/__dev/hotspot-editor` lokalize NotFound, editör metni yok ve `0` canvas verdi; production bundle'da editor chunk'ı yoktur.

## 20. Staging result

`npm run staging:verify` 9 SPA route shell, 2 entry asset, 14 medya, missing-file 404, DEV-route bundle izolasyonu ve localhost/port/filesystem hijyenini PASS etti. Dört exterior WebP ve altı transition MP4 doğru MIME/range yanıtlarını verdi. Bu provider-neutral yerel staging kanıtıdır; deploy yapılmadı.

## 21. Commands

- `npm run validate:exterior-media`
- `npm run validate:data`
- `npm run build` (sandbox denemesi ve izinli tekrar)
- `npm run lint`
- `npx tsc -b`
- `npm run test:localization`
- `node scripts/test-panorama-adapter.mjs`
- `node scripts/test-tour-help-storage.mjs`
- `npm run staging:verify`
- `git diff --check`
- Production Chromium beş viewport route/geometri matrisi.
- Production Chromium dokuz Unit pointer/keyboard, representative route, locale, transition ve console kontrolleri.
- DEV Chromium editor A/B/C ve production DEV-route izolasyon kontrolleri.

## 22. Required check results

| Kontrol | Sonuç |
| --- | --- |
| `npm run validate:exterior-media` | PASS: 4 WebP + 6 H.264/yuv420p MP4 |
| `npm run validate:data` | PASS: 3 Block, 10 UnitType, 78 Unit, 9 exact demo Unit |
| `npm run build` | PASS: izinli tekrar, 90 modül |
| `npm run lint` | PASS |
| `npx tsc -b` | PASS |
| `npm run test:localization` | PASS: TR/EN/RU, 120 parity key |
| `node scripts/test-panorama-adapter.mjs` | PASS: mapping/navigation/validation/lifecycle ve 3 remount |
| `node scripts/test-tour-help-storage.mjs` | PASS: first visit/persistence/failure/session fallback |
| `npm run staging:verify` | PASS |
| `git diff --check` | PASS; yalnız LF/CRLF bilgilendirmeleri |

Production ve temiz DEV browser konsollarında warning/error yoktu.

## 23. Dependency changes

Yok. `package.json` ve `package-lock.json` değiştirilmedi; yeni paket eklenmedi.

## 24. Human-eye review / remaining uncertainty

A-003 ve B/C'deki sekiz Unit outline'ı gerçek Block görsellerinde tek tek focus edilerek gözle incelendi. Polygonlar operatörün seçtiği cephe bölgelerini izliyor; B ve C komşuları arasında belirgin istenmeyen overlap görülmedi. Visual doğruluk için operatör ataması kaynak kabul edildi; Codex Unit kimliğini görüntüden yeniden yorumlamadı. Kontroller Chromium viewport simülasyonudur; fiziksel telefon, Safari ve farklı GPU testi yapılmadı. Son müşteri kabulinde gerçek cihazlarda insan gözü review'u önerilir.

## 25. Warnings / blocker / architectural conflicts

İlk final `npm run build` sandbox içinde beklenen Vite/esbuild `spawn EPERM` hatasını verdi; sandbox dışındaki izinli aynı kaynak tekrarında PASS alındı. Browser QA sırasında screen-space rect scroll konumuyla değiştiği için IMP-026 anchor doğrulaması doğru biçimde document-space (`rect.y + scrollY`) ölçümüyle yapıldı ve delta `0 px` bulundu. Açık blocker veya locked baseline mimari çelişkisi yoktur.

## 26. Scope confirmation

Yalnızca IMP-028 tamamlandı. Masterplan A/B/C geometrisi, Unit/UnitType seed/domain verisi, exterior WebP/MP4 dosyaları, panorama mimarisi ve locked baseline belgeleri değiştirilmedi. Deploy yapılmadı ve IMP-029'a başlanmadı.
