import { useLocale } from './Locale.jsx'
import { MotionTitle } from './EditorialMotion.jsx'
import PixelCard from './PixelCard.jsx'
import './SubscriptionPlans.css'

export default function SubscriptionPlans() {
  const { language } = useLocale()
  const zh = language === 'zh'
  const plans = zh ? [
    ['SINGLE VOYAGE', '按航次付费版', '适合单次灵活远洋托管与临时避风需求', '/ 单航次', ['单航次全程气象导航优化', '每日一次气象更新与陆基监控', '航次结束标准化总结报告'], '¥ 1,800', '购买单航次'],
    ['FLEET STANDARD', '标准船队版', '中大型船队常规运力高效数字化管理', '/ 单船 / 月', ['包含按航次版全部功能', '船端极低流量 Web/App 终端', '每天 4 次高频气象场重构', 'CII 碳排精算与能耗跟踪'], '¥ 4,500', '开通标准版'],
    ['PRO ENTERPRISE', '专业旗舰版', '追求极致精细化运营与自动避险船东', '/ 单船 / 月', ['包含标准版全部功能', '7x24 资深远洋船长人机协同把关', 'P&I / 保险理赔气象证据支持', 'ECDIS 路由文件无缝导入导出'], '¥ 8,200', '开通旗舰版'],
    ['CUSTOM SOLUTION', '企业/船东定制版', '私有化部署、数据 API 接入与专属算法', '', ['专属私有化/混合云部署方案', '企业现有 Fleet ERP / AIS API 打通', '专用船型 CFD 流体动力学模型构建'], '定制商务询价', '洽谈定制方案'],
  ] : [
    ['SINGLE VOYAGE', 'Pay per voyage', 'Flexible ocean-voyage management and temporary weather avoidance.', '/ voyage', ['Full-voyage weather routing optimization', 'Daily weather updates and shore monitoring', 'Standardized end-of-voyage report'], '¥ 1,800', 'Buy a single voyage'],
    ['FLEET STANDARD', 'Standard fleet', 'Efficient digital management for medium and large fleets.', '/ vessel / month', ['All pay-per-voyage features', 'Ultra-low-bandwidth onboard Web/App terminal', 'High-frequency weather field reconstruction 4 times daily', 'CII carbon calculations and energy tracking'], '¥ 4,500', 'Activate Standard'],
    ['PRO ENTERPRISE', 'Professional flagship', 'For shipowners pursuing precise operations and automated risk avoidance.', '/ vessel / month', ['All Standard features', '24/7 human–machine oversight by experienced ocean captains', 'Weather evidence for P&I and insurance claims', 'Seamless ECDIS route file import and export'], '¥ 8,200', 'Activate Flagship'],
    ['CUSTOM SOLUTION', 'Enterprise / shipowner custom', 'Private deployment, data API integration and dedicated algorithms.', '', ['Private / hybrid-cloud deployment', 'Existing Fleet ERP / AIS API integration', 'Vessel-specific CFD model development'], 'Custom business quote', 'Discuss a custom plan'],
  ]
  return <section id="plans" className="nv-dark nv-plans" aria-label={zh ? '订阅方案' : 'Subscription plans'}>
    <div className="nv-plans-intro">
      <MotionTitle>{zh ? '为每次远航，选择合适的方案。' : 'The right plan for every voyage.'}</MotionTitle>
      <p>{zh ? '从单航次到长期船队协作，按你的运营需求沟通服务范围。' : 'From single voyages to ongoing fleet collaboration, explore the scope that fits your operations.'}</p>
    </div>
    <div className="nv-plans-grid">{plans.map(([code, name, description, term, features, price, action], index) =>
      <PixelCard as="article" className={`nv-plan ${index === 1 ? 'nv-plan-featured' : ''}`} key={code}
        variant="blue" colors={['#8db3ff', '#5289ef', '#2b6de5']} glowColor="#2b6de5"
        gap={9} pixelSize={2} speed={22} origin="pointer" revealDuration={550}
        spotlight={0.45} glow={0.3} opacity={0.3} fade={0.85}
        radius={16} intro={false} clickPulse>
        {index === 1 && <span className="nv-plan-badge">{zh ? '最受欢迎' : 'MOST POPULAR'}</span>}
        <span className="nv-plan-code">{code}</span>
        <h3>{name}</h3>
        <p className="nv-plan-description">{description}</p>
        <div className="nv-plan-price"><strong>{price}</strong><span>{term || '\u00a0'}</span></div>
        <ul>{features.map(feature => <li key={feature}><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>{feature}</li>)}</ul>
        <a className="nv-plan-action" href="#contact" aria-label={`${action} · ${name}`}>{action}</a>
      </PixelCard>
    )}</div>
    <p className="nv-plans-note">{zh ? '预览页面：购买与开通按钮将跳转至预约演示，暂不支持在线支付。' : 'Preview: purchase and activation buttons open the demo inquiry section. Online payments are not enabled.'}</p>
  </section>
}
