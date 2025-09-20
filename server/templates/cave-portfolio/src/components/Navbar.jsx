import { useState } from "react";
import portfolioData from '../data/portfolioData.js';

const Navbar = ({ activeCard, onCardChange }) => {
  const [active, setActive] = useState(activeCard || "about");
  const { header } = portfolioData;

  const navigationItems = [
    { key: 'about', label: 'About', icon: '🔥', color: 'green', description: 'Personal Story' },
    { key: 'experience', label: 'Experience', icon: '⛏️', color: 'purple', description: 'Professional Journey' },
    { key: 'contact', label: 'Contact', icon: '💎', color: 'cyan', description: 'Let\'s Connect' }
  ];

  const handleCardChange = (cardType) => {
    setActive(cardType);
    if (onCardChange) {
      onCardChange(cardType);
    }
  };

  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-black/20 backdrop-blur-xl border border-white/25 rounded-2xl px-8 py-4 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="text-white font-bold text-lg">
            {header.name}'s Cave
          </div>
          {navigationItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleCardChange(item.key)}
              className={`
                group px-5 py-3 rounded-xl transition-all duration-300 flex items-center gap-3
                relative overflow-hidden
                ${active === item.key ? 
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
              
              {active === item.key && (
                <div className={`
                  absolute bottom-0 left-0 right-0 h-0.5 
                  bg-gradient-to-r from-${item.color}-400 to-${item.color}-600
                `} />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;




