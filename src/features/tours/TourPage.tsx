import { Link, useParams } from 'react-router-dom'

export default function TourPage() {
  const { blockId, unitId } = useParams()
  return (
    <>
      <h1>Virtual Tour</h1>
      <p>Tur yer tutucusu. blockId: {blockId}, unitId: {unitId}</p>
      <Link to={`/block/${blockId}/unit/${unitId}`}>Return to Unit</Link>
    </>
  )
}
