import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Section from '../components/Section'
import Tip from '../components/Tip'
import { LAYERS } from '../data/layers'

const layer = LAYERS[8]
const A = layer.accent // violet

// helps framer-motion scale/rotate SVG elements around their own center
const svgT = { transformBox: 'fill-box', transformOrigin: 'center' }

const STATIONS = ['Deposit', 'Coat', 'Expose', 'Develop', 'Etch', 'CMP', 'Metrology']
const RING_T = 5.6 // one full loop of the process ring, seconds

// beam segments: plasma -> M1..M4 -> reticle -> wafer
const BEAM = [
  [70, 122, 140, 178],
  [140, 178, 200, 112],
  [200, 112, 260, 178],
  [260, 178, 320, 112],
  [320, 112, 368, 62],
  [368, 70, 368, 222],
]
const MIRRORS = [
  [140, 178, 14],
  [200, 112, -14],
  [260, 178, 14],
  [320, 112, -38],
]

function makeDies() {
  const out = []
  let i = 0
  for (let y = -76.5; y <= 77; y += 17)
    for (let x = -76.5; x <= 77; x += 17) {
      if (Math.hypot(x, y) > 72) continue
      const h = ((i * 2654435761) >>> 0) % 100
      out.push({ x, y, c: h < 85 ? '#34d399' : h < 94 ? '#fbbf24' : '#f87171' })
      i++
    }
  return out
}

