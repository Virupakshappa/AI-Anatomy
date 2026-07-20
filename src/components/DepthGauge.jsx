import { motion } from 'framer-motion'
import { LAYERS } from '../data/layers'

const PITCH = 32 // row height (28) + gap (4)

// Fixed elevator-style depth indicator on the right edge.
export default function DepthGauge({ active }) {
  return (
    <nav
      aria-label="Depth"
      className="fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 md:block lg:right-6"
    >
      <div className="relative flex flex-col gap-1">
        {/* track */}
        <div className="absolute right-[2.5px] top-2 bottom-2 w-px bg-slate-800/70" />
        {/* elevator car: ring around the active dot */}
        <motion.div
          className="absolute -right-[4.5px] h-4 w-4 rounded-full border"
          style={{ borderColor: LAYERS[active]?.accent ?? '#22d3ee' }}
          animate={{ y: active * PITCH + 6 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        />
        {LAYERS.map((l) => {
          const isActive = active === l.index
          return (
            <button
              key={l.id}
              onClick={() =>
                document
                  .getElementById(l.id)
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              className="group flex h-7 items-center justify-end gap-2.5"
              aria-label={`Go to ${l.name} layer`}
            >
              <span
                className={`font-mono text-[10px] uppercase tracking-wider transition-colors ${
                  isActive ? '' : 'text-slate-600 group-hover:text-slate-400'
                }`}
                style={isActive ? { color: l.accent } : undefined}
              >
                {l.name}
              </span>
              <span
                className="h-1.5 w-1.5 rounded-full transition-colors"
                style={{ background: isActive ? l.accent : '#334155' }}
              />
            </button>
          )
        })}
      </div>
    </nav>
  )
}
