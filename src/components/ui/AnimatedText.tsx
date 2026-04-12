import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, SplitText, ScrollTrigger } from '@/lib/gsap'

type Tag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'

interface AnimatedTextProps {
  children: string
  as?: Tag
  className?: string
  type?: 'words' | 'chars' | 'lines'
  stagger?: number
  duration?: number
  y?: number
  delay?: number
  useScroll?: boolean
  scrollStart?: string
}

export default function AnimatedText({
  children,
  as: Tag = 'h2',
  className = '',
  type = 'words',
  stagger = 0.06,
  duration = 0.75,
  y = 50,
  delay = 0,
  useScroll = true,
  scrollStart = 'top 85%',
}: AnimatedTextProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null)

  useGSAP(() => {
    if (!ref.current) return
    const split   = new SplitText(ref.current, { type })
    const targets = type === 'words' ? split.words : type === 'chars' ? split.chars : split.lines

    const anim = gsap.from(targets, {
      y, opacity: 0, stagger, duration, delay, ease: 'power3.out', paused: useScroll,
    })

    if (useScroll) {
      ScrollTrigger.create({
        trigger: ref.current as Element,
        start: scrollStart,
        onEnter: () => anim.play(),
      })
    } else {
      anim.play()
    }

    return () => split.revert()
  }, { scope: ref })

  const El = Tag
  return <El ref={ref} className={className}>{children}</El>
}
