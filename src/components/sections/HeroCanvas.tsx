/**
 * Neural Particle Text Formation
 *
 * Particles start scattered, converge to form "Manuel Cortez" with
 * neural-network connections between them, hold the shape, then
 * dissolve into a Perlin noise flow field.
 */

import { useEffect, useRef } from 'react'

/* ─── Minimal 2D Perlin noise ─────────────────────────── */
function buildNoise(seed: number) {
  const p = Array.from({ length: 256 }, (_: unknown, i: number) => i)
  let s = (seed ^ 0x1d2e3f4a) & 0x7fffffff
  for (let i = 255; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) & 0x7fffffff
    const j = s % (i + 1)
    ;[p[i], p[j]] = [p[j], p[i]]
  }
  const perm = new Uint8Array(512)
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255]

  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
  const lerp = (t: number, a: number, b: number) => a + t * (b - a)
  const grad = (h: number, x: number, y: number) =>
    ((h & 1) ? -x : x) + ((h & 2) ? -y : y)

  return (x: number, y: number): number => {
    const X = Math.floor(x) & 255
    const Y = Math.floor(y) & 255
    const xf = x - Math.floor(x)
    const yf = y - Math.floor(y)
    const u = fade(xf)
    const v = fade(yf)
    return lerp(v,
      lerp(u, grad(perm[perm[X] + Y], xf, yf),
        grad(perm[perm[X + 1] + Y], xf - 1, yf)),
      lerp(u, grad(perm[perm[X] + Y + 1], xf, yf - 1),
        grad(perm[perm[X + 1] + Y + 1], xf - 1, yf - 1)),
    )
  }
}

/* ─── Seeded PRNG ─────────────────────────────────────── */
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

/* ─── Particle ────────────────────────────────────────── */
interface P {
  x: number; y: number
  tx: number; ty: number      // text target position
  vx: number; vy: number
  speed: number
  life: number; maxLife: number
  size: number
  hasTarget: boolean
}

/* ─── Sample text pixels from the REAL DOM title position ── */
function sampleTextPositions(w: number, h: number, canvasEl: HTMLCanvasElement): { x: number; y: number }[] {
  // Find the actual h1 element and measure its position relative to the canvas container
  const container = canvasEl.parentElement
  if (!container) return []
  const titleEl = container.querySelector('h1')
  if (!titleEl) return []

  const containerRect = container.getBoundingClientRect()
  const titleRect = titleEl.getBoundingClientRect()

  // Title position relative to the canvas
  const titleLeft = titleRect.left - containerRect.left
  const titleTop = titleRect.top - containerRect.top

  // Read the actual computed font styles from the DOM title
  const computed = getComputedStyle(titleEl)
  const fontSize = parseFloat(computed.fontSize)
  const fontWeight = computed.fontWeight
  const fontFamily = computed.fontFamily
  const lineHeight = parseFloat(computed.lineHeight) || fontSize * 0.94

  const off = document.createElement('canvas')
  off.width = w
  off.height = h
  const offCtx = off.getContext('2d')!

  offCtx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
  offCtx.fillStyle = 'white'
  offCtx.textBaseline = 'top'

  // Match the DOM's letter-spacing for precise alignment
  const letterSpacing = computed.letterSpacing
  if (letterSpacing && letterSpacing !== 'normal') {
    ;(offCtx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = letterSpacing
  }

  // Always render two lines — the font is large enough that it wraps on all screen sizes
  offCtx.fillText('Manuel', titleLeft, titleTop)
  offCtx.fillText('Cortez', titleLeft, titleTop + lineHeight)

  const data = offCtx.getImageData(0, 0, w, h).data
  const positions: { x: number; y: number }[] = []
  // Denser sampling on mobile for sharper text
  const isMob = w < 768
  const step = isMob ? 3 : Math.max(4, Math.floor(Math.min(w, h) / 180))

  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if (data[(y * w + x) * 4 + 3] > 128) {
        positions.push({ x, y })
      }
    }
  }
  return positions
}

