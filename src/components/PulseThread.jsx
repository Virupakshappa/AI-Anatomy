import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

// The persistent "data pulse": a glowing line on the left edge that fills as
// you descend the stack, with a bright head dot at the current depth.
export default function PulseThread() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 22 })
  const headTop = useTransform(progress, (v) => `${v * 100}%`)

  return (
    <div className="pointer-events-none fixed inset-y-0 left-4 z-20 hidden w-px sm:block md:left-8">
      <div className="absolute inset-0 bg-slate-800/60" />
      <motion.div
        className="absolute inset-x-0 top-0 h-full origin-top bg-gradient-to-b from-cyan-400 via-violet-400 to-amber-300"
        style={{ scaleY: progress }}
      />
      <motion.div
        className="absolute -left-[3.5px] h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_14px_3px_rgba(34,211,238,0.8)]"
        style={{ top: headTop }}
      />
    </div>
  )
}
