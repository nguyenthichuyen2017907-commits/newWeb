import { useState } from 'react'
import './styles.css'
import Hero from './Hero.jsx'
import Grainient from './Grainient.jsx'
import useMotion from './useMotion.js'
import PixelCard from './PixelCard.jsx'

const capabilities = [
  { id: '01', title: '动态气象与海况感知', en: 'REAL-TIME METOCEAN SENSING', body: '汇聚 ECMWF、GFS、JMA 等全球多源气象数据，持续捕捉风、浪、流、气压与涌浪方向的变化。', metric: '12+', label: '数据源实时融合' },
  { id: '02', title: '船舶数字孪生与性能建模', en: 'DIGITAL TWIN / HYDRODYNAMICS', body: '将吃水、纵倾、航速—功率曲线与船体阻力带入天气模型，计算恶劣海况下的失速与真实到港表现。', metric: '5–10%', label: '燃油与碳排潜在节省' },
  { id: '03', title: '多目标路径优化引擎', en: 'MULTI-OBJECTIVE ROUTING', body: '在安全、准时与经济之间找到动态平衡，输出最省油、最准时、最安全的多策略航线。', metric: '3', label: '可切换航线策略' },
  { id: '04', title: '人机协作与动态重航线', en: 'HUMAN-IN-THE-LOOP', body: '台风形成或突发强气旋时，自动报警并生成修正航线，由船长或岸基调度员一键确认。', metric: '24/7', label: '全天候风险守望' },
]

const features = [
  { no: '01', title: '全链路数字化智能工具集', desc: '一站式解决数据采集、处理、分析与可视化需求，打…信息孤岛，实现气象业务全流程智能化。', image: '/product-digital.png', tags: ['多源融合', '流计算', '低代码'] },
  { no: '02', title: '中央路径图系统', desc: '基于GIS的高精度路径追踪与可视化展示，为中央决…提供直观依据，支持多模式集成预报。', image: '/product-path.png', tags: ['GIS集成', '轨迹推演', '空间分析'] },
  { no: '03', title: '上冲分析模型', desc: '针对突发高强度事件（如强对流天气）的智能识别与…警分析，支持分钟级更新。', image: '/product-nowcasting.png', tags: ['AI识别', '自动告警', '强对流'] },
  { no: '04', title: '卫星遥感平台', desc: '集成多源卫星数据（风云、葵花等），提供宏观视角…洞察能力，支持红外、云图反演分析。', image: '/product-satellite.png', tags: ['光谱分析', '云图反演', '多星融合'] },
  { no: '05', title: 'MICAPS 智能工作站', desc: '新一代预报员工作台，支持二三维一体化展示，提供…大的交互式预报制作工具。', image: '/product-micaps.png', tags: ['交互预报', '三维可视化', '自动化'] },
  { no: '06', title: '远洋气象导航系统', desc: '结合风浪流数据，为远洋船舶提供最优航线规划，降…能耗并规避恶劣海况。', image: '/product-routing.png', tags: ['航线规划', '节能减排', '海况规避'] },
]

const roles = [
  ['航线规划员', 'Voyage Optimizer', '开航前生成 Passage Plan，计算预估耗油量与 ETA。'],
  ['防台风助手', 'Storm Guard', '监控全船队与前方海域，提前推送绕航方案。'],
  ['脱碳合规官', 'CII Tracker', '追踪 CII 评级与 EU ETS 成本，推荐最佳经济航速。'],
  ['船长终端', 'Onboard / ECDIS', '适配低带宽卫星通信，航线一键导入电子海图。'],
  ['理赔分析师', 'Performance Claim', '基于历史气象与合同条款，生成性能分析报告。'],
]

const plans = [
  { name: '按航次付费', en: 'PER VOYAGE PLAN', price: '定制', desc: '适用于单航次租船或临时航气导需求。', items: ['单次航路规划', '全程动态追踪', '航次报告导出'] },
  { name: '标准船队版', en: 'STANDARD FLEET', price: '$20', unit: '/ 船 / 月', desc: '让每一艘船都拥有稳定、可复制的气象决策能力。', items: ['高精度气象图层', '每日航线优化建议', '船端 / 岸端同步', '基础耗油与 CII 监控'], featured: true },
  { name: '专业旗舰版', en: 'PRO FLEET', price: '$100', unit: '/ 船 / 月', desc: '给复杂航区与高价值船队的高频、深度保障。', items: ['高频高精度区域模型', '24 小时专属气象师', '传感器数据对接', '高级风险复盘'] },
  { name: '企业 / 船东定制版', en: 'ENTERPRISE CUSTOM', price: '定制', desc: '将模型、数据与工作流嵌入你的船队系统。', items: ['私有化 / 专属云部署', '定制水动力模型', 'ERP / Fleet API 集成'] },
]

function Arrow() { return <span className="arrow-circle" aria-hidden="true">↗</span> }

function RoleIcon({ index }) {
  const paths = [
    <><path d="M5 19 11 5l4 8 8 4-14 6z" /><path d="m11 5 4 8-6 10" /></>,
    <><path d="M8 18a6 6 0 1 1 1-11 5 5 0 1 1 10 7" /><path d="m15 13-5 7h5l-2 6" /></>,
    <><path d="M23 5C8 4 3 10 7 18c8 5 16-1 16-13Z" /><path d="M5 25 18 12" /></>,
    <><rect x="4" y="5" width="23" height="16" rx="3" /><path d="M11 26h9M15.5 21v5m-6-12 4 4 8-5" /></>,
    <><path d="M8 4h12l5 5v18H8zM20 4v6h5M12 15h9M12 20h6" /></>,
  ]
  return <svg className="role-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[index]}</svg>
}

