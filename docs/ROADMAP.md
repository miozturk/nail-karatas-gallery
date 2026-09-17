# Roadmap

The roadmap defines implementation order. It does not authorize skipping task boundaries.

## Phase 0 — Foundation

### IMP-001 Project Bootstrap
Create the React + TypeScript + Vite repository foundation and required folder structure.

### IMP-002 Domain Types and Seed Data
Implement baseline TypeScript domain models and convert the approved inventory into initial project data.

### IMP-003 Router and App Shell
Implement baseline routes, AppShell, placeholder route views, and global navigation shell.

## Phase 1 — Exterior Scene Engine

### IMP-004 SceneStage
Implement responsive 1920 x 1440 logical stage.

### IMP-005 SVG Hotspot Layer
Implement reusable block/unit polygon hotspot rendering and hover state.

### IMP-006 Masterplan Scene
Implement Home scene, A/B/C hover synchronization and navigation controls.

### IMP-007 Transition Layer
Implement deterministic HTML5 transition playback, interaction lock and route coordination.

### IMP-008 Block Scenes
Implement A/B/C block scene views and Home reverse transitions.

## Phase 2 — Unit Interaction

### IMP-009 Unit Hotspots
Bind block polygons to actual Unit data.

### IMP-010 Unit Quick Card
Implement plan preview, unit summary and actions.

### IMP-011 Unit Detail Drawer
Implement the initial expandable detail experience.

## Phase 3 — Authoring Utility

### IMP-012 Hotspot Editor v1
Build development-only polygon editor with image display, point creation, undo/reset and JSON coordinate output.

## Phase 4 — Panorama Validation and Integration

### IMP-013 Panorama Technology Spike
Test the candidate viewer with three temporary licensed demo panoramas:
- room-to-room hotspots,
- external room menu,
- active-scene callbacks,
- minimap synchronization,
- mobile behavior.

Outcome: lock Pannellum or record an architecture change.

### IMP-014 Panorama Adapter
Implement the approved panorama adapter.

### IMP-015 Virtual Tour UI
Implement room menu, minimap, active camera, minimap collapse and return-to-unit.

### IMP-016 Tour Help
Implement first-use instructions with local persistence.

## Phase 5 — Demo Completion

### IMP-017 Project Video
Add global project-animation viewing.

### IMP-018 Responsive / Mobile Pass
Validate exterior stage and tour UI on desktop and mobile.

### IMP-019 Media Loading / Performance
Finalize preload/lazy-load strategy and optimize runtime assets.

### IMP-020 Staging Build
Prepare the client-facing demo deployment.

## Future phases

Not part of the initial demo:
- Availability UI.
- Full Unit Detail page.
- Amenities galleries.
- Brochure.
- Location.
- Contact workflow.
- Analytics.
- Backend / admin.
