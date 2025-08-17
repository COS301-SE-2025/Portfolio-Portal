import React, { useState, useEffect } from 'react';
import Hero from './Hero';
import About from './About';
import Experience from './Experience';
import Contact from './Contact';
import LoadingScreen from './LoadingScreen';
import './Index.css';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeCard, setActiveCard] = useState('about');
  const [isCardVisible, setIsCardVisible] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle loading completion
  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  // Enhanced card navigation with smooth transitions
  const handleCardChange = (cardType) => {
    if (isTransitioning || cardType === activeCard) return;
    
    setIsTransitioning(true);
    setIsCardVisible(false);
    
    setTimeout(() => {
      setActiveCard(cardType);
      setIsCardVisible(true);
      setTimeout(() => setIsTransitioning(false), 300);
    }, 200);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isLoading || isTransitioning) return;
      
      switch(e.key) {
        case '1':
          handleCardChange('about');
          break;
        case '2':
          handleCardChange('experience');
          break;
        case '3':
          handleCardChange('contact');
          break;
        case 'ArrowLeft':
          // Cycle backwards
          setActiveCard(prev => {
            const newCard = prev === 'about' ? 'contact' : 
                            prev === 'experience' ? 'about' : 
                            prev === 'contact' ? 'experience' : 'about';
            handleCardChange(newCard);
            return prev; // Return previous to prevent double update
          });
          break;
        case 'ArrowRight':
          // Cycle forwards
          setActiveCard(prev => {
            const newCard = prev === 'about' ? 'experience' : 
                            prev === 'experience' ? 'contact' : 
                            prev === 'contact' ? 'about' : 'about';
            handleCardChange(newCard);
            return prev; // Return previous to prevent double update
          });
          break;
        case 'Escape':
        case 'e':
        case 'E':
          // Toggle card visibility
          setIsCardVisible(!isCardVisible);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isLoading, isTransitioning, isCardVisible]);

  // Auto-cycle cards every 20 seconds (increased for better UX)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading && !isTransitioning && isCardVisible) {
        setActiveCard(prev => {
          const newCard = prev === 'about' ? 'experience' : 
                          prev === 'experience' ? 'contact' : 
                          'about';
          handleCardChange(newCard);
          return prev;
        });
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [isLoading, isTransitioning, isCardVisible]);

  // Get current card component with enhanced transitions
  const getCurrentCard = () => {
    const cardProps = {
      className: `transition-all duration-500 ${isCardVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`
    };

    switch(activeCard) {
      case 'experience':
        return <Experience {...cardProps} />;
      case 'contact':
        return <Contact {...cardProps} />;
      case 'about':
      default:
        return <About {...cardProps} />;
    }
  };

  // Get card theme colors
  const getCardTheme = () => {
    switch(activeCard) {
      case 'about':
        return {
          border: 'border-green-400/40',
          shadow: 'shadow-green-500/25',
          glow: 'bg-green-400/5',
          accent: 'green'
        };
      case 'experience':
        return {
          border: 'border-purple-400/40',
          shadow: 'shadow-purple-500/25',
          glow: 'bg-purple-400/5',
          accent: 'purple'
        };
      case 'contact':
        return {
          border: 'border-cyan-400/40',
          shadow: 'shadow-cyan-500/25',
          glow: 'bg-cyan-400/5',
          accent: 'cyan'
        };
      default:
        return {
          border: 'border-white/20',
          shadow: 'shadow-white/10',
          glow: 'bg-white/5',
          accent: 'white'
        };
    }
  };

  const theme = getCardTheme();

  if (isLoading) {
    return <LoadingScreen onLoadComplete={handleLoadComplete} />;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 overflow-hidden">
      
      {/* Enhanced 3D Scene with interactive camera */}
      <div className="relative z-10">
        <Hero activeCard={activeCard} />
      </div>

      {/* Enhanced Central Card Overlay with better positioning */}
      <div className={`
        fixed inset-0 z-40 flex items-center justify-center p-6 pointer-events-none
        transition-all duration-500
        ${isCardVisible ? 'opacity-100' : 'opacity-0'}
      `}>
        <div className={`
          relative z-50 w-full max-w-6xl h-[85vh]
          transition-all duration-700 transform pointer-events-auto
          ${isTransitioning ? 'scale-95 opacity-70' : 'scale-100 opacity-100'}
          ${!isCardVisible ? 'scale-95 opacity-0' : ''}
        `}>
          <div className={`
            h-full backdrop-blur-xl border-2 rounded-3xl shadow-2xl
            transition-all duration-700 overflow-hidden
            bg-black/10 ${theme.border} ${theme.shadow}
            hover:${theme.glow} hover:border-opacity-60
          `}>
            {/* Card header with theme indicator */}
            <div className={`
              absolute top-0 left-0 right-0 h-1 
              ${activeCard === 'about' ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 
                activeCard === 'experience' ? 'bg-gradient-to-r from-purple-400 to-indigo-400' : 
                'bg-gradient-to-r from-cyan-400 to-blue-400'}
              transition-all duration-700
            `} />
            
            {/* Card content */}
            <div className="h-full pt-1">
              {getCurrentCard()}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation Pills with better styling */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/20 backdrop-blur-xl border border-white/25 rounded-2xl px-8 py-4 shadow-2xl">
          <div className="flex items-center gap-6">
            {[
              { key: 'about', label: 'About', icon: '🔥', color: 'green', description: 'Personal Story' },
              { key: 'experience', label: 'Experience', icon: '⛏️', color: 'purple', description: 'Professional Journey' },
              { key: 'contact', label: 'Contact', icon: '💎', color: 'cyan', description: 'Let\'s Connect' }
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => handleCardChange(item.key)}
                disabled={isTransitioning}
                className={`
                  group px-5 py-3 rounded-xl transition-all duration-300 flex items-center gap-3
                  relative overflow-hidden disabled:opacity-50
                  ${activeCard === item.key ? 
                    `bg-${item.color}-500/25 border-${item.color}-400/60 text-white border-2 scale-105 shadow-lg` : 
                    'bg-white/8 text-white/80 hover:bg-white/15 hover:text-white border border-white/20 hover:border-white/40 hover:scale-102'}
                `}
                title={item.description}
              >
                <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                  {item.icon}
                </span>
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-sm leading-tight">{item.label}</span>
                  <span className="text-xs opacity-70 leading-tight">{item.description}</span>
                </div>
                
                {/* Active indicator */}
                {activeCard === item.key && (
                  <div className={`
                    absolute bottom-0 left-0 right-0 h-0.5 
                    bg-gradient-to-r from-${item.color}-400 to-${item.color}-600
                  `} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Progress Indicator */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/20 backdrop-blur-xl border border-white/25 rounded-2xl px-6 py-4 shadow-xl">
          <div className="flex items-center gap-4">
            {['about', 'experience', 'contact'].map((item, index) => {
              const colors = ['green', 'purple', 'cyan'];
              const isActive = activeCard === item;
              
              return (
                <div key={item} className="flex items-center gap-2">
                  <div
                    className={`
                      w-3 h-3 rounded-full transition-all duration-500
                      ${isActive ? 
                        `bg-gradient-to-r from-${colors[index]}-400 to-${colors[index]}-600 scale-125 shadow-lg` : 
                        'bg-white/25 hover:bg-white/40'}
                    `}
                  />
                  {index < 2 && (
                    <div className="w-8 h-0.5 bg-white/20 rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Enhanced Keyboard Instructions */}
      <div className="fixed bottom-6 left-20 z-40">
        <div className="bg-black/20 backdrop-blur-xl border border-white/25 rounded-xl px-5 py-4 shadow-xl">
          <div className="text-sm text-white/80">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-white font-semibold">Controls:</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white/25 rounded-md font-mono">1-3</kbd>
                <span>Quick Nav</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white/25 rounded-md font-mono">←→</kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white/25 rounded-md font-mono">E</kbd>
                <span>Toggle Cards</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/60">e</span>
                <span>Explore 3D</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Status Indicator */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="bg-black/20 backdrop-blur-xl border border-white/25 rounded-xl px-5 py-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className={`
              w-3 h-3 rounded-full animate-pulse
              ${activeCard === 'about' ? 'bg-green-400' : 
                activeCard === 'experience' ? 'bg-purple-400' : 
                'bg-cyan-400'}
            `}></div>
            <div className="flex flex-col">
              <span className="text-white font-medium text-sm capitalize leading-tight">
                {activeCard}
              </span>
              <span className="text-white/60 text-xs leading-tight">
                {isTransitioning ? 'Transitioning...' : 'Active'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Background Effects with depth */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Animated particles with better distribution */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className={`
              absolute w-1 h-1 rounded-full animate-ping
              ${i % 3 === 0 ? 'bg-purple-400/20' : 
                i % 3 === 1 ? 'bg-cyan-400/20' : 
                'bg-green-400/20'}
            `}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
        
        {/* Enhanced gradient orbs with better positioning */}
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/8 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '4s' }}
        />
        <div 
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/8 to-transparent rounded-full blur-3xl animate-pulse" 
          style={{ animationDelay: '2s', animationDuration: '5s' }}
        />
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-green-500/8 to-transparent rounded-full blur-3xl animate-pulse" 
          style={{ animationDelay: '1s', animationDuration: '6s' }}
        />
        
        {/* Dynamic theme-based overlay */}
        <div className={`
          absolute inset-0 transition-all duration-1000
          ${activeCard === 'about' ? 'bg-gradient-to-br from-green-500/5 via-transparent to-transparent' :
            activeCard === 'experience' ? 'bg-gradient-to-br from-purple-500/5 via-transparent to-transparent' :
            'bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent'}
        `} />
      </div>

      {/* Card visibility toggle button */}
      <button
        onClick={() => setIsCardVisible(!isCardVisible)}
        className="fixed top-6 right-6 z-50 bg-black/20 backdrop-blur-xl border border-white/25 rounded-xl p-3 shadow-xl hover:bg-black/30 transition-all duration-300"
        title={isCardVisible ? 'Hide cards (E)' : 'Show cards (E)'}
      >
        <div className="w-5 h-5 text-white/80 hover:text-white transition-colors duration-200">
          {isCardVisible ? '👁️' : '👁️‍🗨️'}
        </div>
      </button>
    </div>
  );
};

export default Index;