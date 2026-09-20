import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { developmentVideo } from './developmentMedia'
import { useI18n } from '../../i18n/useI18n'
import './VideoPage.css'

type MediaStatus = 'loading' | 'ready' | 'error'

export default function VideoPage() {
  const { t } = useI18n()
  const [status, setStatus] = useState<MediaStatus>('loading')
  const player = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = player.current!
    video.src = developmentVideo.src
    return () => {
      video.pause()
      video.removeAttribute('src')
      video.load()
    }
  }, [])

  return (
    <section className="project-video" aria-labelledby="project-video-heading">
      <h1 id="project-video-heading">{t('video.title')}</h1>
      <p id="project-video-description">
        {t('video.description')}
      </p>
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
      <p id="project-video-status" role="status" aria-live="polite" aria-atomic="true">
        {status === 'loading' ? t('video.statusLoading')
          : status === 'ready' ? t('video.statusReady') : t('video.statusError')}
      </p>
      <Link to="/">{t('video.home')}</Link>
    </section>
  )
}
