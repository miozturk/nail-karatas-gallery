import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { I18nContext } from './I18nContext'
import type { Translate, TranslationValues } from './I18nContext'
import { readStoredLocale, writeStoredLocale } from './locale'
import type { Locale } from './locale'
import { en } from './translations/en'
import { ru } from './translations/ru'
import { tr } from './translations/tr'
import type { TranslationDictionary, TranslationKey } from './translations/tr'

const dictionaries: Record<Locale, TranslationDictionary> = { tr, en, ru }

function interpolate(template: string, values?: TranslationValues): string {
  if (!values) return template
  return template.replace(/\{([^}]+)\}/g, (match, name: string) =>
    Object.hasOwn(values, name) ? String(values[name]) : match)
}

function translate(locale: Locale, key: TranslationKey, values?: TranslationValues): string {
  const dictionary = dictionaries[locale]
  if (!Object.hasOwn(dictionary, key)) {
    if (import.meta.env.DEV) throw new Error(`Missing translation key: ${key}`)
    return String(key)
  }
  return interpolate(dictionary[key], values)
}

export default function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(readStoredLocale)

  useEffect(() => {
    document.documentElement.lang = locale
    writeStoredLocale(locale)
  }, [locale])

  const t = useCallback<Translate>((key, values) => translate(locale, key, values), [locale])
  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t])

  return <I18nContext value={value}>{children}</I18nContext>
}
