import Navbar from "../components/Templates/space/Navbar"
import Hero from "../components/Templates/space/Hero"
import About from "../components/Templates/space/About"
import Experience from "../components/Templates/space/Experience"
import Contact from "../components/Templates/space/Contact"

const Space = () => {
  return (
    <div className='relative z-0 bg-black text-white'>
      <div className='bg-[url("/stars-bg.png")] bg-cover bg-no-repeat bg-center'>
        <Navbar />
        <Hero />
              <About />
      <Experience />
      <Contact />
      </div>

    </div>
  )
}

export default Space