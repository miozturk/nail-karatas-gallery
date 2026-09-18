import { NavLink, Outlet } from 'react-router-dom'

export default function AppShell() {
  return (
    <>
      <header className="app-header">
        <p>Nail Karataş Gallery</p>
        <nav aria-label="Global navigation">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/video">Video</NavLink>
        </nav>
      </header>
      <main><Outlet /></main>
    </>
  )
}
