export const SUPPORTED_LOCALES = ['tr', 'en', 'ru'] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'tr'
export const LOCALE_STORAGE_KEY = 'nail-karatas-locale-v1'

interface LocaleStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export function isSupportedLocale(value: unknown): value is Locale {
  return typeof value === 'string' && SUPPORTED_LOCALES.some((locale) => locale === value)
}

function getBrowserStorage(storage?: LocaleStorage | null): LocaleStorage | null {
  if (storage !== undefined) return storage
  try {
    return globalThis.localStorage
  } catch {
    return null
  }
}

export function readStoredLocale(storage?: LocaleStorage | null): Locale {
  try {
    const value = getBrowserStorage(storage)?.getItem(LOCALE_STORAGE_KEY)
    return isSupportedLocale(value) ? value : DEFAULT_LOCALE
  } catch {
    return DEFAULT_LOCALE
  }
}

export function writeStoredLocale(locale: Locale, storage?: LocaleStorage | null): void {
  try {
    getBrowserStorage(storage)?.setItem(LOCALE_STORAGE_KEY, locale)
  } catch {
    // Locale still changes for this session when persistence is unavailable.
  }
}
