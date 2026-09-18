import { Link, useParams } from 'react-router-dom'

export default function UnitDetailsPage() {
  const { blockId, unitId } = useParams()
  return (
    <>
      <h1>Unit Details</h1>
      <p>Detay yer tutucusu. blockId: {blockId}, unitId: {unitId}</p>
      <Link to={`/block/${blockId}/unit/${unitId}`}>Return to Unit</Link>
    </>
  )
}
