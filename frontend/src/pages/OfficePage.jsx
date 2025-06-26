import { ErrorBoundary } from "../components/Templates/office";
import { Navbar, Hero, About, Experience, Contact } from "../components/Templates/office";

const OfficePage = () => {
  return (
    <div className='relative z-0 bg-gray-900 text-white'>
      <ErrorBoundary>
        <Navbar />
      </ErrorBoundary>
      <ErrorBoundary>
        <Hero />
      </ErrorBoundary>
      <ErrorBoundary>
        <About />
      </ErrorBoundary>
      <ErrorBoundary>
        <Experience />
      </ErrorBoundary>
      <ErrorBoundary>
        <Contact />
      </ErrorBoundary>
    </div>
  )
}

export default OfficePage;