import { forwardRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const AboutSection = forwardRef(({ id, show }, ref) => {
  const { isDark } = useTheme();

  return (
    <div 
      id={id} 
      ref={ref} 
      className={`relative min-h-screen flex items-center justify-center px-6 lg:px-20 py-12 overflow-hidden ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950' 
          : 'bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100'
      }`}
    >
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large floating shapes */}
        <div className={`absolute top-20 left-10 w-32 h-32 rounded-full blur-xl animate-float-slow ${
          isDark ? 'bg-blue-500/15' : 'bg-purple-300/30'
        }`}></div>
        <div className={`absolute top-60 right-20 w-24 h-24 rounded-full blur-lg animate-float-medium ${
          isDark ? 'bg-indigo-500/20' : 'bg-blue-300/35'
        }`}></div>
        <div className={`absolute bottom-40 left-40 w-20 h-20 rounded-full blur-lg animate-float-fast ${
          isDark ? 'bg-purple-500/25' : 'bg-indigo-300/40'
        }`}></div>
        
        {/* Geometric shapes */}
        <div className={`absolute top-32 right-10 w-16 h-16 transform rotate-45 animate-spin-slow ${
          isDark ? 'bg-gradient-to-br from-blue-500/15 to-indigo-600/15' : 'bg-gradient-to-br from-purple-300/30 to-blue-400/30'
        }`}></div>
        <div className={`absolute bottom-20 right-1/4 w-12 h-12 transform rotate-12 animate-bounce-slow ${
          isDark ? 'bg-gradient-to-br from-slate-700/20 to-blue-500/20' : 'bg-gradient-to-br from-indigo-300/35 to-purple-400/35'
        }`}></div>
      </div>

      {/* Enhanced gradient overlay */}
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-gradient-to-r from-slate-800/30 via-transparent to-blue-900/20' 
          : 'bg-gradient-to-r from-purple-100/40 via-transparent to-blue-100/40'
      }`}></div>

      {show && (
        <div className={`relative z-10 max-w-6xl w-full animate-fadeIn ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="space-y-12 lg:pr-8 relative">
              {/* Enhanced accent line */}
              <div className={`absolute -left-4 top-0 w-1 h-32 rounded-full ${
                isDark ? 'bg-gradient-to-b from-blue-400 to-indigo-500' : 'bg-gradient-to-b from-purple-500 to-blue-600'
              } animate-pulse`}></div>
              
              <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold leading-none relative">
                <span className="relative inline-block">
                  About
                  <div className={`absolute -inset-1 rounded-lg blur-lg ${
                    isDark ? 'bg-blue-500/20' : 'bg-purple-300/30'
                  } -z-10 animate-pulse`}></div>
                </span>
                <br />
                <span className={`relative inline-block ${
                  isDark 
                    ? 'bg-gradient-to-r bg-clip-text text-transparent from-blue-400 via-indigo-300 to-purple-400' 
                    : 'bg-gradient-to-r bg-clip-text text-transparent from-purple-600 via-blue-600 to-indigo-600'
                } animate-gradient-shift`}>
                  us
                  <div className={`absolute -inset-2 rounded-lg blur-xl ${
                    isDark ? 'bg-gradient-to-r from-blue-500/30 to-indigo-400/20' : 'bg-gradient-to-r from-purple-400/40 to-blue-400/40'
                  } -z-10 animate-pulse`}></div>
                </span>
              </h1>
              
              <div className={`space-y-8 text-base lg:text-lg leading-relaxed max-w-2xl relative ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                <p>
                  Portfolio Portal is a capstone project developed in collaboration between
                  the University of Pretoria and EPI-USE Africa. As part of the university's
                  final-year curriculum, this initiative reflects a{' '}
                  <span className={`font-semibold ${
                    isDark 
                      ? 'bg-gradient-to-r bg-clip-text text-transparent from-white to-blue-200' 
                      : 'bg-gradient-to-r bg-clip-text text-transparent from-slate-900 to-purple-700'
                  }`}>strong partnership</span>{' '}
                  between academia and industry, aiming to create meaningful, real-world
                  solutions through innovation and practical application.
                </p>
                <p>
                  With guidance and support from EPI-USE, this project explores modern web
                  technologies to deliver a tool that allows users to convert traditional
                  CVs into{' '}
                  <span className={`font-semibold ${
                    isDark 
                      ? 'bg-gradient-to-r bg-clip-text text-transparent from-white to-blue-200' 
                      : 'bg-gradient-to-r bg-clip-text text-transparent from-slate-900 to-purple-700'
                  }`}>immersive, digital portfolio experiences.</span>{' '}
                  The collaboration emphasizes not only technical growth for students, but also a commitment to
                  building solutions that bridge creativity and functionality in the digital
                  space.
                </p>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end relative">
              {/* Enhanced floating accents */}
              <div className={`absolute -top-4 -right-4 w-8 h-8 rounded-full animate-bounce-slow ${
                isDark ? 'bg-gradient-to-br from-blue-400 to-indigo-500' : 'bg-gradient-to-br from-purple-500 to-blue-600'
              } shadow-lg`}></div>
              <div className={`absolute -bottom-4 -left-4 w-6 h-6 rounded-full animate-float-medium ${
                isDark ? 'bg-gradient-to-br from-indigo-400 to-purple-500' : 'bg-gradient-to-br from-blue-500 to-indigo-600'
              } shadow-lg`}></div>
              
              <div className={`relative w-80 h-80 sm:w-96 sm:h-96 lg:w-[500px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl p-4 transition-all duration-300 hover:scale-105 hover:-translate-y-2 group ${
                isDark 
                  ? 'bg-gradient-to-br from-slate-800/50 to-blue-900/50 border border-blue-400/30 hover:shadow-blue-500/25 backdrop-blur-sm' 
                  : 'bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 hover:shadow-purple-500/30'
              }`}>
                {/* Enhanced glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/5 to-indigo-400/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-3xl"></div>
                
                {/* Enhanced image container */}
                <div className={`absolute inset-4 rounded-2xl ${
                  isDark ? 'bg-slate-900/30 backdrop-blur-sm' : 'bg-gradient-to-br from-purple-100/50 to-blue-100/50'
                } backdrop-blur-sm`}></div>
                
                <img
                  src="/images/about.png"
                  alt="About us illustration"
                  className="relative z-10 w-full h-full object-contain rounded-2xl"
                />
              </div>
            </div>
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

export default AboutSection;

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