# Architecture Decisions — Baseline v1

Status: **LOCKED**  
Approved: **2026-09-16**

## ADR-001 Application form

The product is a Single Page Application.

Technology:
- React
- TypeScript
- Vite
- React Router

## ADR-002 Exterior visual engine

Exterior project and block navigation must not depend on realtime 3D.

It uses:
- static architectural render images,
- SVG polygon interaction layers,
- HTML5 transition videos.

Three.js is not part of the exterior navigation baseline.

## ADR-003 Logical stage

Exterior scenes use a fixed logical coordinate system:

- Width: 1920
- Height: 1440
- Aspect ratio: 4:3

The image and SVG overlay share the same coordinate system.

The stage scales responsively without changing the logical hotspot coordinates.

## ADR-004 Transition media

Each block has forward and reverse web videos.

Do not rely on negative `playbackRate`.

Transition playback locks scene interaction until completion.

The target static scene must be available beneath / immediately after the transition so the final video frame can hand off cleanly.

## ADR-005 Domain data separation

UI components must not be the source of project data.

Domain data is modeled independently.

Core entities:
- Project
- Block
- UnitType
- Unit
- Tour
- PanoramaScene
- TourHotspot
- Scene / polygon hotspot data.

`Unit` and `UnitType` are separate.

## ADR-006 Availability readiness

Availability UI is not part of the initial demo.

`Unit` still contains availability status from the start:

- unknown
- available
- reserved
- sold

This allows a future Availability page without restructuring unit data.

## ADR-007 Routing and state

Location / durable navigation state belongs in the URL where practical.

Examples:
- selected block,
- selected unit,
- tour route.

Transient UI state remains local / React-managed:
- hoveredBlock,
- hoveredUnit,
- isTransitioning,
- menu open state,
- detail drawer state,
- active tour scene,
- minimap collapsed state.

Do not add a global state-management library in the baseline.

## ADR-008 Unit detail behavior

Selecting a unit opens a Quick Card without leaving the block visual context.

The initial demo's Details action may expand into a drawer / larger panel.

A dedicated full Unit Detail page is future scope.

## ADR-009 Panorama isolation

The panorama engine is replaceable and must sit behind an application adapter boundary.

Application components must not depend directly on Pannellum-specific APIs.

First candidate:
- Pannellum.

Pannellum is not locked until a technology spike verifies:
- multi-scene navigation,
- visual hotspot navigation,
- external room-menu navigation,
- minimap synchronization,
- mobile behavior.

## ADR-010 Styling

Initial implementation uses ordinary CSS / CSS Modules.

Do not introduce a design-system or UI-framework dependency before a demonstrated need.

## ADR-011 Backend

Initial demo is static / client-side.

No backend is required.

Domain data may begin as typed TypeScript data / JSON-like modules and be migrated to an API later.

## ADR-012 Media loading

Initial exterior assets may be selectively preloaded.

Heavy media such as panorama sets and galleries must be lazy-loaded.

Source render sequences and master production assets are not web runtime assets.

## ADR-013 Responsive behavior

Exterior scene preserves the 4:3 logical stage.

Panorama experience is not constrained to 4:3 and may use full available viewport space.

## ADR-014 Repository discipline

Git is mandatory.

Google Drive is not a replacement for Git.

Large source assets may live outside the repository.

Only optimized web-delivery assets required by the application belong in `public/media` during the demo stage.

## ADR-015 Package discipline

Baseline runtime / tooling should remain small.

Initial package manager: npm.

Node baseline: Node.js 24 LTS.

Do not add dependencies for convenience when browser / React capabilities are sufficient.
