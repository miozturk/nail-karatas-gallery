# IMP-027 — Human-Assisted Real Masterplan Hotspot Authoring Completion Report

Tarih: 2026-09-21

## 1. Özet

Mevcut DEVELOPMENT-ONLY Hotspot Editor gerçek `/media/scenes/project/masterplan.webp` görseline bağlandı ve zorunlu Phase A STOP noktasında operatörden koordinatlar beklendi. İdris tarafından editörde üretilip aynı konuşmada sağlanan `a`, `b`, `c` polygonları A/B/C ataması ve nokta sırası değiştirilmeden production Home/Masterplan akışına entegre edildi. Logical 1920 × 1440 uzayı, `SceneStage`, `SvgHotspotLayer`, selector senkronu, transition mapping'i ve IMP-026 stage-anchor sözleşmesi korundu. Yalnızca IMP-027 uygulandı.

## 2. Değişen dosyalar

- `src/features/devtools/hotspot-editor/HotspotEditor.tsx`: gerçek Masterplan tabanı ve operator yönlendirmesi.
- `src/features/devtools/hotspot-editor/HotspotEditor.css`: kullanılmayan nötr proof zemin stili kaldırıldı.
- `src/features/devtools/hotspot-editor/README.md`: gerçek medya ve hizalama sözleşmesi belgelendi.
- `src/features/masterplan/masterplanHotspots.ts`: human-authored canonical A/B/C production polygonları.
- `src/features/masterplan/developmentHotspots.ts`: artık doğru olmayan DEVELOPMENT-ONLY geometri kaynağı kaldırıldı.
- `src/features/masterplan/MasterplanPage.tsx`: canonical polygon kaynağı ve güvenli Block ID doğrulaması bağlandı.
- `src/i18n/translations/tr.ts`, `en.ts`, `ru.ts`: artık yanlış olan Masterplan DEVELOPMENT-ONLY geometri metinleri güncellendi.
- `docs/IMP-027-COMPLETION-REPORT.md`: bu rapor.

## 3. Eski DEVELOPMENT-ONLY geometry audit

Eski tek kaynak `src/features/masterplan/developmentHotspots.ts` idi:

- A: `[[180,360],[620,360],[620,1080],[180,1080]]`
- B: `[[740,360],[1180,360],[1180,1080],[740,1080]]`
- C: `[[1300,360],[1740,360],[1740,1080],[1300,1080]]`

`MasterplanPage`, `blocks.map()` içinde `developmentBlockPolygons[block.id]` kullanıyordu. Aynı koordinat literalleri UI componentlerinde tekrarlanmıyordu. Polygonlar domain `Block` verisine yazılmamıştı. Unit hotspotları ayrı kaynakta kaldı ve değiştirilmedi.

## 4. Phase A editor hazırlığı

Mevcut ikinci bir editör oluşturulmadan yeniden kullanıldı. Nötr DEVELOPMENT-ONLY taban yerine `SceneStageImage` ile merkezi `exteriorMedia.masterplan` kaynağı gösterildi. Editör `import.meta.env.DEV` koşullu lazy route olarak kaldı; global navigasyona eklenmedi. Görselin doğal ölçüsü 1920 × 1440, image/SVG rect'leri 1280 ve 768 genişlikte birebir eşit bulundu.

## 5. Human authoring workflow

Operatör gerçek Masterplan üzerinde küçük harf `a`, `b`, `c` ID'leriyle polygonları çizdi, her polygonu kaydetti ve deterministik JSON alanının tamamını aynı Codex konuşmasına yapıştırdı. Phase B, yalnız bu veri geldikten sonra başladı. Codex bina ataması yapmadı, polygon çizmedi ve koordinatları algoritmik olarak iyileştirmedi.

## 6. A coordinates / vertex count

12 köşe:

```text
[[189,801],[458,641],[863,722],[886,697],[973,719],[969,749],[1390,843],[1348,906],[1348,958],[1167,1150],[234,907],[230,817]]
```

## 7. B coordinates / vertex count

12 köşe:

```text
[[586,663],[568,316],[636,284],[629,240],[701,206],[786,224],[811,212],[888,222],[890,239],[938,248],[933,611],[762,701]]
```

## 8. C coordinates / vertex count

10 köşe:

```text
[[1064,224],[1111,199],[1228,217],[1266,186],[1435,213],[1431,246],[1604,276],[1580,636],[1532,684],[1048,605]]
```

Üç ID benzersizdir; her polygon en az üç köşelidir ve tüm koordinatlar X=`0..1920`, Y=`0..1440` sınırları içindedir.

## 9. Production geometry integration

`masterplanHotspots.ts`, `ExteriorBlockId` ve `Polygon` tipleriyle tam `a/b/c` kaynağıdır. `getMasterplanBlockPolygon()` bilinmeyen string ID'leri güvenli biçimde reddeder. UI içinde coordinate literal tekrarı yoktur. `SvgHotspotLayer` API'si, route/domain verisi ve medya manifesti değiştirilmedi.

## 10. Selector ↔ polygon sync

Production Chromium kontrolünde:

- A selector focus → yalnız A polygon `data-hovered=true`.
- B polygon focus → yalnız B selector `data-highlighted=true`.
- B polygon pointer-hover → yalnız B selector vurgulandı.
- A selector pointer-hover → yalnız A polygon vurgulandı.
- A/B/C focus konturları gerçek Masterplan üzerinde ayrı kullanıcı tanımlı kütleleri izledi.
- Belirgin büyük veya istenmeyen overlap görülmedi; kullanıcı geometrisi değiştirilmedi.

## 11. Responsive geometry result

Chromium viewport simülasyonudur; fiziksel cihaz/Safari testi değildir.

