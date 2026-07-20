import { motion } from 'framer-motion'
import Section from '../components/Section'
import Tip from '../components/Tip'
import { LAYERS } from '../data/layers'

const layer = LAYERS[1]
const A = layer.accent

// One continuous route: browser → tls → cdn → lb, down to gateway → auth →
// rate limiter, then down into the request queue and out the bottom.
const ROUTE =
  'M95 70 H630 C700 70 700 185 630 185 H235 C160 185 160 260 250 285 C310 302 385 305 450 305 V392'

// Plain labels (no tooltip) — positioned as % of the 900x420 viewBox.
const LABELS = [
  { x: 10.6, y: 25.5, text: 'browser' },
  { x: 70, y: 52.8, text: 'api gateway' },
  { x: 47.8, y: 52.8, text: 'auth' },
]

// Hover-hotspot labels.
const TIPS = [
  {
    x: 27.8,
    y: 25.5,
    text: 'https · tls',
    label: 'TLS 1.3',
    fact: 'Your prompt is encrypted before it leaves the tab — every hop in between sees only ciphertext.',
  },
  {
    x: 47.2,
    y: 26.6,
    text: 'cdn edge',
    label: 'Edge PoP',
    sup: 'cdn-edge',
    fact: 'Anycast routing sends you to the nearest of hundreds of points of presence — often under 20 ms away.',
  },
  {
    x: 70,
    y: 25.5,
    text: 'load balancer',
    label: 'Load balancer',
    sup: 'traffic-management',
    fact: 'Health-checks the whole fleet and spreads millions of requests so no single box ever melts.',
  },
  {
    x: 26.1,
    y: 52.8,
    text: 'rate limiter',
    label: 'Rate limiter',
    sup: 'traffic-management',
    fact: 'Token-bucket: everyone gets a fair sip. Burst too hard and you drink an HTTP 429 instead.',
  },
  {
    x: 50,
    y: 84.5,
    text: 'request queue',
    label: 'Request queue',
    sup: 'traffic-management',
    fact: 'Your request waits — milliseconds that feel like nothing — for a free slot on a GPU downstream.',
  },
]

const labelClass =
  'whitespace-nowrap font-mono text-[7px] uppercase tracking-widest text-slate-500 sm:text-[10px]'

