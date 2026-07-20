import { motion } from 'framer-motion'
import Section from '../components/Section'
import Tip from '../components/Tip'
import { LAYERS } from '../data/layers'

const layer = LAYERS[7]

const COLS = 8
const ROWS = 6
// die tile grid: 8x6 SM/tensor tiles inside the die rect (220..420, 88..288)
const TILES = Array.from({ length: ROWS * COLS }, (_, i) => {
  const r = Math.floor(i / COLS)
  const c = i % COLS
  return { x: 225 + c * 24, y: 93 + r * 32, delay: (r + c) * 0.14 }
})

// six HBM stacks flanking the die, 3 per side
const STACK_YS = [90, 160, 230]
const STACKS = [
  ...STACK_YS.map((y, i) => ({ x: 84, y, side: 'left', delay: i * 0.4 })),
  ...STACK_YS.map((y, i) => ({ x: 456, y, side: 'right', delay: 0.2 + i * 0.4 })),
]

// hover hotspots overlaid on the SVG (percent of the 640x420 viewBox)
const HOTSPOTS = [
  {
    left: '50%',
    top: '21%',
    chip: 'SM grid',
    label: 'SM / Tensor cores',
    sup: ['gpu-accelerators', 'eda-ip'],
    fact: 'One die packs 16,000+ cores that each multiply matrices for a living.',
  },
  {
    left: '50%',
    top: '68.5%',
    chip: '80B FET',
    label: 'Transistors',
    sup: ['foundries', 'wfe-equipment'],
    fact: '80 billion+ switches on this die — none of them bigger than a virus.',
  },
  {
    left: '21%',
    top: '44%',
    chip: 'HBM ×6',
    label: 'HBM + TSV',
    sup: ['hbm-memory', 'test-equipment'],
    fact: 'Memory towers connected by vias thinner than a wavelength of light… almost.',
  },
  {
    left: '23%',
    top: '85%',
    chip: 'interposer',
    label: 'Silicon interposer',
    sup: ['advanced-packaging', 'abf-substrates'],
    fact: "A silicon 'circuit board' with wires 100x finer than any PCB can manage.",
  },
]

function HbmStack({ x, y, side, delay }) {
  const innerX = x + 8
  const innerW = 84
  const traceX1 = side === 'left' ? x + 102 : 422
  const traceX2 = side === 'left' ? 218 : x - 2
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={100}
        height={52}
        rx={5}
        fill="#131c30"
        stroke="#f59e0b"
        strokeOpacity="0.3"
      />
      {/* 4 stacked DRAM layers, pulsing bottom-to-top */}
      {[0, 1, 2, 3].map((li) => (
        <motion.rect
          key={li}
          x={innerX}
          y={y + 6 + li * 12}
          width={innerW}
          height={9}
          rx={2}
          fill="#fbbf24"
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{
            repeat: Infinity,
            duration: 2.4,
            delay: delay + (3 - li) * 0.18,
            ease: 'easeInOut',
          }}
        />
      ))}
      {/* TSV via-dots between layers */}
      {[1, 2, 3].map((li) => (
        <line
          key={li}
          x1={innerX + 4}
          y1={y + 4.5 + li * 12}
          x2={innerX + innerW - 4}
          y2={y + 4.5 + li * 12}
          stroke="#f59e0b"
          strokeOpacity="0.55"
          strokeWidth="1.5"
          strokeDasharray="1.5 5.5"
        />
      ))}
      {/* traces to the die */}
      {[13, 26, 39].map((dy) => (
        <line
          key={dy}
          x1={traceX1}
          y1={y + dy}
          x2={traceX2}
          y2={y + dy}
          stroke="#334155"
          strokeWidth="1.5"
        />
      ))}
      {/* data pulses shuttling both directions */}
      <rect x={-5} y={-2} width={10} height={4} rx={2} fill="#fcd34d" opacity="0.9">
        <animateMotion
          dur="1.7s"
          begin={`${-delay}s`}
          repeatCount="indefinite"
          path={`M${traceX1} ${y + 13} L${traceX2} ${y + 13}`}
        />
      </rect>
      <rect x={-5} y={-2} width={10} height={4} rx={2} fill="#fb923c" opacity="0.85">
        <animateMotion
          dur="2.1s"
          begin={`${-delay - 0.7}s`}
          repeatCount="indefinite"
          path={`M${traceX2} ${y + 39} L${traceX1} ${y + 39}`}
        />
      </rect>
    </g>
  )
}

/* ---------- cross-section slice rows ---------- */

const SLICES = [
  { w: 'w-1/2', cls: 'bg-amber-400/70', label: 'die' },
  { bumps: 'w-3/5' },
  { w: 'w-4/5', cls: 'bg-amber-200/30', label: 'interposer' },
  { bumps: 'w-11/12' },
  { w: 'w-full', cls: 'bg-slate-600/70', label: 'substrate' },
]

