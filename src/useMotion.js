import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function useMotion() {
  const opened = useRef(false)
  useLayoutEffect(() => {
    const media = gsap.matchMedia()
    let alive = true
    media.add({ all: 'all', desktop: '(min-width: 1025px)', reduce: '(prefers-reduced-motion: reduce)' }, context => {
      if (context.conditions.reduce) return
      const desktop = context.conditions.desktop
      const distance = desktop ? 110 : 48
      document.documentElement.classList.add('motion-active')
      const finishes = new Map()
      const opening = gsap.timeline({ defaults: { ease: 'expo.out' } })
      const atHome = scrollY < 80 && (!location.hash || location.hash === '#top')
      if (!opened.current && atHome) {
        opened.current = true
        opening
          .fromTo('.opening-curtain', { scaleY: 1 }, { scaleY: 0, duration: 1.65, ease: 'power4.inOut' }, 0)
          .from('.royal-sky', { scale: 1.16, duration: 2.6 }, .35)
          .from('.ap-nav', { y: -85, duration: 1.45, clearProps: 'transform' }, .7)
          .from('.hero-line', { yPercent: 120, scaleY: .56, skewY: 7, duration: 1.8, stagger: .24, transformOrigin: '50% 100%', clearProps: 'transform,transformOrigin' }, .65)
          .from('.ap-copy > p', { y: 36, clipPath: 'inset(100% 0 0 0)', duration: 1.35, clearProps: 'transform,clipPath' }, 1.5)
          .from('.ap-cta a', { y: 42, clipPath: 'inset(100% 0 0 0)', duration: 1.15, stagger: .15, clearProps: 'transform,clipPath' }, 1.85)
      } else {
        gsap.set('.opening-curtain', { scaleY: 0 })
      }

      document.querySelectorAll('.page-sections > section').forEach((section, index) => {
        const heading = section.querySelector('h2')
        const lead = section.querySelector('.section-lead, .contact-content > p:not(.kicker)')
        const cards = [...section.querySelectorAll('.feature-card, .role-card, .price-card')]
        const sequence = gsap.timeline({
          defaults: { ease: 'expo.out' },
          scrollTrigger: { trigger: section, start: 'top 72%', once: true },
        })
        sequence.from(heading, {
          y: distance, x: desktop && index === 1 ? -65 : 0,
          scaleY: .7, skewY: desktop ? 3 : 1.5,
          clipPath: 'inset(100% 0 0 0)', transformOrigin: '0% 100%',
          duration: 1.65, clearProps: 'transform,clipPath,transformOrigin',
        }, 0)
        if (lead) sequence.from(lead, { y: 24, clipPath: 'inset(100% 0 0 0)', duration: 1.1, clearProps: 'transform,clipPath' }, .35)

        if (desktop && cards.length) {
          sequence.from(cards, {
            y: index === 1 ? 90 : 65, rotation: index === 1 ? 2 : 0,
            clipPath: index === 0 ? 'inset(0 100% 0 0)' : 'inset(100% 0 0 0)',
            duration: 1.45, stagger: { amount: .48 }, clearProps: 'transform,clipPath',
          }, .45)
        } else {
          cards.forEach(card => {
            const reveal = gsap.from(card, { y: 42, clipPath: 'inset(35% 0 0 0)', duration: 1.25, ease: 'expo.out', clearProps: 'transform,clipPath', scrollTrigger: { trigger: card, start: 'top 88%', once: true } })
            finishes.set(card, reveal)
          })
        }
        const form = section.querySelector('.inquiry-form')
        if (form) sequence.from(form, { x: desktop ? 70 : 0, y: desktop ? 0 : 35, clipPath: 'inset(0 100% 0 0)', duration: 1.5, clearProps: 'transform,clipPath' }, .4)
        finishes.set(section, sequence)
      })

      if (desktop) {
        document.querySelectorAll('.feature-grid:not(.reference-products) .feature-visual').forEach(visual => {
          gsap.fromTo(visual, { yPercent: -5, scale: 1.14 }, { yPercent: 5, scale: 1.14, ease: 'none', scrollTrigger: { trigger: visual.closest('.feature-card'), start: 'top bottom', end: 'bottom top', scrub: 1.4 } })
        })
      }
      // Navigation and keyboard access never have to wait for choreography.
      const onScroll = () => { if (scrollY > 80 && opening.isActive()) opening.progress(1) }
      const onFocus = event => {
        if (event.target.closest('.ap-hero, .ap-nav')) opening.progress(1)
        finishes.forEach((animation, element) => { if (element.contains(event.target)) animation.progress(1) })
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      document.addEventListener('focusin', onFocus)
      return () => {
        document.documentElement.classList.remove('motion-active')
        window.removeEventListener('scroll', onScroll)
        document.removeEventListener('focusin', onFocus)
      }
    })
    document.fonts.ready.then(() => { if (alive) ScrollTrigger.refresh() })
    return () => { alive = false; media.revert() }
  }, [])
}
