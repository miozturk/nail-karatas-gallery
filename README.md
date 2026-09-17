# Nail Karataş Interactive Sales Gallery

Bu repository, Nail Karataş projesi için interaktif dijital satış galerisi uygulamasını içerir.

## Baseline status

- Product / site-map baseline: **LOCKED**
- Architecture baseline v1: **LOCKED**
- Approved: **2026-09-16**
- Current implementation task: **IMP-001 Project Bootstrap**

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
