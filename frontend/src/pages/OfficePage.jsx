import { ErrorBoundary } from "../components/Templates/office";
import { Navbar, Hero, About, Experience, Contact } from "../components/Templates/office";

const OfficePage = () => {
  return (
    <div className='relative z-0 bg-gray-900 text-white overflow-hidden'>
      {/* Blue Blur Lights Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 -left-20 w-60 h-60 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-500"></div>
        <div className="absolute bottom-1/4 -right-20 w-60 h-60 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-1500"></div>
      </div>

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