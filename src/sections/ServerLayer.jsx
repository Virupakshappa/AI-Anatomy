import { motion } from 'framer-motion'
import Section from '../components/Section'
import Tip from '../components/Tip'
import { LAYERS } from '../data/layers'

const layer = LAYERS[6]

const CENTER = 3 // plates start collapsed toward this index, then explode apart
const spring = { type: 'spring', stiffness: 80, damping: 15 }
const view = { once: true, margin: '-15% 0px' }

const fanGlyph = (
  <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none">
    <circle cx="12" cy="12" r="8.5" opacity="0.45" />
    <path d="M12 4v6M12 14v6M4 12h6M14 12h6" />
  </g>
)

/* ---------- plate bodies ---------- */

function LidPlate() {
  return (
    <div
      className="h-5 w-full rounded-lg border border-slate-600/50 bg-slate-800/80"
      style={{
        backgroundImage:
          'repeating-linear-gradient(90deg, rgb(148 163 184 / 0.08) 0 2px, transparent 2px 9px)',
      }}
    />
  )
}

function GpuPlate() {
  return (
    <div className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-amber-400/30 bg-slate-900/85 px-2 py-2 sm:gap-2">
      <Tip
        label="GPU"
        suppliers="gpu-accelerators"
        fact="~700 W each — eight of them draw more power than a suburban house."
        accent={layer.accent}
      >
        <span className="flex items-end gap-1 sm:gap-1.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="relative block h-11 w-5 overflow-hidden rounded-sm border border-slate-600/60 bg-slate-800 sm:h-14 sm:w-8"
            >
              {/* heatsink fins */}
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-2/3"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(90deg, rgb(100 116 139 / 0.65) 0 1px, transparent 1px 3px)',
                }}
              />
              <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-slate-700/80" />
              {/* idle heat glow */}
              <motion.span
                aria-hidden
                className="absolute inset-0 bg-amber-400/30"
                animate={{ opacity: [0.05, 0.5, 0.05] }}
                transition={{
                  repeat: Infinity,
                  duration: 2.3,
                  delay: i * 0.28,
                  ease: 'easeInOut',
                }}
              />
            </span>
          ))}
        </span>
      </Tip>
      <Tip
        label="HBM"
        suppliers="hbm-memory"
        fact="DRAM dies stacked like pancakes, wired together by thousands of through-silicon vias."
        accent={layer.accent}
        className="ml-1"
      >
        <span className="rounded border border-amber-400/40 bg-amber-400/10 px-1 py-0.5 font-mono text-[8px] tracking-widest text-amber-300 [writing-mode:vertical-rl] sm:[writing-mode:horizontal-tb]">
          HBM
        </span>
      </Tip>
    </div>
  )
}

function NvlinkPlate() {
  return (
    <Tip
      label="NVLink"
      suppliers="chip-interconnect"
      fact="GPUs gossip at 900 GB/s — RAM-speed bandwidth, but between separate chips."
      accent={layer.accent}
      className="w-full"
    >
      <span className="mx-auto flex h-6 w-[92%] items-center justify-center rounded-md border border-amber-300/40 bg-gradient-to-r from-amber-500/15 via-amber-300/25 to-amber-500/15">
        <span
          aria-hidden
          className="h-1.5 w-4/5 rounded-full opacity-70"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, rgb(252 211 77 / 0.8) 0 4px, transparent 4px 14px)',
          }}
        />
      </span>
    </Tip>
  )
}

function CpuPlate() {
  const sticks = (key) => (
    <span key={key} className="flex items-center gap-1">
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className="h-9 w-1.5 rounded-sm border-t-2 border-emerald-400/50 bg-slate-700"
        />
      ))}
    </span>
  )
  return (
    <Tip
      label="CPU + RAM"
      fact="Two host CPUs shepherd the GPUs and stage data through ~2 TB of DDR5 — the accelerators' concierge desk."
      accent={layer.accent}
      suppliers={['cpus', 'memory-storage']}
      className="w-full"
    >
      <span className="flex h-14 w-full items-center justify-center gap-3 rounded-lg border border-slate-600/50 bg-slate-900/85 sm:gap-5">
        {sticks('a')}
        {['CPU 0', 'CPU 1'].map((c) => (
          <span
            key={c}
            className="grid h-9 w-10 place-items-center rounded border border-slate-500/60 bg-slate-800 font-mono text-[7px] tracking-wider text-slate-400 sm:w-12"
          >
            {c}
          </span>
        ))}
        {sticks('b')}
      </span>
    </Tip>
  )
}

function NicPlate() {
  return (
    <Tip
      label="NIC"
      suppliers={['nics-dpus', 'connectors-cabling']}
      fact="400 Gb/s each — enough to move a feature film every second, and there are eight of them."
      accent={layer.accent}
      className="w-full"
    >
      <span className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-600/50 bg-slate-900/85 sm:gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className={`relative h-6 w-9 rounded-sm border border-slate-600/70 bg-slate-800 ${
              i > 3 ? 'hidden sm:block' : ''
            }`}
          >
            <span className="absolute bottom-1 left-1 h-1.5 w-2.5 bg-slate-950 ring-1 ring-slate-600/60" />
            <span className="absolute bottom-1 left-4.5 h-1.5 w-2.5 bg-slate-950 ring-1 ring-slate-600/60" />
            <span
              className="led absolute right-1 top-1 h-1 w-1 rounded-full bg-emerald-400"
              style={{ animationDelay: `${(i * 0.55) % 1.8}s`, boxShadow: '0 0 5px #34d399' }}
            />
          </span>
        ))}
      </span>
    </Tip>
  )
}

