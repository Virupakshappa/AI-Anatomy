import { useContext, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ActiveContext } from '../lib/active'
import StatChip from './StatChip'

// Full-viewport layer section: renders the standard header (kicker, title,
// tagline, stat chips) and reports visibility to the DepthGauge. Scenes are
// passed as children and render below the header.
export default function Section({ layer, children }) {
  const ref = useRef(null)
  const { setActive } = useContext(ActiveContext)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setActive(layer.index)),
      { rootMargin: '-45% 0px -45% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [layer.index, setActive])

  return (
    <section
      ref={ref}
      id={layer.id}
      className="relative flex min-h-screen snap-start flex-col items-center justify-center overflow-hidden px-5 py-24 sm:px-10"
    >
      <div className="relative z-10 w-full max-w-6xl">
        <motion.header
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className="font-mono text-[11px] uppercase tracking-[0.35em]"
            style={{ color: layer.accent }}
          >
            Layer {String(layer.index + 1).padStart(2, '0')} · {layer.kicker}
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-100 sm:text-6xl">
            {layer.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-400 sm:text-lg">
            {layer.tagline}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {layer.stats.map((s) => (
              <StatChip key={s} label={s} accent={layer.accent} />
            ))}
          </div>
        </motion.header>
        <div className="relative mt-8 sm:mt-10">{children}</div>
      </div>
    </section>
  )
}
