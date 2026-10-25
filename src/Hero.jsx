import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './hero.css'

const links = [['首页', '#top'], ['功能模块', '#features'], ['业务场景', '#roles'], ['订阅方案', '#pricing']]

function Sky() {
  const canvas = useRef(null)
  const skyVideo = useRef(null)
  const [motion, setMotion] = useState(false)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const video = skyVideo.current
    if (!video) return
    let visible = true
    const sync = () => {
      if (visible && !document.hidden) video.play().catch(() => {})
      else video.pause()
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
    observer.observe(video)
    document.addEventListener('visibilitychange', sync)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); video.pause() }
  }, [motion])
  useEffect(() => {
    const media = matchMedia('(min-width: 900px) and (orientation: landscape) and (prefers-reduced-motion: no-preference)')
    const update = () => setMotion(media.matches)
    update()
    media.addEventListener('change', update)
    const draw = () => {
      const el = canvas.current
      const width = el.clientWidth, height = el.clientHeight
      const ratio = Math.min(devicePixelRatio, 2)
      el.width = width * ratio; el.height = height * ratio
      const ctx = el.getContext('2d')
      ctx.scale(ratio, ratio)
      let seed = 47
      const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
      for (let i = 0; i < 230; i++) {
        ctx.fillStyle = 'rgba(255,255,255,' + (.15 + random() * .6) + ')'
        ctx.beginPath(); ctx.arc(random() * width, random() * height, .3 + random() * .7, 0, Math.PI * 2); ctx.fill()
      }
    }
    const observer = new ResizeObserver(draw)
    observer.observe(canvas.current)
    return () => { media.removeEventListener('change', update); observer.disconnect() }
  }, [])
  return <div className="royal-sky" aria-hidden="true">
    <canvas ref={canvas} />
    <div className={ready && motion ? 'royal-rim is-covered' : 'royal-rim'} />
    {motion && <video ref={skyVideo} className={ready ? 'royal-video is-ready' : 'royal-video'} autoPlay muted loop playsInline onCanPlay={() => setReady(true)} onError={() => setReady(false)} src="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/e859f229-8ebd-43fb-a5a0-58006ba75327.mp4" />}
  </div>
}

export default function Hero() {
  const hero = useRef(null)
  const [floating, setFloating] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('top')
  useEffect(() => {
    const sections = ['top', 'features', 'roles', 'pricing', 'contact'].map(id => document.getElementById(id))
    const update = () => {
      const current = sections.filter(section => section && section.getBoundingClientRect().top <= innerHeight * .4).at(-1)
      setActiveSection(current?.id || 'top')
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])
  const toggle = useRef(null)
  const panel = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setFloating(entry.boundingClientRect.bottom <= 96)
    }, { rootMargin: '-96px 0px 0px 0px', threshold: 0 })
    observer.observe(hero.current)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!open) return
    const old = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panel.current?.querySelector('a')?.focus()
    function keyboard(event) {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus() }
      if (event.key !== 'Tab') return
      const nodes = [toggle.current, ...panel.current.querySelectorAll('a')]
      const first = nodes[0], last = nodes[nodes.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', keyboard)
    const desktop = matchMedia('(min-width: 900px) and (orientation: landscape)')
    const close = () => { if (desktop.matches) setOpen(false) }
    desktop.addEventListener('change', close)
    return () => { document.body.style.overflow = old; document.removeEventListener('keydown', keyboard); desktop.removeEventListener('change', close) }
  }, [open])

  return <section className="ap-hero" id="top" ref={hero}>
    <Sky />
    <div className="opening-curtain" aria-hidden="true" />
    <div className="ap-nav-space" aria-hidden="true" />
    {createPortal(<div className={`ap-navigation-layer ${floating ? 'is-floating' : ''}`}>
    <nav className="ap-nav ap-container" aria-label="主导航">
      <a className="ap-brand" href="#top" aria-label="Navfull 首页"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>Navfull<span className="ap-brand-period">.</span></a>
      <div className="ap-links">{links.map(([label, href]) => <a href={href} key={href} className={activeSection === href.slice(1) ? 'royal-home' : ''} aria-current={activeSection === href.slice(1) ? 'location' : undefined}>{label}</a>)}</div>
      <div className="ap-nav-actions"><a href="#contact">联系专家</a><a className="ap-light" href="#contact">预约演示</a></div>
      <button ref={toggle} className={`ap-toggle ${open ? 'is-open' : ''}`} aria-label={open ? '关闭导航' : '打开导航'} aria-expanded={open} aria-controls="ap-mobile-menu" onClick={() => setOpen(!open)}><span /><span /></button>
    </nav>
    <div className={`ap-menu ${open ? 'is-open' : ''}`} inert={!open} aria-hidden={!open}>
      <div className="ap-backdrop" onClick={() => setOpen(false)} />
      <div className="ap-menu-panel" id="ap-mobile-menu" ref={panel}>{links.map(([label, href]) => <a key={href} href={href} aria-current={activeSection === href.slice(1) ? 'location' : undefined} onClick={() => setOpen(false)}>{label}</a>)}<a className="ap-light" href="#contact" onClick={() => setOpen(false)}>预约演示</a></div>
    </div>
    </div>, document.body)}
    <div className="ap-main ap-container">
      <div className="ap-copy">
        <h1><span><span className="hero-line"><em>Navfull</em> 智能领航，</span></span><span><span className="hero-line">更安全，更高效。</span></span></h1>
        <p>融合全球气象预报与船舶数字孪生，让每一次远洋决策更有把握。<br />从船舶位置、航线规划到航路风险，始终看得更远一步。</p>
        <div className="ap-cta"><a className="ap-light" href="#contact">申请免费测试航次</a><a className="ap-outline" href="#features">探索功能模块</a></div>
      </div>
    </div>

  </section>
}
