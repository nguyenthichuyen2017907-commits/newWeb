import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PixelCard from './PixelCard.jsx'
import ChromaGrid from './ChromaGrid.jsx'
import ScrollFloat, { FloatText } from './ScrollFloat.jsx'
import Grainient from './Grainient.jsx'
import BorderGlow from './BorderGlow.jsx'
import MagicRings from './MagicRings.jsx'
import useAtelierMotion from './useAtelierMotion.js'
import './atelier.css'
import './OceanShowcase.css'

function Icon({ type = 'arrow', ...props }) {
  const paths = {
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    compass: <><circle cx="12" cy="12" r="9" /><path d="m16 8-2 6-6 2 2-6z" /></>,
    wind: <><path d="M3 8h13a3 3 0 1 0-3-3M3 12h17M3 16h10a3 3 0 1 1-3 3" /></>,
    shield: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z" /><path d="m8 12 3 3 5-6" /></>,
    leaf: <><path d="M20 4C5 2 1 12 8 17c8 5 13-3 12-13Z" /><path d="M4 21 15 10" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18M5 7h14M5 17h14" /></>,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    check: <path d="m5 12 4 4L19 6" />,
    play: <path d="m9 5 11 7-11 7Z" />,
  }
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[type]}</svg>
}
function Brand() { return <a className="nf-brand" href="#top" aria-label="Navfull 首页"><span className="nf-brand-symbol"><Icon type="compass" /></span>Navfull<span className="nf-brand-dot">.</span></a> }
const navigation = [['首页','top'],['产品','features'],['船岸协作','roles'],['订阅','pricing']]
function Header({ onDemo }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const button = useRef(null)
  const menu = useRef(null)
  useEffect(() => {
    const update = () => {
      const current = navigation.map(([,id]) => ({ id, top: document.getElementById(id)?.getBoundingClientRect().top ?? Infinity })).filter(section => section.top < innerHeight * .45).sort((a,b) => b.top - a.top)[0]
      setActive(current?.id || '')
    }
    window.addEventListener('scroll', update, { passive: true }); update()
    return () => window.removeEventListener('scroll', update)
  }, [])
  useEffect(() => {
    if (!open) return
    const old = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    menu.current.querySelector('a')?.focus()
    const key = event => {
      if (event.key === 'Escape') { setOpen(false); button.current.focus() }
      if (event.key !== 'Tab') return
      const nodes = [button.current, ...menu.current.querySelectorAll('a,button')]
      if (event.shiftKey && document.activeElement === nodes[0]) { event.preventDefault(); nodes.at(-1).focus() }
      if (!event.shiftKey && document.activeElement === nodes.at(-1)) { event.preventDefault(); nodes[0].focus() }
    }
    const resize = () => { if (innerWidth > 800) setOpen(false) }
    document.addEventListener('keydown', key); window.addEventListener('resize', resize)
    return () => { document.body.style.overflow = old; document.removeEventListener('keydown', key); window.removeEventListener('resize', resize) }
  }, [open])
  return <header className="nf-header">
    <div className="nf-nav"><Brand /><nav className="nf-desktop-nav" aria-label="主导航">{navigation.map(([name,id])=><a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined}>{name}</a>)}</nav><button className="nf-button nf-nav-cta" onClick={onDemo}>预约演示<Icon /></button><button className="nf-menu-toggle" ref={button} aria-expanded={open} aria-controls="nf-mobile-nav" aria-label={open?'关闭菜单':'打开菜单'} onClick={()=>setOpen(!open)}>{open?<Icon type="close"/>:<span />}</button></div>
    {open && <nav id="nf-mobile-nav" ref={menu} className="nf-mobile-nav" aria-label="移动导航">{navigation.map(([name,id])=><a key={id} href={`#${id}`} onClick={()=>setOpen(false)}>{name}<Icon /></a>)}<button className="nf-button" onClick={()=>{setOpen(false);onDemo()}}>预约产品演示<Icon /></button></nav>}
  </header>
}

