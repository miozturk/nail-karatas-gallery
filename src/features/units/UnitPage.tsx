import { Link, useParams } from 'react-router-dom'

export default function UnitPage() {
  const { blockId, unitId } = useParams()
  return (
    <>
      <h1>Unit Quick Card</h1>
      <p>Rota yer tutucusu. blockId: {blockId}, unitId: {unitId}</p>
      <nav aria-label="Unit navigation">
        <Link to={`/block/${blockId}`}>Bloğa dön</Link>
        <Link to="details">Details</Link>
        <Link to="tour">Virtual Tour</Link>
      </nav>
    </>
  )
}
