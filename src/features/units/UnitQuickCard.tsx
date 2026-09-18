import { Link } from 'react-router-dom'
import type { Unit, UnitType } from '../../types'
import './UnitQuickCard.css'

interface UnitQuickCardProps {
  unit: Unit
  unitType: UnitType
  disabled: boolean
}

export default function UnitQuickCard({ unit, unitType, disabled }: UnitQuickCardProps) {
  const route = `/block/${unit.blockId}/unit/${unit.id}`
  return (
    <section className="unit-quick-card" aria-labelledby="unit-quick-card-title" inert={disabled}>
      <header>
        <h2 id="unit-quick-card-title">Seçili bölüm: {unit.id}</h2>
        <Link to={`/block/${unit.blockId}`} aria-label="Kartı kapat ve bloğa dön">Kapat — Bloğa dön</Link>
      </header>
      <div className="unit-quick-card__plan">
        <strong>Plan önizleme alanı</strong>
        <small>DEVELOPMENT-ONLY · Gerçek plan değildir.</small>
      </div>
      <dl>
        <div><dt>Resmî bağımsız bölüm no</dt><dd>{unit.unitNo}</dd></div>
        <div><dt>Kat</dt><dd>{unit.floor}</dd></div>
        <div><dt>Bölüm tipi</dt><dd>{unitType.name}</dd></div>
        <div><dt>Kategori</dt><dd>{unitType.category === 'commercial' ? 'Ticari' : 'Konut'}</dd></div>
        {unitType.rooms && <div><dt>Oda</dt><dd>{unitType.rooms}</dd></div>}
        {unitType.netArea !== undefined && <div><dt>Net alan</dt><dd>{unitType.netArea} m²</dd></div>}
      </dl>
      <nav aria-label={`${unit.id} işlemleri`}>
        <Link to={`${route}/tour`}>Sanal Tur</Link>
        <Link to={`${route}/details`}>Detayları Gör</Link>
      </nav>
    </section>
  )
}