const strategies = [
  { name:'更经济', type:'最省油航线', icon:'leaf', text:'将天气、海流与船舶性能放在一起计算，找到更经济的航行路径。', path:'M70 245 C180 250 190 110 310 145 S440 235 535 115', color:'#6ba4ff' },
  { name:'更准时', type:'固定 ETA', icon:'compass', text:'以预计到港时间为约束，在航速与航线之间取得平衡，让计划更可控。', path:'M70 245 C210 205 300 180 385 150 S475 125 535 115', color:'#92cec8' },
  { name:'更安心', type:'风险优先航线', icon:'shield', text:'关注强风、巨浪与船舶运动风险，提前绕开不适宜的海况。', path:'M70 245 C160 260 235 290 340 260 S460 190 535 115', color:'#e7c9a8' },
]
const roles = [
  { title:'航线规划员', en:'Voyage planning', icon:'compass', heading:'先看清全程，再决定出发。', body:'开航前生成航路计划，评估预估耗油量与到港时间。每一个决策，都有天气与船舶性能作为依据。', details:['航路报告 Passage Plan','预估耗油量 FOC','到港时间 ETA'] },
  { title:'船长与驾驶台', en:'Onboard operations', icon:'globe', heading:'海上的变化，船岸一起应对。', body:'适配低带宽卫星通信，增量更新气象数据。修正航线由船长确认，并支持导入电子海图。', details:['低带宽数据更新','船岸同步协作','ECDIS 航线导入'] },
  { title:'风控与调度', en:'Fleet protection', icon:'shield', heading:'让风险预警，走在风浪之前。', body:'持续关注全船队与前方海况。识别异常航速、强风巨浪与横摇风险，给出可执行的绕航建议。', details:['全船队风险监控','恶劣海况提醒','动态绕航建议'] },
  { title:'脱碳与合规', en:'Decarbonization', icon:'leaf', heading:'每一次航行，都向低碳靠近。', body:'追踪船舶 CII 评级与 EU ETS 成本，将航速、航线与碳排表现结合，辅助制定经济航行策略。', details:['CII 评级追踪','EU ETS 成本评估','经济航速建议'] },
]
const products = [
  { title:'远洋气象导航系统', category:'气象导航', image:'routing', text:'结合风、浪、流数据，为远洋航行规划更合适的路径。', tags:['航线规划','节能减排'] },
  { title:'全链路数字化智能工具集', category:'数据智能', image:'digital', text:'从数据采集到分析与可视化，连接气象业务的每个环节。', tags:['多源融合','流计算'] },
  { title:'中央路径图系统', category:'气象导航', image:'path', text:'高精度路径追踪与可视化展示，支持多模式集成预报。', tags:['GIS 集成','轨迹推演'] },
  { title:'上冲分析模型', category:'气象感知', image:'nowcasting', text:'面向强对流等突发天气，提供智能识别与预警分析。', tags:['AI 识别','自动告警'] },
  { title:'卫星遥感平台', category:'气象感知', image:'satellite', text:'汇聚多源卫星数据，从更广阔的视角洞察天气变化。', tags:['云图反演','多星融合'] },
  { title:'MICAPS 智能工作站', category:'数据智能', image:'micaps', text:'二三维一体化展示，为预报制作提供交互式工作环境。', tags:['交互预报','三维可视化'] },
]
const plans = [
  { name:'按航次', price:'按需', unit:'单次航程', text:'从一次航行，开始验证。', items:['单次航路规划','全程动态追踪','航次报告'] },
  { name:'标准船队', price:'$20', unit:'/ 船 / 月', text:'让智能决策成为日常。', items:['高精度气象图层','每日航线优化建议','船端 / 岸端同步','基础油耗与 CII 监控'], featured:true },
  { name:'专业旗舰', price:'$100', unit:'/ 船 / 月', text:'复杂海况，更深度的支持。', items:['高频高精度区域模型','24 小时气象师复核','传感器数据对接','高级风险复盘'] },
  { name:'企业定制', price:'定制', unit:'面向船东与企业', text:'融入你的船队工作流。', items:['私有化 / 专属云部署','定制水动力模型','ERP / Fleet API 集成'] },
]

