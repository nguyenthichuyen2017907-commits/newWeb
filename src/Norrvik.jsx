import ThreadsBackdrop from './ThreadsBackdrop.jsx'
import { assetUrl } from './assetUrl.js'
import { useEffect, useRef, useState } from 'react'
import './norrvik.css'
import { LocaleProvider, useLocale, LanguageSwitch } from './Locale.jsx'
import './Locale.css'
import { MotionTitle, useEditorialMotion } from './EditorialMotion.jsx'
import './FloatingNavigation.css'
import './CrewAccordion.css'
import CapabilityShowcase from './CapabilityShowcase.jsx'
import GooeyNav from './GooeyNav.jsx'
import SubscriptionPlans from './SubscriptionPlans.jsx'
import './MobileCardNav.css'

const getCrew = t => [
  [t("LUKAS BRENNER"), t("OPERATIONS LEAD"), assetUrl('/optimized/ocean-voyage-concept.jpg')],
  [t("AMINA OKAFOR"), t("PORT STRATEGY"), assetUrl('/optimized/crew-meteorologist-typhoon.jpg')],
  [t("MARTIN KLEIN"), t("FLEET DIRECTOR"), assetUrl('/optimized/crew-shore-dispatcher.jpg')],
  [t("SOFIA LIND"), t("CARGO CONTROL"), assetUrl('/optimized/crew-risk-assessment.jpg')],
  [t("JONAS BERG"), t("VESSEL OPS"), assetUrl('/optimized/product-path.jpg')],
]

const getModes = t => [
  ['01', t("TIME-CRITICAL LANES"), t("When the schedule matters, every move is visible.")],
  ['02', t("COLD CHAIN, START TO FINISH"), t("Temperature-sensitive cargo, tracked across every handoff.")],
  ['03', t("A DASHBOARD LIKE YOUR CFO"), t("One live view for cost, carbon, capacity and confidence.")],
]

function Logo() { return <img src={assetUrl('/navfull-logo.png')} alt="Navfull" width="789" height="110" /> }

function Header() {
  const { t, language } = useLocale()
  const [open, setOpen] = useState(false)
  const headerRef = useRef(null)
  const menuRef = useRef(null)
  const targets = ['#top', '#cargo', '#crew', '#plans', '#contact']
  const labels = [t('ABOUT US'), t('OUR CARGO'), t('THE CREW'), language === 'zh' ? '订阅方案' : 'Plans', t('CONTACT')]
  const descriptions = language === 'zh'
    ? ['每次远航，更有把握。', '气象、航线与风险决策', '船岸协同，共享航次信息', '找到适合你的服务方案', '一起规划下一次远航']
    : ['Navigate with confidence.', 'Weather, routes and risk', 'Connect ship and shore', 'Find the right service plan', 'Plan your next voyage together']
  useEffect(() => {
    if (!open) return
    const dismiss = event => {
      if (!headerRef.current?.contains(event.target)) setOpen(false)
    }
    const escape = event => {
      if (event.key === 'Escape') { setOpen(false); menuRef.current?.focus() }
    }
    const desktop = window.matchMedia('(min-width: 801px)')
    const resize = () => { if (desktop.matches) setOpen(false) }
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('keydown', escape)
    desktop.addEventListener('change', resize)
    return () => {
      document.removeEventListener('pointerdown', dismiss)
      document.removeEventListener('keydown', escape)
      desktop.removeEventListener('change', resize)
    }
  }, [open])
  const [activeNav, setActiveNav] = useState(() => Math.max(0, targets.indexOf(window.location.hash)))
  useEffect(() => {
    const sections = [
      ['.nv-hero', 0], ['#about', 0], ['#cargo', 1],
      ['.nv-rules', 1], ['.nv-modes', 1], ['#crew', 2], ['#plans', 3], ['#contact', 4],
    ].map(([selector, index]) => ({ element: document.querySelector(selector), index }))
    let frame = 0
    let positions = []
    let positionsDirty = true
    const sync = () => {
      frame = 0
      // Read the section just below the fixed header, not the last clicked hash.
      const threshold = window.innerWidth <= 800 ? 110 : 140
      const scrollY = window.scrollY
      if (positionsDirty) {
        positions = sections.filter(({ element }) => element).map(({ element, index }) => ({ top: element.getBoundingClientRect().top + scrollY, index }))
        positionsDirty = false
      }
      let current = 0
      for (const { top, index } of positions) {
        if (top <= scrollY + threshold) current = index
      }
      setActiveNav(previous => previous === current ? previous : current)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(sync) }
    const invalidate = () => { positionsDirty = true; schedule() }
    const resize = new ResizeObserver(invalidate)
    sections.forEach(({ element }) => { if (element) resize.observe(element) })
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', invalidate)
    window.addEventListener('hashchange', schedule)
    schedule()
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', invalidate)
      window.removeEventListener('hashchange', schedule)
    }
  }, [])
  return <header ref={headerRef} className={`nv-header is-floating ${open ? 'is-open' : ''}`}>
    <a className="nv-logo" href="#top"><Logo/></a>
    <GooeyNav className="nv-nav" ariaLabel={t("Main navigation")}
      items={[t('ABOUT US'), t('OUR CARGO'), t('THE CREW'), language === 'zh' ? '订阅方案' : 'Plans', t('CONTACT')].map((label, i) => ({ label, href: targets[i] }))}
      activeIndex={activeNav} onChange={index => { setActiveNav(index); setOpen(false) }}
      frame={false} color="#2B6DE5" activeTextColor="#ffffff"
      particleCount={8} spread={18} animationTime={650} timeVariance={100} gooeyness={0.4} wobble={0} />
    <LanguageSwitch/><a className="nv-header-cta" href="#contact">{t("GET A FREIGHT QUOTE")}</a>
    <button ref={menuRef} type="button" className="nv-menu" aria-label={t("Toggle menu")} aria-expanded={open} aria-controls="mobile-card-nav" onClick={() => setOpen(!open)}><span/><span/><span/></button>
    <div className="nv-mobile-panel" id="mobile-card-nav" inert={!open} aria-hidden={!open}>
      <nav className="nv-mobile-cards" aria-label={language === 'zh' ? '移动端导航' : 'Mobile navigation'}>
        {labels.map((label, index) => <a key={targets[index]} href={targets[index]}
          className="nv-mobile-card" aria-current={activeNav === index ? 'location' : undefined}
          style={{ '--card-order': index }} onClick={() => { setActiveNav(index); setOpen(false); menuRef.current?.focus() }}>
          <strong>{label}</strong><span>{descriptions[index]}</span>
        </a>)}
      </nav>
    </div>
  </header>
}

