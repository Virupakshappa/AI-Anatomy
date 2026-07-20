import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Section from '../components/Section'
import Tip from '../components/Tip'
import { LAYERS } from '../data/layers'

const layer = LAYERS[3]

const TOKENS = ['The', 'sky', 'is', 'so', 'very']
const NEXT = 'blue'
// deterministic pseudo-attention weight between token i (query) and j (key)
const weight = (i, j) => 0.25 + (((i * 7 + j * 13) % 10) / 10) * 0.7

const Caption = ({ children }) => (
  <p className="mb-3 text-center font-mono text-[10px] uppercase tracking-widest text-slate-500">
    {children}
  </p>
)

const Arrow = () => (
  <div className="hidden items-center self-center lg:flex" aria-hidden>
    <svg width="28" height="12" viewBox="0 0 28 12" className="text-slate-600">
      <path
        d="M0 6h22m0 0l-5-4m5 4l-5 4"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  </div>
)

export default function ModelLayer() {
  // which token is currently "attending"
  const [focus, setFocus] = useState(TOKENS.length - 1)

  useEffect(() => {
    const t = setInterval(
      () => setFocus((f) => ((f + 1) % (TOKENS.length - 1)) + 1),
      1600
    )
    return () => clearInterval(t)
  }, [])

  // shimmering weight field behind the pipeline
  const fieldDots = []
  for (let i = 0; i < 140; i++) {
    const x = (i * 37) % 100
    const y = ((i * 53) % 97) / 0.97
    fieldDots.push(
      <span
        key={i}
        className="animate-shimmer absolute h-[3px] w-[3px] rounded-full"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          background: i % 5 === 0 ? '#a78bfa' : '#6d6a8f',
          animationDelay: `${(i % 30) * 0.1}s`,
        }}
      />
    )
  }

  const nodeX = (i) => 24 + i * 44

  return (
    <Section layer={layer}>
      {/* particle field = the weights */}
      <div aria-hidden className="absolute -inset-x-4 -top-6 bottom-0 hidden opacity-60 sm:block">
        {fieldDots}
      </div>

      <div className="relative flex flex-col items-stretch justify-center gap-6 lg:flex-row lg:gap-2">
        {/* tokens in */}
        <div className="panel flex-1 p-4 lg:max-w-[150px]">
          <Caption>Tokens in</Caption>
          <div className="flex flex-wrap justify-center gap-1.5 lg:flex-col lg:items-center">
            {TOKENS.map((t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="rounded-md bg-violet-500/15 px-2 py-1 font-mono text-xs text-violet-200 ring-1 ring-violet-400/30"
              >
                {t}
              </motion.span>
            ))}
          </div>
        </div>

        <Arrow />

        {/* embeddings */}
        <div className="panel flex-1 p-4 lg:max-w-[170px]">
          <Caption>Embedding</Caption>
          <Tip
            label="Embeddings"
            fact="Each token becomes a point in ~10,000-dimensional space — meaning as coordinates."
            accent={layer.accent}
            className="w-full justify-center"
          >
            <div className="flex justify-center gap-2">
              {TOKENS.map((t, i) => (
                <div key={t} className="flex flex-col-reverse gap-[3px]">
                  {[0, 1, 2, 3, 4].map((r) => (
                    <motion.span
                      key={r}
                      className="block h-[7px] w-[9px] origin-bottom rounded-[2px] bg-violet-400"
                      animate={{
                        opacity: [0.25, 0.4 + weight(i, r) * 0.6, 0.25],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2.6,
                        delay: (i * 5 + r) * 0.13,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </Tip>
        </div>

        <Arrow />

        {/* attention */}
        <div className="panel flex-[1.6] p-4">
          <Caption>Self-attention</Caption>
          <Tip
            label="Attention head"
            fact="Every token asks every earlier token: are you relevant to me? Dozens of heads do this in parallel, ~100 layers deep."
            accent={layer.accent}
            className="w-full justify-center"
          >
            <svg viewBox="0 0 244 110" className="h-auto w-full max-w-[260px]">
              {TOKENS.map((_, j) =>
                j < focus ? (
                  <motion.path
                    key={`${focus}-${j}`}
                    d={`M ${nodeX(focus)} 88 Q ${(nodeX(focus) + nodeX(j)) / 2} ${
                      88 - (focus - j) * 32
                    } ${nodeX(j)} 88`}
                    fill="none"
                    stroke="#a78bfa"
                    strokeWidth={1 + weight(focus, j) * 2}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: weight(focus, j) }}
                    transition={{ duration: 0.5 }}
                  />
                ) : null
              )}
              {TOKENS.map((t, i) => (
                <g key={t}>
                  <circle
                    cx={nodeX(i)}
                    cy={88}
                    r={9}
                    fill={i === focus ? '#a78bfa' : '#1e1b31'}
                    stroke={i === focus ? '#c4b5fd' : '#4c4573'}
                    strokeWidth="1.5"
                  />
                  <text
                    x={nodeX(i)}
                    y={106}
                    textAnchor="middle"
                    fontSize="8"
                    fontFamily="monospace"
                    fill={i === focus ? '#c4b5fd' : '#64748b'}
                  >
                    {t}
                  </text>
                </g>
              ))}
            </svg>
          </Tip>
        </div>

        <Arrow />

        {/* MLP */}
        <div className="panel flex-1 p-4 lg:max-w-[150px]">
          <Caption>MLP</Caption>
          <Tip
            label="Feed-forward"
            fact="After attention gathers context, dense layers transform it — most of the parameters live here."
            accent={layer.accent}
            className="w-full justify-center"
          >
            <svg viewBox="0 0 90 100" className="mx-auto h-auto w-full max-w-[90px]">
              {[0, 1, 2, 3].map((a) =>
                [0, 1, 2, 3].map((b) => (
                  <line
                    key={`${a}-${b}`}
                    x1={20}
                    y1={14 + a * 24}
                    x2={70}
                    y2={14 + b * 24}
                    stroke="#a78bfa"
                    strokeOpacity="0.18"
                  />
                ))
              )}
              {[0, 1, 2, 3].map((a) => (
                <motion.circle
                  key={`l-${a}`}
                  cx={20}
                  cy={14 + a * 24}
                  r={4.5}
                  fill="#7c6cd9"
                  animate={{ opacity: [0.35, 1, 0.35] }}
                  transition={{ repeat: Infinity, duration: 2, delay: a * 0.2 }}
                />
              ))}
              {[0, 1, 2, 3].map((b) => (
                <motion.circle
                  key={`r-${b}`}
                  cx={70}
                  cy={14 + b * 24}
                  r={4.5}
                  fill="#a78bfa"
                  animate={{ opacity: [0.35, 1, 0.35] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    delay: 0.5 + b * 0.2,
                  }}
                />
              ))}
            </svg>
          </Tip>
        </div>

        <Arrow />

        {/* logits + sampled token */}
        <div className="panel flex-1 p-4 lg:max-w-[170px]">
          <Caption>Logits → sample</Caption>
          <Tip
            label="Logits"
            fact="A score for every one of ~100k vocabulary entries. Temperature decides how adventurous the pick is."
            accent={layer.accent}
            className="w-full justify-center"
          >
            <div className="flex h-20 items-end justify-center gap-1.5">
              {[0.35, 0.55, 1, 0.45, 0.7, 0.3, 0.5].map((hgt, i) => (
                <motion.span
                  key={i}
                  className="w-3 origin-bottom rounded-t-sm"
                  style={{
                    height: `${hgt * 100}%`,
                    background: hgt === 1 ? '#c4b5fd' : '#4c4573',
                    boxShadow:
                      hgt === 1 ? '0 0 12px rgba(196,181,253,0.7)' : 'none',
                  }}
                  animate={{ scaleY: [1, hgt === 1 ? 1.06 : 0.82, 1] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.8,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
          </Tip>
          <motion.div
            className="mt-4 text-center"
            animate={{ scale: [0.9, 1.06, 1], opacity: [0, 1, 1] }}
            transition={{ repeat: Infinity, duration: 3.2, times: [0, 0.15, 1] }}
          >
            <span className="rounded-lg bg-violet-400/20 px-3 py-1.5 font-mono text-sm text-violet-100 ring-1 ring-violet-300/50">
              “{NEXT}”
            </span>
          </motion.div>
        </div>
      </div>

      <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-widest text-slate-600">
        one forward pass ≈ one token · repeat until the thought is finished
      </p>
    </Section>
  )
}
