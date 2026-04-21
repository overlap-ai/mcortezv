import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import Navbar       from '@/components/layout/Navbar'
import Footer       from '@/components/layout/Footer'
import CustomCursor from '@/components/ui/CustomCursor'
import MusicModal   from '@/components/ui/MusicModal'
import HomePage     from '@/pages/HomePage'
import PaperPage    from '@/pages/PaperPage'

function useSmoothScroll() {
  useEffect(() => {
    // Skip on mobile for performance
    if (window.innerWidth < 768) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time: number) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove((time: number) => lenis.raf(time * 1000))
      lenis.destroy()
    }
  }, [])
}

function MainLayout({ heroReady }: { heroReady: boolean }) {
  return (
    <>
      <Navbar />
      <HomePage heroReady={heroReady} />
      <Footer />
    </>
  )
}

export default function App() {
  const [heroReady, setHeroReady] = useState(false)
  useSmoothScroll()

  return (
    <BrowserRouter>
      <div className="grain-overlay" aria-hidden="true" />
      <CustomCursor />
      {/* MusicModal lives outside Routes so audio persists on all pages */}
      <MusicModal onDone={() => setHeroReady(true)} />

      <Routes>
        <Route path="/"              element={<MainLayout heroReady={heroReady} />} />
        <Route path="/papers/:slug"  element={<PaperPage />} />
      </Routes>
    </BrowserRouter>
  )
}
