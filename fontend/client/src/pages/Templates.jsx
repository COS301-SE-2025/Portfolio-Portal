import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const templates = [
  {
    title: 'Office',
    description: 'Corporate and professional with a sleek modern look.',
    image: '/placeholders/office.png',
  },
  {
    title: 'Studio',
    description: 'A clean, minimal space perfect for designers and creatives.',
    image: '/placeholders/studio.png',
  },
  {
    title: 'Gallery',
    description: 'A curated portfolio display, like a personal museum.',
    image: '/placeholders/gallery.png',
  },
  {
    title: 'Space',
    description: 'A futuristic scene that showcases innovation and ambition.',
    image: '/placeholders/space.png',
  },
  {
    title: 'Forest',
    description: 'Serene and natural — ideal for calm, grounded presentation.',
    image: '/placeholders/forest.png',
  },
  {
    title: 'Studio',
    description: 'A clean, minimal space perfect for designers and creatives.',
    image: '/placeholders/studio.png',
  },
];

const Templates = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  
  return (
    <div className={`min-h-screen py-12 px-6 lg:px-20 transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white' 
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 text-gray-900'
    }`}>
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

      <h1 className={`text-4xl font-bold text-center mb-4 ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>
        Explore Our Templates
      </h1>
      
      <p className={`text-center mb-12 ${
        isDark ? 'text-gray-300' : 'text-gray-600'
      }`}>
        Discover the styles you can use to turn your CV into an immersive portfolio.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {templates.map((template, index) => (
          <div 
            key={index} 
            className={`p-6 rounded-3xl border flex flex-col items-center text-center transition-all duration-300 hover:scale-105 ${
              isDark 
                ? 'bg-white/10 backdrop-blur-md border-white/20' 
                : 'bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg hover:shadow-xl'
            }`}
          >
            <div className="hidden lg:flex items-center justify-center">
              <div className={`w-96 h-96 rounded-3xl flex items-center justify-center backdrop-blur-sm border transition-colors duration-300 ${
                isDark 
                  ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-white/10' 
                  : 'bg-gradient-to-br from-purple-100/60 to-blue-100/60 border-gray-200'
              }`}>
                <div className={`text-center ${
                  isDark ? 'text-white/60' : 'text-gray-500'
                }`}>
                  <div className={`w-24 h-24 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                    isDark ? 'bg-purple-500/30' : 'bg-purple-200/60'
                  }`}>
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-sm">3D Portfolio Preview</p>
                </div>
              </div>
            </div>
            
            <h2 className={`text-xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {template.title}
            </h2>
            
            <p className={`text-sm mb-4 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {template.description}
            </p>
            
            <button className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 ${
              isDark 
                ? 'bg-white text-indigo-800 hover:bg-gray-100 hover:scale-105' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 shadow-md hover:shadow-lg'
            }`}>
              Explore
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;