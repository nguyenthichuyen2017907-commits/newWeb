import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function useAtelierMotion(root) {
  useLayoutEffect(() => {
    const media=gsap.matchMedia()
    let alive=true
    media.add({ all:'all', desktop:'(min-width: 801px)', reduce:'(prefers-reduced-motion: reduce)' }, context=>{
      if(context.conditions.reduce)return
      const desktop=context.conditions.desktop
      root.current.classList.add('nf-motion')
      const timelines=[]
      const opening=gsap.timeline({defaults:{ease:'expo.out'}})
      if(scrollY<70 && (!location.hash||location.hash==='#top')) {
        opening.fromTo('.nf-opening',{scaleY:1},{scaleY:0,duration:1.55,ease:'power4.inOut'},0)
          .fromTo('.nf-hero-line .nf-float-char',{yPercent:desktop?110:70,scaleY:desktop?1.8:1.3,scaleX:.85,opacity:0},{yPercent:0,scaleY:1,scaleX:1,opacity:1,stagger:.045,duration:1.45,ease:'power3.out',clearProps:'transform'},.45)
          .from('.nf-hero-copy>p',{y:24,clipPath:'inset(100% 0 0 0)',duration:1.3,clearProps:'transform,clipPath'},1.1)
          .from('.nf-hero-actions>*',{y:26,clipPath:'inset(100% 0 0 0)',stagger:.13,duration:1.25,clearProps:'transform,clipPath'},1.35)
          .from('.nf-hero-note',{opacity:0,duration:1.2,clearProps:'opacity'},1.7)
          .from('.nf-horizon',{y:80,opacity:0,duration:2,clearProps:'transform,opacity'},.55)
      } else {
        gsap.set('.nf-opening',{scaleY:0})
        gsap.set('.nf-hero-line .nf-float-char',{opacity:1})
      }
      if(desktop){
        gsap.fromTo('.nf-product-window',{rotationX:16,y:45,scale:.94},{rotationX:0,y:0,scale:1,ease:'none',scrollTrigger:{trigger:'.nf-window-wrap',start:'top 95%',end:'top 20%',scrub:1.25}})
        gsap.to('.nf-horizon-ring',{y:-65,stagger:.05,ease:'none',scrollTrigger:{trigger:'.nf-hero',start:'top top',end:'bottom top',scrub:1.8}})
        gsap.fromTo('.nf-ocean-backdrop img',{yPercent:-4},{yPercent:4,ease:'none',scrollTrigger:{trigger:'.nf-ocean-break',start:'top bottom',end:'bottom top',scrub:1.2}})
      }
      // Separate foreground depth from the static tilt and heading entrance.
      gsap.fromTo('.nf-ocean-visual',{y:desktop?55:16},{y:desktop?-55:-16,ease:'none',scrollTrigger:{trigger:'.nf-ocean-break',start:'top bottom',end:'bottom top',scrub:desktop?1.1:.6,invalidateOnRefresh:true}})
      gsap.fromTo('.nf-manifesto-line>span',{color:'#444f5e'},{color:'#d5e1f3',stagger:.45,ease:'none',scrollTrigger:{trigger:'.nf-manifesto',start:'top 75%',end:'bottom 55%',scrub:.8}})
      root.current.querySelectorAll('.nf-scroll-float').forEach(heading=>{
        gsap.fromTo(heading.querySelectorAll('.nf-float-char'),
          {yPercent:desktop?110:65,scaleY:desktop?1.8:1.25,scaleX:.85,opacity:0},
          {yPercent:0,scaleY:1,scaleX:1,opacity:1,duration:1,stagger:.035,ease:'power3.out',scrollTrigger:{trigger:heading,start:'clamp(top 94%)',end:'clamp(top 62%)',scrub:desktop?.55:.25,invalidateOnRefresh:true}})
      })
      root.current.querySelectorAll('.nf-reveal').forEach(element=>{
        const targets=element.querySelector('.nf-scroll-float')
          ? [...element.children].filter(child=>!child.matches('.nf-scroll-float, .nf-ocean-visual, .nf-ocean-backdrop')&&!child.querySelector('.nf-scroll-float'))
          : element
        const timeline=gsap.timeline({scrollTrigger:{trigger:element,start:'top 88%',toggleActions:'play none none none'}})
        timeline.from(targets,{y:desktop?65:32,clipPath:'inset(10% 0 0 0)',opacity:.25,duration:1.5,ease:'expo.out',clearProps:'transform,clipPath,opacity'})
        timelines.push([element,timeline])
      })
      root.current.querySelectorAll('.nf-plan').forEach((element,index)=>{
        const tween=gsap.from(element,{y:desktop?55:25,clipPath:'inset(15% 0 0 0)',duration:1.35,delay:desktop?index*.12:0,ease:'expo.out',clearProps:'transform,clipPath',scrollTrigger:{trigger:element,start:'top 94%',toggleActions:'play none none none'}})
        timelines.push([element,tween])
      })
      const skip=()=>{if(scrollY>80&&opening.isActive())opening.progress(1)}
      const focus=event=>{opening.progress(1);timelines.forEach(([element,animation])=>{if(element.contains(event.target))animation.progress(1)})}
      window.addEventListener('scroll',skip,{passive:true});document.addEventListener('focusin',focus)
      return()=>{root.current?.classList.remove('nf-motion');window.removeEventListener('scroll',skip);document.removeEventListener('focusin',focus)}
    },root)
    document.fonts.ready.then(()=>{if(alive)ScrollTrigger.refresh()})
    return()=>{alive=false;media.revert()}
  },[root])
}
