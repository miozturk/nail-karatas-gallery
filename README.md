# Nail Karataş Interactive Sales Gallery

Bu repository, Nail Karataş projesi için interaktif dijital satış galerisi uygulamasını içerir.

## Baseline status

- Product / site-map baseline: **LOCKED**
- Architecture baseline v1: **LOCKED**
- Approved: **2026-09-16**
- Current implementation task: **IMP-002 Domain Types and Seed Data**

## Core idea

The application is a React + TypeScript + Vite single-page application.

Exterior navigation is **not realtime 3D**. It uses:
- static architectural renders,
- SVG polygon hotspots,
- pre-rendered HTML5 transition videos.

The virtual-tour module is isolated behind a panorama adapter. Pannellum is the first candidate and must be validated by a dedicated spike before it becomes a locked dependency.

Read in this order before implementation:

1. `AGENTS.md`
2. `docs/PROJECT-SCOPE.md`
3. `docs/SITE-MAP.md`
4. `docs/ARCHITECTURE-DECISIONS.md`
5. `docs/DATA-MODEL.md`
6. `docs/MEDIA-CONVENTIONS.md`
7. `docs/ROADMAP.md`
8. `CURRENT_TASK.md`
9. the task file referenced by `CURRENT_TASK.md`

## IMP-002 veri katmanı

`src/types/index.ts` domain tiplerini, `src/data/` onaylı envanterin tipli seed
verilerini içerir. `SceneDefinition`, SceneStage görevine kadar yalnızca `id`
alanı taşıyan geçici bir sözleşmedir; medya bağlantısı içermez.

`data-source/inventory.snapshot.json` kategori, availability ve plan varyantlarını
zaten normalize eder: Konut/Ticari → residential/commercial;
Bilinmiyor/Müsait/Rezerve/Satıldı → unknown/available/reserved/sold;
Normal/Aynalı/Özel → normal/mirrored/special.
Seed verisinde kaynak kimlikleri korunur, `null` alanlar ve kaynak planlama
metadatası çıkarılır. Unit kategorisi ilişkili UnitType üzerinden okunur.
Demo seçimi yalnızca Unit satırlarından gelir; eksik medya ve alan bilgisi üretilmez.

Node.js 24 ile `npm run validate:data`, gerçek TypeScript seed modüllerini yükler;
kimlikleri, referansları, sayıları, demo kümesini ve snapshot ile alan eşitliğini
denetler. Hatalarda sıfırdan farklı çıkış kodu döndürür.
Diğer kontroller: `npm run build` ve `npm run lint`.
