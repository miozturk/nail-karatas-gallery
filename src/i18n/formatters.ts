import type { PanoramaTourDefinition } from '../panorama/types'
import type { AvailabilityStatus, UnitCategory } from '../types'
import type { Translate } from './I18nContext'
import type { Locale } from './locale'
import type { TranslationKey } from './translations/tr'

export function formatCategory(category: UnitCategory, t: Translate): string {
  return t(category === 'commercial' ? 'category.commercial' : 'category.residential')
}

export function formatAvailability(status: AvailabilityStatus, t: Translate): string {
  return t(`availability.${status}` as TranslationKey)
}

const floorKeys: Readonly<Record<string, TranslationKey>> = {
  'Bodrum + Zemin + Asma': 'format.floor.basementGroundMezzanine',
  'Zemin Kat': 'format.floor.ground',
}

export function formatFloor(value: string, t: Translate): string {
  const known = floorKeys[value]
  if (known) return t(known)
  const numbered = /^(\d+)\. Kat$/.exec(value)
  return numbered ? t('format.floor.numbered', { number: numbered[1] }) : value
}

const orientationKeys: Readonly<Record<string, TranslationKey>> = {
  Bahçe: 'format.orientation.garden',
  Yol: 'format.orientation.road',
  Kuzey: 'format.orientation.north',
  Güney: 'format.orientation.south',
  Doğu: 'format.orientation.east',
  Batı: 'format.orientation.west',
}

export function formatOrientation(value: string, t: Translate): string {
  return value.split(' / ').map((token) => {
    const key = orientationKeys[token]
    return key ? t(key) : token
  }).join(' / ')
}

const unitTypeKeys: Readonly<Record<string, TranslationKey>> = {
  'Mağaza Tip 1': 'format.unitType.shop1',
  'Mağaza Tip 2': 'format.unitType.shop2',
  'Mağaza Tip 3': 'format.unitType.shop3',
  'Mağaza Tip 4': 'format.unitType.shop4',
}

export function formatUnitTypeName(value: string, rooms: string | undefined, t: Translate): string {
  const known = unitTypeKeys[value]
  if (known) return t(known)
  return rooms ? t('format.unitType.residential', { rooms }) : value
}

const numberLocales: Record<Locale, string> = {
  tr: 'tr-TR',
  en: 'en-US',
  ru: 'ru-RU',
}

export function formatArea(value: number, locale: Locale): string {
  return `${new Intl.NumberFormat(numberLocales[locale]).format(value)} m²`
}

const roomKeys: Readonly<Record<string, TranslationKey>> = {
  'living-room': 'room.living-room',
  hall: 'room.hall',
  bedroom: 'room.bedroom',
  'bedroom-master': 'room.bedroom-master',
  'bedroom-single': 'room.bedroom-single',
  bathroom: 'room.bathroom',
}

export function formatRoomName(id: string, fallback: string, t: Translate): string {
  const key = roomKeys[id]
  return key ? t(key) : fallback
}

export function localizeTour(tour: PanoramaTourDefinition, t: Translate): PanoramaTourDefinition {
  const roomNames = new Map(tour.scenes.map((scene) => [scene.id, formatRoomName(scene.id, scene.name, t)]))
  return {
    ...tour,
    scenes: tour.scenes.map((scene) => ({
      ...scene,
      name: roomNames.get(scene.id) ?? scene.name,
      hotspots: scene.hotspots.map((hotspot) => ({
        ...hotspot,
        label: roomNames.get(hotspot.targetSceneId) ?? hotspot.label,
      })),
    })),
  }
}
