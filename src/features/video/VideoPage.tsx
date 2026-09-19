import { useState } from 'react'
import { Link } from 'react-router-dom'
import { developmentVideo } from './developmentMedia'
import './VideoPage.css'

type MediaStatus = 'loading' | 'ready' | 'error'

const statusMessages: Record<MediaStatus, string> = {
  loading: 'Video yükleniyor… Oynatmak için yerel video kontrollerini kullanın.',
  ready: 'Video oynatılmaya hazır.',
  error: 'Video yüklenemedi veya oynatılamadı. Ana sayfaya dönebilirsiniz.',
}

export default function VideoPage() {
  const [status, setStatus] = useState<MediaStatus>('loading')

  return (
    <section className="project-video" aria-labelledby="project-video-heading">
      <h1 id="project-video-heading">Proje Videosu</h1>
      <p id="project-video-description">
        DEVELOPMENT-ONLY · Bu sessiz klip yalnızca oynatma deneyimini doğrulamak
        içindir; Nail Karataş projesinin tanıtım filmi değildir.
      </p>
      <video
        className="project-video__player"
        src={developmentVideo.src}
        controls
        playsInline
        preload="metadata"
        aria-label="Geliştirme amaçlı sessiz video"
        aria-describedby="project-video-description project-video-status"
        onLoadStart={() => setStatus('loading')}
        onCanPlay={() => setStatus('ready')}
        onWaiting={() => setStatus('loading')}
        onPlaying={() => setStatus('ready')}
        onError={() => setStatus('error')}
      >
        Tarayıcınız HTML5 video oynatmayı desteklemiyor.
      </video>
      <p id="project-video-status" role="status" aria-live="polite" aria-atomic="true">
        {statusMessages[status]}
      </p>
      <Link to="/">Ana sayfaya dön</Link>
    </section>
  )
}
