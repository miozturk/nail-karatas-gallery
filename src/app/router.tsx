import { Outlet, Route, Routes, useParams } from 'react-router-dom'
import { blocks, units } from '../data'
import MasterplanPage from '../features/masterplan/MasterplanPage'
import BlockPage from '../features/blocks/BlockPage'
import UnitPage from '../features/units/UnitPage'
import UnitDetailsPage from '../features/units/UnitDetailsPage'
import TourPage from '../features/tours/TourPage'
import VideoPage from '../features/video/VideoPage'
import AppShell from './AppShell'
import NotFoundPage from './NotFoundPage'

function BlockRoute() {
  const { blockId } = useParams()
  return blocks.some((block) => block.id === blockId)
    ? <Outlet /> : <NotFoundPage />
}

function UnitRoute() {
  const { blockId, unitId } = useParams()
  return units.some((unit) => unit.id === unitId && unit.blockId === blockId)
    ? <Outlet /> : <NotFoundPage />
}

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<MasterplanPage />} />
        <Route path="block/:blockId" element={<BlockRoute />}>
          <Route index element={<BlockPage />} />
          <Route path="unit/:unitId" element={<UnitRoute />}>
            <Route index element={<UnitPage />} />
            <Route path="details" element={<UnitDetailsPage />} />
            <Route path="tour" element={<TourPage />} />
          </Route>
        </Route>
        <Route path="video" element={<VideoPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
