# Project Instructions for Codex

## Authority and scope

This repository is governed by locked product and architecture baselines.

Do not redesign the product, replace the architecture, or introduce alternative frameworks unless the current task explicitly authorizes it.

The implementation agent is responsible for implementing the assigned task, not for re-scoping the application.

## Required reading

Before making any change, read:

- `docs/PROJECT-SCOPE.md`
- `docs/SITE-MAP.md`
- `docs/ARCHITECTURE-DECISIONS.md`
- `docs/DATA-MODEL.md`
- `docs/MEDIA-CONVENTIONS.md`
- `docs/ROADMAP.md`
- `CURRENT_TASK.md`
- the task file referenced by `CURRENT_TASK.md`

## Locked technical constraints

- React + TypeScript + Vite.
- React Router for route-based application state.
- Exterior scenes use static renders + SVG hotspots + HTML5 transition video.
- Do not add Three.js or realtime 3D for exterior navigation.
- Logical exterior scene coordinate system is 1920 x 1440 (4:3).
- SVG uses the same 1920 x 1440 coordinate system.
- Forward and reverse transition videos are separate web assets.
- Do not rely on negative video playbackRate.
- Unit and UnitType are separate domain entities.
- Availability is part of the domain model from the start, but its UI is not in the initial demo.
- Panorama integration must be behind an adapter boundary.
- Do not install Pannellum or another panorama engine before the panorama spike task authorizes it.
- No Redux, Zustand, MobX, or other global state library unless a future architecture decision explicitly adds one.
- No Tailwind, Bootstrap, Material UI, or other UI framework unless explicitly authorized.
- Use ordinary CSS / CSS Modules for the initial application.
- No backend is required for the demo baseline.
- Source PNG sequences and master render sources do not belong in the Git repository.

## Implementation discipline

- Work only on the current IMP task.
- Do not pre-implement later roadmap items.
- Keep changes small and reviewable.
- Prefer simple code over abstractions that are not yet needed.
- Do not rename locked domain concepts without approval.
- If a task conflicts with a locked document, stop and report the conflict instead of guessing.
- If a requirement is ambiguous but does not affect architecture, choose the simplest reversible implementation and document the choice.

## Validation

For each implementation task:

1. Run all checks required by the task.
2. Fix failures caused by the task.
3. Report:
   - changed files,
   - commands run,
   - validation results,
   - any unresolved issue,
   - any architecture conflict discovered.

Do not claim PASS if a required check did not run successfully.
