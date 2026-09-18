import { Link } from 'react-router-dom'
import type { AvailabilityStatus, Unit, UnitType } from '../../types'
import './UnitDetailsDrawer.css'

const availabilityLabels: Record<AvailabilityStatus, string> = {
  unknown: 'Bilinmiyor',
  available: 'Satışa uygun',
  reserved: 'Rezerve',
  sold: 'Satıldı',
}

interface UnitDetailsDrawerProps {
  unit: Unit
  unitType: UnitType
  disabled: boolean
}

export default function UnitDetailsDrawer({ unit, unitType, disabled }: UnitDetailsDrawerProps) {
  const route = `/block/${unit.blockId}/unit/${unit.id}`

  return (
    <section className="unit-details-drawer" aria-labelledby="unit-details-title" inert={disabled}>
      <header>
        <h2 id="unit-details-title">Bölüm detayları: {unit.id}</h2>
        <Link to={`/block/${unit.blockId}`}>Bloğa Dön</Link>
      </header>
      <dl>
        <div><dt>Unit ID</dt><dd>{unit.id}</dd></div>
        <div><dt>Resmî bağımsız bölüm no</dt><dd>{unit.unitNo}</dd></div>
        <div><dt>Kat</dt><dd>{unit.floor}</dd></div>
        <div><dt>Bölüm tipi</dt><dd>{unitType.name}</dd></div>
        <div><dt>Kategori</dt><dd>{unitType.category === 'commercial' ? 'Ticari' : 'Konut'}</dd></div>
        {unitType.rooms && <div><dt>Oda</dt><dd>{unitType.rooms}</dd></div>}
        {unitType.netArea !== undefined && <div><dt>Net alan</dt><dd>{unitType.netArea} m²</dd></div>}
        {unit.orientation && <div><dt>Yön</dt><dd>{unit.orientation}</dd></div>}
        <div><dt>Satış durumu</dt><dd>{availabilityLabels[unit.availability]}</dd></div>
      </dl>
      <div className="unit-details-drawer__media">
        <section className="unit-details-drawer__placeholder" aria-label="Plan yer tutucusu">
          <h3>Kat planı alanı</h3>
          <p>DEVELOPMENT-ONLY · Gerçek plan henüz entegre edilmedi.</p>
        </section>
        <section className="unit-details-drawer__placeholder" aria-label="Galeri yer tutucusu">
          <h3>Galeri / görsel alanı</h3>
          <p>DEVELOPMENT-ONLY · Gerçek galeri henüz entegre edilmedi.</p>
        </section>
      </div>
      <nav aria-label={`${unit.id} detay işlemleri`}>
        <Link to={route}>Quick Card'a Dön</Link>
        <Link to={`${route}/tour`}>Sanal Tur</Link>
      </nav>
    </section>
  )
}
