export default function StatChip({ label, accent = '#22d3ee' }) {
  return (
    <span
      className="rounded-full border px-2.5 py-1 font-mono text-[11px] whitespace-nowrap"
      style={{
        borderColor: accent + '44',
        color: accent,
        background: accent + '0d',
      }}
    >
      {label}
    </span>
  )
}