export default function ApiEdgeLayer() {
  return (
    <Section layer={layer}>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15% 0px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto w-full max-w-4xl"
      >
        {/* ambient glow */}
        <div
          aria-hidden
          className="absolute -inset-10 rounded-full blur-3xl"
          style={{ backgroundColor: A + '0f' }}
        />

        <div className="relative">
          <svg
            viewBox="0 0 900 420"
            className="h-auto w-full"
            role="img"
            aria-label="Request lifecycle: browser to TLS to CDN to load balancer to gateway, auth, rate limiter and request queue"
          >
            {/* route: static base + flowing dashes */}
            <path id="edgeRoute" d={ROUTE} fill="none" stroke="#1e293b" strokeWidth="2" />
            <path
              d={ROUTE}
              fill="none"
              stroke={A}
              strokeOpacity="0.5"
              strokeWidth="1.6"
              className="animate-flow"
            />

            {/* hero packets riding the route (negative begins = already in flight) */}
            {['0s', '-2s', '-4s'].map((begin) => (
              <g key={begin}>
                <circle r="7" fill={A} opacity="0.25" />
                <circle r="3" fill="#e0f2fe" />
                <animateMotion dur="6s" begin={begin} repeatCount="indefinite">
                  <mpath href="#edgeRoute" />
                </animateMotion>
              </g>
            ))}

            {/* a 429: red packet reaches the rate limiter and bounces back */}
            <g>
              <circle r="6" fill="#f87171" opacity="0.3" />
              <circle r="3" fill="#f87171" />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.06;0.94;1"
                dur="5s"
                begin="-1s"
                repeatCount="indefinite"
              />
              <animateMotion
                path="M430 185 C395 185 340 185 300 185 C340 185 395 185 430 185"
                dur="5s"
                begin="-1s"
                repeatCount="indefinite"
              />
            </g>
            <text
              x="300"
              y="152"
              textAnchor="middle"
              fontSize="12"
              fill="#f87171"
              opacity="0"
              className="font-mono"
            >
              429
              <animate
                attributeName="opacity"
                values="0;0;1;1;0;0"
                keyTimes="0;0.38;0.46;0.6;0.68;1"
                dur="5s"
                begin="-1s"
                repeatCount="indefinite"
              />
            </text>

            {/* browser */}
            <rect x="40" y="48" width="110" height="44" rx="10" fill="#0b1220" stroke={A} strokeOpacity="0.4" />
            <rect x="52" y="60" width="56" height="5" rx="2.5" fill={A} fillOpacity="0.5" />
            <rect x="52" y="72" width="36" height="5" rx="2.5" fill="#334155" />
            <circle cx="132" cy="70" r="4" fill={A} fillOpacity="0.7">
              <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
            </circle>

            {/* tls padlock */}
            <path
              d="M241 60 v-7 a9 9 0 0 1 18 0 v7"
              fill="none"
              stroke={A}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <rect x="234" y="60" width="32" height="24" rx="6" fill="#0b1220" stroke={A} strokeOpacity="0.7" strokeWidth="1.5" />
            <circle cx="250" cy="72" r="3" fill={A}>
              <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" />
            </circle>

            {/* cdn cluster: three linked edge nodes */}
            <line x1="408" y1="60" x2="444" y2="62" stroke={A} strokeOpacity="0.3" />
            <line x1="408" y1="60" x2="426" y2="86" stroke={A} strokeOpacity="0.3" />
            <line x1="444" y1="62" x2="426" y2="86" stroke={A} strokeOpacity="0.3" />
            {[
              [408, 60],
              [444, 62],
              [426, 86],
            ].map(([cx, cy], i) => (
              <g key={i}>
                <circle cx={cx} cy={cy} r="9" fill="#0b1220" stroke={A} strokeOpacity="0.7" />
                <circle cx={cx} cy={cy} r="3" fill={A}>
                  <animate
                    attributeName="opacity"
                    values="0.25;1;0.25"
                    dur="2.4s"
                    begin={`${i * 0.5}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            ))}

            {/* load balancer */}
            <rect x="575" y="48" width="110" height="44" rx="10" fill="#0b1220" stroke={A} strokeOpacity="0.4" />
            {[0, 1, 2].map((i) => (
              <rect key={i} x="589" y={57 + i * 10} width="82" height="5" rx="2.5" fill={A}>
                <animate
                  attributeName="opacity"
                  values="0.15;0.8;0.15"
                  dur="1.8s"
                  begin={`${i * 0.6}s`}
                  repeatCount="indefinite"
                />
              </rect>
            ))}

            {/* api gateway */}
            <rect x="575" y="163" width="110" height="44" rx="10" fill="#0b1220" stroke={A} strokeOpacity="0.4" />
            <path
              d="M600 185 h60 M630 175 v20"
              stroke={A}
              strokeOpacity="0.5"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* auth shield */}
            <rect x="385" y="163" width="90" height="44" rx="10" fill="#0b1220" stroke={A} strokeOpacity="0.4" />
            <path
              d="M430 172 l10 4 v8 c0 6 -4 9 -10 12 c-6 -3 -10 -6 -10 -12 v-8 z"
              fill={A}
              fillOpacity="0.25"
              stroke={A}
              strokeOpacity="0.8"
              strokeWidth="1.5"
            />

            {/* rate limiter: token bucket draining */}
            <rect x="180" y="163" width="110" height="44" rx="10" fill="#0b1220" stroke={A} strokeOpacity="0.4" />
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={205 + i * 18} y="176" width="10" height="18" rx="2" fill={A}>
                <animate
                  attributeName="opacity"
                  values="0.9;0.15;0.9"
                  dur="2.8s"
                  begin={`${i * 0.7}s`}
                  repeatCount="indefinite"
                />
              </rect>
            ))}

            {/* request queue: bars filling and draining */}
            <rect x="385" y="277" width="130" height="56" rx="10" fill="#0b1220" stroke={A} strokeOpacity="0.4" />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect key={i} x={399 + i * 17} y="289" width="11" height="32" rx="2" fill={A}>
                <animate
                  attributeName="opacity"
                  values="0.1;0.9;0.9;0.1"
                  keyTimes="0;0.3;0.7;1"
                  dur="3.6s"
                  begin={`${i * 0.3}s`}
                  repeatCount="indefinite"
                />
              </rect>
            ))}

            {/* exit arrow to the next layer */}
            <path
              d="M436 384 L450 398 L464 384"
              fill="none"
              stroke={A}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <animate attributeName="opacity" values="0.25;1;0.25" dur="1.8s" repeatCount="indefinite" />
            </path>
          </svg>

          {/* html labels overlaid on the svg (scale via % positions) */}
          {LABELS.map((l) => (
            <span
              key={l.text}
              className={`absolute -translate-x-1/2 ${labelClass}`}
              style={{ left: `${l.x}%`, top: `${l.y}%` }}
            >
              {l.text}
            </span>
          ))}
          {TIPS.map((t) => (
            <span
              key={t.text}
              className="absolute -translate-x-1/2"
              style={{ left: `${t.x}%`, top: `${t.y}%` }}
            >
              <Tip label={t.label} fact={t.fact} accent={A} suppliers={t.sup}>
                <span className={`${labelClass} border-b border-dotted border-slate-600`}>
                  {t.text}
                </span>
              </Tip>
            </span>
          ))}
          <span
            className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[7px] uppercase tracking-[0.3em] sm:text-[10px]"
            style={{ top: '96.5%', color: A + 'aa' }}
          >
            ↓ to inference serving
          </span>
        </div>
      </motion.div>
    </Section>
  )
}
