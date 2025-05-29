import { forwardRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const HowItWorksSection = forwardRef(({ id, show, handleScrollToSection }, ref) => {
  const { isDark } = useTheme();

  return (
    <div id={id} ref={ref} className="min-h-screen flex flex-col items-center justify-center px-8 py-16">
      {show && (
        <div className={`max-w-4xl w-full text-center space-y-12 animate-fadeIn ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <h2 className="text-5xl lg:text-6xl font-bold mb-8">How it works</h2>
          <p className={`text-xl max-w-3xl mx-auto leading-relaxed mb-16 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
            Portfolio Portal uses smart OCR and beautiful templates to turn your resume into a dynamic web experience — no coding required.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            <div className="flex flex-col items-center space-y-6">
              <div className={`w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold ${isDark ? 'shadow-2xl' : 'shadow-2xl shadow-purple-200/50'}`}>
                1
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Upload</h3>
                <h3 className="text-2xl font-bold mb-4">your CV</h3>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-6">
              <div className={`w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold ${isDark ? 'shadow-2xl' : 'shadow-2xl shadow-purple-200/50'}`}>
                2
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Choose a</h3>
                <h3 className="text-2xl font-bold mb-4">template</h3>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-6">
              <div className={`w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold ${isDark ? 'shadow-2xl' : 'shadow-2xl shadow-purple-200/50'}`}>
                3
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Enjoy your</h3>
                <h3 className="text-2xl font-bold mb-4">portfolio!</h3>
              </div>
            </div>
          </div>
          <button onClick={() => handleScrollToSection('upload-section')} className="mt-16 animate-pulseArrow">
            <svg className={`w-12 h-12 transition-colors duration-300 ${isDark ? 'text-white hover:text-purple-300' : 'text-slate-700 hover:text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      )}
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

  .animate-fadeIn {
    animation: fadeIn 0.8s ease-out;
  }

  @keyframes pulseArrow {
    0% {
      opacity: 0.6;
      transform: scale(1);
      filter: drop-shadow(0 0 0 rgba(255, 255, 255, 0));
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
      filter: drop-shadow(0 0 10px rgba(147, 51, 234, 0.7));
    }
    100% {
      opacity: 0.6;
      transform: scale(1);
      filter: drop-shadow(0 0 0 rgba(255, 255, 255, 0));
    }
  }

  .animate-pulseArrow {
    animation: pulseArrow 2s infinite ease-in-out;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}