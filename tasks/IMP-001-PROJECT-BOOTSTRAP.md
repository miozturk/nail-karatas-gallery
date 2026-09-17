# IMP-001 — Project Bootstrap

Status: **READY**

## Objective

Create the minimum repository/application foundation required for later implementation.

Do not implement product features in this task.

## Required stack

- Node.js 24 LTS
- npm
- React
- TypeScript
- Vite
- React Router

## Required work

1. Initialize a Vite React + TypeScript application in the repository root without deleting or overwriting the existing baseline documentation.
2. Add React Router as the only required application dependency beyond the Vite React baseline.
3. Configure npm scripts so the project can:
   - run development mode,
   - build,
   - lint.
4. Create the following source folders if they do not exist:

```text
src/
  app/
  features/
    masterplan/
    blocks/
    units/
    tours/
    video/
    navigation/
  components/
    SceneStage/
    SvgHotspotLayer/
    TransitionLayer/
    Modal/
  data/
  panorama/
  types/
  hooks/
  utils/
  styles/
```

5. Create runtime media folders:

```text
public/media/
  scenes/
  transitions/
  plans/
  panoramas/
  galleries/
  video/
```

6. Keep the application UI minimal: a simple bootstrap placeholder that clearly states the app is initialized is sufficient.
7. Preserve all baseline documents.
8. Add / update `.gitignore` appropriately for Node/Vite and local development artifacts.
9. Add an `.nvmrc` containing `24`.
10. Set a compatible Node engine requirement in `package.json`.

## Explicitly forbidden in IMP-001

Do not:
- implement the Home scene,
- implement routes beyond any minimum router setup needed for application boot,
- add Three.js,
- add Pannellum,
- add a panorama viewer,
- add Redux / Zustand / MobX,
- add Tailwind / Bootstrap / MUI,
- add backend code,
- import project production data,
- add real project media,
- build the hotspot editor,
- redesign the folder architecture,
- change locked baseline documents.

## Acceptance criteria

IMP-001 passes only if:

- `npm install` completes.
- `npm run build` passes.
- `npm run lint` passes.
- `npm run dev` starts successfully.
- React renders the minimal bootstrap page.
- React Router is installed and the application remains bootable.
- Required folder structure exists.
- `.nvmrc` is `24`.
- No forbidden dependency has been introduced.
- Baseline documents are unchanged except for purely mechanical path/reference fixes if absolutely required; any such change must be reported.

## Completion report

Return:

1. Summary.
2. Changed / created files.
3. Dependencies added.
4. Commands executed.
5. Build / lint / dev verification results.
6. Any warning or unresolved issue.
7. Stop after IMP-001. Do not start IMP-002.