| Viewport | SceneStage X/Y/W/H | Image/SVG | Oran | Yatay overflow |
| --- | --- | --- | ---: | --- |
| 320×844 | `16 / 411 / 273 / 204.75` | Birebir | 4:3 | Yok |
| 390×844 | `16 / 411 / 343 / 257.25` | Birebir | 4:3 | Yok |
| 768×1024 | `24 / 319 / 705 / 528.75` | Birebir | 4:3 | Yok |
| 1280×800 | `96.5 / 319 / 1072 / 804` | Birebir | 4:3 | Yok |
| 1440×900 | `176.5 / 319 / 1072 / 804` | Birebir | 4:3 | Yok |

Her viewportta SVG `points` değerleri operatör koordinatlarıyla aynı kaldı.

## 12. IMP-026 layout-contract regression

Home, `/block/b`, `/block/b/unit/B-301` ve `/block/b/unit/B-301/details` rotaları beş viewportta ayrı ayrı ölçüldü. Her viewport içindeki route'ların SceneStage X/Y/W/H değerleri tamamen aynıydı; maksimum route delta `0 px`. `scrollWidth <= clientWidth` kaldı. Header/intro/stage anchor sözleşmesinde regresyon görülmedi.

## 13. Transition regression

- A → `/media/transitions/project/home-to-a.mp4` → `/block/a`
- B → `/media/transitions/project/home-to-b.mp4` → `/block/b`
- C → `/media/transitions/project/home-to-c.mp4` → `/block/c`

Üç akışta video/SceneStage rect'i birebir eşitti ve üç selector geçiş sırasında disabled oldu. B polygon pointer aktivasyonu doğru B videosunu ve route'unu kullandı. Transition medya dosyaları ve preload/lifecycle kodu değiştirilmedi.

## 14. Keyboard/accessibility

Polygonlar focus-visible durumunu korudu. A polygon `Enter`, C polygon `Space` ile doğru route'a ulaştı. TR erişilebilir grup etiketi `Masterplan blok bölgeleri`; polygon etiketleri `A Blok`, `B Blok`, `C Blok` oldu. Disabled, focus, pointer ve selector senkron semantiği korundu.

## 15. TR / EN / RU

320×844 Home'da TR/EN/RU ayrı ayrı seçildi. `<html lang>`, başlık, grup ve polygon etiketleri doğru çevrildi. Locale değişiminde route `/`, SceneStage `16 / 411 / 273 / 204.75` ve tüm polygon koordinatları değişmedi. Otomatik parity testi 120 anahtarla geçti.

## 16. DEV editor regression

Temiz DEV sekmesinde gerçek Masterplan `1920×1440` doğal ölçüyle yüklendi; image ve SVG rect'leri `98.5 / 220.2969 / 1068 / 801` olarak birebir eşitti ve console temizdi. Editörün ilk export değeri `{}` kaldı. Production `/__dev/hotspot-editor`, lokalize `Sayfa bulunamadı` gösterdi; editor DOM'u ve canvas yoktu. Production asset listesinde Hotspot Editor chunk/metni bulunmadı.

## 17. Staging

`npm run staging:verify` 9 SPA route shell, 2 entry asset, 14 medya, missing-file 404, DEV-route bundle izolasyonu ve localhost/port/filesystem hijyenini PASS etti. Gerçek exterior WebP/MP4 varlıkları doğru MIME ve byte-range yanıtlarını verdi. Bu yerel, provider-neutral staging kanıtıdır; deploy yapılmadı.

## 18. Commands

- `npm run validate:exterior-media`
- `npm run validate:data`
- `npm run build` (sandbox denemesi ve izinli tekrar)
- `npm run lint`
- `npx tsc -b` (ilk dar ID tipi hatası düzeltildikten sonra final PASS)
- `npm run test:localization`
- `node scripts/test-panorama-adapter.mjs`
- `node scripts/test-tour-help-storage.mjs`
- `npm run staging:verify`
- `git diff --check`
- Production Chromium viewport, focus, pointer, keyboard, transition, locale ve console kontrolleri.

## 19. Required checks

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

## 20. Dependency changes

Yok. `package.json` ve `package-lock.json` değiştirilmedi; yeni paket eklenmedi.

## 21. Human-eye review note

A/B/C outline'ları 1440 px production Masterplan üzerinde ayrı ayrı focus edilerek gözle incelendi. A ön ticari kütleyi, B soldaki arka kütleyi, C sağdaki arka kütleyi operatörün verdiği atamayla gösterdi. Belirgin drift veya büyük istenmeyen overlap görülmedi. Bu kontrol kullanıcı atamasını yeniden yorumlamaz; son müşteri kabulünde fiziksel cihazlarda insan gözü review'u önerilir.

## 22. Warnings/blockers

İlk `npm run build` sandbox içinde Vite/esbuild `spawn EPERM` verdi; izinli aynı kaynak tekrarı başarılı oldu. İlk TypeScript turunda genel `Block.id: string` ile dar canonical key tipi arasında indeksleme hatası bulundu; güvenli ID doğrulama helper'ı ile düzeltildi ve final TypeScript/lint/build geçti. Dosya değişimi sırasında açık DEV sekmesinde geçici HMR reload mesajı oluştu; temiz DEV ve production sekmelerinde warning/error yoktu. Açık blocker veya locked baseline mimari çelişkisi yoktur.

## 23. Scope confirmation

Yalnız IMP-027 tamamlandı. Unit hotspot koordinatları, Block görselleri, transition videoları, Unit/UnitType verisi, panorama/tour davranışı ve locked baseline belgeleri değiştirilmedi. Deploy yapılmadı ve IMP-028'e başlanmadı.
