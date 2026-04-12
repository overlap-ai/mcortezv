import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import Navbar       from '@/components/layout/Navbar'
import Footer       from '@/components/layout/Footer'
import CustomCursor from '@/components/ui/CustomCursor'
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

function MainLayout() {
  return (
    <>
      <Navbar />
      <HomePage />
      <Footer />
    </>
  )
}

export default function App() {
  useSmoothScroll()

  return (
    <BrowserRouter>
      <div className="grain-overlay" aria-hidden="true" />
      <CustomCursor />

      <Routes>
        <Route path="/"              element={<MainLayout />} />
        <Route path="/papers/:slug"  element={<PaperPage />} />
      </Routes>
    </BrowserRouter>
  )
}
