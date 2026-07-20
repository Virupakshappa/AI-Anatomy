import { motion } from 'framer-motion'
import Section from '../components/Section'
import Tip from '../components/Tip'
import { LAYERS } from '../data/layers'

const layer = LAYERS[5]

// Deterministic pseudo-random so LED phases / link pulses are stable across renders.
const R = (() => {
  let s = 1337
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280)
})()

// 3 rows x 5 racks, each with a column of 4 status LEDs (mostly green/cyan, rare amber)
const ROWS = [0, 1, 2].map((row) => ({
  row,
  racks: Array.from({ length: 5 }, (_, i) => ({
    id: `${row}-${i}`,
    leds: Array.from({ length: 4 }, () => {
      const r = R()
      return {
        color: r < 0.6 ? '#34d399' : r < 0.87 ? '#22d3ee' : '#fbbf24',
        delay: `${(R() * 2.4).toFixed(2)}s`,
      }
    }),
  })),
}))

const COLD = Array.from({ length: 7 }, (_, i) => ({
  left: 8 + i * 12 + R() * 6,
  delay: R() * 2.4,
  dur: 2.2 + R() * 1.4,
}))
const HOT = Array.from({ length: 7 }, (_, i) => ({
  left: 10 + i * 12 + R() * 6,
  delay: R() * 2.4,
  dur: 2 + R() * 1.4,
  warm: R() > 0.45,
}))

// Spine-leaf: 3 spines up top, 6 leaves below, all-to-all links pulsing at random phases
const SPINES = [56, 120, 184]
const LEAVES = [24, 62, 100, 138, 176, 214]
const LINKS = SPINES.flatMap((sx) =>
  LEAVES.map((lx) => ({ sx, lx, delay: R() * 3.6, dur: 1.4 + R() * 1.9 }))
)

function RackRow({ racks }) {
  return (
    <div className="relative z-10 flex justify-between gap-2 sm:gap-3">
      {racks.map((rack) => (
        <div
          key={rack.id}
          className="relative h-14 max-w-[64px] flex-1 rounded-md border border-slate-700/70 bg-slate-900/95 shadow-[0_10px_20px_-12px_rgba(0,0,0,0.9)] sm:h-16"
        >
          {/* cold plate */}
          <span className="absolute left-1/2 top-1 h-0.5 w-3/5 -translate-x-1/2 rounded bg-teal-300/50" />
          {/* status LEDs */}
          <span className="absolute left-1.5 top-3.5 flex flex-col gap-1.5">
            {rack.leds.map((led, i) => (
              <span
                key={i}
                className="led h-1 w-1 rounded-full"
                style={{
                  background: led.color,
                  boxShadow: `0 0 6px ${led.color}`,
                  animationDelay: led.delay,
                }}
              />
            ))}
          </span>
          {/* server slot lines */}
          <span
            aria-hidden
            className="absolute inset-y-2.5 right-1.5 w-4 rounded-sm opacity-60 sm:w-6"
            style={{
              backgroundImage:
                'repeating-linear-gradient(180deg, rgb(51 65 85 / 0.9) 0 1px, transparent 1px 4px)',
            }}
          />
        </div>
      ))}
    </div>
  )
}

