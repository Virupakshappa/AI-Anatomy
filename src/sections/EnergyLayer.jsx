import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Section from '../components/Section'
import Tip from '../components/Tip'
import { LAYERS } from '../data/layers'

const layer = LAYERS[10]

export default function EnergyLayer() {
  const [mw, setMw] = useState(87.4)

  useEffect(() => {
    const t = setInterval(
      () => setMw(87.4 + (Math.random() - 0.5) * 0.6),
      800
    )
    return () => clearInterval(t)
  }, [])

  return (
    <Section layer={layer}>
      {/* live megawatt counter */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
            campus draw · live
          </p>
          <p className="font-mono text-4xl font-bold tabular-nums text-yellow-200 text-glow sm:text-5xl">
            {mw.toFixed(1)}
            <span className="ml-2 text-lg text-yellow-500/80">MW</span>
          </p>
        </div>
        <Tip
          label="PUE"
          suppliers="datacenter-operators"
          fact="Power Usage Effectiveness: 1.12 means only 12% of the energy goes to anything other than the chips themselves."
          accent={layer.accent}
        >
          <span className="rounded-full border border-yellow-400/40 bg-yellow-400/10 px-3 py-1.5 font-mono text-sm text-yellow-200">
            PUE 1.12
          </span>
        </Tip>
      </div>

      {/* power flow diagram */}
      <div className="panel overflow-x-auto p-4 sm:p-6">
        <svg viewBox="0 0 900 260" className="h-auto w-full min-w-[640px]">
          <defs>
            <path id="hv1" d="M 120 60 C 200 60 220 110 300 116" fill="none" />
            <path id="hv2" d="M 120 120 C 190 120 220 118 300 122" fill="none" />
            <path id="hv3" d="M 120 180 C 200 180 220 130 300 128" fill="none" />
            <path id="feed" d="M 360 122 H 470" fill="none" />
            <path id="dist" d="M 530 122 H 640 H 720" fill="none" />
          </defs>

          {/* generation icons */}
          <g>
            {/* nuclear cooling tower */}
            <path d="M 76 36 C 68 52 68 62 62 78 H 104 C 98 62 98 52 90 36 Z" fill="#1c1917" stroke="#facc15" strokeOpacity="0.6" />
            {[0, 1].map((i) => (
              <motion.circle
                key={i}
                cx={83 + i * 8}
                cy={26}
                r={5}
                fill="#e2e8f0"
                opacity="0.25"
                animate={{ y: [-2, -14], opacity: [0.3, 0], scale: [1, 1.7] }}
                transition={{ repeat: Infinity, duration: 2.6, delay: i * 1.2 }}
              />
            ))}
            <text x="83" y="94" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#a1a1aa">nuclear</text>

            {/* wind turbine */}
            <line x1="83" y1="120" x2="83" y2="150" stroke="#facc15" strokeOpacity="0.6" strokeWidth="2" />
            <g>
              <g>
                {[0, 120, 240].map((a) => (
                  <line
                    key={a}
                    x1="83"
                    y1="120"
                    x2="83"
                    y2="102"
                    stroke="#fde68a"
                    strokeWidth="2"
                    transform={`rotate(${a} 83 120)`}
                  />
                ))}
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 83 120"
                  to="360 83 120"
                  dur="3.5s"
                  repeatCount="indefinite"
                />
              </g>
            </g>
            <text x="83" y="164" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#a1a1aa">wind</text>

            {/* solar panel */}
            <g transform="translate(58 182)">
              <rect width="50" height="26" rx="3" fill="#0c1a2e" stroke="#facc15" strokeOpacity="0.6" />
              {[8, 20, 32, 44].map((x) => (
                <line key={x} x1={x} y1="2" x2={x} y2="24" stroke="#facc15" strokeOpacity="0.25" />
              ))}
              <motion.rect
                width="12"
                height="26"
                rx="3"
                fill="#fde68a"
                opacity="0.25"
                animate={{ x: [0, 38, 0] }}
                transition={{ repeat: Infinity, duration: 3.4, ease: 'easeInOut' }}
              />
            </g>
            <text x="83" y="226" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#a1a1aa">solar</text>
          </g>

          {/* HV lines with flowing electrons */}
          {['hv1', 'hv2', 'hv3'].map((id) => (
            <g key={id}>
              <use href={`#${id}`} stroke="#facc15" strokeOpacity="0.25" strokeWidth="1.5" />
              <use href={`#${id}`} stroke="#fde68a" strokeWidth="1.5" className="animate-flow" />
            </g>
          ))}
          {['hv1', 'hv2', 'hv3'].map((id, i) => (
            <circle key={id} r="3" fill="#fef08a" style={{ filter: 'drop-shadow(0 0 4px #fde047)' }}>
              <animateMotion dur={`${2.2 + i * 0.5}s`} begin={`${i * 0.4}s`} repeatCount="indefinite">
                <mpath href={`#${id}`} />
              </animateMotion>
            </circle>
          ))}
          <text x="200" y="46" fontSize="8.5" fontFamily="monospace" fill="#64748b">230 kV transmission</text>

          {/* substation / transformer */}
          <g>
            <motion.g
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
            >
              <circle cx="322" cy="112" r="16" fill="none" stroke="#facc15" strokeWidth="2" />
              <circle cx="340" cy="130" r="16" fill="none" stroke="#fbbf24" strokeWidth="2" />
            </motion.g>
            <text x="330" y="166" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#a1a1aa">substation</text>
            <text x="330" y="82" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#64748b">→ 34.5 kV</text>
          </g>

          <g>
            <use href="#feed" stroke="#facc15" strokeOpacity="0.25" strokeWidth="1.5" />
            <use href="#feed" stroke="#fde68a" strokeWidth="1.5" className="animate-flow" />
          </g>

          {/* UPS */}
          <g transform="translate(478 100)">
            <rect width="44" height="44" rx="6" fill="#1c1917" stroke="#facc15" strokeOpacity="0.6" />
            <rect x="12" y="8" width="20" height="28" rx="2" fill="none" stroke="#fde68a" />
            <rect x="18" y="4" width="8" height="4" fill="#fde68a" />
            {[0, 1, 2].map((i) => (
              <motion.rect
                key={i}
                x="15"
                y={28 - i * 7}
                width="14"
                height="5"
                fill="#facc15"
                animate={{ opacity: [0.2, 1, 1, 0.2] }}
                transition={{ repeat: Infinity, duration: 2.4, delay: i * 0.4 }}
              />
            ))}
            <text x="22" y="58" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#a1a1aa">UPS</text>
          </g>

          <g>
            <use href="#dist" stroke="#facc15" strokeOpacity="0.25" strokeWidth="1.5" />
            <use href="#dist" stroke="#fde68a" strokeWidth="1.5" className="animate-flow" />
          </g>
          <text x="585" y="112" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#64748b">PDU · 415 V</text>

          {/* busbar + racks */}
          <rect x="720" y="70" width="6" height="120" rx="2" fill="#fbbf24" opacity="0.7" />
          <text x="723" y="206" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#a1a1aa">busbar</text>
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(748 ${74 + i * 30})`}>
              <line x1="-22" y1="12" x2="0" y2="12" stroke="#facc15" strokeOpacity="0.4" />
              <motion.rect
                width="110"
                height="24"
                rx="4"
                fill="#131b2e"
                stroke="#fbbf24"
                strokeOpacity="0.5"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 2.2, delay: i * 0.3 }}
              />
              {[0, 1, 2, 3, 4].map((j) => (
                <circle
                  key={j}
                  cx={12 + j * 20}
                  cy="12"
                  r="2.5"
                  fill="#fde047"
                  className="led"
                  style={{ animationDelay: `${(i * 5 + j) * 0.23}s` }}
                />
              ))}
            </g>
          ))}
        </svg>
      </div>

      {/* labeled hotspots */}
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        <Tip label="Transformer" suppliers="grid-equipment" fact="Steps voltage down like gears on a bike — same power, different push." accent={layer.accent}>
          <span className="cursor-default font-mono text-[10px] uppercase tracking-wider text-yellow-200/70 underline decoration-dotted underline-offset-4">transformer</span>
        </Tip>
        <Tip label="UPS" suppliers={['ups-power', 'batteries-bess']} fact="Batteries carry the whole datacenter for seconds — just long enough for diesel generators to wake up." accent={layer.accent}>
          <span className="cursor-default font-mono text-[10px] uppercase tracking-wider text-yellow-200/70 underline decoration-dotted underline-offset-4">UPS</span>
        </Tip>
        <Tip label="Busbar" suppliers="grid-equipment" fact="A copper spine running the length of the hall, carrying thousands of amps to the rack rows." accent={layer.accent}>
          <span className="cursor-default font-mono text-[10px] uppercase tracking-wider text-yellow-200/70 underline decoration-dotted underline-offset-4">busbar</span>
        </Tip>
        <Tip label="Nuclear" suppliers="power-generation" fact="One large reactor (~1 GW) could feed roughly ten AI campuses this size." accent={layer.accent}>
          <span className="cursor-default font-mono text-[10px] uppercase tracking-wider text-yellow-200/70 underline decoration-dotted underline-offset-4">nuclear</span>
        </Tip>
      </div>
    </Section>
  )
}