/* ─── Phase curves ────────────────────────────────────── */
function formingStrength(t: number): number {
  if (t < 0.5) return 0
  if (t < 1.8) return Math.min(1, (t - 0.5) / 1.0)
  if (t < 2.8) return 1
  return 0
}
/** How much flow field influences particles (0 during forming, ramps slowly after explosion) */
function flowFieldStrength(t: number): number {
  if (t < 5.0) return 0                                     // explosion drifts freely for ~2s
  return Math.min(1, (t - 5.0) / 3.0)                       // then flow field blends in over 3s
}
const EXPLOSION_TIME = 2.8

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const SEED = 2025
    const noise = buildNoise(SEED)
    const rng = mulberry32(SEED ^ 0xdeadbeef)
    let startTime = performance.now()
    let time = 0
    let animId = 0
    let particles: P[] = []
    let W = 0, H = 0
    let exploded = false
    let flowFieldCount = 100

    function makeParticle(w: number, h: number, target?: { x: number; y: number }): P {
      return {
        x: rng() * w,
        y: rng() * h,
        tx: target?.x ?? 0,
        ty: target?.y ?? 0,
        vx: (rng() - 0.5) * 3,
        vy: (rng() - 0.5) * 3,
        speed: 0.25 + rng() * 0.6,
        life: Math.floor(rng() * 300),
        maxLife: 250 + Math.floor(rng() * 250),
        size: 0.6 + rng() * 1.2,
        hasTarget: !!target,
      }
    }

    const resize = () => {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      canvas.width = W
      canvas.height = H
      ctx.fillStyle = '#060606'
      ctx.fillRect(0, 0, W, H)

      const textPositions = sampleTextPositions(W, H, canvas)

      // Shuffle text positions for natural distribution
      for (let i = textPositions.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1))
        ;[textPositions[i], textPositions[j]] = [textPositions[j], textPositions[i]]
      }

      // Cap text particles — fewer on mobile for performance
      const isMobile = W < 768
      const maxTextParticles = isMobile ? 450 : 600
      let usedPositions = textPositions
      if (textPositions.length > maxTextParticles) {
        const every = Math.ceil(textPositions.length / maxTextParticles)
        usedPositions = textPositions.filter((_, i) => i % every === 0)
      }
      particles = []
      for (let i = 0; i < usedPositions.length; i++) {
        particles.push(makeParticle(W, H, usedPositions[i]))
      }
      // Ambient particles
      const extraCount = isMobile
        ? Math.max(30, Math.min(80, Math.floor((W * H) / 6000)))
        : Math.max(15, Math.floor(usedPositions.length * 0.08))
      for (let i = 0; i < extraCount; i++) {
        particles.push(makeParticle(W, H))
      }
      // How many particles the flow field should have (same as original HeroCanvas)
      flowFieldCount = Math.max(60, Math.min(220, Math.floor((W * H) / 5500)))
      startTime = performance.now()
      exploded = false
    }

    // Wait for fonts to load before first sample so the canvas uses Inter, not a fallback
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => resize())
    } else {
      resize()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    /* ─── Draw loop — single continuous system ─── */
    const draw = () => {
      const elapsed = (performance.now() - startTime) / 1000
      const forming = formingStrength(elapsed)
      const flow = flowFieldStrength(elapsed)

      // Fade trail — crisp during text, normal otherwise
      ctx.fillStyle = `rgba(6,6,6,${forming > 0.5 ? 0.15 : 0.055})`
      ctx.fillRect(0, 0, W, H)

      time += 0.0035

      /* ── Neural-network connection lines (only during forming) ── */
      if (forming > 0.25) {
        ctx.lineWidth = 0.5
        const threshold = 40 + forming * 40
        const threshSq = threshold * threshold
        for (let i = 0; i < particles.length; i += 2) {
          const a = particles[i]
          if (!a.hasTarget) continue
          for (let j = i + 2; j < Math.min(i + 50, particles.length); j += 2) {
            const b = particles[j]
            if (!b.hasTarget) continue
            const dx = a.x - b.x
            const dy = a.y - b.y
            if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) continue
            const dSq = dx * dx + dy * dy
            if (dSq < threshSq) {
              const d = Math.sqrt(dSq)
              const a2 = (1 - d / threshold) * 0.12 * forming
              ctx.beginPath()
              ctx.moveTo(a.x, a.y)
              ctx.lineTo(b.x, b.y)
              ctx.strokeStyle = `rgba(34,211,165,${a2})`
              ctx.stroke()
            }
          }
        }
      }

      /* ── Explosion impulse — one-time burst ── */
      if (elapsed >= EXPLOSION_TIME && !exploded) {
        exploded = true
        let sumX = 0, sumY = 0, cnt = 0
        for (const p of particles) {
          if (p.hasTarget) { sumX += p.x; sumY += p.y; cnt++ }
        }
        const cx = cnt > 0 ? sumX / cnt : W / 2
        const cy = cnt > 0 ? sumY / cnt : H / 2
        for (const p of particles) {
          const dx = p.x - cx
          const dy = p.y - cy
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          // Moderate force — slow enough to watch, far enough to fill the screen
          const force = 4 + Math.random() * 6
          p.vx = (dx / dist) * force + (Math.random() - 0.5) * 3
          p.vy = (dy / dist) * force + (Math.random() - 0.5) * 3
          p.life = 0
          p.maxLife = 400 + Math.floor(Math.random() * 400)
        }
      }

      /* ── Update & draw particles ── */
      let activeCount = 0
      for (const p of particles) {
        if (p.life < p.maxLife) activeCount++
        /* Text-forming spring */
        if (p.hasTarget && forming > 0) {
          const dx = p.tx - p.x
          const dy = p.ty - p.y
          p.vx += dx * 0.12 * forming
          p.vy += dy * 0.12 * forming
          p.vx *= 0.82
          p.vy *= 0.82
          if (forming > 0.9) {
            p.vx += (Math.random() - 0.5) * 0.15
            p.vy += (Math.random() - 0.5) * 0.15
          }
        }

        /* Flow field — blends in gradually after explosion */
        if (flow > 0.01) {
          const n = noise(p.x * 0.0026, p.y * 0.0026 + time)
          const angle = n * Math.PI * 5
          const cx = (W * 0.5 - p.x) / W * 0.015
          const cy = (H * 0.5 - p.y) / H * 0.01
          p.vx += (Math.cos(angle) * 0.09 + cx) * p.speed * flow
          p.vy += (Math.sin(angle) * 0.09 + cy) * p.speed * flow
        }

        /* Damping — smooth blend from explosion drift (0.997) to flow field (0.91) */
        const damp = forming > 0 ? 1 : 0.997 - flow * 0.087  // 0.997 → 0.91 as flow goes 0→1
        p.vx *= damp
        p.vy *= damp

        p.x += p.vx
        p.y += p.vy
        p.life++

        /* Respawn — only up to flowFieldCount once explosion has settled */
        if (forming < 0.05 && (p.life > p.maxLife || p.x < -8 || p.x > W + 8 || p.y < -8 || p.y > H + 8)) {
          if (exploded && activeCount > flowFieldCount) {
            // Let excess particles die — don't respawn
            p.life = p.maxLife // mark as dead, skip drawing
            continue
          }
          p.x = rng() * W
          p.y = rng() * H
          p.vx = (rng() - 0.5) * 2
          p.vy = (rng() - 0.5) * 2
          p.life = 0
          continue
        }

        /* Alpha — bright during forming, normal life-cycle otherwise */
        const lifeT = p.life / p.maxLife
        const alpha = forming > 0.1
          ? 0.45 + forming * 0.45
          : Math.sin(lifeT * Math.PI) * 0.72

        /* Color: teal → purple by speed */
        const spd = Math.min(1, Math.sqrt(p.vx * p.vx + p.vy * p.vy) * 1.8)
        const r = 34 + (105 * spd) | 0
        const g = 211 - (119 * spd) | 0
        const b = 165 + (81 * spd) | 0
        const sz = forming > 0.1 ? p.size * (0.8 + forming * 0.6) : p.size

        ctx.beginPath()
        ctx.arc(p.x, p.y, sz, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  )
}
