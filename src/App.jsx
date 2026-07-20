import { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ActiveContext } from './lib/active'
import { LAYERS } from './data/layers'
import DepthGauge from './components/DepthGauge'
import LoadingScreen from './components/LoadingScreen'
import PulseThread from './components/PulseThread'
import Starfield from './components/Starfield'
import UserLayer from './sections/UserLayer'

// Layer 1 loads eagerly (it's above the fold); everything deeper is lazy.
const deep = [
  lazy(() => import('./sections/ApiEdgeLayer')),
  lazy(() => import('./sections/ServingLayer')),
  lazy(() => import('./sections/ModelLayer')),
  lazy(() => import('./sections/TrainingLayer')),
  lazy(() => import('./sections/DatacenterLayer')),
  lazy(() => import('./sections/ServerLayer')),
  lazy(() => import('./sections/ChipLayer')),
  lazy(() => import('./sections/FabLayer')),
  lazy(() => import('./sections/MaterialsLayer')),
  lazy(() => import('./sections/EnergyLayer')),
  lazy(() => import('./sections/EarthLayer')),
]

export default function App() {
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState(0)
  const ctx = useMemo(() => ({ setActive }), [])

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1700)
    return () => clearTimeout(t)
  }, [])

  return (
    <ActiveContext.Provider value={ctx}>
      <AnimatePresence>{loading && <LoadingScreen key="loader" />}</AnimatePresence>

      <Starfield />
      {/* nebula vignette over the starfield */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 55% at 50% -10%, rgba(56,189,248,0.08), transparent 60%), radial-gradient(ellipse 70% 50% at 50% 110%, rgba(251,146,60,0.06), transparent 60%)',
        }}
      />

      <PulseThread />
      <DepthGauge active={active} />

      <main className="relative z-10">
        <UserLayer />
        {deep.map((C, i) => (
          <Suspense
            key={LAYERS[i + 1].id}
            fallback={<div className="min-h-screen" />}
          >
            <C />
          </Suspense>
        ))}
      </main>

      <footer className="relative z-10 pb-10 pt-2 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-600">
          All numbers approximate &amp; illustrative · React + Tailwind + Framer Motion
        </p>
      </footer>
    </ActiveContext.Provider>
  )
}
