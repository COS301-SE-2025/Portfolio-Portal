// pages/LabProPage.jsx - Enhanced version with chemistry background effects
import { ErrorBoundary } from "../components/Templates/labpro";
import { Navbar, Hero, About, Experience, Contact } from "../components/Templates/labpro";

const LabProPage = () => {
  return (
    <div className='relative z-0 bg-gray-900 text-white overflow-hidden'>
      {/* Enhanced background effects with floating particles and chemistry elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        
        {/* NEW: Floating white glowing dots */}
        {[...Array(30)].map((_, index) => (
          <div
            key={index}
            className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              filter: 'blur(0.5px)',
            }}
          />
        ))}
        
        {/* NEW: Larger glowing particles */}
        {[...Array(15)].map((_, index) => (
          <div
            key={`large-${index}`}
            className="absolute w-3 h-3 bg-emerald-300 rounded-full opacity-20 animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
        
        {/* NEW: Chemistry-themed floating elements */}
        {[...Array(8)].map((_, index) => (
          <div
            key={`molecule-${index}`}
            className="absolute text-white opacity-10 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${12 + Math.random() * 8}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          >
            {['⚛️', '🧪', '⚗️', '🔬', '💎', '🧬'][Math.floor(Math.random() * 6)]}
          </div>
        ))}
        
        {/* NEW: Molecular structure lines */}
        <svg className="absolute inset-0 w-full h-full opacity-5">
          {[...Array(10)].map((_, index) => (
            <line
              key={index}
              x1={`${Math.random() * 100}%`}
              y1={`${Math.random() * 100}%`}
              x2={`${Math.random() * 100}%`}
              y2={`${Math.random() * 100}%`}
              stroke="white"
              strokeWidth="1"
              className="animate-pulse"
              style={{ animationDelay: `${index * 0.5}s` }}
            />
          ))}
        </svg>
      </div>

      {/* NEW: Enhanced CSS for custom animations */}
      <style>
        {`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(90deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
          75% { transform: translateY(-10px) rotate(270deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes shimmer {
          0% { opacity: 0.3; }
          50% { opacity: 0.8; }
          100% { opacity: 0.3; }
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        `}
      </style>

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