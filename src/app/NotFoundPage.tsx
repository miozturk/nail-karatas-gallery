import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'

export default function NotFoundPage() {
  const { t } = useI18n()
  return (
    <section className="not-found" aria-labelledby="not-found-title">
      <h1 id="not-found-title">{t('notFound.title')}</h1>
      <p>{t('notFound.body')}</p>
      <Link className="ui-action ui-action--primary" to="/">{t('notFound.home')}</Link>
    </section>
  )
}
