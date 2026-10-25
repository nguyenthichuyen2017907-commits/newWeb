import { assetUrl } from './assetUrl.js'
import { useState } from 'react'
import { useLocale } from './Locale.jsx'
import './CapabilityShowcase.css'

const items = [
  ['ON SCHEDULE', 'EVERY MILE ACCOUNTED FOR.', assetUrl('/optimized/capability-vessels.jpg'), 'AIS', ['船舶分布与历史航迹', 'Vessel positions & tracks']],
  ['IN THE OPEN', 'NO HIDDEN HANDOFFS.', assetUrl('/optimized/capability-weather.jpg'), 'WIND', ['风场与海洋气象', 'Wind & marine weather']],
  ['SHORTEST PATH', 'SMARTER ROUTES, LOWER COST.', assetUrl('/optimized/hero-ocean.jpg'), 'ROUTE', ['航线优化与航行策略', 'Route optimization & strategy']],
  ['ONE PLANNER', 'ONE PERSON TO CALL.', assetUrl('/optimized/capability-typhoon.jpg'), 'ALERT', ['台风路径与风险预警', 'Typhoon tracks & risk alerts']],
]

export default function CapabilityShowcase() {
  const { t, language } = useLocale()
  const [active, setActive] = useState(0)
  const [loaded, setLoaded] = useState(() => new Set([0]))
  const english = language === 'en'
  return <>
    <div className="nv-wide-photo nv-capability-visual" id="capability-preview" role="region" aria-label={t(items[active][0])}>
      {items.map(([title, , src], i) => <img key={src} src={loaded.has(i) ? src : undefined} alt={i === active ? t(title) : ''} aria-hidden={i !== active} className={i === active ? 'is-active' : ''} decoding="async" loading="lazy" />)}
      <div className="nv-photo-stat" aria-live="polite" aria-atomic="true">
        <strong>{items[active][3]}</strong>
        <span>{items[active][4][english ? 1 : 0]}</span>
        <small>{english ? 'Concept illustration · Not live data' : '概念示意 · 非实时数据'}</small>
      </div>
    </div>
    <div className="nv-four nv-capability-controls" role="group" aria-label={english ? 'Explore capabilities' : '切换核心能力'}>
      {items.map(([title, description], i) => <button type="button" key={title} aria-pressed={active === i} aria-controls="capability-preview" onClick={() => { setLoaded(previous => new Set([...previous, i])); setActive(i) }}>
        <b>{String(i + 1).padStart(2, '0')}</b>
        <h3>{t(title)}</h3>
        <p>{t(description)}</p>
      </button>)}
    </div>
  </>
}
