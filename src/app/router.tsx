import { lazy, Suspense } from 'react'
import { Outlet, Route, Routes, useParams } from 'react-router-dom'
import { blocks, units, unitTypes } from '../data'
import MasterplanPage from '../features/masterplan/MasterplanPage'
import BlockPage, { UnitOverlayRoute } from '../features/blocks/BlockPage'
import { useI18n } from '../i18n/useI18n'
import AppShell from './AppShell'
import NotFoundPage from './NotFoundPage'

const TourPage = lazy(() => import('../features/tours/TourPage'))
const VideoPage = lazy(() => import('../features/video/VideoPage'))

const HotspotEditor = import.meta.env.DEV
  ? lazy(() => import('../features/devtools/hotspot-editor/HotspotEditor'))
  : null

const PanoramaSpike = import.meta.env.DEV
  ? lazy(() => import('../features/devtools/panorama-spike/PanoramaSpike'))
  : null

function BlockRoute() {
  const { blockId } = useParams()
  return blocks.some((block) => block.id === blockId)
    ? <Outlet /> : <NotFoundPage />
}

function UnitRoute() {
  const { blockId, unitId } = useParams()
  return units.some((unit) => unit.id === unitId && unit.blockId === blockId
    && unitTypes.some((type) => type.id === unit.unitTypeId))
    ? <Outlet /> : <NotFoundPage />
}

export default function AppRouter() {
  const { t } = useI18n()
  return (
    <Routes>
      {PanoramaSpike && <Route path="/__dev/panorama-spike" element={
        <Suspense fallback={<p>Panorama yükleniyor…</p>}><PanoramaSpike /></Suspense>
      } />}
      {HotspotEditor && <Route path="/__dev/hotspot-editor" element={
        <Suspense fallback={<p>Editör yükleniyor…</p>}><HotspotEditor /></Suspense>
      } />}
      <Route element={<AppShell />}>
        <Route index element={<MasterplanPage />} />
        <Route path="block/:blockId" element={<BlockRoute />}>
          {/* Keep the Block scene mounted while Unit and Details overlays swap. */}
          <Route element={<BlockPage />}>
            <Route index element={null} />
            <Route path="unit/:unitId" element={<UnitOverlayRoute />} />
            <Route path="unit/:unitId/details" element={<UnitOverlayRoute showDetails />} />
          </Route>
          {/* Tour keeps its existing full-width surface and Unit validation. */}
          <Route path="unit/:unitId/tour" element={<UnitRoute />}>
            <Route index element={
              <Suspense fallback={<p className="route-loading" role="status">{t('loading.tour')}</p>}><TourPage /></Suspense>
            } />
          </Route>
        </Route>
        <Route path="video" element={
          <Suspense fallback={<p className="route-loading" role="status">{t('loading.video')}</p>}><VideoPage /></Suspense>
        } />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
