import { forwardRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import Earth from "../3DModels/Earth";
import { useTheme } from '../../contexts/ThemeContext';
import { Sparkles } from 'lucide-react';
const HeroSection = forwardRef(({ id, show, handleScrollToSection }, ref) => {
  const { isDark } = useTheme();

  return (
    <div 
      id={id} 
      ref={ref} 
      className={`relative flex items-center justify-center min-h-[calc(100vh-80px)] px-8 overflow-hidden ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950' 
          : 'bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100'
      }`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large floating shapes */}
        <div className={`absolute top-20 right-10 w-32 h-32 rounded-full blur-xl animate-float-slow ${
          isDark ? 'bg-blue-500/15' : 'bg-purple-300/30'
        }`}></div>
        <div className={`absolute top-60 left-20 w-24 h-24 rounded-full blur-lg animate-float-medium ${
          isDark ? 'bg-indigo-500/20' : 'bg-blue-300/35'
        }`}></div>
        <div className={`absolute bottom-40 right-40 w-20 h-20 rounded-full blur-lg animate-float-fast ${
          isDark ? 'bg-purple-500/25' : 'bg-indigo-300/40'
        }`}></div>
        
        {/* Geometric shapes */}
        <div className={`absolute top-32 left-10 w-16 h-16 transform rotate-45 animate-spin-slow ${
          isDark ? 'bg-gradient-to-br from-blue-500/15 to-indigo-600/15' : 'bg-gradient-to-br from-purple-300/30 to-blue-400/30'
        }`}></div>
        <div className={`absolute bottom-20 left-1/4 w-12 h-12 transform rotate-12 animate-bounce-slow ${
          isDark ? 'bg-gradient-to-br from-slate-700/20 to-blue-500/20' : 'bg-gradient-to-br from-indigo-300/35 to-purple-400/35'
        }`}></div>
      </div>

      {/* Gradient overlay */}
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-gradient-to-r from-slate-800/30 via-transparent to-blue-900/20' 
          : 'bg-gradient-to-r from-purple-100/40 via-transparent to-blue-100/40'
      }`}></div>

      {show && (
        
        <div className={`relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-fadeIn ${isDark ? 'text-white' : 'text-slate-900'}`}>
          
          <div className="space-y-6 relative">
                        <nav className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex items-center">
          <Sparkles className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
          <span
            className={`text-2xl font-bold bg-clip-text text-transparent ${
              isDark ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-gradient-to-r from-purple-600 to-pink-600'
            }`}
          >
            Portfolio Portal
          </span>
        </div>
      </nav>
            {/* Glowing accent */}
            <div className={`absolute -left-4 top-0 w-1 h-32 rounded-full ${
              isDark ? 'bg-gradient-to-b from-blue-400 to-indigo-500' : 'bg-gradient-to-b from-purple-500 to-blue-600'
            } animate-pulse`}></div>
            
            <h1 className="text-6xl lg:text-7xl font-bold leading-tight relative">
              <span className="relative inline-block">
                Bring your
                <div className={`absolute -inset-1 rounded-lg blur-lg ${
                  isDark ? 'bg-blue-500/20' : 'bg-purple-300/30'
                } -z-10 animate-pulse`}></div>
              </span>
              <br />
              <span className={`relative inline-block bg-gradient-to-r bg-clip-text text-transparent ${
                isDark 
                  ? 'from-blue-400 via-indigo-300 to-purple-400' 
                  : 'from-purple-600 via-blue-600 to-indigo-600'
              } animate-gradient-shift`}>
                CV to life
                <div className={`absolute -inset-2 rounded-lg blur-xl ${
                  isDark ? 'bg-gradient-to-r from-blue-500/30 to-indigo-400/20' : 'bg-gradient-to-r from-purple-400/40 to-blue-400/40'
                } -z-10 animate-pulse`}></div>
              </span>
            </h1>
            
            <p className={`text-xl max-w-lg leading-relaxed relative ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Upload your CV and let us turn it into a 3D interactive portfolio that{' '}
              <span className={`font-semibold bg-gradient-to-r bg-clip-text text-transparent ${
                isDark 
                  ? 'from-white to-blue-200' 
                  : 'from-slate-900 to-purple-700'
              }`}>speaks for you.</span>
            </p>
            
            <button
              onClick={() => handleScrollToSection('how-it-works')}
              className={`relative mt-8 font-medium py-4 px-8 rounded-full transition-all duration-300 flex items-center space-x-2 group overflow-hidden ${
                isDark 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-lg hover:shadow-blue-500/25' 
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-purple-500/30'
              } transform hover:scale-105 hover:-translate-y-1`}
            >
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/20 to-indigo-400/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              
              <span className="relative z-10">Find out more</span>
              <svg className="relative z-10 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          <div className="h-96 relative">
            {/* Canvas container with glow */}
            <div className={`absolute inset-0 rounded-xl ${
              isDark ? 'bg-gradient-to-br from-slate-800/30 to-blue-900/20' : 'bg-gradient-to-br from-purple-100/50 to-blue-100/50'
            } backdrop-blur-sm`}></div>
            
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }} className="rounded-xl">
              <ambientLight intensity={isDark ? 1.5 : 1.8} />
              <pointLight position={[10, 10, 10]} intensity={isDark ? 1 : 0.8} />
              <pointLight position={[-10, -10, -10]} intensity={0.3} color={isDark ? "#3b82f6" : "#6366f1"} />
              <Suspense fallback={null}>
                <Earth />
                <OrbitControls enableZoom={false} autoRotate={true} autoRotateSpeed={1.5} />
              </Suspense>
            </Canvas>
            
            {/* Floating accent elements around canvas */}
            <div className={`absolute -top-4 -right-4 w-8 h-8 rounded-full animate-bounce-slow ${
              isDark ? 'bg-gradient-to-br from-blue-400 to-indigo-500' : 'bg-gradient-to-br from-purple-500 to-blue-600'
            } shadow-lg`}></div>
            <div className={`absolute -bottom-4 -left-4 w-6 h-6 rounded-full animate-float-medium ${
              isDark ? 'bg-gradient-to-br from-indigo-400 to-purple-500' : 'bg-gradient-to-br from-blue-500 to-indigo-600'
            } shadow-lg`}></div>
          </div>
        </div>
      )}

      {/* Enhanced floating particles */}
      <div className={`absolute top-20 right-20 w-4 h-4 rounded-full animate-pulse ${isDark ? 'bg-blue-400 opacity-60' : 'bg-purple-500 opacity-70'} shadow-lg`}></div>
      <div className={`absolute top-40 right-32 w-6 h-6 rounded-full animate-pulse delay-1000 ${isDark ? 'bg-indigo-400 opacity-40' : 'bg-blue-500 opacity-60'} shadow-lg`}></div>
      <div className={`absolute top-32 right-16 w-3 h-3 rounded-full animate-pulse delay-500 ${isDark ? 'bg-slate-300 opacity-50' : 'bg-green-500 opacity-70'} shadow-lg`}></div>
      <div className={`absolute bottom-32 left-16 w-5 h-5 rounded-full animate-pulse delay-700 ${isDark ? 'bg-purple-500 opacity-45' : 'bg-indigo-500 opacity-65'} shadow-lg`}></div>
    </div>
  );
});

export default HeroSection;

const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes float-slow {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(180deg);
    }
  }

  @keyframes float-medium {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-15px) rotate(90deg);
    }
  }

  @keyframes float-fast {
    0%, 100% {
      transform: translateY(0px) scale(1);
    }
    50% {
      transform: translateY(-10px) scale(1.1);
    }
  }

  @keyframes spin-slow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes bounce-slow {
    0%, 100% {
      transform: translateY(0) scale(1);
    }
    50% {
      transform: translateY(-10px) scale(1.05);
    }
  }

  @keyframes gradient-shift {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.8s ease-out;
  }

  .animate-float-slow {
    animation: float-slow 6s ease-in-out infinite;
  }

  .animate-float-medium {
    animation: float-medium 4s ease-in-out infinite;
  }

  .animate-float-fast {
    animation: float-fast 3s ease-in-out infinite;
  }

  .animate-spin-slow {
    animation: spin-slow 8s linear infinite;
  }

  .animate-bounce-slow {
    animation: bounce-slow 3s ease-in-out infinite;
  }

  .animate-gradient-shift {
    background-size: 200% 200%;
    animation: gradient-shift 3s ease infinite;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}