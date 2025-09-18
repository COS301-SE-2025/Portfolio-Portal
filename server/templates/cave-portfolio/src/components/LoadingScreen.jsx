import React, { useEffect } from 'react';

const LoadingScreen = ({ onLoadComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onLoadComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onLoadComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mx-auto mb-8"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4">Loading Portfolio</h2>
        <p className="text-gray-300 text-lg">Preparing your immersive experience...</p>
        
        <div className="mt-8 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;