function RouteExperience() {
  const [selected, setSelected] = useState(0)
  const current = strategies[selected]
  return <section className="nf-section nf-route-section" id="platform">
    <div className="nf-section-heading nf-reveal"><ScrollFloat>天气会变。<br/><span>方向，始终清晰。</span></ScrollFloat><p>不只看天气，更懂你的船。<br/>把复杂的气象与船舶数据，转化为下一步行动。</p></div>
    <div className="nf-route-stage nf-reveal">
      <div className="nf-route-copy"><span className="nf-small-label">多目标航线优化</span><h3>同一片海，<br/>不止一种最优解。</h3><div className="nf-strategies" aria-label="航线策略">{strategies.map((item,i)=><button key={item.name} onClick={()=>setSelected(i)} aria-pressed={selected===i}><Icon type={item.icon}/>{item.name}</button>)}</div><div className="nf-strategy-text" key={selected} aria-live="polite"><strong>{current.type}</strong><p>{current.text}</p></div><span className="nf-disclaimer">交互示意 · 非实时航行数据</span></div>
      <div className="nf-route-map"><img src="/hero-ocean.png" alt="太平洋海域气象概念图" loading="lazy"/><div className="nf-map-top"><span><i/>ROUTE INTELLIGENCE</span><Icon type="compass"/></div><svg className="nf-route-svg" viewBox="0 0 600 360" aria-hidden="true"><path d="M70 245 535 115" stroke="#ffffff40" strokeDasharray="4 7" fill="none"/><ellipse cx="350" cy="169" rx="64" ry="45" fill="#8bb1e514" stroke="#95b4df66" strokeDasharray="3 5"/><path key={selected} className="nf-voyage-path" d={current.path} stroke={current.color} fill="none" strokeWidth="3"/><circle cx="70" cy="245" r="5" fill="#fff"/><circle cx="535" cy="115" r="5" fill="#fff"/></svg><span className="nf-port nf-port-a">出发港</span><span className="nf-port nf-port-b">目的港</span><div className="nf-map-key"><span style={{background:current.color}}/>{current.type}<small>策略示意</small></div></div>
    </div>
    <div className="nf-principles nf-reveal">{[
      {icon:'wind',title:'感知变化',lines:['融合风、浪、海流与气压，','理解前方海域。']},
      {icon:'compass',title:'理解船舶',lines:['结合吃水、纵倾与性能，','计算真实航行代价。']},
      {icon:'shield',title:'协同决策',lines:['动态重算，人工确认，','每次更新都有据可循。']},
    ].map(item=><BorderGlow className="nf-principle-card" key={item.title}>
      <div className="nf-principle-copy"><Icon type={item.icon}/><h3>{item.title}</h3><p>{item.lines[0]}<br/>{item.lines[1]}</p></div>
    </BorderGlow>)}</div>
  </section>
}

function Collaboration() {
  const [active,setActive] = useState(0)
  const role=roles[active]
  return <section className="nf-collaboration nf-section" id="roles"><div className="nf-section-heading nf-reveal"><ScrollFloat>不同位置。<br/><span>同一个方向。</span></ScrollFloat><p>让岸上的计划，与海上的每一次判断保持连接。</p></div>
    <div className="nf-collab-layout nf-reveal"><div className="nf-role-list" aria-label="业务角色">{roles.map((item,i)=><BorderGlow as="div" className="nf-role-shell" key={item.title} data-selected={active===i}><button onClick={()=>setActive(i)} aria-pressed={active===i}><Icon type={item.icon}/><span>{item.title}<small>{item.en}</small></span><Icon/></button></BorderGlow>)}</div><BorderGlow as="div" className="nf-role-panel" aria-live="polite"><div className="nf-network" aria-hidden="true"><span className="nf-network-shore">岸基</span><i/><span className="nf-network-core"><Icon type={role.icon}/></span><i/><span className="nf-network-ship">船端</span></div><div key={active} className="nf-role-details"><h3>{role.heading}</h3><p>{role.body}</p><div className="nf-role-points">{role.details.map(point=><span key={point}><Icon type="check"/>{point}</span>)}</div></div></BorderGlow></div>
  </section>
}

