import { useState, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import SceneStage from '../../../components/SceneStage/SceneStage'
import SceneStageImage from '../../../components/SceneStage/SceneStageImage'
import { exteriorMedia, type ExteriorBlockId } from '../../../media/exteriorMedia'
import type { Point, Polygon } from '../../../types'
import './HotspotEditor.css'

type AuthoringUnitId =
  | 'A-003'
  | 'B-301'
  | 'B-302'
  | 'B-303'
  | 'B-304'
  | 'C-401'
  | 'C-402'
  | 'C-403'
  | 'C-404'

interface SavedPolygon {
  blockId: ExteriorBlockId
  points: Polygon
}

const unitIdsByBlock: Record<ExteriorBlockId, readonly AuthoringUnitId[]> = {
  a: ['A-003'],
  b: ['B-301', 'B-302', 'B-303', 'B-304'],
  c: ['C-401', 'C-402', 'C-403', 'C-404'],
}

const blockLabels: Record<ExteriorBlockId, string> = {
  a: 'Block A',
  b: 'Block B',
  c: 'Block C',
}

export default function HotspotEditor() {
  const [blockId, setBlockId] = useState<ExteriorBlockId>('a')
  const [id, setId] = useState<AuthoringUnitId>('A-003')
  const [vertices, setVertices] = useState<Point[]>([])
  const [polygons, setPolygons] = useState<Map<AuthoringUnitId, SavedPolygon>>(new Map())
  const [selected, setSelected] = useState<AuthoringUnitId | null>(null)
  const [pointer, setPointer] = useState<Point | null>(null)
  const [status, setStatus] = useState('')
  const entries = [...polygons].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
  const sceneEntries = entries.filter(([, polygon]) => polygon.blockId === blockId)
  const json = JSON.stringify(Object.fromEntries(entries), null, 2)
  const valid = vertices.length >= 3 && unitIdsByBlock[blockId].includes(id) && !polygons.has(id)

  function coordinates(event: PointerEvent<SVGSVGElement>): Point {
    const rect = event.currentTarget.getBoundingClientRect()
    return [
      Math.round(Math.max(0, Math.min(1920, (event.clientX - rect.left) / rect.width * 1920))),
      Math.round(Math.max(0, Math.min(1440, (event.clientY - rect.top) / rect.height * 1440))),
    ]
  }

  function commit() {
    if (!valid) return
    setPolygons(new Map(polygons).set(id, { blockId, points: [...vertices] }))
    setSelected(id)
    setVertices([])
    setStatus(`${id}, ${blockLabels[blockId]} için kaydedildi. Veriler yalnızca bu oturumun belleğinde tutulur.`)
  }

  function changeBlock(nextBlockId: ExteriorBlockId) {
    if (nextBlockId === blockId) return
    if (vertices.length > 0) {
      setStatus('Sahne değiştirmek için önce mevcut taslağı kaydedin veya temizleyin.')
      return
    }
    setBlockId(nextBlockId)
    setId(unitIdsByBlock[nextBlockId][0])
    setSelected(null)
    setPointer(null)
    setStatus(`${blockLabels[nextBlockId]} authoring sahnesi açıldı. Kayıtlı polygonların Block ataması değiştirilmedi.`)
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
      Her Unit polygonunu yalnız ait olduğu gerçek Block görseli üzerinde çizin. Sayfadan ayrılınca veya sayfayı yenileyince
      tüm polygonlar silinir. Unit konumunu editör belirlemez; görsel atamanın kaynağı operatördür.</p>
    <section aria-labelledby="scene-heading">
      <h2 id="scene-heading">Authoring sahnesi</h2>
      <label htmlFor="block-scene">Gerçek Block görseli</label>
      <select id="block-scene" value={blockId} disabled={vertices.length > 0}
        onChange={(event) => changeBlock(event.target.value as ExteriorBlockId)}>
        <option value="a">Block A</option>
        <option value="b">Block B</option>
        <option value="c">Block C</option>
      </select>
      <p>Taslak köşeleri varken sahne seçimi kilitlenir; böylece bir polygon başka Block'a sessizce taşınmaz.</p>
    </section>
    <div className="hotspot-editor__canvas">
      <SceneStage label={`${blockLabels[blockId]} Unit polygon çizim sahnesi`} base={
        <SceneStageImage src={exteriorMedia.blocks[blockId].scene}
          alt={`Nail Karataş gerçek ${blockLabels[blockId]} görünümü`} />
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
          {sceneEntries.map(([name, polygon]) => <polygon key={name} points={points(polygon.points)}
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
      <select id="polygon-id" value={id}
        onChange={(event) => setId(event.target.value as AuthoringUnitId)}
        aria-describedby="commit-help" aria-invalid={polygons.has(id)}>
        {unitIdsByBlock[blockId].map((unitId) => <option key={unitId} value={unitId}>{unitId}</option>)}
      </select>
      <p id="commit-help">Bu listede yalnız {blockLabels[blockId]} için izinli Unit ID'leri bulunur.
        Kaydetmek için en az 3 köşe ve daha önce kaydedilmemiş bir ID gerekir.
        {polygons.has(id) && ' Bu ID zaten kayıtlı; değiştirmek için önce kayıtlı polygonu silin.'}</p>
      <div className="hotspot-editor__actions">
        <button disabled={!vertices.length} onClick={() => setVertices(vertices.slice(0, -1))}>Son köşeyi geri al</button>
        <button disabled={!vertices.length} onClick={() => { setVertices([]); setStatus('Taslak temizlendi.') }}>Taslağı temizle</button>
        <button disabled={!valid} onClick={commit}>Polygon kaydet</button>
      </div>
      <ol>{vertices.map(([x, y], index) => <li key={index}>{x}, {y}</li>)}</ol>
    </section>
    <section aria-labelledby="saved-heading">
      <h2 id="saved-heading">Kayıtlı polygonlar ({entries.length}/9)</h2>
      <p>Kayıtlı polygonu ve gerçek Block sahnesini incelemek için ID düğmesini seçin. Değiştirmek için silip yeniden çizin.</p>
      <ul>{entries.map(([name, polygon]) => <li key={name}>
        <button disabled={vertices.length > 0} aria-pressed={selected === name} onClick={() => {
          setBlockId(polygon.blockId)
          setId(name)
          setSelected(name)
          setPointer(null)
          setStatus(`${name}, ${blockLabels[polygon.blockId]} üzerinde gösteriliyor.`)
        }}>{name}</button>{' '}({blockLabels[polygon.blockId]}){' '}
        <button aria-label={`${name} polygonunu sil`} onClick={() => {
          const next = new Map(polygons)
          next.delete(name)
          setPolygons(next)
          if (selected === name) setSelected(null)
          setStatus(`${name} silindi.`)
        }}>Sil</button>
      </li>)}</ul>
      {selected && <div><h3>{selected} köşeleri</h3><ol>
        {polygons.get(selected)?.points.map(([x, y], index) => <li key={index}>{x}, {y}</li>)}
      </ol></div>}
    </section>
    <section aria-labelledby="export-heading">
      <h2 id="export-heading">JSON dışa aktar</h2>
      <p>Her Unit kaydı kendi <code>blockId</code> değerini ve çizim sırasındaki <code>points</code> listesini içerir.</p>
      <label htmlFor="polygon-json">Kayıtlı Unit polygonlarının JSON çıktısı</label>
      <textarea id="polygon-json" readOnly value={json} rows={22} spellCheck={false} />
      {typeof navigator.clipboard?.writeText === 'function'
        ? <button onClick={() => void copy()}>JSON kopyala</button>
        : <p>Panoya erişim yok. JSON alanından elle kopyalayabilirsiniz.</p>}
    </section>
    <p role="status">{status}</p>
  </main>
}
