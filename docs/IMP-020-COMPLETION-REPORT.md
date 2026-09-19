# IMP-020 — Staging Build Readiness Completion Report

Tarih: 2026-09-19

1. **Özet:** Mevcut demo için provider-neutral production staging hazırlığı tamamlandı. Node built-in'leriyle çalışan küçük bir statik SPA sunucusu, otomatik staging doğrulayıcısı ve müşteri-demo QA checklist'i eklendi. Bir hosting sağlayıcısı seçilmedi, üçüncü tarafa deploy yapılmadı ve sonraki IMP'ye başlanmadı.

2. **Oluşturulan / değiştirilen dosyalar:**
   - `package.json`: `staging:build`, `staging:serve` ve `staging:verify` komutları.
   - `scripts/staging-server.mjs`: `dist/` için provider-neutral yerel statik sunucu ve SPA fallback.
   - `scripts/verify-staging.mjs`: direct-route, entry asset, medya/MIME/range, DEV izolasyonu ve environment hijyeni doğrulaması.
   - `docs/STAGING-QA-CHECKLIST.md`: müşteri-demo build'i için elle staging kontrol listesi.
   - `docs/IMP-020-COMPLETION-REPORT.md`: bu rapor.
   - `package-lock.json` ve dependency listeleri değişmedi. Kilitli baseline belgeleri değiştirilmedi.

3. **Production build sonucu:** `npm run staging:build`, mevcut `npm run build` komutunu çağırarak `dist/` çıktısını üretti. Vite 82 modülü dönüştürdü ve build geçti.

   | Çıktı | Boyut | gzip |
   | --- | ---: | ---: |
   | `dist/index.html` | 0,41 kB | 0,28 kB |
   | `assets/index-1PCJDHbR.js` | 288,48 kB | 88,93 kB |
   | `assets/index-BHGXl570.css` | 5,42 kB | 1,58 kB |
   | `assets/TourPage-DCw84yV2.js` | 5,58 kB | 2,39 kB |
   | `assets/TourPage-bAQSjnHi.css` | 2,29 kB | 0,84 kB |
   | `assets/VideoPage-BQX1ise5.js` | 1,44 kB | 0,79 kB |
   | `assets/VideoPage-CeU97_Gq.css` | 0,28 kB | 0,21 kB |
   | `assets/PannellumAdapter-BgI0kzNn.js` | 58,20 kB | 18,42 kB |
   | `assets/PannellumAdapter-CN2-yKHH.css` | 9,50 kB | 2,54 kB |

   `dist/media/` altında yalnızca mevcut optimize web-delivery proof varlıkları ve boş klasör `.gitkeep` dosyaları bulunuyor. Source PNG sequence, master render, Corona/Vantage/3ds Max kaynağı bulunmadı. IMP-020 kapsamında yeniden bundle optimizasyonu yapılmadı.

4. **Provider-neutral staging server / verification yaklaşımı:** `npm run staging:serve`, varsayılan olarak `127.0.0.1:4173` üzerinde `dist/` sunuyor; `--host`, `--port` ve `--dist` seçenekleri destekleniyor. Sunucu yalnızca Node built-in modüllerini kullanıyor. Mevcut dosyalar normal sunuluyor; dosya uzantısı olmayan bilinmeyen yollar `dist/index.html` SPA shell'ine düşüyor; eksik dosya istekleri 404 alıyor. Yalnızca GET/HEAD kabul ediliyor. HTML, JS, CSS, JSON, SVG, JPG/JPEG, PNG, WEBP, MP4 ve map MIME tipleri tanımlı; medya byte-range istekleri 206 ile destekleniyor. API, backend iş mantığı, provider ayarı veya dependency eklenmedi.

   `npm run staging:verify` sunucuyu boş bir yerel portta süreç içinde başlatıp kapatıyor. CLI yolu ayrıca `npm run staging:serve -- --port 4197` ile doğrudan çalıştırıldı ve aynı sunucu tarayıcı doğrulamalarında kullanıldı.

