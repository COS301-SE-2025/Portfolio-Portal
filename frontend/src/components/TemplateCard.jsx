import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const TemplateCard = ({ template }) => {
  const { isDark } = useTheme();

  return (
    <div 
      className={`backdrop-blur-md p-6 rounded-3xl border flex flex-col items-center text-center transition hover:scale-105 ${
        isDark 
          ? 'bg-white/10 border-white/20' 
          : 'bg-white/60 border-gray-200/50 shadow-xl hover:shadow-2xl'
      }`}
    >
      <div className="w-full max-w-96 h-64 lg:h-80 mb-6 rounded-2xl overflow-hidden">
        <img 
          src={template.image} 
          alt={`${template.title} template preview`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          onError={(e) => {
            console.log('Template image failed to load:', e.target.src);
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div 
          className={`w-full h-full rounded-2xl flex-col items-center justify-center backdrop-blur-sm border transition-colors duration-300 ${
            isDark 
              ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-white/10' 
              : 'bg-gradient-to-br from-purple-100/60 to-blue-100/60 border-gray-200'
          }`}
          style={{ display: 'none' }}
        >
          <div className={`text-center ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
            <div className={`w-16 h-16 mx-auto mb-3 rounded-xl flex items-center justify-center ${
              isDark ? 'bg-purple-500/30' : 'bg-purple-200/60'
            }`}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm">{template.title} Preview</p>
          </div>
        </div>
      </div>
      
      <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
        {template.title}
      </h2>
      
      <p className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        {template.description}
      </p>
      
      <button className={`px-4 py-2 rounded-full font-semibold text-sm transition ${
        isDark 
          ? 'bg-white text-indigo-800 hover:bg-gray-100' 
          : 'bg-indigo-600 text-white hover:bg-indigo-700'
      }`}>
        <a href={template.href || '#'}>
          Explore
        </a>
      </button>
    </div>
  );
};

export default TemplateCard;