function Stat({ value, label }) { return <div className="nv-stat"><strong>{value}</strong><span>{label}</span></div> }

function App() {
  const { t, language } = useLocale()
  const root = useRef(null)
  useEditorialMotion(root, language)
  useEffect(() => {
    const background = root.current.querySelector('.nv-contact-bg')
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        background.style.setProperty('--contact-photo',  `url('${assetUrl('/optimized/hero-ocean.jpg')}')`)
        observer.disconnect()
      }
    }, { rootMargin: '500px' })
    observer.observe(background)
    return () => observer.disconnect()
  }, [])
  const crew = getCrew(t)
  const cargoModes = getModes(t)
  const modeTags = language === 'zh'
    ? [['洋流', '风向', '距离'], ['DTA', 'ETA', 'RTA'], ['台风', '浪高', '时间损失']]
    : [['Currents', 'Wind direction', 'Distance'], ['DTA', 'ETA', 'RTA'], ['Typhoons', 'Wave height', 'Time loss']]
  const [mode, setMode] = useState(0)
  const [activeCrew, setActiveCrew] = useState(0)
  const [saved, setSaved] = useState('')
  function submit(e) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    try {
      localStorage.setItem('navfull-inquiry', JSON.stringify(data))
      setSaved('')
    } catch { setSaved('saveError') }
  }
  return <div ref={root} className="norvik" id="top" lang={language === 'en' ? 'en' : 'zh-CN'}>
    <Header/>
    <main>
      <section className="nv-hero">
        <div className="nv-hero-photo"/>
        <div className="nv-hero-overlay"/>
        <div className="nv-opening" aria-hidden="true"><i className="nv-opening-shutter"/><i className="nv-opening-shutter"/></div>
        <div className="nv-hero-copy"><p className="nv-label">{t("NORVIK / FREIGHT SYSTEMS")}</p><MotionTitle as="h1">{t("FREIGHT")}<br/>{t("THAT KEEPS")}<br/><em>{t("THE WORLD")}</em></MotionTitle><p className="nv-microcopy">{t("OCEAN, ROAD, RAIL AND AIR — ONE CONNECTED WAY TO MOVE WHAT MATTERS.")}</p></div>
        <div className="nv-hero-stats"><Stat value={t("99.2%")} label={t("ON-TIME ARRIVAL")}/><Stat value={t("2.1M")} label={t("TONNES MOVED")}/><Stat value={t("06 MIN")} label={t("RESPONSE TIME")}/></div>
        <a className="nv-scroll" href="#about">{t("SCROLL TO MOVE")} <span>↓</span></a>
      </section>

      <section className="nv-dark nv-manifesto" id="about"><div className="nv-section-tag">{t("01 / OUR PROMISE")}</div><div className="nv-manifesto-grid"><MotionTitle>{t("WE STARTED WITH THREE TRUCKS, AND ONE PROMISE: ")}<em>{t("EVERY LOAD ARRIVES WHEN WE SAY IT WILL.")}</em> <span>{t("SEVENTY YEARS ON, THAT PROMISE COVERS 180 PORTS.")}</span></MotionTitle><div className="nv-side-note">{t("PEOPLE, PROCESS, PRECISION.")}<br/>{t("THAT'S HOW WE KEEP THINGS MOVING.")}</div></div><div className="nv-rule"/><a className="nv-button" href="#contact">{t("START A CONVERSATION")}</a></section>

