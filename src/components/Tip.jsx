import { useEffect, useRef, useState } from 'react'
import { DISCLAIMER, SUPPLIERS } from '../data/suppliers'

// Hover hotspot: wraps any element, glows on hover and reveals a tooltip
// with a label + fun fact.
//
// Optional `suppliers` prop: a SUPPLIERS key (or array of keys). When set,
// the tooltip gets a small circled "S" button at its top-right; clicking it
// opens an inline popup (✕ / Escape to close) listing the top 10 companies
// behind that component, with tab chips when several categories apply.
//
// Hover is JS-managed with a leave grace period so the cursor can travel
// from the trigger into the tooltip (and onto the S button) without it
// vanishing — pure CSS group-hover dies in the gap between the two.
const HIDE_DELAY = 320

export default function Tip({
  label,
  fact,
  accent = '#22d3ee',
  suppliers,
  children,
  className = '',
}) {
  const [hover, setHover] = useState(false)
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState(0)
  const hideTimer = useRef(null)

  const keys = Array.isArray(suppliers) ? suppliers : suppliers ? [suppliers] : []
  const data = keys.length ? SUPPLIERS[keys[Math.min(tab, keys.length - 1)]] : null

  const enter = () => {
    clearTimeout(hideTimer.current)
    setHover(true)
  }
  const leave = () => {
    clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setHover(false), HIDE_DELAY)
  }

  useEffect(() => () => clearTimeout(hideTimer.current), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const shown = hover && !open

  return (
    <span
      className={`group/tip relative inline-flex ${className}`}
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      <span className="transition duration-300 group-hover/tip:brightness-125">
        {children}
      </span>

      {/* hover tooltip (hidden while the suppliers popup is open) */}
      {!open && (
        <span
          className={`absolute bottom-full left-1/2 z-40 mb-2 w-56 -translate-x-1/2 rounded-lg border border-slate-700/80 bg-slate-950/95 p-3 text-left shadow-2xl backdrop-blur transition duration-200 ${
            shown
              ? 'pointer-events-auto scale-100 opacity-100'
              : 'pointer-events-none scale-95 opacity-0'
          }`}
        >
          {/* invisible bridge over the gap below the tooltip */}
          <span aria-hidden className="absolute inset-x-0 top-full h-3" />
          <span
            className="block font-mono text-[10px] uppercase tracking-widest"
            style={{ color: accent }}
          >
            {label}
          </span>
          <span className="mt-1 block text-xs leading-relaxed text-slate-300">
            {fact}
          </span>
          {data && (
            <button
              type="button"
              aria-label={`Show top suppliers for ${label}`}
              title="Top 10 suppliers"
              onClick={(e) => {
                e.stopPropagation()
                setTab(0)
                setOpen(true)
              }}
              className="absolute -right-2 -top-2 grid h-5 w-5 cursor-pointer place-items-center rounded-full border bg-slate-950 font-mono text-[10px] font-bold leading-none transition hover:scale-110"
              style={{ borderColor: accent, color: accent }}
            >
              S
            </button>
          )}
        </span>
      )}

      {/* suppliers popup */}
      {open && data && (
        <span className="absolute bottom-full left-1/2 z-50 mb-2 w-80 max-w-[88vw] -translate-x-1/2 rounded-xl border border-slate-600/80 bg-slate-950/95 p-3 text-left shadow-2xl backdrop-blur">
          <span className="flex items-start justify-between gap-2">
            <span>
              <span
                className="block font-mono text-[10px] uppercase tracking-widest"
                style={{ color: accent }}
              >
                Suppliers · {label}
              </span>
              <span className="mt-0.5 block text-[11px] text-slate-400">
                {data.title}
              </span>
            </span>
            <button
              type="button"
              aria-label="Close suppliers popup"
              onClick={(e) => {
                e.stopPropagation()
                setOpen(false)
              }}
              className="grid h-5 w-5 shrink-0 cursor-pointer place-items-center rounded-full border border-slate-600 text-[10px] leading-none text-slate-400 transition hover:border-slate-400 hover:text-slate-200"
            >
              ✕
            </button>
          </span>

          {/* category tabs when several supply markets apply */}
          {keys.length > 1 && (
            <span className="mt-2 flex flex-wrap gap-1">
              {keys.map((k, i) => (
                <button
                  key={k}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setTab(i)
                  }}
                  className="cursor-pointer rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider transition"
                  style={
                    i === Math.min(tab, keys.length - 1)
                      ? { borderColor: accent, color: accent, background: accent + '14' }
                      : { borderColor: '#334155', color: '#64748b' }
                  }
                >
                  {SUPPLIERS[k]?.tab ?? k}
                </button>
              ))}
            </span>
          )}

          <span className="mt-2 block max-h-60 overflow-y-auto pr-1">
            {data.rows.map((r, i) => (
              <span
                key={r.name}
                className="flex items-baseline gap-2 border-b border-slate-800/60 py-1.5 last:border-0"
              >
                <span className="w-4 shrink-0 text-right font-mono text-[10px] text-slate-500">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs text-slate-200">
                    {r.name}
                  </span>
                  <span className="block truncate text-[10px] text-slate-500">
                    {r.role}
                  </span>
                </span>
                <span
                  className="shrink-0 font-mono text-[10px]"
                  style={{
                    color:
                      r.ticker === 'private' || r.ticker === 'state-owned'
                        ? '#64748b'
                        : accent,
                  }}
                >
                  {r.ticker}
                </span>
              </span>
            ))}
          </span>

          <span className="mt-2 block border-t border-slate-800 pt-1.5 text-center font-mono text-[9px] uppercase tracking-wider text-slate-600">
            {DISCLAIMER}
          </span>
        </span>
      )}
    </span>
  )
}
