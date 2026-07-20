import { motion } from 'framer-motion'
import Section from '../components/Section'
import Tip from '../components/Tip'
import { LAYERS } from '../data/layers'

const layer = LAYERS[2]
const A = layer.accent

const vp = { once: true, margin: '-15% 0px' }

const TOKENS = [
  ['Every', '1135'],
  ['▁token', '5931'],
  ['▁begins', '4102'],
  ['▁as', '601'],
  ['▁sand', '9214'],
]

const CHIP_COLORS = ['#22d3ee', '#34d399', '#fbbf24', '#f472b6']

function PanelTitle({ children, right }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
        {children}
      </span>
      {right && <span className="font-mono text-[9px] text-slate-600">{right}</span>}
    </div>
  )
}

function Pod({ i }) {
  const inner = (
    <div className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-2 py-2">
      <div className="flex items-center gap-1.5">
        <span
          className="led h-1.5 w-1.5 rounded-full"
          style={{
            backgroundColor: i === 5 ? '#fbbf24' : '#34d399',
            animationDelay: `${(i * 0.23).toFixed(2)}s`,
          }}
        />
        <span className="font-mono text-[8px] text-slate-500">pod-{i}</span>
      </div>
      {/* utilization bar */}
      <div className="mt-1.5 h-1 overflow-hidden rounded bg-slate-700/50">
        <motion.div
          className="h-full rounded"
          style={{ backgroundColor: A, originX: 0 }}
          animate={{ scaleX: [0.35, 0.9, 0.55, 0.8] }}
          transition={{ duration: 4 + i * 0.7, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        />
      </div>
    </div>
  )
  // pod 5 keeps crash-looping
  return i === 5 ? (
    <motion.div
      animate={{ opacity: [1, 1, 0.15, 0.15, 1] }}
      transition={{ duration: 7, times: [0, 0.72, 0.78, 0.9, 1], repeat: Infinity }}
    >
      {inner}
    </motion.div>
  ) : (
    inner
  )
}

export default function ServingLayer() {
  return (
    <Section layer={layer}>
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        {/* (a) pods + router */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          transition={{ duration: 0.6 }}
          className="panel p-4 sm:p-5"
        >
          <PanelTitle right="7/8 ready">gpu fleet</PanelTitle>
          <div className="relative mt-3">
            <div className="flex justify-center">
              <Tip
                label="Model router"
                suppliers="inference-serving"
                fact="Weighs queue depth, cache hits and pod health to decide which replica answers you."
                accent={A}
              >
                <span
                  className="rounded-md border px-3 py-1 font-mono text-[10px] uppercase tracking-widest"
                  style={{ borderColor: A + '66', color: A, backgroundColor: A + '12' }}
                >
                  router
                </span>
              </Tip>
            </div>
            {/* requests fanning from router to pods */}
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-8 flex justify-center">
              {[-1, 0, 1].map((k, i) => (
                <motion.span
                  key={k}
                  className="absolute h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: A, boxShadow: `0 0 8px 2px ${A}55` }}
                  animate={{ x: [0, k * 70], y: [0, 42], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.5, ease: 'easeIn' }}
                />
              ))}
            </div>
            <div className="mt-8 grid grid-cols-4 gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={vp}
                  transition={{ duration: 0.45, delay: i * 0.07, ease: 'backOut' }}
                >
                  {i === 0 ? (
                    <Tip
                      label="Pod"
                      suppliers="k8s-platforms"
                      fact="Each pod pins a copy (or shard) of the model into GPU memory — cold-starting one means minutes of weight loading."
                      accent={A}
                      className="w-full"
                    >
                      <Pod i={i} />
                    </Tip>
                  ) : (
                    <Pod i={i} />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* (b) continuous batching */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="panel p-4 sm:p-5"
        >
          <Tip
            label="Continuous batching"
            suppliers="inference-serving"
            fact="New requests hop into the running batch mid-flight and finished ones hop out — the GPU never waits for stragglers."
            accent={A}
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 border-b border-dotted border-slate-600">
              continuous batching
            </span>
          </Tip>
          <div className="mt-4 flex items-center gap-3">
            <span className="font-mono text-[9px] uppercase tracking-widest text-slate-600">
              reqs →
            </span>
            <div className="relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl border border-slate-700/50 bg-slate-900/40 px-3 py-3">
              {CHIP_COLORS.map((c, i) => (
                <div
                  key={c}
                  className="relative h-8 w-12 rounded-md border border-dashed border-slate-700 sm:w-14"
                >
                  <motion.div
                    className="absolute inset-0 grid place-items-center rounded-md font-mono text-[8px]"
                    style={{ backgroundColor: c + '2b', color: c, boxShadow: `inset 0 0 0 1px ${c}55` }}
                    animate={{ x: [-110, 0, 0, 110], opacity: [0, 1, 1, 0] }}
                    transition={{
                      duration: 3.5 + i * 1.1,
                      times: [0, 0.18, 0.82, 1],
                      repeat: Infinity,
                      delay: i * 0.6,
                      ease: 'easeInOut',
                    }}
                  >
                    req
                  </motion.div>
                </div>
              ))}
            </div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-slate-600">
              → gpu
            </span>
          </div>
          <p className="mt-3 font-mono text-[9px] text-slate-600">
            one batch · many conversations · chips join &amp; leave mid-step
          </p>
        </motion.div>

        {/* (d) tokenizer */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="panel p-4 sm:p-5"
        >
          <Tip
            label="Tokenizer"
            fact="Text is chopped into subword pieces from a ~100k-entry vocabulary. The ids are all the model ever sees."
            accent={A}
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 border-b border-dotted border-slate-600">
              tokenizer
            </span>
          </Tip>
          <p className="mt-3 font-mono text-xs text-slate-400">
            “Every token begins as sand”
          </p>
          <div className="mt-3 flex min-h-[3.5rem] flex-wrap content-start gap-1.5">
            {TOKENS.map(([word, id], i) => {
              const t = 0.06 + i * 0.1
              return (
                <motion.span
                  key={id}
                  className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 font-mono text-[10px]"
                  style={{ backgroundColor: A + '16', boxShadow: `inset 0 0 0 1px ${A}44` }}
                  animate={{
                    opacity: [0, 0, 1, 1, 0],
                    scale: [0.6, 0.6, 1, 1, 0.85],
                  }}
                  transition={{
                    duration: 6,
                    times: [0, t, t + 0.07, 0.86, 1],
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                >
                  <span style={{ color: A }} className="text-glow">
                    {word}
                  </span>
                  <span className="text-slate-500">{id}</span>
                </motion.span>
              )
            })}
          </div>
        </motion.div>

        {/* (c) kv-cache */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="panel p-4 sm:p-5"
        >
          <Tip
            label="KV-cache"
            suppliers="hbm-memory"
            fact="Remembering earlier tokens so attention isn't recomputed — one long chat can pin gigabytes of GPU memory."
            accent={A}
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 border-b border-dotted border-slate-600">
              kv-cache
            </span>
          </Tip>
          <div className="mt-4 grid grid-cols-8 gap-1">
            {Array.from({ length: 32 }).map((_, i) => {
              const s = 0.04 + (i / 32) * 0.42
              return (
                <motion.span
                  key={i}
                  className="h-3 rounded-[3px]"
                  style={{ backgroundColor: A }}
                  animate={{ opacity: [0.08, 0.08, 0.85, 0.85, 0.08, 0.08] }}
                  transition={{
                    duration: 9,
                    times: [0, s, s + 0.03, s + 0.45, s + 0.48, 1],
                    repeat: Infinity,
                  }}
                />
              )
            })}
          </div>
          <div className="mt-2 flex justify-between font-mono text-[9px] text-slate-600">
            <span>fills as tokens generate</span>
            <span>evict ← oldest</span>
          </div>
        </motion.div>
      </div>

      {/* (e) tokens streaming down to the next layer */}
      <div className="relative mt-4 flex flex-col items-center">
        <div aria-hidden className="flex h-10 gap-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: A, boxShadow: `0 0 10px 2px ${A}55` }}
              animate={{ y: [-2, 34], opacity: [0, 1, 0] }}
              transition={{ duration: 1.7, repeat: Infinity, delay: i * 0.34, ease: 'easeIn' }}
            />
          ))}
        </div>
        <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.3em] text-slate-500">
          ↓ batched tokens enter the transformer
        </p>
      </div>
    </Section>
  )
}