5. **Direct-route refresh matrisi:** HTTP katmanında tüm uygulama yolları 200 `text/html` SPA shell'i döndürdü; in-app Chromium'da direct open/refresh sonrasında React Router beklenen görünümü render etti.

   | Rota | HTTP | Production UI sonucu |
   | --- | --- | --- |
   | `/` | 200 SPA shell | `Home / Masterplan` |
   | `/block/b` | 200 SPA shell | `B Blok` |
   | `/block/b/unit/B-301` | 200 SPA shell | B-301 Unit Quick Card |
   | `/block/b/unit/B-301/details` | 200 SPA shell | B-301 Details |
   | `/block/b/unit/B-301/tour` | 200 SPA shell | `Sanal Tur · B-301`, bir panorama canvas'ı |
   | `/video` | 200 SPA shell | `Proje Videosu`, native kontrollü ve autoplay kapalı video |
   | `/invalid-staging-proof` | 200 SPA shell | Uygulama `Sayfa bulunamadı` görünümü |

   Eksik `/assets/missing-staging-proof.js` isteği 404 aldı; dosya istekleri yanlışlıkla SPA shell'ine düşmedi. Hash routing'e geçilmedi.

6. **Media erişim / content-type doğrulaması:** Otomatik verifier aşağıdaki root-relative sabit URL'lere 16 byte range isteği gönderdi. Tamamı 206 ve doğru `Content-Range` ile döndü.

   | Medya | Content-Type |
   | --- | --- |
   | `/media/transitions/dev-transition-proof.mp4` | `video/mp4` |
   | `/media/transitions/dev-reverse-transition-proof.mp4` | `video/mp4` |
   | `/media/panoramas/dev/living-room.jpg` | `image/jpeg` |
   | `/media/panoramas/dev/hall.jpg` | `image/jpeg` |
   | `/media/panoramas/dev/bedroom.jpg` | `image/jpeg` |
   | `/media/video/dev/project-video-proof.mp4` | `video/mp4` |

   Doğrudan Tour rotasında lazy Tour/Pannellum chunk'ları ve panorama, doğrudan Video rotasında lazy Video chunk'ı ve project-video kaynağı yüklendi. Bu varlıkların tamamı açıkça `DEVELOPMENT-ONLY` sentetik proof medyasıdır; gerçek Nail Karataş proje medyası değildir.

7. **DEV-only production izolasyonu:** `/__dev/hotspot-editor` ve `/__dev/panorama-spike` HTTP katmanında SPA shell'i aldıktan sonra production React Router tarafından `Sayfa bulunamadı` görünümüne yönlendi; DEV araç UI'ı ve canvas erişilebilir değildi. Production `dist/` taramasında iki route dizesi, `HotspotEditor` veya `PanoramaSpike` bulunmadı ve bu araçlara ait chunk oluşmadı. Geliştirme modu route tanımları değiştirilmedi.

8. **Environment / localhost / filesystem hijyeni:** Mevcut statik build secret veya environment variable gerektirmiyor; `.env` dosyası yok ve yenisi eklenmedi. Uygulama kaynaklarında localhost, `127.0.0.1`, `file://` veya Windows filesystem yolu bulunmadı. Production çıktısında local development-server portu, `127.0.0.1`, `file://` veya Windows filesystem yolu bulunmadı. Staging sunucusunun kendi CLI host/port değeri production uygulama bundle'ına girmez.

9. **Base path ve cache/header önerileri:** Build host root'unu (`/`) varsayıyor ve mevcut `/media/...` yolları bu kararla uyumlu. Subdirectory hosting, ileride açık bir Vite base-path ve router/media-path kararı gerektirir. IMP-020 hiçbir provider-specific header'ı etkinleştirmedi. Gerçek host yapılandırmasında önerilen kategoriler:
   - `index.html`: kısa/no-cache veya revalidation-friendly.
   - Hash'li JS/CSS: uzun, immutable cache.
   - Versioned dosya adı/yolu kullanan production medya: uzun cache.
   - Unversioned/mutable medya: revalidation-friendly.

10. **Staging QA checklist özeti:** `docs/STAGING-QA-CHECKLIST.md`; Home, A/B/C, forward/reverse geçiş, Quick Card, Details, mevcut/mevcut olmayan Tour, first-use help, oda/hotspot/minimap, Video, Back/Forward, direct refresh, geçersiz route, 390/1280 px, taşma, console ve host devri cache/fallback maddelerini içeriyor. Final production operasyonu, DNS/CDN veya provider prosedürü içermiyor.

11. **390 px / 1280 px tarayıcı doğrulaması:** In-app Chromium viewport simülasyonu kullanıldı; fiziksel cihaz/Safari testi değildir. 390 × 844'te direct-route matrisi ve tam müşteri akışı boyunca yatay taşma olmadı. 1280 × 800'de Home, B Block, B-301 Quick Card, Details, Tour ve Video rotalarında yatay taşma olmadı; exterior sahne 768 × 576 (4:3), project video 768 × 432 (16:9) ölçüldü. Tour'da tek canvas oluştu. A ve C forward/reverse geçişleri de 1280 px'te tamamlandı.

