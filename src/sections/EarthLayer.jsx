import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Section from '../components/Section'
import Tip from '../components/Tip'
import { LAYERS } from '../data/layers'

const layer = LAYERS[11]

const CLOSING = 'Every token begins as sand.'

// tower tiers, bottom → top, borrowing accents from the layers they recap
const TIERS = [
  { label: 'sand', accent: LAYERS[11].accent, sup: 'polysilicon-quartz', fact: 'Quartz is the second most abundant material in Earth’s crust — and the substrate of thought.' },
  { label: 'ingot', accent: LAYERS[9].accent },
  { label: 'wafer', accent: LAYERS[9].accent },
  { label: 'die', accent: LAYERS[7].accent, sup: 'foundries', fact: '80 billion transistors, printed with light no eye can see.' },
  { label: 'server', accent: LAYERS[6].accent },
  { label: 'rack', accent: LAYERS[5].accent },
  { label: 'datacenter', accent: LAYERS[5].accent },
  { label: 'model', accent: LAYERS[3].accent, sup: 'ai-models', fact: 'The internet, compressed into weights that fit in a single rack’s memory.' },
  { label: 'cloud / API', accent: LAYERS[1].accent },
  { label: 'chat', accent: LAYERS[0].accent, sup: 'ai-models', fact: 'Back where we started — the blinking cursor, one second and one planet away from the sand.' },
]

export default function EarthLayer() {
  const [chars, setChars] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setChars((c) => (c >= CLOSING.length + 18 ? 0 : c + 1))
    }, 90)
    return () => clearInterval(t)
  }, [])

  return (
    <Section layer={layer}>
      <div className="grid items-center gap-10 lg:grid-cols-2">
        {/* the stack tower */}
        <div className="relative mx-auto flex w-full max-w-xs flex-col items-center">
          {/* mini chat bubble at the summit */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: TIERS.length * 0.14 + 0.4 }}
            className="mb-3 min-h-[38px] rounded-2xl rounded-bl-sm bg-cyan-500/10 px-4 py-2 font-mono text-xs text-cyan-100 ring-1 ring-cyan-400/30"
          >
            {CLOSING.slice(0, Math.min(chars, CLOSING.length))}
            <span className="animate-blink ml-0.5 inline-block h-3 w-[6px] translate-y-[2px] bg-cyan-300" />
          </motion.div>

          {/* rising pulse along the tower */}
          <div className="pointer-events-none absolute bottom-0 left-1/2 top-12 w-px -translate-x-1/2 bg-slate-700/40">
            <motion.span
              className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-orange-300 shadow-[0_0_12px_3px_rgba(251,146,60,0.7)]"
              animate={{ top: ['100%', '-2%'], opacity: [0, 1, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut', times: [0, 0.15, 0.85, 1] }}
            />
          </div>

          {/* tiers assemble bottom-to-top */}
          <div className="flex w-full flex-col-reverse items-center gap-1.5">
            {TIERS.map((t, i) => {
              const width = 46 + i * 5.4 // % — narrower toward the top? inverted: sand widest
              const plate = (
                <motion.div
                  initial={{ opacity: 0, y: 26, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-10% 0px' }}
                  transition={{
                    type: 'spring',
                    stiffness: 210,
                    damping: 20,
                    delay: i * 0.14,
                  }}
                  className="flex h-8 items-center justify-center rounded-md font-mono text-[10px] uppercase tracking-widest"
                  style={{
                    width: `${100 - width * 0.55}%`,
                    minWidth: '9rem',
                    color: t.accent,
                    background: t.accent + '14',
                    border: `1px solid ${t.accent}55`,
                    boxShadow: `0 0 18px ${t.accent}22`,
                  }}
                >
                  {t.label}
                </motion.div>
              )
              return t.fact ? (
                <Tip key={t.label} label={t.label} fact={t.fact} accent={t.accent} suppliers={t.sup} className="w-full justify-center">
                  {plate}
                </Tip>
              ) : (
                <div key={t.label} className="flex w-full justify-center">
                  {plate}
                </div>
              )
            })}
          </div>

          {/* the grain of sand beneath everything */}
          <div className="mt-4 flex flex-col items-center">
            <Tip
              label="One grain"
              fact="SiO₂. Melted, purified, pulled, sliced, printed, packaged, racked, trained — and finally, asked a question."
              accent={layer.accent}
            >
              <motion.span
                className="block h-2.5 w-2.5 rounded-full bg-orange-300"
                animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 2.4 }}
                style={{ boxShadow: '0 0 18px 5px rgba(251,146,60,0.5)' }}
              />
            </Tip>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">
              SiO₂ · one grain of quartz
            </p>
          </div>
        </div>

        {/* closing statement */}
        <div className="text-center lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-3xl font-light leading-snug text-slate-200 sm:text-5xl"
          >
            Every token
            <br />
            begins as{' '}
            <motion.span
              className="font-normal text-orange-300"
              animate={{ opacity: [0.75, 1, 0.75] }}
              transition={{ repeat: Infinity, duration: 3 }}
              style={{ textShadow: '0 0 30px rgba(251,146,60,0.55)' }}
            >
              sand
            </motion.span>
            .
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-5 max-w-md text-sm leading-relaxed text-slate-500 lg:mx-0 mx-auto"
          >
            Twelve layers down, the stack rests on the oldest technology there
            is: the Earth. Your next question makes the round trip — sand to
            silicon to thought and back — in about a second.
          </motion.p>
          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.8 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              document.getElementById('user')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="mt-8 rounded-full border border-orange-400/40 bg-orange-400/10 px-6 py-2.5 font-mono text-xs uppercase tracking-widest text-orange-200 transition-colors hover:bg-orange-400/20"
          >
            Ask another question ↺
          </motion.button>
        </div>
      </div>
    </Section>
  )
}
