import { forwardRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import SectionWrapper from './SectionWrapper';

const AboutSection = forwardRef(({ id, show }, ref) => {
  const { isDark } = useTheme();

  return (
    <SectionWrapper id={id} show={show} ref={ref} isDark={isDark}>
      <div className={`relative z-10 max-w-6xl w-full animate-fadeIn ${isDark ? 'text-white' : 'text-gray-900'}`}>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="space-y-12 lg:pr-8 relative">
            
            <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold leading-none relative">
              <span className="relative inline-block">
                About
              </span>
              <br />
              <span className={`relative inline-block ${
                isDark 
                  ? 'bg-gradient-to-r bg-clip-text text-transparent from-blue-400 via-indigo-300 to-purple-400' 
                  : 'bg-gradient-to-r bg-clip-text text-transparent from-purple-600 via-blue-600 to-indigo-600'
              } animate-gradient-shift`}>
                us
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
                }`}>strong partnership</span> between academia and industry.
              </p>
              <p>
                With guidance from EPI-USE, this project explores modern web
                technologies to deliver a tool that allows users to convert traditional
                CVs into{' '}
                <span className={`font-semibold ${
                  isDark 
                    ? 'bg-gradient-to-r bg-clip-text text-transparent from-white to-blue-200' 
                    : 'bg-gradient-to-r bg-clip-text text-transparent from-slate-900 to-purple-700'
                }`}>immersive, digital portfolio experiences.</span>
              </p>
            </div>
          </div>
          
          <div className="flex justify-center lg:justify-end relative">
            <div className={`relative w-80 h-80 sm:w-96 sm:h-96 lg:w-[500px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl p-4 transition-all duration-300 hover:scale-105 hover:-translate-y-2 group ${
              isDark 
                ? 'bg-gradient-to-br from-slate-800/50 to-blue-900/50 border border-blue-400/30 hover:shadow-blue-500/25 backdrop-blur-sm' 
                : 'bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 hover:shadow-purple-500/30'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/5 to-indigo-400/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-3xl"></div>
              <div className={`absolute inset-4 rounded-2xl ${
                isDark ? 'bg-slate-900/30 backdrop-blur-sm' : 'bg-gradient-to-br from-purple-100/50 to-blue-100/50'
              }`}></div>
              <img
                src="/images/about.png"
                alt="About us illustration"
                className="relative z-10 w-full h-full object-contain rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
});

export default AboutSection;