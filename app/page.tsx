import Activity from '@/components/Activity'
import Contact from '@/components/Contact'
import Hero from '@/components/Hero'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'

const page = () => {
  return (
    <main className="">
      <Hero />
      <Skills />
      <Projects />
      <Activity />
      <Contact />
    </main>
  )
}

export default page