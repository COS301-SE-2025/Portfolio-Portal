// pages/LabProPage.jsx
import { ErrorBoundary } from "../components/Templates/labpro";
import { Navbar, Hero, About, Experience, Contact } from "../components/Templates/labpro";

const LabProPage = () => {
  return (
    <div className='relative z-0 bg-gray-900 text-white overflow-hidden'>
      {/* Chemistry-themed multi-color background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Chemical element colors */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 -left-20 w-60 h-60 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
        <div className="absolute bottom-1/4 -right-20 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1500"></div>
        {/* Additional chemistry colors */}
        <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-8 animate-bounce delay-700"></div>
        <div className="absolute bottom-1/3 right-1/3 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-8 animate-bounce delay-1200"></div>
        <div className="absolute top-1/3 right-1/4 w-28 h-28 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-8 animate-pulse delay-800"></div>
        <div className="absolute bottom-1/2 left-1/3 w-36 h-36 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-8 animate-pulse delay-900"></div>
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