function ProductGallery() {
  const [filter,setFilter]=useState('全部产品')
  useEffect(() => { const frame = requestAnimationFrame(() => ScrollTrigger.refresh(true)); return () => cancelAnimationFrame(frame) }, [filter])
  return <section className="nf-section nf-products" id="features"><div className="nf-products-heading nf-reveal"><div><ScrollFloat>从看见天气，<br/><span>到创造可能。</span></ScrollFloat></div><p>六种工具，一套气象智慧。<br/>让复杂的数据，成为清晰的洞察。</p></div><div className="nf-product-filters" aria-label="产品分类">{['全部产品','气象导航','气象感知','数据智能'].map(name=><button key={name} aria-pressed={filter===name} onClick={()=>setFilter(name)}>{name}</button>)}</div><div aria-live="polite"><ChromaGrid className="nf-chroma-products" items={products.filter(p=>filter==='全部产品'||p.category===filter).map(product=>({...product,image:`/product-${product.image}.png`,accent:'#3987ff'}))} columns={3} gap={22} radius={250} softness={.75} damping={.4} fadeOut={.55} grayscale={.85} dim={.08} glow={.25} borderGlow={.65} aspectRatio="513 / 298" cardRadius={14} renderInfo={product=><div className="nf-product-body"><h3>{product.title}</h3><p>{product.text}</p><div>{product.tags.map(tag=><span key={tag}>{tag}</span>)}</div></div>}/></div></section>
}

function Inquiry({ dialogRef, onClose, plan }) {
  const [status,setStatus]=useState('')
  const submit=event=>{
    event.preventDefault()
    try { localStorage.setItem('oceania-inquiry',JSON.stringify({...Object.fromEntries(new FormData(event.currentTarget)),plan})); setStatus('已保存在当前浏览器，尚未发送。正式联系通道接入后即可提交。') }
    catch { setStatus('当前浏览器无法保存，请复制并保留你的需求。') }
  }
  return <dialog ref={dialogRef} className="nf-dialog" onClose={()=>{setStatus('');onClose()}} onClick={event=>{if(event.target===event.currentTarget)dialogRef.current.close()}}><div className="nf-dialog-body"><button className="nf-dialog-close" aria-label="关闭预约表单" onClick={()=>dialogRef.current.close()}><Icon type="close"/></button><Icon type="compass"/><h2>开启你的下一个航次。</h2><p>{plan ? `感兴趣的方案：${plan}` : '告诉我们你的船队与航行需求。'}</p><form onSubmit={submit}><label>联系人<input name="name" autoComplete="name" required maxLength="80" placeholder="你的姓名"/></label><label>工作邮箱<input name="email" type="email" autoComplete="email" required placeholder="name@company.com"/></label><label>航次需求<textarea name="message" rows="3" required maxLength="2000" placeholder="船型、航区，以及你希望解决的问题"/></label><button className="nf-button" type="submit">保存演示需求<Icon/></button><small>预览版：仅保存在本机，不会发送或提交。</small><p className="nf-form-status" role="status">{status}</p></form></div></dialog>
}

