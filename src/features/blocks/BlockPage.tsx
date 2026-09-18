import { Link, useParams } from 'react-router-dom'
import { units } from '../../data'

export default function BlockPage() {
  const { blockId } = useParams()
  return (
    <>
      <h1>Block</h1>
      <p>Blok yer tutucusu. blockId: {blockId}</p>
      <Link to="/">Home</Link>
      <ul>
        {units.filter((unit) => unit.blockId === blockId && unit.demoEnabled).map((unit) => (
          <li key={unit.id}>
            <Link to={`/block/${blockId}/unit/${unit.id}`}>{unit.id}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}
