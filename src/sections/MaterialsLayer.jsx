import { motion } from 'framer-motion'
import Section from '../components/Section'
import Tip from '../components/Tip'
import { LAYERS } from '../data/layers'

const layer = LAYERS[9]

const Caption = ({ children }) => (
  <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-slate-500">
    {children}
  </p>
)

// abstract dotted continents: ellipse blobs on a 460x220 map
const BLOBS = [
  { cx: 95, cy: 85, rx: 45, ry: 48 }, // north america
  { cx: 125, cy: 165, rx: 22, ry: 38 }, // south america
  { cx: 225, cy: 70, rx: 30, ry: 26 }, // europe
  { cx: 235, cy: 140, rx: 32, ry: 42 }, // africa
  { cx: 330, cy: 85, rx: 62, ry: 44 }, // asia
  { cx: 390, cy: 180, rx: 24, ry: 15 }, // australia
]
const inBlob = (x, y) =>
  BLOBS.some(
    (b) => ((x - b.cx) / b.rx) ** 2 + ((y - b.cy) / b.ry) ** 2 <= 1
  )
const MAP_DOTS = (() => {
  const dots = []
  for (let x = 10; x < 460; x += 9) {
    for (let y = 10; y < 220; y += 9) {
      // jitter deterministically so the grid feels organic
      const jx = ((x * 13 + y * 7) % 5) - 2
      if (inBlob(x, y)) dots.push([x + jx, y])
    }
  }
  return dots
})()

const HUB = { x: 372, y: 108 } // "the fab"
const SOURCES = [
  { label: 'quartz', x: 80, y: 60, sup: 'polysilicon-quartz', fact: 'High-purity quartz for crucibles comes largely from one small region of North Carolina.' },
  { label: 'copper', x: 120, y: 185, sup: 'miners-metals', fact: 'Chilean copper becomes the microscopic wiring inside every chip.' },
  { label: 'neon', x: 240, y: 55, sup: 'industrial-gases', fact: 'Lithography lasers breathe neon — a byproduct of steelmaking, once mostly from Ukraine.' },
  { label: 'cobalt', x: 235, y: 160, sup: 'miners-metals', fact: 'Cobalt lines the deepest interconnect layers, atoms thick.' },
  { label: 'rare earths', x: 315, y: 70, sup: 'rare-earths', fact: 'Magnets, polishing slurries, lasers — rare earths hide in every tool.' },
  { label: 'wafers', x: 420, y: 70, sup: 'wafer-makers', fact: 'A handful of companies grow nearly all of the world’s 300 mm wafers.' },
  { label: 'OSAT', x: 355, y: 185, sup: ['advanced-packaging', 'abf-substrates'], fact: 'Assembly, packaging and test — the quiet last mile of every chip.' },
]

