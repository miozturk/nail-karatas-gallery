import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../../i18n/useI18n'
import { projectVideo } from '../../media/projectVideo'
import './VideoPage.css'

type MediaStatus = 'loading' | 'ready' | 'error'

export default function VideoPage() {
  const { t } = useI18n()
  const [status, setStatus] = useState<MediaStatus>('loading')
  const player = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = player.current!
    video.src = projectVideo.src
    return () => {
      video.pause()
      video.removeAttribute('src')
      video.load()
    }
  }, [])

  return (
    <section className="project-video" aria-labelledby="project-video-heading">
      <header className="project-video__header">
        <h1 id="project-video-heading">{t('video.title')}</h1>
      </header>
      <p className="ui-notice project-video__notice" id="project-video-description">
        {t('video.description')}
      </p>
      <div className="project-video__frame">
        <video
          className="project-video__player"
          ref={player}
          controls
          playsInline
          preload="metadata"
          aria-label={t('video.label')}
          aria-describedby="project-video-description project-video-status"
          onLoadStart={() => setStatus('loading')}
          onCanPlay={() => setStatus('ready')}
          onWaiting={() => setStatus('loading')}
          onPlaying={() => setStatus('ready')}
          onError={() => setStatus('error')}
        >
          {t('video.fallback')}
        </video>
      </div>
      <p className="ui-status project-video__status" id="project-video-status" data-status={status}
        role="status" aria-live="polite" aria-atomic="true">
        {status === 'loading' ? t('video.statusLoading')
          : status === 'ready' ? t('video.statusReady') : t('video.statusError')}
      </p>
      <Link className="ui-action ui-action--secondary project-video__home" to="/">{t('video.home')}</Link>
    </section>
  )
}