export default function ChipLayer() {
  return (
    <Section layer={layer}>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15% 0px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]"
      >
        {/* ---------- package top view ---------- */}
        <div className="panel relative overflow-hidden p-3 sm:p-5">
          <div
            aria-hidden
            className="absolute -inset-12 rounded-full bg-amber-500/[0.07] blur-3xl"
          />
          <div className="relative">
            <svg viewBox="0 0 640 420" className="h-auto w-full">
              {/* package substrate */}
              <rect
                x="14"
                y="20"
                width="612"
                height="380"
                rx="14"
                fill="#0b1120"
                stroke="#334155"
                strokeOpacity="0.8"
              />
              <text
                x="320"
                y="390"
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
                fontSize="10"
                letterSpacing="3"
                fill="#64748b"
              >
                PACKAGE SUBSTRATE
              </text>

              {/* CoWoS interposer */}
              <rect
                x="60"
                y="52"
                width="520"
                height="316"
                rx="8"
                fill="#111a2e"
                stroke="#f59e0b"
                strokeOpacity="0.25"
              />
              <text
                x="80"
                y="356"
                fontFamily="ui-monospace, monospace"
                fontSize="9"
                letterSpacing="2.5"
                fill="#8a7a4a"
              >
                COWOS INTERPOSER
              </text>

              {/* GPU die + tile grid lighting in traveling waves */}
              <rect
                x="220"
                y="88"
                width="200"
                height="200"
                rx="6"
                fill="#1a2138"
                stroke="#f59e0b"
                strokeOpacity="0.45"
              />
              <text
                x="320"
                y="79"
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
                fontSize="9"
                letterSpacing="3"
                fill="#b48b3c"
              >
                GPU DIE
              </text>
              {TILES.map((t, i) => (
                <motion.rect
                  key={i}
                  x={t.x}
                  y={t.y}
                  width={22}
                  height={30}
                  rx={2.5}
                  fill="#f59e0b"
                  animate={{ opacity: [0.08, 0.85, 0.08] }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    delay: t.delay,
                    ease: 'easeInOut',
                  }}
                />
              ))}

              {/* HBM towers + traces + shuttling pulses */}
              {STACKS.map((s, i) => (
                <HbmStack key={i} {...s} />
              ))}
            </svg>

            {/* hover hotspots pinned over the SVG */}
            {HOTSPOTS.map((h) => (
              <Tip
                key={h.chip}
                label={h.label}
                fact={h.fact}
                suppliers={h.sup}
                accent={layer.accent}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                // eslint-disable-next-line react/no-unknown-property
              >
                <span
                  className="rounded-full border border-amber-400/40 bg-slate-950/90 px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest text-amber-300 sm:text-[9px]"
                  style={{ boxShadow: '0 0 14px rgba(245,158,11,0.25)' }}
                >
                  {h.chip}
                </span>
              </Tip>
            ))}
            {/* position the hotspots (wrapper spans need coords) */}
            <style>{`/* positions applied inline below */`}</style>
          </div>

          <p className="relative mt-2 font-mono text-[9px] uppercase tracking-[0.3em] text-slate-600">
            amber waves = kernels executing · shuttles = HBM traffic
          </p>
        </div>

        {/* ---------- cross-section ---------- */}
        <div className="panel flex flex-col justify-center gap-2 p-4 sm:p-5">
          <Tip
            label="CoWoS"
            suppliers={['advanced-packaging', 'abf-substrates']}
            fact="Chip-on-Wafer-on-Substrate — the 2.5D packaging trick that makes AI chips possible at all."
            accent={layer.accent}
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
              CoWoS cross-section
            </p>
          </Tip>

          <div className="mt-2 flex flex-col gap-1.5">
            {SLICES.map((s, i) =>
              s.bumps ? (
                <motion.div
                  key={i}
                  aria-hidden
                  className={`h-1.5 self-center ${s.bumps}`}
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, rgba(251,191,36,0.65) 1px, transparent 1.4px)',
                    backgroundSize: '7px 6px',
                    backgroundPosition: 'center',
                  }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.12 }}
                />
              ) : (
                <motion.div
                  key={i}
                  className="grid grid-cols-[minmax(0,1fr)_58px] items-center gap-2"
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.4 + i * 0.12 }}
                >
                  <div className={`h-4 self-center justify-self-center rounded-sm ${s.w} ${s.cls}`} />
                  <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500">
                    {s.label}
                  </span>
                </motion.div>
              )
            )}
          </div>

          <p className="mt-3 font-mono text-[9px] uppercase tracking-widest text-slate-600">
            micro-bumps: ~45 µm pitch
          </p>
          <p className="font-mono text-[9px] uppercase tracking-widest text-slate-600">
            one package ≈ 1 kg of engineering
          </p>
        </div>
      </motion.div>
    </Section>
  )
}
