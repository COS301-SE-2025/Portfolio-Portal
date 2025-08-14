import { forwardRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const HowItWorksSection = forwardRef(({ id, show, handleScrollToSection }, ref) => {
  const { isDark } = useTheme();

  return (
    <div 
      id={id} 
      ref={ref} 
      className={`relative min-h-screen flex flex-col items-center justify-center px-8 py-16 overflow-hidden ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950' 
          : 'bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100'
      }`}
    >
      {/* Animated background elements */}
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

      {/* Gradient overlay */}
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-gradient-to-r from-slate-800/30 via-transparent to-blue-900/20' 
          : 'bg-gradient-to-r from-purple-100/40 via-transparent to-blue-100/40'
      }`}></div>

      {show && (
        <div className={`relative z-10 max-w-4xl w-full text-center space-y-12 animate-fadeIn ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {/* Glowing accent */}
          <div className={`absolute -left-4 top-0 w-1 h-32 rounded-full ${
            isDark ? 'bg-gradient-to-b from-blue-400 to-indigo-500' : 'bg-gradient-to-b from-purple-500 to-blue-600'
          } animate-pulse`}></div>
          
          <h2 className="text-5xl lg:text-6xl font-bold mb-8 relative">
            <span className="relative inline-block">
              How it
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
              works
              <div className={`absolute -inset-2 rounded-lg blur-xl ${
                isDark ? 'bg-gradient-to-r from-blue-500/30 to-indigo-400/20' : 'bg-gradient-to-r from-purple-400/40 to-blue-400/40'
              } -z-10 animate-pulse`}></div>
            </span>
          </h2>
          
          <p className={`text-xl max-w-3xl mx-auto leading-relaxed mb-16 relative ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Portfolio Portal uses smart OCR and beautiful templates to turn your resume into a{' '}
            <span className={`font-semibold bg-gradient-to-r bg-clip-text text-transparent ${
              isDark 
                ? 'from-white to-blue-200' 
                : 'from-slate-900 to-purple-700'
            }`}>dynamic web experience</span> — no coding required.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {[
              { number: 1, title: 'Upload', subtitle: 'your CV' },
              { number: 2, title: 'Choose a', subtitle: 'template' },
              { number: 3, title: 'Enjoy your', subtitle: 'portfolio!' }
            ].map((step, index) => (
              <div key={step.number} className="flex flex-col items-center space-y-6 relative group">
                {/* Floating accent elements */}
                <div className={`absolute -top-4 -right-4 w-6 h-6 rounded-full animate-bounce-slow ${
                  isDark ? 'bg-gradient-to-br from-blue-400 to-indigo-500' : 'bg-gradient-to-br from-purple-500 to-blue-600'
                } shadow-lg opacity-60`}></div>
                
                <div className={`relative w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold transition-all duration-300 group-hover:scale-110 ${
                  isDark 
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 shadow-2xl hover:shadow-blue-500/25' 
                    : 'bg-gradient-to-br from-purple-600 to-blue-600 shadow-2xl shadow-purple-200/50 hover:shadow-purple-500/30'
                } transform hover:-translate-y-1`}>
                  {/* Button glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/20 to-indigo-400/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-full"></div>
                  
                  <span className="relative z-10">{step.number}</span>
                </div>
                
                <div className="text-center relative">
                  <div className={`absolute -inset-2 rounded-lg blur-lg ${
                    isDark ? 'bg-blue-500/10' : 'bg-purple-300/20'
                  } -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  
                  <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                  <h3 className="text-2xl font-bold mb-4">{step.subtitle}</h3>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => handleScrollToSection('upload-section')} 
            className={`relative mt-16 p-4 rounded-full transition-all duration-300 group overflow-hidden ${
              isDark 
                ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-500/30 hover:to-indigo-500/30 backdrop-blur-sm border border-blue-400/30' 
                : 'bg-gradient-to-r from-purple-100/50 to-blue-100/50 hover:from-purple-200/70 hover:to-blue-200/70 backdrop-blur-sm border border-purple-300/50'
            } transform hover:scale-110 hover:-translate-y-1`}
          >
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/10 to-indigo-400/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-full"></div>
            
            <svg className={`relative z-10 w-12 h-12 transition-colors duration-300 ${
              isDark ? 'text-white group-hover:text-blue-300' : 'text-slate-700 group-hover:text-purple-600'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
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

export default HowItWorksSection;

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