import { useState, useEffect } from 'react';

const AuthLayout = ({ children, title, subtitle }) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDark(savedTheme ? savedTheme === 'dark' : true);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-500 ${
      isDark 
        ? 'bg-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-gray-50 to-blue-100'
    }`}>
      <button
        onClick={toggleTheme}
        className={`fixed top-4 right-4 sm:top-6 sm:right-6 z-50 p-2 rounded-full backdrop-blur-md border transition-all duration-300 group ${
          isDark 
            ? 'bg-white/10 border-white/20 hover:bg-white/20 text-white' 
            : 'bg-gray-100/80 border-gray-200 hover:bg-gray-200/80 text-gray-800'
        }`}
        aria-label="Toggle theme"
      >
        {isDark ? (
          <svg className="w-5 h-5 text-yellow-400 group-hover:text-yellow-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-gray-800 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>
      
      <div className="w-full max-w-md bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-xl p-6 sm:p-8 transition-all duration-300">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className={`text-3xl sm:text-4xl font-bold mb-3 ${
            isDark ? 'text-gray' : 'text-gray-900'
          } transition-colors duration-300`}>
            {title}
          </h1>
          <p className={`text-base sm:text-lg ${
            isDark ? 'text-gray' : 'text-gray-600'
          } transition-colors duration-300`}>
            {subtitle}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;