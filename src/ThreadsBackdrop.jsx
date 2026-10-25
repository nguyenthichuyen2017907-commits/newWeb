import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import './ThreadsBackdrop.css'

const Threads = lazy(() => import('./Threads.jsx'))

export default function ThreadsBackdrop() {
  const ref = useRef(null)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setReady(true)
        observer.disconnect()
      }
    }, { rootMargin: '160px' })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return <div ref={ref} className="nv-threads-backdrop" aria-hidden="true">
    {ready && <Suspense fallback={null}><Threads color="#2b6de5" accentColor="#7a9db5"
      lineCount={48} thickness={0.7} softness={0.8} amplitude={1.3}
      distance={0.28} waves={0.85} speed={0.22} split={0.08} fray={0.55}
      angle={-12} taper={0.65} brightness={1.2} fade={0.85} opacity={0.2}
      enableMouseInteraction={false}/></Suspense>}
  </div>
}