export default function MaterialsLayer() {
  return (
    <Section layer={layer}>
      <div className="grid gap-4 lg:grid-cols-5">
        {/* world map with supply arcs */}
        <div className="panel p-5 lg:col-span-3">
          <Caption>Planetary supply routes → the fab</Caption>
          <svg viewBox="0 0 460 220" className="h-auto w-full">
            {MAP_DOTS.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="1.4" fill="#34d399" opacity="0.16" />
            ))}
            {SOURCES.map((s, i) => {
              const mx = (s.x + HUB.x) / 2
              const my = Math.min(s.y, HUB.y) - 36
              const d = `M ${s.x} ${s.y} Q ${mx} ${my} ${HUB.x} ${HUB.y}`
              return (
                <g key={s.label}>
                  <motion.path
                    id={`route-${i}`}
                    d={d}
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="1"
                    strokeOpacity="0.45"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.3 + i * 0.18 }}
                  />
                  <circle r="2.2" fill="#6ee7b7">
                    <animateMotion
                      dur={`${3 + (i % 3)}s`}
                      begin={`${i * 0.6}s`}
                      repeatCount="indefinite"
                    >
                      <mpath href={`#route-${i}`} />
                    </animateMotion>
                  </circle>
                  <circle cx={s.x} cy={s.y} r="3" fill="#34d399" />
                  <text
                    x={s.x}
                    y={s.y + (s.y > 170 ? 14 : -8)}
                    textAnchor="middle"
                    fontSize="8.5"
                    fontFamily="monospace"
                    fill="#86efac"
                  >
                    {s.label}
                  </text>
                </g>
              )
            })}
            {/* the fab hub */}
            <motion.circle
              cx={HUB.x}
              cy={HUB.y}
              r="6"
              fill="#34d399"
              animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.25, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ transformOrigin: `${HUB.x}px ${HUB.y}px` }}
            />
            <text
              x={HUB.x + 10}
              y={HUB.y + 3}
              fontSize="9"
              fontFamily="monospace"
              fill="#d1fae5"
            >
              fab
            </text>
          </svg>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {SOURCES.filter((s) => s.sup).map((s) => (
              <Tip key={s.label} label={s.label} fact={s.fact} accent={layer.accent} suppliers={s.sup}>
                <span className="cursor-default font-mono text-[10px] uppercase tracking-wider text-emerald-300/70 underline decoration-dotted underline-offset-4">
                  {s.label}
                </span>
              </Tip>
            ))}
            <Tip
              label="Ultrapure water"
              suppliers="water-treatment"
              fact="A fab drinks millions of gallons a day — filtered until it's cleaner than anything you've ever touched."
              accent={layer.accent}
            >
              <span className="cursor-default font-mono text-[10px] uppercase tracking-wider text-emerald-300/70 underline decoration-dotted underline-offset-4">
                UPW
              </span>
            </Tip>
          </div>
        </div>

        {/* Czochralski pull */}
        <div className="panel p-5 lg:col-span-2">
          <Caption>Czochralski · growing the crystal</Caption>
          <div className="flex items-end justify-center gap-8">
            <Tip
              label="Czochralski process"
              suppliers="wafer-makers"
              fact="A seed crystal touches molten silicon and is pulled up at ~1 mm/min, rotating — atoms line up behind it into one perfect 300 mm crystal."
              accent={layer.accent}
            >
              <svg viewBox="0 0 120 190" className="h-auto w-[120px]">
                {/* pull rod + growing ingot, slowly rising then reset */}
                <motion.g
                  animate={{ y: [26, -14] }}
                  transition={{
                    repeat: Infinity,
                    duration: 7,
                    ease: 'linear',
                    repeatType: 'loop',
                  }}
                >
                  <rect x="57" y="-40" width="6" height="60" fill="#475569" />
                  <rect x="52" y="20" width="16" height="14" rx="3" fill="#34d399" opacity="0.5" />
                  <motion.rect
                    x="44"
                    y="34"
                    width="32"
                    height="76"
                    rx="10"
                    fill="#34d399"
                    opacity="0.85"
                    animate={{ scaleX: [0.98, 1.02, 0.98] }}
                    transition={{ repeat: Infinity, duration: 2.4 }}
                    style={{ transformOrigin: '60px 70px' }}
                  />
                </motion.g>
                {/* crucible of melt */}
                <path d="M 20 140 L 28 172 Q 60 184 92 172 L 100 140 Z" fill="#0f2a22" stroke="#34d399" strokeOpacity="0.5" />
                <motion.ellipse
                  cx="60"
                  cy="142"
                  rx="39"
                  ry="8"
                  fill="#fbbf24"
                  animate={{ opacity: [0.5, 0.9, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2.2 }}
                />
                <text x="60" y="186" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#64748b">
                  1,414&#176;C melt
                </text>
              </svg>
            </Tip>

            {/* slicing into wafers */}
            <Tip
              label="Wafer slicing"
              suppliers="wafer-makers"
              fact="Diamond wire saws shave the ingot into wafers less than a millimeter thick — then they're polished to atomic smoothness."
              accent={layer.accent}
            >
              <svg viewBox="0 0 90 190" className="hidden h-auto w-[90px] sm:block">
                <rect x="30" y="16" width="30" height="70" rx="9" fill="#34d399" opacity="0.7" />
                {[0, 1, 2].map((i) => (
                  <line
                    key={i}
                    x1="30"
                    y1={36 + i * 16}
                    x2="60"
                    y2={36 + i * 16}
                    stroke="#04040c"
                    strokeWidth="1.5"
                  />
                ))}
                {[0, 1, 2, 3].map((i) => (
                  <motion.ellipse
                    key={i}
                    cx="45"
                    cy={110 + i * 18}
                    rx="16"
                    ry="4.5"
                    fill="none"
                    stroke="#6ee7b7"
                    strokeWidth="1.2"
                    initial={{ opacity: 0, y: -18 }}
                    whileInView={{ opacity: [0, 1, 1], y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.9 + i * 0.28 }}
                  />
                ))}
                <text x="45" y="186" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#64748b">
                  wafers
                </text>
              </svg>
            </Tip>
          </div>

          {/* transformation strip */}
          <div className="mt-5 flex items-center justify-center gap-1.5">
            {['quartz', 'polysilicon', 'ingot', 'wafer'].map((step, i) => (
              <div key={step} className="flex items-center gap-1.5">
                <Tip
                  label={step}
                  suppliers={i < 2 ? 'polysilicon-quartz' : 'wafer-makers'}
                  fact={
                    i === 0
                      ? 'SiO₂ — beach sand’s fancier cousin, mined as lumps of quartzite.'
                      : i === 1
                        ? 'Refined to 9N purity: 99.9999999%. One wrong atom per billion.'
                        : i === 2
                          ? 'A single crystal weighing hundreds of kilograms, flawless to the atom.'
                          : 'The blank canvas — 300 mm of mirror-polished silicon.'
                  }
                  accent={layer.accent}
                >
                  <span className="rounded-md bg-emerald-500/10 px-2 py-1.5 font-mono text-[10px] uppercase tracking-wider text-emerald-200 ring-1 ring-emerald-400/30">
                    {step}
                  </span>
                </Tip>
                {i < 3 && (
                  <svg width="12" height="8" viewBox="0 0 12 8" className="shrink-0 text-slate-600">
                    <path d="M0 4h8m0 0L5 1m3 3L5 7" stroke="currentColor" fill="none" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
