import React, { useEffect, useState } from 'react';

const LoadingScreen = ({ onLoadComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Entering the cave...');
  
  const loadingMessages = [
    'Entering the cave...',
    'Lighting the torches...',
    'Awakening the crystals...',
    'Preparing the journey...',
    'Almost ready...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        
        // Update loading message based on progress
        if (newProgress > 20 && newProgress <= 40) {
          setLoadingText(loadingMessages[1]);
        } else if (newProgress > 40 && newProgress <= 60) {
          setLoadingText(loadingMessages[2]);
        } else if (newProgress > 60 && newProgress <= 80) {
          setLoadingText(loadingMessages[3]);
        } else if (newProgress > 80) {
          setLoadingText(loadingMessages[4]);
        }
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onLoadComplete();
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onLoadComplete]);

  return (
    <div className="loading-container">
      <div className="flex flex-col items-center space-y-8">
        {/* Logo/Title */}
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
            Cave Explorer
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-cyan-400 mx-auto rounded-full animate-pulse"></div>
        </div>

        {/* Animated Crystal */}
        <div className="relative">
          <div className="w-24 h-24 relative animate-float">
            {/* Crystal shape using CSS */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-purple-500 to-cyan-400 transform rotate-45 rounded-lg animate-glow"></div>
            <div className="absolute inset-2 bg-gradient-to-tl from-purple-300 via-purple-400 to-cyan-300 transform rotate-45 rounded-lg opacity-80"></div>
            <div className="absolute inset-4 bg-gradient-to-br from-white via-purple-200 to-cyan-200 transform rotate-45 rounded-lg opacity-60"></div>
          </div>
          
          {/* Sparkle effects */}
          <div className="absolute -top-2 -left-2 w-3 h-3 bg-white rounded-full opacity-70 animate-ping"></div>
          <div className="absolute -bottom-2 -right-2 w-2 h-2 bg-cyan-300 rounded-full opacity-70 animate-ping" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-1/2 -right-4 w-1.5 h-1.5 bg-purple-300 rounded-full opacity-70 animate-ping" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Progress Bar */}
        <div className="w-80 max-w-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white/70">{loadingText}</span>
            <span className="text-sm text-purple-300 font-mono">{Math.round(progress)}%</span>
          </div>
          
          <div className="w-full bg-white/10 backdrop-blur-sm rounded-full h-2 border border-white/20">
            <div 
              className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full transition-all duration-300 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 shimmer"></div>
            </div>
          </div>
        </div>

        {/* Loading Dots */}
        <div className="flex space-x-2">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-3 h-3 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-pulse"
              style={{
                animationDelay: `${index * 0.2}s`,
                animationDuration: '1s'
              }}
            ></div>
          ))}
        </div>

        {/* Mystical Quote */}
        <div className="text-center max-w-md px-4">
          <p className="text-white/60 italic text-sm leading-relaxed">
            "In the depths of every cave lies a treasure waiting to be discovered..."
          </p>
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-transparent rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-cyan-500/20 to-transparent rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

export default LoadingScreen;