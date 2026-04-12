import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { personal, achievements } from '@/data/personal'

/* ─── Education progress calculation ─── */
function getEducationProgress(): number {
  const start = new Date(2024, 6, 1)
  const end = new Date(2028, 11, 31)
  const now = new Date()
  const total = end.getTime() - start.getTime()
  const elapsed = now.getTime() - start.getTime()
  return Math.min(Math.max((elapsed / total) * 100, 0), 100)
}

export default function Experience() {
  const containerRef = useRef<HTMLElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  const { currentRole, education } = personal
  const progress = getEducationProgress()

  useGSAP(() => {
    gsap.from('.exp-label, .exp-title', {
      scrollTrigger: { trigger: containerRef.current, start: 'top 78%' },
      y: 30, opacity: 0, stagger: 0.1, duration: 0.65, ease: 'power3.out',
    })

    // Cards staggered entrance
    const cards = gsap.utils.toArray<HTMLElement>('.exp-card')
    cards.forEach((card, i) => {
      gsap.from(card, {
        y: 50, opacity: 0,
        duration: 0.9, delay: i * 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 90%' },
      })
    })

    // Animate progress bar
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: `${progress}%`,
        duration: 1.8, delay: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: progressRef.current, start: 'top 90%' },
      })
    }
  }, { scope: containerRef })

  return (
    <section id="experience" ref={containerRef} className="section bg-[var(--bg-base)]">
      <div className="max-w-[1280px] mx-auto">

        {/* Header */}
        <div className="exp-label section-label">Experience</div>
        <h2 className="exp-title text-h1 mb-14">
          Where I've been{' '}
          <span className="text-gradient-accent">building</span>
        </h2>

        {/* ── Bento Grid ── */}
        <div
          className="exp-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1px',
            background: 'var(--border-medium)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}
        >
          {/* ── Current Role Card (2-col) ── */}
          <div
            className="exp-card group relative p-7 md:p-8 overflow-hidden transition-all duration-300 flex flex-col justify-between"
            style={{ gridColumn: 'span 2', background: 'var(--bg-card)', minHeight: 240 }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="absolute top-0 right-0 w-36 h-36 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: 'radial-gradient(circle at top right, rgba(34,211,165,0.15) 0%, transparent 70%)' }} />

            <div className="relative z-10">
              <span className="font-mono text-[0.6rem] tracking-[0.14em] uppercase text-[var(--text-muted)] mb-4 block">Current Role</span>
              <h3 className="text-xl md:text-2xl font-bold text-[var(--text)] leading-tight">
                {currentRole.title}{' '}
                <span className="text-[var(--accent)]">@ {currentRole.company}</span>
              </h3>
              <p className="text-sm text-[var(--text-muted)] mt-3 leading-relaxed max-w-lg">{currentRole.description}</p>
            </div>

            <div className="flex items-center gap-2 mt-6 relative z-10">
              <span className="w-2 h-2 rounded-full flex-shrink-0 relative" style={{ background: 'var(--accent)' }}>
                <span className="absolute inset-[-3px] rounded-full animate-pulse-dot" style={{ background: 'var(--accent)', opacity: 0.4 }} />
              </span>
              <span className="font-mono text-xs text-[var(--text-secondary)] tracking-wide">Active · Remote · ene. 2026 – Present</span>
            </div>
          </div>

          {/* ── Education Card ── */}
          <div className="exp-card group relative p-7 overflow-hidden transition-all duration-300 flex flex-col" style={{ background: 'var(--bg-card)' }}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="absolute top-0 right-0 w-28 h-28 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: 'radial-gradient(circle at top right, rgba(139,92,246,0.15) 0%, transparent 70%)' }} />

            <div className="relative z-10 flex-1">
              <span className="font-mono text-[0.6rem] tracking-[0.14em] uppercase text-[var(--text-muted)] mb-3 block">Education</span>
              <h3 className="text-lg font-bold text-[var(--text)] leading-tight">ITSON</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1 leading-snug">B.S. Computer Software Engineering<br />Instituto Tecnológico de Sonora</p>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {education.subjects.map((s) => (
                  <span key={s} className="font-mono text-[0.6rem] text-[var(--text-secondary)] px-2 py-0.5 rounded border border-[var(--border)]" style={{ background: 'var(--accent-2-dim)' }}>{s}</span>
                ))}
              </div>
            </div>

            <div className="relative z-10 mt-6">
              <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                <div ref={progressRef} className="h-full rounded-full relative" style={{ width: 0, background: 'linear-gradient(90deg, var(--accent-2), rgba(139,92,246,0.4))' }}>
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full" style={{ background: 'var(--accent-2)', boxShadow: '0 0 12px var(--accent-2)' }} />
                </div>
              </div>
              <div className="flex justify-between mt-2 font-mono text-[0.6rem] text-[var(--text-muted)] tracking-wide">
                <span>Jul 2024</span>
                <span>{Math.round(progress)}% Complete</span>
                <span>Dec 2028</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── Achievements — separate row, equal width ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* NVIDIA */}
          <div
            className="exp-card group relative rounded-2xl p-7 overflow-hidden transition-all duration-300"
            style={{ background: 'linear-gradient(135deg, rgba(118,185,0,0.08), rgba(118,185,0,0.02), var(--bg-card))', border: '1px solid rgba(118,185,0,0.15)' }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="absolute top-0 right-0 w-40 h-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: 'radial-gradient(circle at top right, rgba(118,185,0,0.2) 0%, transparent 70%)' }} />
            <div className="absolute top-0 -left-full w-full h-full opacity-0 group-hover:opacity-100 group-hover:left-full transition-all duration-700 pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(118,185,0,0.05), transparent)' }} />

            <div className="relative z-10 flex items-start gap-5">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, rgba(118,185,0,0.18), rgba(118,185,0,0.06))', border: '1px solid rgba(118,185,0,0.3)' }}
              >
                <img src="https://upload.wikimedia.org/wikipedia/sco/2/21/Nvidia_logo.svg" alt="NVIDIA" className="w-10 h-10 object-contain" loading="lazy" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-[var(--text)] leading-tight mb-1">{achievements[0].title}</p>
                <p className="text-xs font-semibold mb-2" style={{ color: '#76b900' }}>{achievements[0].issuer}</p>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{achievements[0].description}</p>
                <p className="text-[0.65rem] text-[var(--text-disabled)] font-mono mt-3">{achievements[0].date}</p>
              </div>
            </div>
          </div>

          {/* Intel */}
          <div
            className="exp-card group relative rounded-2xl p-7 overflow-hidden transition-all duration-300"
            style={{ background: 'linear-gradient(135deg, rgba(0,113,197,0.08), rgba(0,113,197,0.02), var(--bg-card))', border: '1px solid rgba(0,113,197,0.15)' }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="absolute top-0 right-0 w-40 h-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: 'radial-gradient(circle at top right, rgba(0,113,197,0.2) 0%, transparent 70%)' }} />
            <div className="absolute top-0 -left-full w-full h-full opacity-0 group-hover:opacity-100 group-hover:left-full transition-all duration-700 pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,113,197,0.05), transparent)' }} />

            <div className="relative z-10 flex items-start gap-5">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, rgba(0,113,197,0.18), rgba(0,113,197,0.06))', border: '1px solid rgba(0,113,197,0.3)' }}
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282006-2020%29.svg" alt="Intel" className="w-10 h-10 object-contain" loading="lazy" style={{ filter: 'brightness(1.5)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-[var(--text)] leading-tight mb-1">{achievements[1].title}</p>
                <p className="text-xs font-semibold mb-2" style={{ color: '#0071c5' }}>{achievements[1].issuer}</p>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{achievements[1].description}</p>
                <p className="text-[0.65rem] text-[var(--text-disabled)] font-mono mt-3">{achievements[1].date}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive */}
        <style>{`
          @media (max-width: 768px) {
            .exp-grid {
              grid-template-columns: 1fr 1fr !important;
            }
            .exp-grid > :first-child {
              grid-column: span 2 !important;
            }
            .exp-grid > :nth-child(3) {
              grid-column: span 1 !important;
            }
          }
          @media (max-width: 480px) {
            .exp-grid {
              grid-template-columns: 1fr !important;
            }
            .exp-grid > * {
              grid-column: span 1 !important;
            }
          }
        `}</style>
      </div>
    </section>
  )
}
