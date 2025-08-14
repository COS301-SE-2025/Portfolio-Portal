import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const TemplateCard = ({ template }) => {
  const { isDark } = useTheme();
  const [imageError, setImageError] = useState(false);
  
  const bgClass = isDark 
    ? 'bg-white/10 border-white/20' 
    : 'bg-white/60 border-gray-200/50 shadow-xl';
  
  const textClass = isDark ? 'text-white' : 'text-slate-900';
  const secondaryText = isDark ? 'text-gray-300' : 'text-gray-600';
  const buttonClass = isDark 
    ? 'bg-white text-indigo-800' 
    : 'bg-indigo-600 text-white';
  
  const fallbackBg = isDark 
    ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-white/10' 
    : 'bg-gradient-to-br from-purple-100/60 to-blue-100/60 border-gray-200';

  return (
    <div className={`backdrop-blur-md p-6 rounded-3xl border flex flex-col items-center text-center ${bgClass}`}>
      <div className="w-full h-64 lg:h-80 mb-6 rounded-2xl overflow-hidden">
        {imageError ? (
          <div className={`w-full h-full rounded-2xl flex flex-col items-center justify-center backdrop-blur-sm border ${fallbackBg}`}>
            <div className={`text-center ${secondaryText}`}>
              <div className={`w-16 h-16 mx-auto mb-3 rounded-xl flex items-center justify-center ${isDark ? 'bg-purple-500/30' : 'bg-purple-200/60'}`}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm">{template.title} Preview</p>
            </div>
          </div>
        ) : (
          <img 
            src={template.image} 
            alt={`${template.title} template preview`}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </div>
      
      <h2 className={`text-xl font-bold mb-2 ${textClass}`}>
        {template.title}
      </h2>
      
      <p className={`text-sm mb-4 ${secondaryText}`}>
        {template.description}
      </p>
      
      <a
        href={template.href || '#'}
        className={`px-4 py-2 rounded-full font-semibold text-sm ${buttonClass}`}
      >
        Explore
      </a>
    </div>
  );
};

export default TemplateCard;