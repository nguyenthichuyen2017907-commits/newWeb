import { useEffect, useRef } from 'react'
import './BorderGlow.css'

// Directional edge proximity adapted from the supplied React Bits BorderGlow.
export default function BorderGlow({ children, className = '', as: Tag = 'article', ...props }) {
  const card = useRef(null)
  const frame = useRef(0)
  const pointer = useRef({ x: 0, y: 0 })
  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  const move = event => {
    if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce), (hover: none)').matches) return
    pointer.current = { x: event.clientX, y: event.clientY }
    if (frame.current) return
    frame.current = requestAnimationFrame(() => {
      frame.current = 0
      const el = card.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const x = pointer.current.x - rect.left - rect.width / 2
      const y = pointer.current.y - rect.top - rect.height / 2
      const proximity = Math.min(1, Math.max(Math.abs(x) / (rect.width / 2), Math.abs(y) / (rect.height / 2)))
      el.style.setProperty('--edge-angle', `${Math.atan2(y, x) * 180 / Math.PI + 90}deg`)
      el.style.setProperty('--edge-power', Math.max(0, (proximity - .3) / .7).toFixed(3))
    })
  }
  const leave = () => {
    cancelAnimationFrame(frame.current)
    frame.current = 0
    card.current?.style.setProperty('--edge-power', '0')
  }
  return <Tag {...props} className={`nf-border-glow ${className}`} ref={card} onPointerMove={move} onPointerLeave={leave} onPointerCancel={leave}>
    {children}
    <span className="nf-edge-glow" aria-hidden="true"><span /></span>
  </Tag>
}
