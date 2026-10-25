import { Children, cloneElement, isValidElement, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './editorial-motion.css'

gsap.registerPlugin(ScrollTrigger)

const textOf = nodes => Children.toArray(nodes).map(node => typeof node === 'string' ? node : isValidElement(node) ? node.type === 'br' ? ' ' : textOf(node.props.children) : '').join('')
function words(nodes) {
  return Children.map(nodes, node => {
    if (typeof node === 'string') return node.split(/([\u3400-\u9fff]|\s+)/u).filter(Boolean).map((word, i) => /^\s+$/.test(word) ? word : <span className="nv-motion-word" key={i}>{word}</span>)
    if (!isValidElement(node) || node.type === 'br') return node
    return cloneElement(node, {}, words(node.props.children))
  })
}

export function MotionTitle({ as: Tag = 'h2', children }) {
  return <Tag className="nv-motion-title" aria-label={textOf(children)}><span aria-hidden="true">{words(children)}</span></Tag>
}

export function useEditorialMotion(root, language) {
  const visited = useRef(false)
  useLayoutEffect(() => {
    let alive = true
    const firstVisit = !visited.current
    visited.current = true
    const media = gsap.matchMedia()
    media.add({ all: 'all', desktop: '(min-width: 801px)', reduce: '(prefers-reduced-motion: reduce)' }, ({ conditions }) => {
      if (conditions.reduce) return
      const desktop = conditions.desktop
      const select = gsap.utils.selector(root)
      const entries = []
      const final = { y: 0, yPercent: 0, scaleX: 1, scaleY: 1, rotation: 0, opacity: 1, duration: 1.65, ease: 'expo.out', clearProps: 'transform,opacity,clipPath' }
      const playOpening = firstVisit && window.scrollY < 80 && (!location.hash || location.hash === '#top')
      const opening = gsap.timeline()
      if (playOpening) {
        opening.set(select('.nv-opening-shutter'), { visibility: 'visible', scaleY: 1 })
          .to(select('.nv-opening-shutter'), { scaleY: 0, duration: 1.7, stagger: .15, ease: 'power4.inOut' }, .1)
          .fromTo(select('.nv-hero-photo'), { scale: 1.16 }, { scale: 1, duration: 2.6, ease: 'power3.out', clearProps: 'transform' }, .25)
          .fromTo(select('.nv-hero h1'), { clipPath: 'inset(100% 0 -20% 0)' }, { clipPath: 'inset(-20% 0 -20% 0)', duration: 1.8, ease: 'power4.out', clearProps: 'clipPath' }, .55)
          .fromTo(select('.nv-hero .nv-motion-word'), { yPercent: 120, scaleY: .52, scaleX: .9, opacity: 0 }, { ...final, stagger: { amount: .55 } }, .58)
          .from(select('.nv-header'), { y: -28, opacity: 0, duration: 1.25, ease: 'power3.out', clearProps: 'transform,opacity' }, 1.05)
          .from(select('.nv-hero .nv-label, .nv-microcopy'), { y: 24, clipPath: 'inset(100% 0 0 0)', duration: 1.3, stagger: .15, ease: 'expo.out', clearProps: 'transform,clipPath' }, 1.3)
          .from(select('.nv-stat'), { y: 36, clipPath: 'inset(100% 0 0 0)', duration: 1.2, stagger: .16, ease: 'expo.out', clearProps: 'transform,clipPath' }, 1.65)
          .from(select('.nv-scroll'), { y: 16, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 2)
      }

      // Each title owns its entrance; lower card groups wait until they are visible.
      select('main section:not(.nv-hero) .nv-motion-title').forEach(title => {
        if (title.getBoundingClientRect().bottom < 0) return
        const timeline = gsap.timeline({ scrollTrigger: { trigger: title, start: 'top 92%', once: true, toggleActions: 'play none none none' } })
        timeline.fromTo(title, { clipPath: 'inset(100% -8% -25% -8%)' }, { clipPath: 'inset(-25% -8% -25% -8%)', duration: 1.55, ease: 'power4.out', clearProps: 'clipPath' }, 0)
          .fromTo(title.querySelectorAll('.nv-motion-word'), { y: desktop ? 88 : 38, scaleY: .65, opacity: 0 }, { ...final, stagger: { amount: desktop ? .42 : .22 } }, .08)
        entries.push([title, timeline])
      })

      const groups = ['.nv-four', '.nv-mode-tabs', '.nv-crew-grid', '.nv-contact form', '.nv-port-list']
      groups.forEach(selector => select(selector).forEach(group => {
        if (group.getBoundingClientRect().bottom < 0) return
        const children = [...group.children].filter(node => !node.matches('small'))
        const tween = gsap.from(children, { y: desktop ? 72 : 28, opacity: 0, duration: 1.4, stagger: { amount: desktop ? .55 : .3 }, ease: 'expo.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: group, start: 'top 88%', once: true, toggleActions: 'play none none none' } })
        entries.push([group, tween])
      }))

      select('.nv-crane-image, .nv-wide-photo, .nv-crew-story > img').forEach(frame => {
        if (frame.getBoundingClientRect().bottom < 0) return
        const tween = gsap.fromTo(frame, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.9, ease: 'power4.inOut', clearProps: 'clipPath', scrollTrigger: { trigger: frame, start: 'top 90%', once: true, toggleActions: 'play none none none' } })
        entries.push([frame, tween])
      })
      if (desktop) {
        // Move the whole chart relative to the copy, including its soft shadow.
        select('.nv-booking .nv-crane-image').forEach(frame => {
          gsap.fromTo(frame, { y: 90 }, { y: -90, ease: 'none', scrollTrigger: { trigger: frame.closest('.nv-booking-layout'), start: 'top bottom', end: 'bottom top', scrub: 1.2, invalidateOnRefresh: true } })
        })
        select('.nv-wide-photo img').forEach(img => {
          gsap.fromTo(img, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1.2 } })
        })
      }
      const skipOpening = () => {
        if (window.scrollY > 80 && opening.isActive()) opening.progress(1)
        if (!opening.isActive()) window.removeEventListener('scroll', skipOpening)
      }
      const focus = event => {
        opening.progress(1)
        entries.forEach(([element, animation]) => { if (element.contains(event.target)) animation.progress(1) })
      }
      root.current.addEventListener('focusin', focus)
      if (playOpening) {
        window.addEventListener('scroll', skipOpening, { passive: true })
        opening.eventCallback('onComplete', () => window.removeEventListener('scroll', skipOpening))
      }
      return () => {
        root.current?.removeEventListener('focusin', focus)
        window.removeEventListener('scroll', skipOpening)
      }
    }, root)
    document.fonts.ready.then(() => { if (alive) ScrollTrigger.refresh() })
    return () => { alive = false; media.revert() }
  }, [root, language])
}
