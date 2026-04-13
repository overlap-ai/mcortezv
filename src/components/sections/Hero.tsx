import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, scrollTo, addMagneticEffect } from '@/lib/gsap'
import HeroCanvas from './HeroCanvas'

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const titleRef     = useRef<HTMLHeadingElement>(null)
  const contentRef   = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!titleRef.current || !containerRef.current) return

    // Set initial hidden states
    gsap.set(titleRef.current, { autoAlpha: 0 })
    gsap.set('.hero-label', { y: 25, autoAlpha: 0 })
    gsap.set('.hero-role', { autoAlpha: 0, y: 15 })
    gsap.set('.hero-desc', { y: 20, autoAlpha: 0 })
    gsap.set('.hero-cta', { y: 15, autoAlpha: 0 })
    gsap.set('.hero-meta', { autoAlpha: 0 })
    gsap.set('.hero-scroll', { autoAlpha: 0, y: 10 })

    // ── Master entrance timeline (title fades in right at explosion moment) ──
    const tl = gsap.timeline({ delay: 2.7 })

    // Title fades in slowly during the final moments of text formation + explosion
    // so the particles and DOM text crossfade seamlessly
    tl.to(titleRef.current, { autoAlpha: 1, duration: 1.0, ease: 'power2.inOut' })

    tl.to('.hero-label', { y: 0, autoAlpha: 1, duration: 0.5, ease: 'smooth-out' }, '-=0.5')
    tl.to('.hero-role', { autoAlpha: 1, y: 0, duration: 0.5, ease: 'smooth-out' }, '-=0.3')
    tl.to('.hero-desc', { y: 0, autoAlpha: 1, duration: 0.5, ease: 'smooth-out' }, '-=0.3')
    tl.to('.hero-cta', { y: 0, autoAlpha: 1, stagger: 0.08, duration: 0.4, ease: 'smooth-out' }, '-=0.25')
    tl.to('.hero-meta', { autoAlpha: 1, duration: 0.4 }, '-=0.2')
    tl.to('.hero-scroll', { autoAlpha: 1, y: 0, duration: 0.4 }, '-=0.15')

    // ── PINNED SCALE-DOWN on scroll (the money shot) ──
    const scaleTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: '+=50%',
        pin: true,
        scrub: 0.5,
      },
    })
    scaleTl.to('.hero-inner', {
      scale: 0.92,
      borderRadius: '24px',
      duration: 1,
    })

    // ── Scroll indicator fades with scrub (separate ScrollTrigger) ──
    gsap.to('.hero-scroll', {
      autoAlpha: 0,
      y: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: '80px top',
        end: '300px top',
        scrub: true,
      },
    })

    // ── Magnetic effect on CTA buttons ──
    const cleanups: (() => void)[] = []
    document.querySelectorAll<HTMLElement>('.hero-cta').forEach(btn => {
      cleanups.push(addMagneticEffect(btn, 0.25))
    })

    return () => {
      cleanups.forEach(fn => fn())
    }
  }, { scope: containerRef })

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative overflow-visible bg-[#060606]"
    >
      {/* ── Hero inner (pinned scale-down target) ── */}
      <div
        className="hero-inner relative overflow-hidden"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          willChange: 'transform',
          background: '#060606',
        }}
      >
        {/* ── Generative art canvas ── */}
        <HeroCanvas />

        {/* ── Parallax glow blobs ── */}
        <div
          className="hero-blob-1 absolute pointer-events-none select-none animate-float-slow"
          style={{
            top: '-25%', right: '-15%',
            width: '70vw', height: '70vw',
            maxWidth: 860, maxHeight: 860,
            background: 'radial-gradient(circle, rgba(34,211,165,0.07) 0%, transparent 68%)',
            borderRadius: '50%',
            willChange: 'transform',
          }}
        />
        <div
          className="hero-blob-2 absolute pointer-events-none select-none animate-float-slower"
          style={{
            bottom: '-25%', left: '-10%',
            width: '55vw', height: '55vw',
            maxWidth: 700, maxHeight: 700,
            background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 68%)',
            borderRadius: '50%',
            willChange: 'transform',
          }}
        />

        {/* ── Edge vignette ── */}
        <div
          className="absolute inset-0 pointer-events-none z-[2]"
          style={{
            background: 'radial-gradient(ellipse 110% 110% at 50% 50%, transparent 35%, rgba(6,6,6,0.82) 100%)',
          }}
        />

        {/* ── Content ── */}
        <div ref={contentRef} className="relative z-10 w-full max-w-[1280px] mx-auto px-6 md:px-10 pt-28 pb-20" style={{ willChange: 'transform' }}>

          {/* Status label */}
          <div className="hero-label inline-flex items-center gap-2.5 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse-dot" />
            <span className="font-mono text-[0.68rem] text-[var(--accent)] tracking-[0.18em] uppercase">
              AI Developer · Monterrey, México
            </span>
          </div>

          {/* Title — SplitText with mask reveals each word */}
          <h1
            ref={titleRef}
            className="font-display mb-7 md:mb-8 text-[var(--text)]"
            style={{
              fontSize: 'clamp(4rem, 9vw, 8.5rem)',
              fontWeight: 800,
              lineHeight: 0.94,
              letterSpacing: '-0.035em',
            }}
          >
            Manuel<br /> Cortez
          </h1>

          {/* Role line */}
          <p
            className="hero-role font-display text-[var(--accent)] mb-3"
            style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', fontWeight: 600, letterSpacing: '-0.01em' }}
          >
            AI Developer & Consultant
          </p>

          {/* Description */}
          <p
            className="hero-desc max-w-lg text-[var(--text-secondary)] mb-10"
            style={{ fontSize: 'clamp(1rem, 1.5vw, 1.0625rem)', lineHeight: '1.75' }}
          >
            Building the intersection of AI and exceptional software.{' '}
            <span className="text-[var(--text)]">Agents, RAG pipelines, automated workflows</span>
            {' '}and interfaces that move the needle in B2B products.
          </p>

          {/* CTAs — with magnetic effect */}
          <div className="flex flex-wrap gap-3 mb-14 md:mb-16">
            <button onClick={() => scrollTo('research')} className="hero-cta btn-ghost magnetic">
              Read Research
            </button>
            <button onClick={() => scrollTo('contact')} className="hero-cta btn-ghost magnetic">
              Get in Touch
            </button>
          </div>

          {/* Meta */}
          <div className="hero-meta flex flex-wrap items-center gap-2 sm:gap-4">
            <span className="text-micro text-[var(--text-disabled)] font-mono uppercase tracking-wider">Working at</span>
            <a href="https://www.hyperflowos.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 group">
              <span className="w-4 h-4 rounded bg-[var(--accent-dim)] border border-[var(--accent-glow)] flex items-center justify-center">
                <span className="text-[7px] font-black text-[var(--accent)]">H</span>
              </span>
              <span className="text-xs text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors font-medium">Hyper Digital</span>
            </a>
            <span className="text-[var(--text-disabled)]">·</span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-[rgba(139,92,246,0.12)] border border-[rgba(139,92,246,0.25)] flex items-center justify-center">
                <span className="text-[7px] font-black text-[#8b5cf6]">N</span>
              </span>
              <span className="text-xs text-[var(--text-muted)] font-medium">NVIDIA Inception</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator (fades on scroll) — OUTSIDE hero-inner ── */}
      <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="font-mono text-[0.6rem] text-[var(--text-disabled)] tracking-[0.2em] uppercase">scroll</span>
        <div className="w-px h-10 animate-scroll-bounce"
          style={{ background: 'linear-gradient(to bottom, var(--text-muted), transparent)' }}
        />
      </div>
    </section>
  )
}
