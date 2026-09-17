# Site Map — Baseline v1

Status: **LOCKED**

## Primary hierarchy

```text
HOME / MASTERPLAN
|
|-- A BLOCK
|   |-- unit hover / highlight
|   |-- Unit Quick Card
|   |   |-- Virtual Tour
|   |   `-- Details
|   `-- Home
|
|-- B BLOCK
|   |-- unit hover / highlight
|   |-- Unit Quick Card
|   |   |-- Virtual Tour
|   |   `-- Details
|   `-- Home
|
|-- C BLOCK
|   |-- unit hover / highlight
|   |-- Unit Quick Card
|   |   |-- Virtual Tour
|   |   `-- Details
|   `-- Home
|
|-- VIRTUAL TOUR
|   |-- panorama scene
|   |-- visual hotspots
|   |-- room menu
|   |-- floor-plan minimap
|   |-- active viewpoint
|   `-- Return to Unit
|
`-- GLOBAL MENU
    |-- Home
    |-- Tours                [supported direction]
    |-- Video                [initial demo]
    |-- Availability         [future UI]
    |-- Brochure             [future]
    |-- Location             [future]
    `-- Contact              [future]
```

## Navigation rules

- Home has no parent / Back destination.
- Block views expose an application-level Home control.
- Returning from a block to Home uses the block's reverse transition video.
- The user must never be forced to use the browser Back button.
- Browser history must still remain coherent.
- Virtual Tour exposes a visible Return to Unit control.
- Global navigation and contextual navigation are separate concepts.

## Route intent

Planned route semantics:

- `/`
- `/block/:blockId`
- `/block/:blockId/unit/:unitId`
- `/block/:blockId/unit/:unitId/details`
- `/block/:blockId/unit/:unitId/tour`
- `/video`
- `/availability` [future]
