// pages/LabProPage.jsx
import { ErrorBoundary } from "../components/Templates/labpro";
import { Navbar, Hero, About, Experience, Contact } from "../components/Templates/labpro";

const LabProPage = () => {
  return (
    <div className='relative z-0 bg-gray-900 text-white overflow-hidden'>
      {/* Beautiful dark green background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 -left-20 w-60 h-60 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-500"></div>
        <div className="absolute bottom-1/4 -right-20 w-60 h-60 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-1500"></div>
        {/* Vague additional elements */}
        <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-bounce delay-700"></div>
        <div className="absolute bottom-1/3 right-1/3 w-32 h-32 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-bounce delay-1200"></div>
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

export default LabProPage;