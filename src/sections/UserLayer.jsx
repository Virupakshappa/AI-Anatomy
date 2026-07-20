import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Section from '../components/Section'
import Tip from '../components/Tip'
import { LAYERS } from '../data/layers'

const layer = LAYERS[0]

const PROMPT = 'How does an AI actually answer me?'
const REPLY = [
  'Your', ' words', ' become', ' numbers,', ' race', ' through', ' miles',
  ' of', ' fiber,', ' wake', ' a', ' warehouse', ' of', ' silicon', ' —',
  ' and', ' return', ' as', ' light', ' on', ' your', ' screen.',
]

// Looping state machine: typing -> sending (packets fly) -> streaming -> resting
export default function UserLayer() {
  const [typed, setTyped] = useState(0)
  const [tokens, setTokens] = useState(0)
  const [phase, setPhase] = useState('typing')

  useEffect(() => {
    let t
    if (phase === 'typing') {
      t =
        typed < PROMPT.length
          ? setTimeout(() => setTyped((n) => n + 1), 42)
          : setTimeout(() => setPhase('sending'), 650)
    } else if (phase === 'sending') {
      t = setTimeout(() => setPhase('streaming'), 1500)
    } else if (phase === 'streaming') {
      t =
        tokens < REPLY.length
          ? setTimeout(() => setTokens((n) => n + 1), 105)
          : setTimeout(() => setPhase('resting'), 4200)
    } else {
      t = setTimeout(() => {
        setTyped(0)
        setTokens(0)
        setPhase('typing')
      }, 600)
    }
    return () => clearTimeout(t)
  }, [phase, typed, tokens])

  const sent = phase !== 'typing'

  return (
    <Section layer={layer}>
      {/* masthead */}
      <div className="pointer-events-none mb-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.55em] text-slate-500">
          Anatomy of AI
        </p>
        <p className="mt-1.5 text-xs text-slate-600">
          a scroll descent from prompt to sand
        </p>
      </div>

      <div className="relative mx-auto max-w-xl">
        {/* ambient glow behind the chat window */}
        <div
          aria-hidden
          className="absolute -inset-12 rounded-full bg-cyan-500/10 blur-3xl"
        />

        <div className="panel relative overflow-hidden">
          {/* window chrome */}
          <div className="flex items-center gap-2 border-b border-slate-700/40 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
            <Tip
              label="The interface"
              suppliers="ai-models"
              fact="The entire stack below exists so this little window can feel instant."
              accent={layer.accent}
              className="ml-3"
            >
              <span className="font-mono text-xs tracking-widest text-slate-400">
                assistant
              </span>
            </Tip>
            <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-emerald-400/80">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
              online
            </span>
          </div>

          {/* message thread — fixed height to avoid layout jump */}
          <div className="flex h-64 flex-col gap-3 overflow-hidden px-4 py-4 sm:h-72">
            <AnimatePresence>
              {sent && (
                <motion.div
                  key="user-msg"
                  initial={{ opacity: 0, y: 14, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="self-end rounded-2xl rounded-br-sm bg-cyan-500/15 px-4 py-2.5 text-sm text-cyan-100 ring-1 ring-cyan-400/30"
                >
                  {PROMPT}
                </motion.div>
              )}
            </AnimatePresence>

            {(phase === 'streaming' || phase === 'resting') && (
              <Tip
                label="Token stream"
                suppliers="ai-models"
                fact="Replies arrive one token at a time over a server-sent-event stream — that typewriter feel is real."
                accent={layer.accent}
                className="max-w-[90%] self-start"
              >
                <div className="rounded-2xl rounded-bl-sm bg-slate-800/70 px-4 py-2.5 text-sm leading-relaxed text-slate-200 ring-1 ring-slate-600/40">
                  {REPLY.slice(0, tokens).map((tok, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.18 }}
                    >
                      {tok}
                    </motion.span>
                  ))}
                  {phase === 'streaming' && (
                    <span className="animate-blink ml-0.5 inline-block h-4 w-[7px] translate-y-[3px] bg-cyan-300" />
                  )}
                </div>
              </Tip>
            )}

            {phase === 'sending' && (
              <div className="flex items-center gap-1.5 self-start px-2 py-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-slate-500"
                    animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.15 }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* input bar */}
          <div className="border-t border-slate-700/40 px-4 py-3">
            <div className="flex items-center gap-3 rounded-xl bg-slate-900/80 px-4 py-2.5 ring-1 ring-slate-700/50">
              <span className="min-h-[20px] flex-1 text-sm text-slate-200">
                {phase === 'typing' ? PROMPT.slice(0, typed) : ''}
                {phase === 'typing' && (
                  <span className="animate-blink ml-0.5 inline-block h-4 w-[7px] translate-y-[3px] bg-cyan-300" />
                )}
                {phase !== 'typing' && (
                  <span className="text-slate-600">Message the assistant…</span>
                )}
              </span>
              <Tip
                label="Send"
                fact="Hitting send fires an HTTPS POST — your words become an encrypted payload in ~1 ms."
                accent={layer.accent}
              >
                <motion.span
                  className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/40"
                  animate={
                    phase === 'sending'
                      ? { scale: [1, 0.85, 1.1, 1] }
                      : { scale: 1 }
                  }
                  transition={{ duration: 0.45 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 20V4m0 0l-6 6m6-6l6 6"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.span>
              </Tip>
            </div>
          </div>
        </div>

        {/* the prompt leaving the UI as glowing packets */}
        <AnimatePresence>
          {phase === 'sending' &&
            [...Array(6)].map((_, i) => (
              <motion.span
                key={i}
                aria-hidden
                className="absolute bottom-0 left-1/2 z-20 h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_3px_rgba(34,211,238,0.7)]"
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  y: 150,
                  x: (i - 2.5) * 16,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.15, delay: i * 0.11, ease: 'easeIn' }}
              />
            ))}
        </AnimatePresence>
      </div>

      {/* scroll hint */}
      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-slate-500">
          Scroll to descend
        </p>
        <motion.svg
          className="mx-auto mt-2 text-cyan-400/70"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.div>
    </Section>
  )
}