export default function FabLayer() {
  const dies = useMemo(makeDies, [])
  const [prog, setProg] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setProg((p) => (p + 0.018) % 1.12), 120)
    return () => clearInterval(id)
  }, [])

  const revealed = Math.min(dies.length, Math.floor(Math.min(prog, 1) * dies.length))
  const good = dies.slice(0, revealed).filter((d) => d.c === '#34d399').length
  const pct = revealed ? ((good / revealed) * 100).toFixed(1) : '0.0'

  return (
    <Section layer={layer}>
      {/* ambient violet haze */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/3 hidden h-96 w-96 rounded-full blur-3xl sm:block"
        style={{ background: A + '14' }}
      />

      <div className="grid gap-4 lg:grid-cols-5">
        {/* ---- (a) EUV machine cutaway ---- */}
        <motion.div
          className="panel relative p-3 sm:p-4 lg:col-span-3"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-1 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
              EUV scanner · cutaway
            </span>
            <span
              className="hidden rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest sm:inline"
              style={{ borderColor: A + '44', color: A }}
            >
              13.5 nm
            </span>
          </div>

          <svg viewBox="0 0 460 290" className="h-auto w-full">
            {/* housing */}
            <rect x="8" y="10" width="444" height="256" rx="18" fill="rgba(148,163,184,0.04)" stroke="rgba(148,163,184,0.16)" />
            {/* droplet generator */}
            <rect x="62" y="24" width="16" height="18" rx="3" fill="#475569" />
            <line x1="70" y1="42" x2="70" y2="48" stroke="#475569" strokeWidth="2" />
            {/* falling tin droplet (one burst ~every 0.6s — real machines: 50,000/s) */}
            <motion.circle
              cx="70" cy="52" r="2.5" fill="#e2e8f0" style={svgT}
              animate={{ y: [0, 66, 66], opacity: [0, 1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: 'linear', times: [0.05, 0.82, 1] }}
            />
            {/* laser pulse */}
            <motion.line
              x1="18" y1="122" x2="64" y2="122" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round"
              animate={{ opacity: [0, 0, 1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, times: [0, 0.76, 0.84, 0.94] }}
            />
            {/* plasma flash */}
            <motion.circle
              cx="70" cy="122" r="9" fill={A} style={svgT}
              animate={{ scale: [0.2, 0.2, 1.9, 0.4], opacity: [0, 0, 0.95, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, times: [0, 0.82, 0.9, 1] }}
            />
            <motion.circle
              cx="70" cy="122" r="18" fill={A} style={svgT}
              animate={{ scale: [0.3, 0.3, 1.6, 0.5], opacity: [0, 0, 0.3, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, times: [0, 0.84, 0.92, 1] }}
            />
            {/* collector mirror */}
            <path d="M 44 90 A 42 42 0 0 0 44 154" fill="none" stroke="#64748b" strokeWidth="2.5" />

            {/* beam segments lighting up in sequence */}
            {BEAM.map(([x1, y1, x2, y2], i) => {
              const s = 0.08 + i * 0.11
              return (
                <motion.line
                  key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={A} strokeWidth="1.6" strokeLinecap="round"
                  animate={{ opacity: [0, 0, 0.9, 0.9, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, times: [0, s, Math.min(s + 0.05, 0.84), 0.86, 1] }}
                />
              )
            })}
            {/* mirror train */}
            {MIRRORS.map(([x, y, r], i) => (
              <rect
                key={i} x={x - 9} y={y - 2.5} width="18" height="5" rx="1.5"
                fill="#c4b5fd" opacity="0.85" transform={`rotate(${r} ${x} ${y})`}
              />
            ))}
            {/* reticle / photomask */}
            <rect x="350" y="52" width="36" height="9" rx="2" fill="#ddd6fe" opacity="0.85" />
            <line x1="356" y1="56.5" x2="380" y2="56.5" stroke="#6d28d9" strokeWidth="1.5" strokeDasharray="2 3" />

            {/* wafer on stepping stage */}
            <motion.g
              animate={{
                x: [0, 0, 9, 9, 18, 18, 9, 9, 0],
                y: [0, 0, 0, 4, 4, 0, 0, 4, 0],
              }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'linear', times: [0, 0.12, 0.16, 0.32, 0.36, 0.52, 0.56, 0.8, 1] }}
            >
              <rect x="332" y="240" width="66" height="9" rx="2" fill="#334155" />
              <ellipse cx="365" cy="234" rx="27" ry="9" fill="#1e1b4b" stroke="#6366f1" strokeOpacity="0.5" />
              {/* exposure flash at each step */}
              <motion.ellipse
                cx="365" cy="231" rx="6" ry="2.2" fill="#f5f3ff"
                animate={{ opacity: [0, 0.9, 0, 0.9, 0, 0.9, 0, 0.9, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, times: [0.02, 0.07, 0.2, 0.25, 0.4, 0.45, 0.6, 0.65, 1] }}
              />
            </motion.g>

            {/* labels */}
            <text x="90" y="32" fontSize="8" fill="#64748b" className="font-mono">tin droplets</text>
            <text x="14" y="112" fontSize="8" fill="#64748b" className="font-mono">CO₂ laser</text>
            <text x="176" y="200" fontSize="8" fill="#64748b" className="font-mono">mirror train</text>
            <text x="392" y="60" fontSize="8" fill="#64748b" className="font-mono">reticle</text>
            <text x="332" y="262" fontSize="8" fill="#64748b" className="font-mono">wafer stage</text>
          </svg>

          {/* hover hotspots */}
          <Tip
            label="EUV source"
            suppliers="litho-equipment"
            fact="Tin droplets shot twice by a laser, 50,000×/s — each burst makes plasma hotter than the sun's surface."
            accent={A}
            className="absolute left-[5%] top-[16%]"
          >
            <span className="rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest" style={{ borderColor: A + '55', color: A }}>
              source
            </span>
          </Tip>
          <Tip
            label="Mirrors"
            suppliers="litho-equipment"
            fact="The smoothest objects ever made — scaled to the size of Germany, the biggest bump would be 1 mm."
            accent={A}
            className="absolute bottom-[10%] left-[38%]"
          >
            <span className="rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest" style={{ borderColor: A + '55', color: A }}>
              mirrors
            </span>
          </Tip>
          <Tip
            label="Photomask"
            suppliers={['photomasks', 'fab-chemicals']}
            fact="The reticle holds the circuit pattern; light bounces off it and prints a 4× shrunken copy on the wafer."
            accent={A}
            className="absolute right-[5%] top-[16%]"
          >
            <span className="rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest" style={{ borderColor: A + '55', color: A }}>
              mask
            </span>
          </Tip>
        </motion.div>

        {/* ---- right column: process ring + yield map ---- */}
        <div className="grid grid-cols-2 gap-4 lg:col-span-2 lg:grid-cols-1">
          {/* (b) process loop */}
          <motion.div
            className="panel relative p-3"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Tip
              label="Process loop"
              fact="Each pass through deposit → coat → expose → etch → CMP is run on billion-dollar tool fleets and exotic chemistry."
              accent={A}
              suppliers={['wfe-equipment', 'fab-chemicals']}
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 border-b border-dotted border-slate-600">
                process loop
              </span>
            </Tip>
            <svg viewBox="0 0 220 196" className="h-auto w-full">
              <path id="fabring" d="M110 34a62 62 0 1 1 -0.01 0" fill="none" stroke="none" />
              <circle cx="110" cy="96" r="62" fill="none" stroke={A} strokeOpacity="0.35" className="animate-flow" />
              <circle r="3.5" fill={A}>
                <animateMotion dur={`${RING_T}s`} repeatCount="indefinite">
                  <mpath href="#fabring" />
                </animateMotion>
              </circle>
              {STATIONS.map((s, i) => {
                const th = (i * 2 * Math.PI) / STATIONS.length
                const cx = 110 + 62 * Math.sin(th)
                const cy = 96 - 62 * Math.cos(th)
                const lx = 110 + 86 * Math.sin(th)
                const ly = 96 - 86 * Math.cos(th)
                return (
                  <g key={s}>
                    <motion.circle
                      cx={cx} cy={cy} r="5" fill="#0f172a" stroke={A} strokeWidth="1.5" style={svgT}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.8, repeat: Infinity, repeatDelay: RING_T - 0.8, delay: (i * RING_T) / STATIONS.length }}
                    />
                    <text x={lx} y={ly + 2.5} fontSize="8" fill="#94a3b8" textAnchor="middle" className="font-mono">
                      {s}
                    </text>
                  </g>
                )
              })}
            </svg>
            <p className="text-center font-mono text-[9px] uppercase tracking-widest text-slate-500">
              ~1,000 loops per wafer
            </p>
          </motion.div>

          {/* (c) wafer yield map */}
          <motion.div
            className="panel relative p-3"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                yield map
              </span>
              <Tip
                label="Yield"
                suppliers={['metrology', 'test-equipment']}
                fact="Not every die survives. A single dust mote or focus wobble kills a chip — yield is the fab's report card."
                accent={A}
              >
                <span className="font-mono text-xs tabular-nums" style={{ color: A }}>
                  {pct}%
                </span>
              </Tip>
            </div>
            <svg viewBox="-100 -100 200 200" className="mx-auto h-auto w-full max-w-[210px]">
              <circle r="88" fill="rgba(148,163,184,0.05)" stroke="#475569" />
              <path d="M -12 87.2 L 12 87.2" stroke="#475569" strokeWidth="3" />
              {dies.map((d, i) => (
                <rect
                  key={i}
                  x={d.x - 7} y={d.y - 7} width="14" height="14" rx="1.5"
                  fill={d.c}
                  opacity={i < revealed ? 0.8 : 0.07}
                  className="transition-opacity duration-300"
                />
              ))}
            </svg>
            <div className="flex justify-center gap-3 font-mono text-[8px] uppercase tracking-widest text-slate-500">
              <span><span className="mr-1 inline-block h-1.5 w-1.5 rounded-[2px] bg-emerald-400" />good</span>
              <span><span className="mr-1 inline-block h-1.5 w-1.5 rounded-[2px] bg-amber-400" />binned</span>
              <span><span className="mr-1 inline-block h-1.5 w-1.5 rounded-[2px] bg-red-400" />dead</span>
            </div>
          </motion.div>
        </div>

        {/* ---- (d) cleanroom strip ---- */}
        <motion.div
          className="panel relative p-3 lg:col-span-5"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg viewBox="0 0 640 84" className="h-auto w-full">
            {/* overhead rail */}
            <line x1="0" y1="14" x2="640" y2="14" stroke="#475569" strokeWidth="2" strokeDasharray="10 6" />
            {/* FOUP pod gliding on the rail */}
            <motion.g
              animate={{ x: [-40, 680] }}
              transition={{ duration: 11, repeat: Infinity, ease: 'linear' }}
            >
              <line x1="14" y1="15" x2="14" y2="26" stroke="#94a3b8" strokeWidth="2" />
              <rect x="0" y="26" width="28" height="20" rx="4" fill={A + '22'} stroke={A + '99'} />
              <line x1="6" y1="32" x2="22" y2="32" stroke={A} strokeOpacity="0.5" />
              <line x1="6" y1="37" x2="22" y2="37" stroke={A} strokeOpacity="0.5" />
              <line x1="6" y1="42" x2="22" y2="42" stroke={A} strokeOpacity="0.5" />
            </motion.g>
            {/* bunny-suit crew */}
            {[150, 330, 480].map((bx, i) => (
              <motion.g
                key={bx}
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.8, ease: 'easeInOut' }}
              >
                <circle cx={bx} cy="42" r="6" fill="#e2e8f0" opacity="0.85" />
                <rect x={bx - 4} y="40" width="8" height="3.5" rx="1.5" fill="#312e81" />
                <rect x={bx - 8} y="48" width="16" height="24" rx="7" fill="#e2e8f0" opacity="0.75" />
                <rect x={bx - 6} y="70" width="4.5" height="8" rx="2" fill="#e2e8f0" opacity="0.7" />
                <rect x={bx + 1.5} y="70" width="4.5" height="8" rx="2" fill="#e2e8f0" opacity="0.7" />
              </motion.g>
            ))}
            <line x1="0" y1="79" x2="640" y2="79" stroke="#334155" strokeWidth="1.5" />
            <text x="8" y="72" fontSize="8" fill="#64748b" className="font-mono">ISO class 1 — cleaner than surgery</text>
          </svg>
          <Tip
            label="FOUP"
            suppliers={['fab-materials', 'fab-components']}
            fact="Wafers commute in sealed pods on ceiling rails — robots hand them between tools, humans never touch them."
            accent={A}
            className="absolute right-3 top-2"
          >
            <span className="rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest" style={{ borderColor: A + '55', color: A }}>
              foup
            </span>
          </Tip>
        </motion.div>
      </div>
    </Section>
  )
}
