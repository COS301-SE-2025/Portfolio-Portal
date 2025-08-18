import { forwardRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import SectionWrapper from './SectionWrapper';

const steps = [
  { number: 1, title: 'Upload', subtitle: 'your CV' },
  { number: 2, title: 'Choose a', subtitle: 'template' },
  { number: 3, title: 'Enjoy your', subtitle: 'portfolio!' }
];

const HowItWorksSection = forwardRef(({ id, show, handleScrollToSection }, ref) => {
  const { isDark } = useTheme();

  return (
    <SectionWrapper id={id} show={show} ref={ref} isDark={isDark}>
      <div className={`relative z-10 max-w-4xl w-full text-center space-y-12 animate-fadeIn ${isDark ? 'text-white' : 'text-slate-900'}`}>
        
        <h2 className="text-5xl lg:text-6xl font-bold mb-8 relative">
          <span className="relative inline-block">
            How it
          </span>
          <br />
          <span className={`relative inline-block bg-gradient-to-r bg-clip-text text-transparent ${
            isDark 
              ? 'from-blue-400 via-indigo-300 to-purple-400' 
              : 'from-purple-600 via-blue-600 to-indigo-600'
          } animate-gradient-shift`}>
            works
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
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center space-y-6 relative group">
              <div className={`relative w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold transition-all duration-300 group-hover:scale-110 ${
                isDark 
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600 shadow-2xl hover:shadow-blue-500/25' 
                  : 'bg-gradient-to-br from-purple-600 to-blue-600 shadow-2xl shadow-purple-200/50 hover:shadow-purple-500/30'
              } transform hover:-translate-y-1`}>
                <span className="relative z-10">{step.number}</span>
              </div>
              
              <div className="text-center relative">
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
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/10 to-indigo-400/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-full"></div>
          <svg className={`relative z-10 w-12 h-12 transition-colors duration-300 ${
            isDark ? 'text-white group-hover:text-blue-300' : 'text-slate-700 group-hover:text-purple-600'
          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>
    </SectionWrapper>
  );
});

export default HowItWorksSection;