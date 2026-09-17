export type UnitCategory = 'residential' | 'commercial'

export type AvailabilityStatus = 'unknown' | 'available' | 'reserved' | 'sold'

// Exterior coordinates share the 1920 x 1440 logical stage.
export type Point = readonly [number, number]
export type Polygon = readonly Point[]

// Provisional until SceneStage: identity only, without media/rendering contracts.
export interface SceneDefinition {
  id: string
}

export interface Block {
  id: string
  name: string
  category: UnitCategory
  scene: SceneDefinition
}

export interface UnitType {
  id: string
  category: UnitCategory
  name: string
  rooms?: string
  bathrooms?: number
  netArea?: number
  grossArea?: number
  planVariant?: 'normal' | 'mirrored' | 'special'
  planImage?: string
  gallery?: string[]
  tourId?: string
}

export interface Unit {
  id: string
  blockId: string
  unitNo: string
  floor: string
  unitTypeId: string
  orientation?: string
  availability: AvailabilityStatus
  hotspot?: Polygon
  demoEnabled: boolean
}
