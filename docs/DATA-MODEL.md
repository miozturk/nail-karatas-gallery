# Data Model — Baseline v1

Status: **LOCKED at conceptual level**

The filled unit inventory spreadsheet is the project-data source used to prepare the initial typed dataset.

## Block

```ts
interface Block {
  id: string;
  name: string;
  category: "residential" | "commercial";
  scene: SceneDefinition;
}
```

## UnitType

Represents reusable architectural content.

```ts
interface UnitType {
  id: string;
  category: "residential" | "commercial";
  name: string;

  rooms?: string;
  bathrooms?: number;
  netArea?: number;
  grossArea?: number;

  planVariant?: string;
  planImage?: string;

  gallery?: string[];
  tourId?: string;
}
```

## Unit

Represents one real independent unit in the project.

```ts
type AvailabilityStatus =
  | "unknown"
  | "available"
  | "reserved"
  | "sold";

interface Unit {
  id: string;
  blockId: string;
  unitNo: string;
  floor: string;
  unitTypeId: string;

  orientation?: string;
  availability: AvailabilityStatus;

  hotspot?: Polygon;
  demoEnabled: boolean;
}
```

## Polygon

Exterior hotspot coordinates use the 1920 x 1440 logical stage.

```ts
type Point = readonly [number, number];
type Polygon = readonly Point[];
```

## Tour

A Tour normally belongs to a UnitType so multiple real units can reuse the same architectural tour.

```ts
interface Tour {
  id: string;
  unitTypeId: string;
  floorPlanImage?: string;
  scenes: PanoramaScene[];
}
```

## PanoramaScene

```ts
interface PanoramaScene {
  id: string;
  name: string;
  panoramaImage: string;

  minimap?: {
    x: number;
    y: number;
  };

  initialView?: {
    yaw: number;
    pitch: number;
    hfov: number;
  };

  hotspots: TourHotspot[];
}
```

## TourHotspot

```ts
interface TourHotspot {
  targetSceneId: string;
  label: string;
  pitch: number;
  yaw: number;
}
```

## Important relationships

```text
Block
  -> Units

Unit
  -> UnitType

UnitType
  -> plan / gallery / optional Tour

Tour
  -> PanoramaScenes

PanoramaScene
  -> TourHotspots
```

## Data rules

- Never duplicate reusable plan / tour content into every Unit record.
- Availability belongs to the real Unit.
- Facade hotspot belongs to the real Unit.
- Architectural plan, gallery and tour normally belong to UnitType.
- A mirrored plan variant may be represented as a separate UnitType variant.
- Missing demo data should remain explicitly unknown / absent; do not invent production values.
