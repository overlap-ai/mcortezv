/**
 * Neural Flow Field — Algorithmic Art for Hero
 *
 * Philosophy: "Neural Convergence"
 * The invisible pathways of an AI mind made visible. Hundreds of data-particles
 * drift through a Perlin noise vector field — chaotic at the micro level, yet
 * converging into emergent, organic patterns. The teal-to-purple color gradient
 * mirrors the transition from raw computation to structured intelligence.
 * Each run is unique; every seed a different mind.
 */

import { useEffect, useRef } from 'react'

/* ─── Minimal 2D Perlin noise (no deps) ───────────────── */
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
  const lerp  = (t: number, a: number, b: number) => a + t * (b - a)
  const grad  = (h: number, x: number, y: number) =>
    ((h & 1) ? -x : x) + ((h & 2) ? -y : y)

  return (x: number, y: number): number => {
    const X  = Math.floor(x) & 255
    const Y  = Math.floor(y) & 255
    const xf = x - Math.floor(x)
    const yf = y - Math.floor(y)
    const u  = fade(xf)
    const v  = fade(yf)
    return lerp(v,
      lerp(u, grad(perm[perm[X] + Y],     xf,     yf),
               grad(perm[perm[X+1] + Y],   xf - 1, yf)),
      lerp(u, grad(perm[perm[X] + Y + 1], xf,     yf - 1),
               grad(perm[perm[X+1]+Y+1],   xf - 1, yf - 1)),
    )
  }
}

/* ─── Particle ─────────────────────────────────────────── */
interface P {
  x: number; y: number
  vx: number; vy: number
  speed: number
  life: number; maxLife: number
  size: number
}

function makeParticle(w: number, h: number, rng: () => number): P {
  return {
    x: rng() * w,
    y: rng() * h,
    vx: 0, vy: 0,
    speed: 0.28 + rng() * 0.64,
    life: Math.floor(rng() * 300),
    maxLife: 180 + Math.floor(rng() * 220),
    size: 0.7 + rng() * 1.1,
  }
}

/* ─── Seeded PRNG (mulberry32) ─────────────────────────── */
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const SEED       = 2025
    const noise      = buildNoise(SEED)
    const rng        = mulberry32(SEED ^ 0xdeadbeef)
    let time         = 0
    let animId       = 0
    let particles: P[] = []
    let W = 0, H = 0

    /* Size canvas to fill parent */
    const resize = () => {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      canvas.width  = W
      canvas.height = H
      ctx.fillStyle = '#060606'
      ctx.fillRect(0, 0, W, H)
      // Rebuild particles on resize
      const count = Math.max(60, Math.min(220, Math.floor((W * H) / 5500)))
      particles = Array.from({ length: count }, () => makeParticle(W, H, rng))
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    /* Draw loop */
    const draw = () => {
      /* Fade trail — lighter fade = longer trails */
      ctx.fillStyle = 'rgba(6,6,6,0.055)'
      ctx.fillRect(0, 0, W, H)

      time += 0.0035

      for (const p of particles) {
        /* Perlin flow field angle */
        const n     = noise(p.x * 0.0026, p.y * 0.0026 + time)
        const angle = n * Math.PI * 5

        /* Slight center pull to keep particles from all escaping */
        const cx = (W * 0.5 - p.x) / W * 0.015
        const cy = (H * 0.5 - p.y) / H * 0.01

        p.vx = p.vx * 0.91 + (Math.cos(angle) * 0.09 + cx) * p.speed
        p.vy = p.vy * 0.91 + (Math.sin(angle) * 0.09 + cy) * p.speed
        p.x += p.vx
        p.y += p.vy
        p.life++

        /* Respawn if out of bounds or aged */
        if (p.life > p.maxLife || p.x < -8 || p.x > W + 8 || p.y < -8 || p.y > H + 8) {
          Object.assign(p, makeParticle(W, H, rng))
          continue
        }

        /* Life alpha — smooth birth and death */
        const lifeT  = p.life / p.maxLife
        const alpha  = Math.sin(lifeT * Math.PI) * 0.72

        /* Color: teal (#22d3a5) → blue-purple (#8b5cf6) by speed */
        const spd = Math.min(1, Math.sqrt(p.vx * p.vx + p.vy * p.vy) * 1.8)
        const r   = Math.round(34  + (139 - 34)  * spd)
        const g   = Math.round(211 + (92  - 211) * spd)
        const b   = Math.round(165 + (246 - 165) * spd)

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
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
