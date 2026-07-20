import { useEffect, useRef } from 'react'

// Fixed parallax starfield + faint circuit traces, drawn on canvas.
// Stars drift at depth-dependent speeds as the page scrolls.
export default function Starfield() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const DPR = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    let raf = 0
    let stars = []
    let traces = []
    let t = 0

    const resize = () => {
      w = canvas.width = window.innerWidth * DPR
      h = canvas.height = window.innerHeight * DPR
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
    }

    const seed = () => {
      stars = Array.from({ length: 170 }, () => ({
        x: Math.random(),
        y: Math.random(),
        z: Math.random(),
        tw: Math.random() * Math.PI * 2,
      }))
      // sparse vertical circuit traces with right-angle jogs
      traces = Array.from({ length: 7 }, () => {
        const x = Math.random()
        return {
          x,
          jogY: 0.2 + Math.random() * 0.6,
          jogX: x + (Math.random() - 0.5) * 0.12,
          a: 0.03 + Math.random() * 0.04,
        }
      })
    }

    const draw = () => {
      t += 0.016
      ctx.clearRect(0, 0, w, h)
      const scroll = window.scrollY

      ctx.lineWidth = 1 * DPR
      for (const tr of traces) {
        ctx.strokeStyle = `rgba(94,234,212,${tr.a})`
        ctx.beginPath()
        ctx.moveTo(tr.x * w, 0)
        ctx.lineTo(tr.x * w, tr.jogY * h)
        ctx.lineTo(tr.jogX * w, tr.jogY * h)
        ctx.lineTo(tr.jogX * w, h)
        ctx.stroke()
      }

      for (const s of stars) {
        const speed = 0.04 + s.z * 0.14
        const y = (((s.y * h - scroll * speed * DPR) % h) + h) % h
        const alpha =
          (0.25 + s.z * 0.5) * (0.7 + 0.3 * Math.sin(t * 2 + s.tw))
        ctx.fillStyle =
          s.z > 0.85
            ? `rgba(167,139,250,${alpha})`
            : s.z > 0.65
              ? `rgba(34,211,238,${alpha})`
              : `rgba(226,232,240,${alpha * 0.75})`
        const size = (0.7 + s.z) * DPR
        ctx.fillRect(s.x * w, y, size, size)
      }
      raf = requestAnimationFrame(draw)
    }

    const onVis = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden) raf = requestAnimationFrame(draw)
    }

    resize()
    seed()
    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    />
  )
}