function PsuPlate() {
  return (
    <Tip
      label="PSU"
      suppliers={['power-supplies', 'power-semis']}
      fact="Six 3 kW supplies in N+N redundancy — the node sips ~10 kW flat out, a hair dryer times seven."
      accent={layer.accent}
      className="w-full"
    >
      <span className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-slate-600/50 bg-slate-900/85 sm:gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="grid h-9 w-12 place-items-center rounded-sm border border-slate-600/70 bg-slate-800 sm:w-14"
          >
            <motion.svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              className="text-slate-500"
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 4.5 + i * 0.6,
                ease: 'linear',
              }}
            >
              {fanGlyph}
            </motion.svg>
          </span>
        ))}
      </span>
    </Tip>
  )
}

function ChassisPlate() {
  return (
    <Tip
      label="Chassis"
      fact="Assembled by ODMs most people have never heard of — Foxconn alone builds ~40% of the world's AI servers."
      accent={layer.accent}
      suppliers="server-odms"
      className="w-full"
    >
      <span className="relative block h-8 w-full min-w-[14rem] rounded-lg border border-slate-600/60 bg-slate-900/90">
      <span
        aria-hidden
        className="absolute inset-x-3 inset-y-2 rounded-sm opacity-70"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgb(51 65 85 / 0.9) 0 3px, transparent 3px 10px)',
        }}
      />
      <span
        className="led absolute right-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-emerald-400"
        style={{ boxShadow: '0 0 6px #34d399' }}
      />
      </span>
    </Tip>
  )
}

const PLATES = [
  { id: 'lid', name: 'Top lid', side: 'left', Body: LidPlate },
  { id: 'gpu', name: '8× GPU · HBM3e', side: 'right', Body: GpuPlate },
  { id: 'nvlink', name: 'NVLink bridge', side: 'left', Body: NvlinkPlate },
  { id: 'cpu', name: '2× CPU · 2 TB RAM', side: 'right', Body: CpuPlate },
  { id: 'nic', name: '8× 400G NIC', side: 'left', Body: NicPlate },
  { id: 'psu', name: '6× 3 kW PSU', side: 'right', Body: PsuPlate },
  { id: 'chassis', name: 'Chassis', side: 'left', Body: ChassisPlate },
]

/* ---------- leader line + label (desktop only) ---------- */

function LeaderLabel({ text, side, delay }) {
  const line = (
    <svg width="42" height="2" viewBox="0 0 42 2" className="shrink-0">
      <motion.line
        x1="0"
        y1="1"
        x2="42"
        y2="1"
        stroke={layer.accent}
        strokeOpacity="0.55"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={view}
        transition={{ duration: 0.45, delay }}
        style={{ originX: side === 'left' ? 1 : 0 }}
      />
    </svg>
  )
  const label = (
    <motion.span
      className="whitespace-nowrap font-mono text-[10px] uppercase tracking-widest text-slate-400"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={view}
      transition={{ duration: 0.4, delay: delay + 0.3 }}
    >
      {text}
    </motion.span>
  )
  return side === 'left' ? (
    <>
      {label}
      {line}
    </>
  ) : (
    <>
      {line}
      {label}
    </>
  )
}

export default function ServerLayer() {
  return (
    <Section layer={layer}>
      <div className="relative mx-auto max-w-4xl">
        {/* ambient glow */}
        <div
          aria-hidden
          className="absolute inset-x-8 top-1/4 bottom-1/4 rounded-full bg-amber-500/[0.07] blur-3xl"
        />

        <div className="relative flex flex-col gap-2.5 sm:gap-3">
          {PLATES.map(({ id, name, side, Body }, i) => (
            <div
              key={id}
              className="grid items-center gap-2 lg:grid-cols-[150px_minmax(0,1fr)_150px]"
            >
              {/* left leader label */}
              <div className="hidden items-center justify-end gap-2 lg:flex">
                {side === 'left' && (
                  <LeaderLabel text={name} side="left" delay={1 + i * 0.08} />
                )}
              </div>

              {/* the plate: flies apart from the collapsed stack */}
              <motion.div
                initial={{ y: (CENTER - i) * 42, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={view}
                transition={{ ...spring, delay: 0.15 + i * 0.1 }}
              >
                <div className="[transform:perspective(900px)_rotateX(24deg)] drop-shadow-[0_16px_16px_rgba(0,0,0,0.55)]">
                  <Body />
                </div>
                <p className="mt-1 text-center font-mono text-[8px] uppercase tracking-[0.3em] text-slate-500 lg:hidden">
                  {name}
                </p>
              </motion.div>

              {/* right leader label */}
              <div className="hidden items-center gap-2 lg:flex">
                {side === 'right' && (
                  <LeaderLabel text={name} side="right" delay={1 + i * 0.08} />
                )}
              </div>
            </div>
          ))}
        </div>

        <motion.p
          className="mt-5 text-center font-mono text-[9px] uppercase tracking-[0.35em] text-slate-600"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={view}
          transition={{ duration: 0.6, delay: 1.6 }}
        >
          one node · ~10 kW · exploded view
        </motion.p>
      </div>
    </Section>
  )
}
