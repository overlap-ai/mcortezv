import Hero       from '@/components/sections/Hero'
import About      from '@/components/sections/About'
import Stack      from '@/components/sections/Stack'
import Experience from '@/components/sections/Experience'
import Projects   from '@/components/sections/Projects'
import Research   from '@/components/sections/Research'
import Contact    from '@/components/sections/Contact'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Stack />
      <Experience />
      <Projects />
      <Research />
      <Contact />
    </main>
  )
}
