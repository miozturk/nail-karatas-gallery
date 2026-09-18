import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <>
      <h1>Sayfa bulunamadı</h1>
      <p>İstenen sayfa, blok veya bağımsız bölüm bulunamadı.</p>
      <Link to="/">Home</Link>
    </>
  )
}
