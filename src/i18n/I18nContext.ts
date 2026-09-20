import { createContext } from 'react'
import type { Locale } from './locale'
import type { TranslationKey } from './translations/tr'

export type TranslationValues = Readonly<Record<string, string | number>>
export type Translate = (key: TranslationKey, values?: TranslationValues) => string

export interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translate
}

export const I18nContext = createContext<I18nContextValue | null>(null)
