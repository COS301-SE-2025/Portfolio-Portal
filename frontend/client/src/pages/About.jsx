import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const About = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900'
          : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50'
      }`}
    >
      {/* Theme Toggle Button - Same as Templates page */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full backdrop-blur-sm border transition-all duration-300 group ${
          isDark 
            ? 'bg-white/10 border-white/20 hover:bg-white/20 text-white' 
            : 'bg-gray-200/80 border-gray-300 hover:bg-gray-300/80 text-gray-700'
        }`}
        aria-label="Toggle theme"
      >
        {isDark ? (
          <svg className="w-6 h-6 text-yellow-400 group-hover:text-yellow-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-slate-700 group-hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      {/* Add top padding to account for navbar */}
      <div className="pt-20 pb-16 px-8 lg:px-16 xl:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center min-h-[80vh]">
            {/* Left Column - Content */}
            <div className="space-y-12 lg:pr-8">
              <h1
                className={`text-5xl lg:text-7xl xl:text-8xl font-bold leading-none ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                About us
              </h1>

              <div
                className={`space-y-8 text-base lg:text-lg leading-relaxed max-w-2xl ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                <p>
                  Portfolio Portal is a capstone project developed in collaboration between
                  the University of Pretoria and EPI-USE Africa. As part of the university's
                  final-year curriculum, this initiative reflects a strong partnership
                  between academia and industry, aiming to create meaningful, real-world
                  solutions through innovation and practical application.
                </p>

                <p>
                  With guidance and support from EPI-USE, this project explores modern web
                  technologies to deliver a tool that allows users to convert traditional
                  CVs into immersive, digital portfolio experiences. The collaboration
                  emphasizes not only technical growth for students, but also a commitment to
                  building solutions that bridge creativity and functionality in the digital
                  space.
                </p>
              </div>
            </div>

            {/* Right Column - Figma Style Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-80 h-80 sm:w-96 sm:h-96 lg:w-[500px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 p-4">
                <img
                  src="/images/about.png"
                  alt="About us illustration"
                  className="w-full h-full object-contain rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;