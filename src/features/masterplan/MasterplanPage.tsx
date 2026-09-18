import { Link } from 'react-router-dom'
import { blocks } from '../../data'

export default function MasterplanPage() {
  return (
    <>
      <h1>Home / Masterplan</h1>
      <p>Masterplan yer tutucusu.</p>
      <ul>
        {blocks.map((block) => (
          <li key={block.id}><Link to={`/block/${block.id}`}>{block.name} Blok</Link></li>
        ))}
      </ul>
    </>
  )
}
