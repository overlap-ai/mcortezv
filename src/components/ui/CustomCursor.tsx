import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [isTouch, setIsTouch] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  )

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)')
    const onChange = (e: MediaQueryListEvent) => setIsTouch(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (isTouch) return

    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0, mouseY = 0

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      gsap.to(dot,  { x: mouseX, y: mouseY, duration: 0,    ease: 'none' })
      gsap.to(ring, { x: mouseX, y: mouseY, duration: 0.18, ease: 'power2.out' })
    }

    const onHoverIn = () => ring.classList.add('hovering')
    const onHoverOut = () => ring.classList.remove('hovering')

    // Add hover detection to all interactive elements
    const targets = document.querySelectorAll('a, button, [role="button"]')
    targets.forEach((el) => {
      el.addEventListener('mouseenter', onHoverIn)
      el.addEventListener('mouseleave', onHoverOut)
    })

    window.addEventListener('mousemove', onMove)

    // MutationObserver to handle dynamically added elements
    const observer = new MutationObserver(() => {
      const newTargets = document.querySelectorAll('a:not([data-cursor]), button:not([data-cursor])')
      newTargets.forEach((el) => {
        el.setAttribute('data-cursor', 'true')
        el.addEventListener('mouseenter', onHoverIn)
        el.addEventListener('mouseleave', onHoverOut)
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      targets.forEach((el) => {
        el.removeEventListener('mouseenter', onHoverIn)
        el.removeEventListener('mouseleave', onHoverOut)
      })
      observer.disconnect()
    }
  }, [isTouch])

  if (isTouch) return null

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  )
}