export default function Atelier() {
  const root=useRef(null)
  const dialog=useRef(null)
  const [plan,setPlan]=useState('')
  const [dialogOpen,setDialogOpen]=useState(false)
  useAtelierMotion(root)
  const demo=(choice='')=>{ setPlan(typeof choice==='string'?choice:''); setDialogOpen(true); dialog.current.showModal() }
  useEffect(()=>{if(!dialogOpen)return; const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=old}},[dialogOpen])
  return <div className="nf-site" ref={root}>
    <a href="#main" className="nf-skip">跳到主要内容</a><Header onDemo={()=>demo()}/>
    <main id="main">
      <section className="nf-hero" id="top"><div className="nf-opening" aria-hidden="true"/><div className="nf-hero-copy"><h1 aria-label="让远航，多一份确定。"><span aria-hidden="true"><span className="nf-hero-line"><FloatText>让远航，</FloatText></span></span><span aria-hidden="true"><span className="nf-hero-line nf-blue"><FloatText>多一份确定。</FloatText></span></span></h1><p>Navfull 将气象智慧融入每一次航行。<br/>更安全的航线，更从容的决策，更有把握的远方。</p><div className="nf-hero-actions"><button className="nf-button" onClick={()=>demo()}>开启测试航次<Icon/></button><a className="nf-button nf-button-quiet" href="#platform">探索 Navfull<Icon type="compass"/></a></div><span className="nf-hero-note">为船长、岸基团队与每一支远航船队而设计</span></div>
        <div className="nf-horizon" aria-hidden="true"><div className="nf-horizon-haze"/><div className="nf-horizon-ring ring-far"/><div className="nf-horizon-ring ring-mid"/><div className="nf-horizon-ring ring-near"/><span className="nf-orbit-star star-one"/><span className="nf-orbit-star star-two"/><span className="nf-orbit-star star-three"/></div>
        <div className="nf-window-wrap"><a className="nf-product-window" href="/navfull-fleet-interface-v2.png" target="_blank" rel="noopener noreferrer" aria-label="打开 Navfull 软件界面原图（新窗口）"><img src="/navfull-fleet-interface-v2.png" alt="Navfull 船舶位置、航线与风险任务工作空间" width="1920" height="1080" fetchPriority="high"/><span className="nf-window-open">查看完整界面<Icon/></span></a></div>
      </section>
      <div className="nf-after-home">
      <div className="nf-grain-layer" aria-hidden="true"><div className="nf-grain-viewport"><Grainient colors={['#040911','#061329','#012b70']} angle={68} flow={.85} silk={.35} grainAmount={.055} grainAnimated={false} contrast={.98} saturation={.99} speed={.35} interactive={false} clickSwirl={false} intro={false} dpr={1}/></div></div>
      <section className="nf-manifesto"><div className="nf-manifesto-rings" aria-hidden="true"><MagicRings color="#0668ff" colorTwo="#73b1ff" motion="pulse" ringCount={6} speed={.45} lineThickness={1.4} glow={.7} baseRadius={.3} radiusStep={.085} expansion={.055} taper={1.3} opacity={.48} hoverScale={1} hoverIntensity={0} parallax={0} clickBurst={false} intro={false} maxDevicePixelRatio={1}/></div><p className="nf-manifesto-line">{['海洋从不承诺平静。','但每一次出发，','都可以准备得更好。'].map(line=><span key={line}>{line}</span>)}</p><span className="nf-manifesto-caption">WEATHER INTELLIGENCE. HUMAN CONFIDENCE.</span></section>
      <RouteExperience/>
      <section className="nf-ocean-break nf-reveal"><picture className="nf-ocean-backdrop"><img src="/hero-ocean.png" alt="" loading="lazy"/></picture><div className="nf-ocean-copy"><ScrollFloat>视野越远，<br/>判断越从容。</ScrollFloat><p>全球气象与船舶性能，在同一张海图中相遇。</p></div><figure className="nf-ocean-visual"><div className="nf-ocean-float"><img src="/ocean-voyage-concept.png" alt="货轮沿蓝色规划航线航行，周围呈现气象云层、等压线与海图信息" width="1536" height="1024" loading="lazy" decoding="async"/><figcaption>气象 · 航线 · 船舶<span>概念示意</span></figcaption></div></figure></section>
      <Collaboration/><ProductGallery/>
      <section className="nf-section nf-pricing" id="pricing"><div className="nf-section-heading nf-reveal"><ScrollFloat>从一次航次，<br/><span>到整支船队。</span></ScrollFloat><p>选择适合当下的支持，让能力随船队一起成长。</p></div><div className="nf-plans">{plans.map(item=><PixelCard key={item.name} className={`nf-plan price-card ${item.featured?'nf-plan-featured':''}`}><div className="nf-plan-name"><h3>{item.name}</h3>{item.featured&&<span>STANDARD</span>}</div><p>{item.text}</p><div className="nf-plan-price">{item.price}<small>{item.unit}</small></div><button className={`nf-button ${item.featured?'':'nf-button-quiet'}`} onClick={()=>demo(item.name)}>了解方案<Icon/></button><ul>{item.items.map(feature=><li key={feature}><Icon type="check"/>{feature}</li>)}</ul></PixelCard>)}</div></section>
      <section className="nf-contact" id="contact"><div className="nf-contact-orbit" aria-hidden="true"/><div className="nf-contact-copy nf-reveal"><ScrollFloat>更好的航行，<br/><span>从这里开始。</span></ScrollFloat><p>下一条航线，让 Navfull 与你同行。</p><button className="nf-button" onClick={()=>demo()}>预约产品演示<Icon/></button></div></section>
      </div>
    </main>
    <footer className="nf-footer"><div><Brand/><p>看见变化，航向确定。</p></div><nav aria-label="页脚导航">{navigation.map(([name,id])=><a key={id} href={`#${id}`}>{name}</a>)}<button onClick={()=>demo()}>联系我们</button></nav><div className="nf-footer-bottom"><span>© 2026 Navfull</span><span>Designed for the journey ahead.</span><a href="#top">回到顶部 ↑</a></div></footer>
    <Inquiry dialogRef={dialog} onClose={()=>setDialogOpen(false)} plan={plan}/>
  </div>
}