<div className="nv-capability-region"><section className="nv-paper nv-booking" id="cargo"><ThreadsBackdrop/><div className="nv-section-tag">{t("02 / THE WAY WE MOVE")}</div><div className="nv-booking-layout"><div><MotionTitle>{t("ONE ")}<em>{t("BOOKING.")}</em><br/><em>{t("EVERY MODE.")}</em><br/>{t("ANY PORT.")}</MotionTitle><p>{t("WHETHER IT'S A SINGLE CONTAINER OR A GLOBAL SUPPLY CHAIN, WE BUILD THE ROUTE AROUND WHAT YOUR CARGO NEEDS.")}</p><div className="nv-booking-card"><span>{t("LANE / SHANGHAI → ROTTERDAM")}</span><strong>{t("EVERY HANDOFF, ACCOUNTED FOR.")}</strong><small>{t("ETD 24.06.26 &nbsp; · &nbsp; ETA 18.07.26")}</small></div><a className="nv-button nv-button-dark" href="#contact">{t("EXPLORE THE NETWORK")}</a></div><div className="nv-crane-image"><img loading="lazy" decoding="async" src={assetUrl('/optimized/voyage-weather-risk.jpg')} alt={language === 'zh' ? '气象预报、航线规划与红橙色风险区域概念海图' : 'Concept forecast map with marine weather, planned routes and risk zones'}/></div></div><div className="nv-port-list">{t("PORTS WE KNOW ")}<span>{t("ROTTERDAM")}</span><span>{t("SHANGHAI")}</span><span>{t("SINGAPORE")}</span><span>{t("LONG BEACH")}</span><span>{t("DUBAI")}</span></div></section>

      <section className="nv-paper nv-rules"><div className="nv-section-tag">{t("03 / HOW WE WORK")}</div><div className="nv-rules-head"><MotionTitle>{t("FOUR RULES")}<br/>{t("WE SHIP BY.")}</MotionTitle><p>{t("NO SHORTCUTS. NO SURPRISES.")}<br/>{t("JUST A CLEARER WAY TO GET THERE.")}</p></div><CapabilityShowcase/></section></div>

      <section className="nv-dark nv-modes"><div className="nv-section-tag">{t("04 / BUILT FOR CARGO")}</div><div className="nv-modes-head"><MotionTitle>{t("BUILT FOR CARGO")}<br/>{t("THAT ")}<em>{t("CAN'T WAIT.")}</em></MotionTitle><p>{t("PRESSURELESS PRODUCTION PARTNERS. LONG-HAUL RETAIL. WHEN THE STAKES ARE HIGH, WE STAY CLOSE.")}</p></div><div className="nv-mode-tabs">{cargoModes.map(([id,title,text], i) => <button key={id} aria-pressed={mode === i} className={mode === i ? 'active' : ''} onClick={() => setMode(i)}><span>{id}</span><strong>{title}</strong><p>{text}</p><small className="nv-mode-tags">{modeTags[i].map(tag => <span key={tag}>{tag}</span>)}</small></button>)}</div></section>

      <section className="nv-paper nv-crew" id="crew"><div className="nv-section-tag">{t("05 / THE CREW")}</div><div className="nv-crew-head"><MotionTitle>{t("MEET THE CREW")}<br/>{t("MOVING ")}<em>{t("YOUR CARGO.")}</em></MotionTitle><strong>{t("320")}</strong><small>{t("PEOPLE WHO KNOW")}<br/>{t("WHERE THINGS GO.")}</small></div><div className="nv-crew-grid" style={{ '--crew-columns': crew.map((_, i) => i === activeCrew ? '1.8fr' : '1fr').join(' ') }}>{crew.map(([name, role, image], i) => <article key={name} className={`${i === 0 ? 'lead' : ''} ${i === activeCrew ? 'is-active' : ''}`} role="button" tabIndex={0} aria-pressed={i === activeCrew} aria-label={`${name} · ${role}`} onPointerEnter={e => { if (e.pointerType !== 'touch') setActiveCrew(i) }} onFocus={() => setActiveCrew(i)} onClick={() => setActiveCrew(i)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveCrew(i) } }}><img loading="lazy" decoding="async" src={image} alt={name}/><div><b>{name}</b><span>{role}</span></div></article>)}</div><div className="nv-crew-story"><img loading="lazy" decoding="async" src={assetUrl('/optimized/product-digital.jpg')} alt={t("Norvik operations team")}/><div><p>{t("“WE USED TO CHASE FIVE FORWARDERS FOR ONE UPDATE. NOW ONE NORVIK PLANNER AND ONE DASHBOARD COVER EVERY CONTAINER ON THE SHIP.”")}</p><small>{t("SAMUEL ADEYEMI / KESTREL FOODS")}</small><a className="nv-button nv-button-dark" href="#contact">{t("MEET THE TEAM")}</a></div><div className="nv-crew-quote"><strong>{t("FEWER CALLS.")}<br/>{t("FEWER DELAYS.")}<br/><em>{t("MORE SHIPPING.")}</em></strong><p>{t("THE SIMPLEST WAY TO MOVE FORWARD IS TO KNOW WHAT'S NEXT.")}</p></div></div></section>

      <SubscriptionPlans/>
      <section className="nv-contact" id="contact"><div className="nv-contact-bg"/><div className="nv-contact-grid"><div><p className="nv-label">{t("06 / GET IN TOUCH")}</p><MotionTitle>{t("GET A FREIGHT QUOTE")}</MotionTitle><p>{t("ROUTE, CARGO, DEADLINE. TELL US WHAT'S MOVING.")}</p><form onSubmit={submit}><label>{t("YOUR NAME")}<input required name="name" placeholder={t("NAME PLACEHOLDER")}/></label><label>{t("WORK EMAIL")}<input required type="email" name="email" placeholder={t("YOUR EMAIL")}/></label><label>{t("WHAT'S MOVING?")}<input required name="voyage" placeholder={t("CARGO / ROUTE / DEADLINE")}/></label><button className="nv-button" type="submit">{t("REQUEST A QUOTE")}</button><small>{t("preview")}</small>{saved === 'saveError' && <small role="alert">{t("saveError")}</small>}</form></div><div className="nv-next"><MotionTitle>{t("TELL US WHAT'S")}<br/><em>{t("MOVING NEXT.")}</em></MotionTitle><p>{t("WE'LL FIND THE CLEAREST WAY TO GET IT THERE.")}</p></div></div></section>
    </main>
    <footer className="nv-footer"><div className="nv-footer-logo"><Logo/></div><div className="nv-footer-tagline"><strong>{t("YOUR CARGO.")}{language === 'en' ? ' ' : ''}{t("ALWAYS ACCOUNTED FOR.")}</strong></div><div><span>{t("STOCKHOLM / ROTTERDAM / SINGAPORE")}</span></div><div className="nv-footer-qrs"><figure><img loading="lazy" decoding="async" src={assetUrl('/wechat-official-qr.png')} width="180" height="180" alt={language === 'en' ? 'WeChat official account QR code' : '微信公众号二维码'}/><figcaption>{language === 'en' ? 'WeChat Official Account' : '公众号'}</figcaption></figure><figure><img loading="lazy" decoding="async" src={assetUrl('/partnership-qr.png')} width="180" height="180" alt={language === 'en' ? 'Partnership inquiry QR code' : '合作咨询二维码'}/><figcaption>{language === 'en' ? 'Partnership Inquiries' : '合作咨询'}</figcaption></figure></div><small>{t("© 2026 NORVIK FREIGHT SYSTEMS")}</small></footer>
  </div>
}

export default function NavigationSite() {
  return <LocaleProvider>{() => <App/>}</LocaleProvider>
}
