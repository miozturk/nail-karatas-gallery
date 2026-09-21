import { useState, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import SceneStage from '../../../components/SceneStage/SceneStage'
import SceneStageImage from '../../../components/SceneStage/SceneStageImage'
import { exteriorMedia } from '../../../media/exteriorMedia'
import type { Point, Polygon } from '../../../types'
import './HotspotEditor.css'

export default function HotspotEditor() {
  const [id, setId] = useState('')
  const [vertices, setVertices] = useState<Point[]>([])
  const [polygons, setPolygons] = useState<Map<string, Polygon>>(new Map())
  const [selected, setSelected] = useState<string | null>(null)
  const [pointer, setPointer] = useState<Point | null>(null)
  const [status, setStatus] = useState('')
  const entries = [...polygons].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
  const json = JSON.stringify(Object.fromEntries(entries), null, 2)
  const key = id.trim()
  const valid = vertices.length >= 3 && key.length > 0 && !polygons.has(key)

  function coordinates(event: PointerEvent<SVGSVGElement>): Point {
    const rect = event.currentTarget.getBoundingClientRect()
    return [
      Math.round(Math.max(0, Math.min(1920, (event.clientX - rect.left) / rect.width * 1920))),
      Math.round(Math.max(0, Math.min(1440, (event.clientY - rect.top) / rect.height * 1440))),
    ]
  }

  function commit() {
    if (!valid) return
    setPolygons(new Map(polygons).set(key, [...vertices]))
    setSelected(key)
    setVertices([])
    setId('')
    setStatus(`${key} kaydedildi. Veriler yalnızca bu oturumun belleğinde tutulur.`)
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(json)
      setStatus('JSON panoya kopyalandı.')
    } catch {
      setStatus('Panoya kopyalanamadı. Aşağıdaki JSON alanını seçip elle kopyalayabilirsiniz.')
    }
  }

  const points = (polygon: Polygon) => polygon.map(([x, y]) => `${x},${y}`).join(' ')

  return <main className="hotspot-editor">
    <h1>Hotspot Editor v1 — DEVELOPMENT-ONLY</h1>
    <Link to="/">Ana sayfaya dön</Link>
    <p id="canvas-help">1920 × 1440 sahnede köşe eklemek için işaretçiyle tıklayın. Kontroller klavyeyle kullanılabilir.
      Polygonları yalnız gerçek Masterplan görselindeki yapıların üzerine çizin. Sayfadan ayrılınca veya sayfayı yenileyince
      tüm polygonlar silinir.</p>
    <div className="hotspot-editor__canvas">
      <SceneStage label="Polygon çizim sahnesi" base={
        <SceneStageImage src={exteriorMedia.masterplan} alt="Nail Karataş gerçek Masterplan görünümü" />
      } interaction={
        <svg viewBox="0 0 1920 1440" width="1920" height="1440" aria-label="Polygon çizim alanı"
          aria-describedby="canvas-help"
          onPointerMove={(event) => setPointer(coordinates(event))}
          onPointerLeave={() => setPointer(null)}
          onPointerDown={(event) => {
            if (event.button !== 0 || !event.isPrimary) return
            const point = coordinates(event)
            setPointer(point)
            setVertices((previous) => [...previous, point])
          }}>
          {entries.map(([name, polygon]) => <polygon key={name} points={points(polygon)}
            className={name === selected ? 'hotspot-editor__selected' : 'hotspot-editor__saved'} />)}
          {vertices.length >= 3
            ? <polygon className="hotspot-editor__draft" points={points(vertices)} />
            : <polyline className="hotspot-editor__draft" points={points(vertices)} />}
          {vertices.map(([x, y], index) => <circle key={index} cx={x} cy={y} r="10" />)}
        </svg>
      } />
    </div>
    <p>İşaretçi X/Y: <output>{pointer ? pointer.join(', ') : '—'}</output></p>
    <section aria-labelledby="draft-heading">
      <h2 id="draft-heading">Yeni polygon</h2>
      <label htmlFor="polygon-id">Polygon ID</label>
      <input id="polygon-id" value={id} onChange={(event) => setId(event.target.value)}
        aria-describedby="commit-help" aria-invalid={polygons.has(key)} />
      <p id="commit-help">Kaydetmek için en az 3 köşe ve boş olmayan benzersiz bir ID gerekir.
        {polygons.has(key) && ' Bu ID zaten kayıtlı; başka bir ID girin.'}</p>
      <div className="hotspot-editor__actions">
        <button disabled={!vertices.length} onClick={() => setVertices(vertices.slice(0, -1))}>Son köşeyi geri al</button>
        <button disabled={!vertices.length && !id} onClick={() => { setVertices([]); setId(''); setStatus('Taslak temizlendi.') }}>Taslağı temizle</button>
        <button disabled={!valid} onClick={commit}>Polygon kaydet</button>
      </div>
      <ol>{vertices.map(([x, y], index) => <li key={index}>{x}, {y}</li>)}</ol>
    </section>
    <section aria-labelledby="saved-heading">
      <h2 id="saved-heading">Kayıtlı polygonlar</h2>
      <p>Kayıtlı polygonu incelemek için ID düğmesini seçin. Değiştirmek için silip yeniden çizin.</p>
      <ul>{entries.map(([name]) => <li key={name}>
        <button aria-pressed={selected === name} onClick={() => setSelected(name)}>{name}</button>{' '}
        <button aria-label={`${name} polygonunu sil`} onClick={() => {
          const next = new Map(polygons)
          next.delete(name)
          setPolygons(next)
          if (selected === name) setSelected(null)
          setStatus(`${name} silindi.`)
        }}>Sil</button>
      </li>)}</ul>
      {selected && <div><h3>{selected} köşeleri</h3><ol>
        {polygons.get(selected)?.map(([x, y], index) => <li key={index}>{x}, {y}</li>)}
      </ol></div>}
    </section>
    <section aria-labelledby="export-heading">
      <h2 id="export-heading">JSON dışa aktar</h2>
      <label htmlFor="polygon-json">Kayıtlı polygonların JSON çıktısı</label>
      <textarea id="polygon-json" readOnly value={json} rows={12} spellCheck={false} />
      {typeof navigator.clipboard?.writeText === 'function'
        ? <button onClick={() => void copy()}>JSON kopyala</button>
        : <p>Panoya erişim yok. JSON alanından elle kopyalayabilirsiniz.</p>}
    </section>
    <p role="status">{status}</p>
  </main>
}
