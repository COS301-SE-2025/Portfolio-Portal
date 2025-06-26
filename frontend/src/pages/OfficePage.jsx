import { Navbar, Hero, About, Experience, Contact } from '../components/Templates/office';

const OfficePage = () => {
  return (
    <div className='relative z-0 bg-gray-900 text-white'>
      <div className='bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'>
        <Navbar />
        <Hero />
        <About />
        <Experience />
        <Contact />
      </div>
    </div>
  )
}

export default OfficePage;