export default function DatacenterLayer() {
  return (
    <Section layer={layer}>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15% 0px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_290px]"
      >
        {/* ---------- the hall ---------- */}
        <div className="panel relative overflow-hidden p-4 sm:p-6">
          <div
            aria-hidden
            className="absolute -inset-10 rounded-full bg-teal-500/[0.06] blur-3xl"
          />
          <div className="relative mb-4 flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
              Hall A · liquid-cooled
            </p>
            <Tip
              label="PUE"
              suppliers="datacenter-operators"
              fact="Power Usage Effectiveness — 1.12 means only 12% of the electricity goes to anything other than the chips."
              accent={layer.accent}
            >
              <span className="rounded-full border border-teal-400/30 bg-teal-400/10 px-2.5 py-1 font-mono text-[10px] tracking-widest text-teal-300">
                PUE 1.12
              </span>
            </Tip>
          </div>

          {/* static isometric tilt — never animated */}
          <div className="relative origin-top [transform:perspective(1000px)_rotateX(16deg)]">
            <div className="flex gap-3 sm:gap-5">
              {/* CDU pump unit */}
              <div className="flex w-13 shrink-0 flex-col items-center justify-center sm:w-16">
                <Tip
                  label="CDU"
                  suppliers="cooling"
                  fact="Coolant distribution unit — the datacenter's heart, pumping liters of liquid per second through the racks."
                  accent={layer.accent}
                  className="w-full"
                >
                  <div className="flex h-24 w-full flex-col items-center justify-between rounded-lg border border-teal-400/40 bg-slate-900/95 py-2.5 shadow-[0_10px_24px_-12px_rgba(45,212,191,0.35)] sm:h-28">
                    <span className="font-mono text-[9px] tracking-[0.25em] text-teal-300">
                      CDU
                    </span>
                    <motion.span
                      aria-hidden
                      className="h-7 w-7 rounded-full border-2 border-dashed border-teal-300/70"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
                    />
                    <span
                      className="led h-1 w-1 rounded-full bg-emerald-400"
                      style={{ boxShadow: '0 0 6px #34d399' }}
                    />
                  </div>
                </Tip>
              </div>

              {/* rack field with coolant plumbing beneath */}
              <div className="relative min-w-0 flex-1">
                <svg
                  aria-hidden
                  className="absolute -inset-x-2 inset-y-0 h-full w-[calc(100%+16px)] opacity-70"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  {/* cool supply out of the CDU */}
                  <path
                    d="M0 96 V10 H98 M0 48 H98 M0 86 H98"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="1.2"
                    strokeOpacity="0.75"
                    vectorEffect="non-scaling-stroke"
                    className="animate-flow"
                  />
                  {/* warm return back to the CDU */}
                  <path
                    d="M98 16 V92 H0"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="1.2"
                    strokeOpacity="0.65"
                    vectorEffect="non-scaling-stroke"
                    className="animate-flow-slow"
                  />
                </svg>

                <div className="relative flex flex-col gap-1.5">
                  <RackRow racks={ROWS[0].racks} />

                  {/* cold aisle */}
                  <div className="relative z-10 h-8 overflow-hidden rounded bg-cyan-400/[0.05]">
                    <span className="absolute left-2 top-1/2 z-10 -translate-y-1/2 font-mono text-[9px] uppercase tracking-widest text-cyan-300/70">
                      cold aisle · 22°C
                    </span>
                    {COLD.map((p, i) => (
                      <motion.span
                        key={i}
                        aria-hidden
                        className={`absolute top-0 h-1 w-1 rounded-full bg-sky-400 ${
                          i > 3 ? 'hidden sm:block' : ''
                        }`}
                        style={{
                          left: `${p.left}%`,
                          boxShadow: '0 0 6px rgba(56,189,248,0.9)',
                        }}
                        animate={{ y: [-4, 30], opacity: [0, 0.9, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: p.dur,
                          delay: p.delay,
                          ease: 'linear',
                        }}
                      />
                    ))}
                  </div>

                  <RackRow racks={ROWS[1].racks} />

                  {/* hot aisle */}
                  <div className="relative z-10 h-8 overflow-hidden rounded bg-orange-400/[0.06]">
                    <Tip
                      label="Hot aisle"
                      suppliers="cooling"
                      fact="Exhaust air here can top 45°C — you could proof bread in the airflow off a training cluster."
                      accent={layer.accent}
                      className="absolute left-2 top-1/2 z-10 -translate-y-1/2"
                    >
                      <span className="font-mono text-[9px] uppercase tracking-widest text-orange-300/80">
                        hot aisle · 45°C
                      </span>
                    </Tip>
                    {HOT.map((p, i) => (
                      <motion.span
                        key={i}
                        aria-hidden
                        className={`absolute bottom-0 h-1 w-1 rounded-full ${
                          p.warm ? 'bg-orange-400' : 'bg-rose-400'
                        } ${i > 3 ? 'hidden sm:block' : ''}`}
                        style={{
                          left: `${p.left}%`,
                          boxShadow: p.warm
                            ? '0 0 6px rgba(251,146,60,0.9)'
                            : '0 0 6px rgba(251,113,133,0.9)',
                        }}
                        animate={{ y: [6, -30], opacity: [0, 0.9, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: p.dur,
                          delay: p.delay,
                          ease: 'linear',
                        }}
                      />
                    ))}
                  </div>

                  <RackRow racks={ROWS[2].racks} />
                </div>
              </div>
            </div>
          </div>

          {/* coolant legend */}
          <div className="relative mt-4 flex gap-5 font-mono text-[9px] uppercase tracking-widest text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-5 rounded bg-cyan-400/80" /> supply 18°C
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-5 rounded bg-amber-400/80" /> return 45°C
            </span>
          </div>
        </div>

        {/* ---------- side column: fabric + heat rejection ---------- */}
        <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
          {/* spine-leaf network */}
          <div className="panel flex-1 p-4">
            <Tip
              label="Spine–leaf"
              suppliers="networking-fabric"
              fact="A flat Clos fabric: any GPU can talk to any GPU in ~2 hops. No hierarchy, no bottleneck."
              accent={layer.accent}
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
                Spine–leaf fabric
              </p>
            </Tip>
            <svg viewBox="0 0 240 118" className="mt-2 h-auto w-full">
              {LINKS.map((k, i) => (
                <motion.line
                  key={i}
                  x1={k.sx}
                  y1={30}
                  x2={k.lx}
                  y2={90}
                  stroke="#2dd4bf"
                  strokeWidth="1"
                  animate={{ opacity: [0.08, 0.7, 0.08] }}
                  transition={{
                    repeat: Infinity,
                    duration: k.dur,
                    delay: k.delay,
                    ease: 'easeInOut',
                  }}
                />
              ))}
              {SPINES.map((x) => (
                <rect
                  key={x}
                  x={x - 11}
                  y={18}
                  width={22}
                  height={12}
                  rx={3}
                  fill="#0f172a"
                  stroke="#2dd4bf"
                  strokeOpacity="0.6"
                />
              ))}
              {LEAVES.map((x) => (
                <rect
                  key={x}
                  x={x - 8}
                  y={90}
                  width={16}
                  height={10}
                  rx={3}
                  fill="#0f172a"
                  stroke="#64748b"
                  strokeOpacity="0.7"
                />
              ))}
            </svg>
            <Tip
              label="Optics"
              suppliers={['optics', 'connectors-cabling']}
              fact="A single fiber pair carries 800 Gb/s — the whole of Wikipedia in about a quarter of a second."
              accent={layer.accent}
            >
              <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-teal-300/70">
                InfiniBand / 800G
              </p>
            </Tip>
          </div>

          {/* cooling tower */}
          <div className="panel relative flex-1 overflow-hidden p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
              Heat rejection
            </p>
            <div className="relative mx-auto mt-3 h-20 w-24">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  aria-hidden
                  className="absolute left-1/2 top-1 h-3.5 w-3.5 rounded-full bg-slate-300/30 blur-[3px]"
                  style={{ marginLeft: (i - 1) * 10 - 7 }}
                  animate={{ y: [0, -22], opacity: [0, 0.55, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.6 + i * 0.5,
                    delay: i * 0.8,
                    ease: 'easeOut',
                  }}
                />
              ))}
              <div className="absolute bottom-0 left-1/2 h-14 w-16 -translate-x-1/2 border border-slate-600/70 bg-slate-800/70 [clip-path:polygon(18%_0,82%_0,100%_100%,0_100%)]" />
              <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 font-mono text-[8px] uppercase tracking-widest text-slate-500">
                tower
              </span>
            </div>
            <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-widest text-slate-600">
              45°C in · 30°C out
            </p>
          </div>
        </div>
      </motion.div>
    </Section>
  )
}
