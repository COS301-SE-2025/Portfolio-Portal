import { forwardRef } from 'react';

const SectionWrapper = forwardRef(({ id, show, isDark, children }, ref) => {
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
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-20 left-10 w-32 h-32 rounded-full blur-xl animate-float-slow ${
          isDark ? 'bg-blue-500/15' : 'bg-purple-300/30'
        }`}></div>
        <div className={`absolute top-60 right-20 w-24 h-24 rounded-full blur-lg animate-float-medium ${
          isDark ? 'bg-indigo-500/20' : 'bg-blue-300/35'
        }`}></div>
        <div className={`absolute bottom-40 left-40 w-20 h-20 rounded-full blur-lg animate-float-fast ${
          isDark ? 'bg-purple-500/25' : 'bg-indigo-300/40'
        }`}></div>
        
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

      {/* Floating particles */}
      <div className={`absolute top-20 right-20 w-4 h-4 rounded-full animate-pulse ${isDark ? 'bg-blue-400 opacity-60' : 'bg-purple-500 opacity-70'} shadow-lg`}></div>
      <div className={`absolute top-40 right-32 w-6 h-6 rounded-full animate-pulse delay-1000 ${isDark ? 'bg-indigo-400 opacity-40' : 'bg-blue-500 opacity-60'} shadow-lg`}></div>
      <div className={`absolute top-32 right-16 w-3 h-3 rounded-full animate-pulse delay-500 ${isDark ? 'bg-slate-300 opacity-50' : 'bg-green-500 opacity-70'} shadow-lg`}></div>
      <div className={`absolute bottom-32 left-16 w-5 h-5 rounded-full animate-pulse delay-700 ${isDark ? 'bg-purple-500 opacity-45' : 'bg-indigo-500 opacity-65'} shadow-lg`}></div>

      {show && children}
    </div>
  );
});

export default SectionWrapper;