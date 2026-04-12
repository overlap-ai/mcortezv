import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, SplitText, scrollTo } from '@/lib/gsap'
import HeroCanvas from './HeroCanvas'

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const titleRef     = useRef<HTMLHeadingElement>(null)

  useGSAP(() => {
    if (!titleRef.current) return

    const split = new SplitText(titleRef.current, { type: 'words' })

    // Set initial hidden states explicitly
    gsap.set('.hero-label', { y: 18, opacity: 0 })
    gsap.set(split.words, { y: 90, opacity: 0 })
    gsap.set('.hero-desc', { y: 22, opacity: 0 })
    gsap.set('.hero-cta', { y: 16, opacity: 0 })
    gsap.set('.hero-meta', { opacity: 0 })
    gsap.set('.hero-scroll', { opacity: 0, y: 10 })

    const tl = gsap.timeline({ delay: 0.3 })

    tl.to('.hero-label', {
      y: 0, opacity: 1, duration: 0.55, ease: 'power2.out',
    })
    tl.to(split.words, {
      y: 0, opacity: 1, stagger: 0.07, duration: 0.95, ease: 'power3.out',
    }, '-=0.2')
    tl.to('.hero-desc', {
      y: 0, opacity: 1, duration: 0.65, ease: 'power2.out',
    }, '-=0.55')
    tl.to('.hero-cta', {
      y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: 'power2.out',
    }, '-=0.45')
    tl.to('.hero-meta', { opacity: 1, duration: 0.5 }, '-=0.3')
    tl.to('.hero-scroll', { opacity: 1, y: 0, duration: 0.5 }, '-=0.2')

    return () => split.revert()
  }, { scope: containerRef })

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-[#060606]"
    >
      {/* ── Generative art canvas (algorithmic-art skill) ── */}
      <HeroCanvas />

      {/* ── Subtle color glow blobs above canvas ── */}
      <div
        className="absolute pointer-events-none select-none animate-float-slow"
        style={{
          top: '-25%', right: '-15%',
          width: '70vw', height: '70vw',
          maxWidth: 860, maxHeight: 860,
          background: 'radial-gradient(circle, rgba(34,211,165,0.07) 0%, transparent 68%)',
          borderRadius: '50%',
        }}
      />
      <div
        className="absolute pointer-events-none select-none animate-float-slower"
        style={{
          bottom: '-25%', left: '-10%',
          width: '55vw', height: '55vw',
          maxWidth: 700, maxHeight: 700,
          background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 68%)',
          borderRadius: '50%',
        }}
      />

      {/* ── Edge vignette for depth ── */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: 'radial-gradient(ellipse 110% 110% at 50% 50%, transparent 35%, rgba(6,6,6,0.82) 100%)',
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 md:px-10 pt-28 pb-20">

        {/* Status label */}
        <div className="hero-label inline-flex items-center gap-2.5 mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse-dot" />
          <span className="font-mono text-[0.68rem] text-[var(--accent)] tracking-[0.18em] uppercase">
            AI Developer · Monterrey, México
          </span>
        </div>

        {/* Title */}
        <h1
          ref={titleRef}
          className="font-display mb-7 md:mb-8 text-[var(--text)]"
          style={{
            fontSize: 'clamp(5.7rem, 9vw, 8.5rem)',
            fontWeight: 800,
            lineHeight: 0.94,
            letterSpacing: '-0.035em',
          }}
        >
          Manuel<br className="hidden sm:block" /> Cortez
        </h1>

        {/* Role line */}
        <p
          className="hero-desc font-display text-[var(--accent)] mb-3"
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

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 mb-14 md:mb-16">
          <button onClick={() => scrollTo('research')} className="hero-cta btn-ghost">
            Read Research
          </button>
          <button onClick={() => scrollTo('contact')} className="hero-cta btn-ghost">
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

      {/* ── Scroll indicator ── */}
      <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="font-mono text-[0.6rem] text-[var(--text-disabled)] tracking-[0.2em] uppercase">scroll</span>
        <div className="w-px h-10 animate-scroll-bounce"
          style={{ background: 'linear-gradient(to bottom, var(--text-muted), transparent)' }}
        />
      </div>
    </section>
  )
}