function SectionTitle({ title, body }) {
  return <div className="section-title reveal"><h2>{title}</h2>{body && <p className="section-lead">{body}</p>}</div>
}

function App() {
  useMotion()
  const [saved, setSaved] = useState('')
  function saveInquiry(event) {
    event.preventDefault()
    try {
      const data = Object.fromEntries(new FormData(event.currentTarget))
      localStorage.setItem('oceania-inquiry', JSON.stringify(data))
      setSaved('需求已保存在此浏览器，尚未发送。正式联系通道接入后可提交。')
    } catch {
      setSaved('浏览器无法保存，请复制需求内容并保留。')
    }
  }
  const [activeCapability, setActiveCapability] = useState(0)

  return <main>
    <Hero />
    <div className="below-hero">
      <div className="page-grainient" aria-hidden="true">
        <Grainient colors={['#280563', '#000000', '#052964']} angle={42} flow={0.8} silk={0.35} grainAmount={0.08} speed={0.7} stir={0.95} dpr={1} intro={false} />
      </div>
      <div className="page-sections">
    <section className="features section-shell" id="features">
      <SectionTitle title="经典产品" body="数据可视化，覆盖不同业务场景，降低阅读成本" />
      <div className="feature-grid reference-products">{features.map(feature => <article className="feature-card reveal" key={feature.no}>
        <div className="feature-media">
          <div className="feature-visual">
            <img src={feature.image} alt={`${feature.title}参考配图`} loading="lazy" width="513" height="298" />
          </div>
        </div>
        <div className="feature-copy"><h3>{feature.title}</h3><p>{feature.desc}</p><ul className="feature-tags" aria-label="模块能力">{feature.tags.map(tag => <li key={tag}>{tag}</li>)}</ul></div>
      </article>)}</div>
      <div className="module-capabilities" id="platform">
        <div className="module-options" aria-label="核心能力">{capabilities.map((item, index) => <button key={item.id} className={activeCapability === index ? 'is-active' : ''} aria-pressed={activeCapability === index} onClick={() => setActiveCapability(index)}>{item.title}</button>)}</div>
        <p className="capability-description" aria-live="polite"><span key={activeCapability}>{capabilities[activeCapability].body}</span></p>
      </div>
    </section>

    <section className="roles section-shell" id="roles">
      <SectionTitle kicker="BUILT FOR THE WHOLE BRIDGE" title={<>不同角色，<br /><span>同一份海上共识。</span></>} body="从岸基到船端，Navfull 将每个岗位真正关心的信号，放到他需要的位置。" />
      <div className="role-grid">{roles.map((role, index) => <article className={`role-card role-${index + 1} reveal`} key={role[0]}><RoleIcon index={index} /><div><h3>{role[0]}</h3><p>{role[1]}</p><small>{role[2]}</small></div></article>)}</div>
    </section>

    <section className="pricing section-shell" id="pricing">
      <SectionTitle kicker="A CLEARER WAY TO SCALE" title={<>从一次航次，<br /><span>到整支船队。</span></>} body="先从一个航次验证价值，再用一套系统管理全船队的天气、风险与碳排表现。" />
      <div className="price-grid">{plans.map(plan => <PixelCard className={`price-card ${plan.featured ? 'featured' : ''} reveal`} key={plan.name}>{plan.featured && <span className="price-badge">STANDARD PLAN</span>}<p className="kicker">{plan.en}</p><h3>{plan.name}</h3><div className="price"><strong>{plan.price}</strong>{plan.unit && <small>{plan.unit}</small>}</div><p className="price-desc">{plan.desc}</p><ul>{plan.items.map(item => <li key={item}><span>＋</span>{item}</li>)}</ul><a href="#contact" className={`price-link ${plan.featured ? 'price-link-light' : ''}`}>了解方案 <Arrow /></a></PixelCard>)}</div>
    </section>

    <section className="contact" id="contact"><div className="contact-bg" /><div className="contact-content"><p className="kicker">READY WHEN YOU ARE</p><h2>下一条航线，<br /><em>从更好的问题开始。</em></h2><p>告诉我们你的航区、船型与当前挑战，准备你的第一个测试航次。</p><form className="inquiry-form" onSubmit={saveInquiry}>
<label>联系人<input name="name" autoComplete="name" required maxLength={80} placeholder="你的姓名" /></label>
<label>工作邮箱<input name="email" type="email" autoComplete="email" required placeholder="name@company.com" /></label>
<label className="inquiry-wide">航次需求<textarea name="message" required maxLength={2000} rows={3} placeholder="例如：散货船，上海至新加坡，希望优化油耗与到港时间。" /></label>
<button className="button button-primary" type="submit">保存测试航次需求 <Arrow /></button>
<p className="form-note">预览版仅保存到当前浏览器，不会发送或提交。</p>
<p className="form-status" role="status">{saved}</p>
</form></div><div className="contact-footer"><a className="brand" href="#top"><span className="brand-mark"><i /><i /><i /></span><span>Navfull<span className="brand-dot">/</span></span></a><span>AI WEATHER ROUTING PLATFORM</span><span>© 2026 Navfull SYSTEMS</span></div></section>
      </div>
    </div>
  </main>
}

export default App
