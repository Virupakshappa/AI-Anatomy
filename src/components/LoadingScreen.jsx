import { motion } from 'framer-motion'

// Fullscreen overlay with a spinning silicon-wafer die map.
export default function LoadingScreen() {
  const dies = []
  for (let gx = 0; gx < 8; gx++) {
    for (let gy = 0; gy < 8; gy++) {
      const o = 0.15 + (((gx * 7 + gy * 13) % 10) / 10) * 0.55
      dies.push(
        <rect
          key={`${gx}-${gy}`}
          x={7 + gx * 11}
          y={7 + gy * 11}
          width={9}
          height={9}
          rx={1}
          fill="#22d3ee"
          opacity={o}
        />
      )
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#04040c]"
      exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeOut' } }}
    >
      <motion.svg
        width="104"
        height="104"
        viewBox="0 0 100 100"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 7, ease: 'linear' }}
      >
        <defs>
          <clipPath id="waferClip">
            <circle cx="50" cy="50" r="45" />
          </clipPath>
        </defs>
        <circle cx="50" cy="50" r="46" fill="#0b0b1e" stroke="#334155" />
        <g clipPath="url(#waferClip)">{dies}</g>
        {/* wafer notch */}
        <rect x="45" y="0" width="10" height="5" fill="#04040c" />
        <circle cx="50" cy="50" r="46" fill="none" stroke="#475569" strokeWidth="1.5" />
      </motion.svg>
      <motion.p
        className="mt-7 font-mono text-[11px] uppercase tracking-[0.4em] text-slate-500"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
      >
        Fabbing interface…
      </motion.p>
    </motion.div>
  )
}
