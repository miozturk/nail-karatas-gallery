warning: in the working copy of 'src/app/AppShell.tsx', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'src/features/blocks/BlockPage.tsx', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/src/app/AppShell.tsx b/src/app/AppShell.tsx[m
[1mindex 0004747..0b70610 100644[m
[1m--- a/src/app/AppShell.tsx[m
[1m+++ b/src/app/AppShell.tsx[m
[36m@@ -1,12 +1,16 @@[m
[31m-import { NavLink, Outlet } from 'react-router-dom'[m
[32m+[m[32mimport { NavLink, Outlet, useMatch } from 'react-router-dom'[m
[32m+[m[32mimport { blocks } from '../data'[m
 [m
 export default function AppShell() {[m
[32m+[m[32m  const blockRoute = useMatch('/block/:blockId')[m
[32m+[m[32m  const hasBlockHome = blocks.some((block) => block.id === blockRoute?.params.blockId)[m
   return ([m
     <>[m
       <header className="app-header">[m
         <p>Nail Karataş Gallery</p>[m
         <nav aria-label="Global navigation">[m
[31m-          <NavLink to="/" end>Home</NavLink>[m
[32m+[m[32m          {/* The block's contextual Home owns reverse playback. */}[m
[32m+[m[32m          {!hasBlockHome && <NavLink to="/" end>Home</NavLink>}[m
           <NavLink to="/video">Video</NavLink>[m
         </nav>[m
       </header>[m
[1mdiff --git a/src/features/blocks/BlockPage.tsx b/src/features/blocks/BlockPage.tsx[m
[1mindex e65707f..64237b9 100644[m
[1m--- a/src/features/blocks/BlockPage.tsx[m
[1m+++ b/src/features/blocks/BlockPage.tsx[m
[36m@@ -1,20 +1,59 @@[m
[31m-import { Link, useParams } from 'react-router-dom'[m
[31m-import { units } from '../../data'[m
[32m+[m[32mimport { useRef, useState } from 'react'[m
[32m+[m[32mimport { useNavigate, useParams } from 'react-router-dom'[m
[32m+[m[32mimport { blocks } from '../../data'[m
[32m+[m[32mimport NotFoundPage from '../../app/NotFoundPage'[m
[32m+[m[32mimport SceneStage from '../../components/SceneStage/SceneStage'[m
[32m+[m[32mimport TransitionLayer from '../../components/TransitionLayer/TransitionLayer'[m
[32m+[m[32mimport { developmentReverseVideo } from './developmentMedia'[m
[32m+[m[32mimport './BlockPage.css'[m
 [m
 export default function BlockPage() {[m
   const { blockId } = useParams()[m
[32m+[m[32m  const navigate = useNavigate()[m
[32m+[m[32m  const pending = useRef(false)[m
[32m+[m[32m  const [isTransitioning, setIsTransitioning] = useState(false)[m
[32m+[m[32m  const block = blocks.find((item) => item.id === blockId)[m
[32m+[m
[32m+[m[32m  const returnHome = () => {[m
[32m+[m[32m    if (!pending.current) return[m
[32m+[m[32m    pending.current = false[m
[32m+[m[32m    setIsTransitioning(false)[m
[32m+[m[32m    void navigate('/')[m
[32m+[m[32m  }[m
[32m+[m[32m  const activateHome = () => {[m
[32m+[m[32m    // Protect even repeated activation before disabled is rendered.[m
[32m+[m[32m    if (pending.current) return[m
[32m+[m[32m    pending.current = true[m
[32m+[m[32m    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {[m
[32m+[m[32m      returnHome()[m
[32m+[m[32m      return[m
[32m+[m[32m    }[m
[32m+[m[32m    setIsTransitioning(true)[m
[32m+[m[32m  }[m
[32m+[m
[32m+[m[32m  if (!block) return <NotFoundPage />[m
[32m+[m
   return ([m
     <>[m
[31m-      <h1>Block</h1>[m
[31m-      <p>Blok yer tutucusu. blockId: {blockId}</p>[m
[31m-      <Link to="/">Home</Link>[m
[31m-      <ul>[m
[31m-        {units.filter((unit) => unit.blockId === blockId && unit.demoEnabled).map((unit) => ([m
[31m-          <li key={unit.id}>[m
[31m-            <Link to={`/block/${blockId}/unit/${unit.id}`}>{unit.id}</Link>[m
[31m-          </li>[m
[31m-        ))}[m
[31m-      </ul>[m
[32m+[m[32m      <h1>{block.name} Blok</h1>[m
[32m+[m[32m      <p>{block.category === 'commercial' ? 'Ticari' : 'Konut'} · Geliştirme sahnesi</p>[m
[32m+[m[32m      <button className="block-scene__home" type="button" disabled={isTransitioning}[m
[32m+[m[32m        onClick={activateHome}>Home — Ana görünüme dön</button>[m
[32m+[m[32m      <p role="status">{isTransitioning[m
[32m+[m[32m        ? 'Geliştirme geri dönüş videosu oynatılıyor — Home kilitli.'[m
[32m+[m[32m        : 'Geri dönüş hazır — Home açık.'}</p>[m
[32m+[m[32m      <figure className="block-scene">[m
[32m+[m[32m        <SceneStage label={`${block.name} Blok geliştirme sahnesi: 1920 × 1440`}[m
[32m+[m[32m          base={<div className="block-scene__background">[m
[32m+[m[32m            <strong>{block.name}</strong>[m
[32m+[m[32m            <span>GELİŞTİRME SAHNESİ</span>[m
[32m+[m[32m          </div>}[m
[32m+[m[32m          overlay={<TransitionLayer src={developmentReverseVideo} active={isTransitioning}[m
[32m+[m[32m            label="Geliştirme geri dönüş videosu"[m
[32m+[m[32m            onComplete={returnHome} onFailure={returnHome} />}[m
[32m+[m[32m        />[m
[32m+[m[32m        <figcaption>1920 × 1440 · 4:3 · Temsili geliştirme görseli ve videosu; gerçek proje medyası değildir.</figcaption>[m
[32m+[m[32m      </figure>[m
     </>[m
   )[m
 }[m