12. **Tam demo akışı regression sonucu:** 390 px production staging build'inde Home → B → B-301 → Details → Quick Card → Tour → Daireye Dön → Block → Home → Video geçti. Forward/reverse route koordinasyonu, Tour first-use yardım içeriği ve `Turu Keşfet`, panorama canvas'ı, Unit dönüşü ve Video lazy kaynağı doğrulandı. B flow'a ek olarak A/C forward-reverse akışları 1280 px'te geçti. A-003 unavailable Tour doğrudan rotasında `Sanal tur henüz mevcut değil`, sıfır canvas ve taşmasız görünüm doğrulandı.

13. **Browser Back / Forward sonucu:** Tam akış sonunda `/video` → Back ile `/` → Forward ile `/video` geçti; Video heading yeniden render oldu. Test edilen production akışlarının console error/warning listesi boştu.

14. **Çalıştırılan komutlar:** `npm run validate:data`; `npm run staging:build` (`npm run build` çağrısı); `npm run staging:verify`; `npm run staging:serve -- --port 4197`; `npm run lint`; `node scripts/test-panorama-adapter.mjs`; `node scripts/test-tour-help-storage.mjs`; production dosya/DEV dizesi/environment/source-media auditleri için `Get-ChildItem` ve `rg`; `git diff --check`. Ayrıca yukarıdaki in-app Chromium route, akış, responsive ve console kontrolleri çalıştırıldı.

15. **Zorunlu kontrol sonuçları:**

   | Kontrol | Sonuç |
   | --- | --- |
   | `npm run validate:data` | PASS: 3 Block, 10 UnitType, 78 Unit, 9 tam demo Unit ve snapshot parity |
   | `npm run build` (via `staging:build`) | PASS: 82 modül, `dist/` oluştu |
   | `npm run lint` | PASS: repo geneli |
   | `node scripts/test-panorama-adapter.mjs` | PASS: mapping/navigation/validation/lifecycle ve 3 remount |
   | `node scripts/test-tour-help-storage.mjs` | PASS: first visit, persistence/reload ve storage failure fallback |
   | `npm run staging:verify` | PASS: route, asset, medya, 404, izolasyon ve hijyen |
   | `git diff --check` | PASS |

16. **Bağımlılıklar:** Eklenmedi. Sunucu ve verifier yalnızca Node built-in API'lerini kullanıyor; `package-lock.json` değişmedi.

17. **Bilinen sınırlar / açık staging kararları:** Hosting sağlayıcısı, gerçek host SPA rewrite kuralı, gerçek cache header'ları, DNS/domain ve CDN hâlâ açık kararlardır. Uygulama root hosting varsayar; subdirectory deploy hazır kabul edilmez. Testler yerel in-app Chromium ve sentetik küçük proof medya ile yapıldı; fiziksel cihaz, Safari, gerçek Nail Karataş medyası, gerçek ağ/CDN/cache davranışı veya production operasyon testi değildir. Yerel doğrulama sunucusu deployment backend'i değildir.

18. **Uyarılar / çözülmemiş konu / mimari çelişki:** İlk sandbox build denemesi esbuild alt sürecinde `spawn EPERM` ile durdu; izinli ortamda aynı build başarıyla tekrarlandı. İlk staging hijyen doğrulaması, React Router bundle'ındaki portsuz dahili `http://localhost` URL fallback sabitini uygulama hard-code'u sanarak durdu; kontrol proje kaynaklarını ayrı tarayacak ve production bundle'da gerçek local portları arayacak şekilde daraltıldı, ardından geçti. `git diff --check` yalnızca `package.json` için gelecekteki LF/CRLF normalizasyon uyarısını yazdı; whitespace hatası vermedi. İşlevsel açık sorun ve mimari çelişki bulunmadı. Cache/header'ların aktif olduğu iddia edilmiyor.

19. **Kapsam kapanışı:** Yalnızca IMP-020 uygulandı. Vercel/Netlify/Cloudflare veya başka provider seçilmedi; deploy, DNS, CDN, backend, authentication, analytics, gerçek medya, final tasarım ya da sonraki IMP çalışması yapılmadı. Sonraki IMP'ye başlanmadı.
