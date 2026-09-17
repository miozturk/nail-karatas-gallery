# Media Conventions — Baseline v1

## Repository media

Optimized runtime media may live under:

```text
public/media/
  scenes/
  transitions/
  plans/
  panoramas/
  galleries/
  video/
```

## Source media

Do not commit:
- PNG animation sequences,
- master Corona / Vantage source exports,
- 3ds Max scenes,
- unoptimized panorama masters,
- large production source packages.

These belong in external project storage such as the project's Google Drive source area.

## Naming

Use lower-case kebab-case.

Examples:

```text
scenes/general.webp
scenes/block-a.webp
scenes/block-b.webp

transitions/general-to-a.mp4
transitions/a-to-general.mp4

plans/bc-t01.webp

panoramas/demo/living-room.webp
panoramas/demo/hall.webp
panoramas/demo/bedroom.webp
```

Do not scatter literal paths through components.

Media paths must be resolved through centralized scene / media data.

## Transition rule

A transition video's first and last visual states must align with the associated static scene states as closely as possible.

Reverse transitions are separately encoded assets.

Avoid temporally obvious moving entourage in transitions if the source forward animation is also used to generate the reverse.
