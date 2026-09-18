import { NavLink, Outlet, useMatch } from 'react-router-dom'
import { blocks } from '../data'

export default function AppShell() {
  const blockRoute = useMatch('/block/:blockId')
  const hasBlockHome = blocks.some((block) => block.id === blockRoute?.params.blockId)
  return (
    <>
      <header className="app-header">
        <p>Nail Karataş Gallery</p>
        <nav aria-label="Global navigation">
          {/* The block's contextual Home owns reverse playback. */}
          {!hasBlockHome && <NavLink to="/" end>Home</NavLink>}
          <NavLink to="/video">Video</NavLink>
        </nav>
      </header>
      <main><Outlet /></main>
    </>
  )
}
