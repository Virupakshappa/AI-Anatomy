import { motion } from 'framer-motion'
import Section from '../components/Section'
import Tip from '../components/Tip'
import { LAYERS } from '../data/layers'

const layer = LAYERS[4]

const Caption = ({ children }) => (
  <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-slate-500">
    {children}
  </p>
)

const GRID_COLS = 12
const GRID_ROWS = 7

// noisy descending loss curve, precomputed
const lossPath = (() => {
  let d = 'M 8 14'
  for (let i = 1; i <= 30; i++) {
    const x = 8 + i * 7.4
    const noise = Math.sin(i * 2.7) * 4 * Math.exp(-i / 18)
    const y = 14 + 70 * (1 - Math.exp(-i / 9)) + noise
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`
  }
  return d
})()

const PIPELINE = ['web crawl', 'filter', 'tokenize', 'shards']

const RLHF = [
  { label: 'model', x: 80, y: 16 },
  { label: 'responses', x: 134, y: 60 },
  { label: 'human ranks', x: 80, y: 104 },
  { label: 'reward model', x: 26, y: 60 },
]

export default function TrainingLayer() {
  return (
    <Section layer={layer}>
      <div className="grid gap-4 sm:grid-cols-2">
        {/* (a) GPU cluster all-reduce */}
        <div className="panel p-5">
          <div className="mb-3 flex items-center justify-between">
            <Caption>10,000 GPUs · all-reduce</Caption>
            <Tip
              label="All-reduce"
              suppliers={['networking-fabric', 'optics']}
              fact="Every step, every GPU averages its gradients with every other — the wave you see is the cluster agreeing."
              accent={layer.accent}
            >
              <span className="-mt-3 cursor-default font-mono text-[10px] uppercase tracking-wider text-purple-300/70 underline decoration-dotted underline-offset-4">
                what?
              </span>
            </Tip>
          </div>
          <div
            className="grid w-full gap-1"
            style={{ gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0,1fr))` }}
          >
            {Array.from({ length: GRID_COLS * GRID_ROWS }, (_, i) => {
              const r = Math.floor(i / GRID_COLS)
              const c = i % GRID_COLS
              return (
                <motion.span
                  key={i}
                  className="aspect-square rounded-[3px] bg-purple-400"
                  animate={{ opacity: [0.12, 0.9, 0.12] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.8,
                    delay: ((r + c) % 18) * 0.14,
                    ease: 'easeInOut',
                  }}
                />
              )
            })}
          </div>
        </div>

        {/* (b) data pipeline */}
        <div className="panel p-5">
          <Caption>Data pipeline · trillions of tokens</Caption>
          <div className="flex h-full flex-col justify-center gap-4">
            <div className="flex items-center justify-between gap-1">
              {PIPELINE.map((stage, i) => (
                <div key={stage} className="flex flex-1 items-center gap-1">
                  <Tip
                    label={stage}
                    fact={
                      i === 1
                        ? 'Most of the crawl is thrown away: dedup, quality filters, toxicity screens. Only the good stuff trains.'
                        : i === 3
                          ? 'The cleaned corpus is chopped into shards so thousands of GPUs can read in parallel.'
                          : i === 0
                            ? 'Petabytes of public web, code and books — the raw ore.'
                            : 'Text becomes integer ids — the only alphabet the model knows.'
                    }
                    accent={layer.accent}
                    className="flex-1"
                  >
                    <span className="block w-full rounded-lg bg-purple-500/10 px-2 py-2 text-center font-mono text-[10px] uppercase tracking-wider text-purple-200 ring-1 ring-purple-400/30">
                      {stage}
                    </span>
                  </Tip>
                  {i < PIPELINE.length - 1 && (
                    <svg width="14" height="8" viewBox="0 0 14 8" className="shrink-0 text-slate-600">
                      <path d="M0 4h10m0 0L7 1m3 3L7 7" stroke="currentColor" fill="none" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
            {/* document chips flowing; one dies at the filter */}
            <div className="relative h-8 overflow-hidden rounded-md bg-slate-900/50">
              {[0, 1, 2, 3, 4].map((i) => {
                const rejected = i === 2
                return (
                  <motion.span
                    key={i}
                    className="absolute top-1/2 h-3 w-5 -translate-y-1/2 rounded-[3px]"
                    style={{ background: rejected ? '#f87171' : '#c084fc' }}
                    animate={
                      rejected
                        ? { x: ['-8%', '38%', '38%'], opacity: [0.9, 0.9, 0], y: ['-50%', '-50%', '30%'] }
                        : { x: ['-8%', '104%'], opacity: [0.9, 0.9] }
                    }
                    transition={{
                      repeat: Infinity,
                      duration: 3.4,
                      delay: i * 0.7,
                      ease: 'linear',
                    }}
                  />
                )
              })}
            </div>
          </div>
        </div>

        {/* (c) loss curve */}
        <div className="panel p-5">
          <Caption>Loss ↓ · months of descent</Caption>
          <Tip
            label="The loss curve"
            fact="One number, watched by very expensive people at 3 a.m. Down and to the right = the model is learning."
            accent={layer.accent}
            className="w-full"
          >
            <svg viewBox="0 0 240 100" className="h-auto w-full">
              <line x1="8" y1="92" x2="236" y2="92" stroke="#334155" />
              <line x1="8" y1="4" x2="8" y2="92" stroke="#334155" />
              <motion.path
                d={lossPath}
                fill="none"
                stroke="#c084fc"
                strokeWidth="1.8"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: [0, 1, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 7,
                  times: [0, 0.7, 1],
                  ease: 'easeOut',
                }}
                style={{ filter: 'drop-shadow(0 0 4px rgba(192,132,252,0.6))' }}
              />
              <text x="216" y="88" fontSize="8" fontFamily="monospace" fill="#64748b">
                steps →
              </text>
              <text x="14" y="12" fontSize="8" fontFamily="monospace" fill="#64748b">
                loss
              </text>
            </svg>
          </Tip>
        </div>

        {/* (d) RLHF loop */}
        <div className="panel p-5">
          <Caption>RLHF · learning taste</Caption>
          <div className="flex items-center justify-center">
            <Tip
              label="RLHF"
              suppliers="data-labeling"
              fact="Humans pick the better of two answers; a reward model learns their taste; the model is nudged toward it."
              accent={layer.accent}
            >
              <svg viewBox="0 0 160 120" className="h-auto w-[260px] max-w-full">
                <circle
                  cx="80"
                  cy="60"
                  r="42"
                  fill="none"
                  stroke="#c084fc"
                  strokeOpacity="0.5"
                  className="animate-flow-slow"
                />
                {RLHF.map((n, i) => (
                  <g key={n.label}>
                    <motion.circle
                      cx={n.x}
                      cy={n.y}
                      r="7"
                      fill="#2e1065"
                      stroke="#c084fc"
                      strokeWidth="1.5"
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{
                        repeat: Infinity,
                        duration: 3.2,
                        delay: i * 0.8,
                      }}
                    />
                    <text
                      x={n.x}
                      y={n.y === 60 ? n.y + 20 : n.y > 60 ? n.y + 18 : n.y - 12}
                      textAnchor="middle"
                      fontSize="7.5"
                      fontFamily="monospace"
                      fill="#a78bbf"
                    >
                      {n.label}
                    </text>
                  </g>
                ))}
              </svg>
            </Tip>
          </div>
        </div>
      </div>
    </Section>
  )
}
