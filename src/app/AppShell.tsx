import { NavLink, Outlet, useMatch } from 'react-router-dom'
import { blocks } from '../data'
import { useI18n } from '../i18n/useI18n'

const localeOptions = [
  { locale: 'tr', label: 'locale.tr' },
  { locale: 'en', label: 'locale.en' },
  { locale: 'ru', label: 'locale.ru' },
] as const

export default function AppShell() {
  const { locale, setLocale, t } = useI18n()
  const homeRoute = useMatch('/')
  const blockRoute = useMatch('/block/:blockId')
  const unitRoute = useMatch('/block/:blockId/unit/:unitId')
  const detailsRoute = useMatch('/block/:blockId/unit/:unitId/details')
  const tourRoute = useMatch('/block/:blockId/unit/:unitId/tour')
  const videoRoute = useMatch('/video')
  const hasBlockHome = blocks.some((block) => block.id === (blockRoute ?? unitRoute ?? detailsRoute ?? tourRoute)?.params.blockId)
  const mainClassName = tourRoute
    ? 'app-main--tour'
    : homeRoute || hasBlockHome ? 'app-main--exterior'
      : videoRoute ? 'app-main--video' : undefined
  return (
    <>
      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-header__top">
            <p className="app-header__brand">{t('app.brand')}</p>
            <div className="language-selector" role="group" aria-label={t('locale.selectorLabel')}>
              {localeOptions.map((option) => <button key={option.locale} type="button"
                aria-label={t(option.label)} aria-pressed={locale === option.locale}
                onClick={() => setLocale(option.locale)}>{option.locale.toUpperCase()}</button>)}
            </div>
          </div>
          <nav className="app-nav" aria-label={t('nav.globalLabel')}>
            {/* The block's contextual Home owns reverse playback. */}
            {hasBlockHome
              ? <span className="app-nav__home-placeholder" aria-hidden="true">{t('nav.home')}</span>
              : <NavLink to="/" end>{t('nav.home')}</NavLink>}
            <NavLink to="/video">{t('nav.video')}</NavLink>
          </nav>
        </div>
      </header>
      <main className={mainClassName}><Outlet /></main>
    </>
  )
}
