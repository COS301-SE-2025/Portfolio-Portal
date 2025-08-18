import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
import * as THREE from 'three';
import About from './About';
import Experience from './Experience';
import Contact from './Contact';
import LoadingScreen from './LoadingScreen';
import './Index.css';

// Import your 3D models
import Cave2 from '../../3DModels/Cave';
import Crystal from '../../3DModels/Crystal';
import Campfire from '../../3DModels/Campfire';
import Pickaxe from '../../3DModels/Pickaxe';
import Shovel from '../../3DModels/Shovel';
import Skull from '../../3DModels/Skull';
import floor from './floor.png';
import Lamp from '../../3DModels/Lamp';

// Optimized Auto-rotating camera component
const AutoRotatingCamera = React.memo(() => {
  const { camera } = useThree();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime() * 0.3;
    const radius = 60;
    const height = 12;
    
    // 20 degrees total rotation (10 degrees each side from center)
    const maxAngle = (10 * Math.PI) / 180;
    const angle = Math.sin(time) * maxAngle;
    
    // Direct position setting for smoothest movement
    camera.position.set(
      Math.sin(angle) * radius,
      height,
      Math.cos(angle) * radius
    );
    
    camera.lookAt(0, -2, 0);
  });
  
  return null;
});

// Optimized Floor and Wall component with memoized texture
const TexturedFloorAndWalls = React.memo(() => {
  const floorTexture = useLoader(THREE.TextureLoader, floor);
  
  // Memoize texture configuration
  useMemo(() => {
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(20, 20);
    floorTexture.anisotropy = 16;
  }, [floorTexture]);
  
  return (
    <>
      {/* Main cave floor with texture */}
      <mesh position={[0, -8, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial 
          map={floorTexture}
          transparent 
          opacity={0.4} 
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>
      
      {/* Secondary floor layer for depth */}
      <mesh position={[0, -7.8, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[180, 180]} />
        <meshStandardMaterial 
          map={floorTexture}
          color="#9a9a9a"
          transparent 
          opacity={0.25} 
          roughness={0.7}
          metalness={0.05}
        />
      </mesh>
      
      {/* Base foundation layer */}
      <mesh position={[0, -8.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[250, 250]} />
        <meshStandardMaterial 
          map={floorTexture}
          color="#6a6a6a"
          transparent 
          opacity={0.2} 
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>
    </>
  );
});

// Optimized Crystal Component
const DecorativeCrystal = React.memo(({ position, color = "#8b5cf6", scale = [4, 4, 4] }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() + position[0]) * 0.2;
    }
  });
  
  return (
    <group ref={meshRef} position={position} scale={scale}>
      <Crystal />
      <pointLight position={[0, 2, 0]} intensity={4} color={color} />
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.15} 
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
});

// Optimized Lighting Setup Component
const OptimizedLighting = React.memo(() => {
  return (
    <>
      {/* Base ambient light */}
      <ambientLight intensity={0.8} color="#6366f1" />
      
      {/* Main directional light */}
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={2.5} 
        color="#ffffff"
        castShadow 
        shadow-mapSize={[1024, 1024]}
      />
      
      {/* Secondary directional lights */}
      <directionalLight position={[-10, 10, 5]} intensity={1.5} color="#e0e7ff" />
      <directionalLight position={[0, 10, -10]} intensity={1.8} color="#f8fafc" />
      
      {/* Campfire lighting */}
      <pointLight position={[0, 2, 0]} intensity={5} color="#ff6b35" />
      <pointLight position={[0, 0, 0]} intensity={3} color="#ffa500" />
      
      {/* Corner area lights for even coverage */}
      <pointLight position={[20, 10, 20]} intensity={2} color="#ffffff" />
      <pointLight position={[-20, 10, 20]} intensity={2} color="#ffffff" />
      <pointLight position={[20, 10, -20]} intensity={2} color="#ffffff" />
      <pointLight position={[-20, 10, -20]} intensity={2} color="#ffffff" />
      
      {/* Skull spotlight */}
      <spotLight 
        position={[30, 15, -30]} 
        target-position={[30, 5, -40]}
        angle={Math.PI / 6}
        penumbra={0.3}
        intensity={6}
        color="#ffffff"
        castShadow
      />
      
      {/* Skull accent light */}
      <pointLight position={[30, 8, -40]} intensity={3} color="#f0f0ff" />
      
      {/* Atmospheric lighting */}
      <spotLight 
        position={[0, 15, 0]} 
        target-position={[0, -8, 0]}
        angle={Math.PI / 2}
        penumbra={0.8}
        intensity={1.5}
        color="#8b5cf6"
        castShadow
      />
      
      {/* Ceiling lights for overall brightness */}
      <pointLight position={[0, 20, 0]} intensity={2} color="#ffffff" />
      <pointLight position={[15, 18, 15]} intensity={1.5} color="#e0e7ff" />
      <pointLight position={[-15, 18, 15]} intensity={1.5} color="#e0e7ff" />
      <pointLight position={[15, 18, -15]} intensity={1.5} color="#e0e7ff" />
      <pointLight position={[-15, 18, -15]} intensity={1.5} color="#e0e7ff" />
    </>
  );
});

// Optimized 3D Scene Models
const Scene3DModels = React.memo(() => {
  return (
    <>
      {/* Cave Interior Model */}
      <group position={[0, -8, -45]} scale={[15, 15, 15]}>
        <Cave2 />
      </group>

      {/* Central Campfire */}
      <group position={[0, -6.5, 0]} scale={[0.08, 0.08, 0.08]}>
        <Campfire />
      </group>
      
      {/* Crystal */}
      <group position={[50, 0, 10]} scale={[7, 7, 7]} rotation={[0, 0, 0]}>
        <Crystal />
      </group>

      {/* Skull */}
      <group position={[30, 5, -40]} scale={[0.05, 0.05, 0.05]} rotation={[0, -Math.PI / 3, 0]}>
        <Skull />
      </group>
      
      {/* Pickaxe */}
      <group position={[45, 5, 8]} scale={[4, 4, 4]} rotation={[0.2, Math.PI / 4, 10]}>
        <Pickaxe />
      </group>
      
      {/* Shovel */}
      <group position={[12, -4.5, -10]} scale={[4, 4, 4]} rotation={[0, 0, -0.3]}>
        <Shovel />
      </group>

      {/* Lamp */}
      <group position={[-30, -4.5, -10]} scale={[16, 16, 16]} rotation={[0, 0, 0]}>
        <Lamp />
      </group>
    </>
  );
});

// Integrated and optimized Hero component
const OptimizedHero = React.memo(({ activeCard }) => {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-800 relative overflow-hidden">
      <Canvas 
        className="w-full h-full" 
        shadows
        gl={{ 
          powerPreference: "high-performance",
          antialias: false, // Disable for better performance
          alpha: false,
          depth: true,
          stencil: false
        }}
        camera={{ fov: 75, near: 0.1, far: 1000 }}
      >
        {/* Auto-rotating camera */}
        <AutoRotatingCamera />
        
        {/* Optimized lighting */}
        <OptimizedLighting />
        
        {/* 3D Scene Models */}
        <Scene3DModels />
        
        {/* Textured Floor and Walls */}
        <TexturedFloorAndWalls />
      </Canvas>
    </div>
  );
});

// Mini 3D Model for cards (optimized)
const MiniModel = React.memo(({ model, scale = [0.3, 0.3, 0.3], position = [0, 0, 0] }) => {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
    }
  });

  // Memoize scale calculation
  const modelScale = useMemo(() => {
    if (model === 'pickaxe' || model === 'shovel') {
      return [2, 2, 2];
    }
    return scale;
  }, [model, scale]);

  const renderModel = useMemo(() => {
    switch(model) {
      case 'pickaxe':
        return <Pickaxe />;
      case 'shovel':
        return <Shovel />;
      case 'crystal':
        return <Crystal />;
      case 'campfire':
        return <Campfire />;
      default:
        return null;
    }
  }, [model]);

  return (
    <group 
      ref={groupRef}
      position={position}
      scale={modelScale}
    >
      <ambientLight intensity={1.2} />
      <pointLight position={[0.5, 0.5, 0.5]} intensity={0.8} />
      {renderModel}
    </group>
  );
});

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeCard, setActiveCard] = useState('about');
  const [isCardVisible, setIsCardVisible] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Optimized load complete handler
  const handleLoadComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Optimized card navigation with smooth transitions
  const handleCardChange = useCallback((cardType) => {
    if (isTransitioning || cardType === activeCard) return;
    
    setIsTransitioning(true);
    setIsCardVisible(false);
    
    setTimeout(() => {
      setActiveCard(cardType);
      setIsCardVisible(true);
      setTimeout(() => setIsTransitioning(false), 300);
    }, 200);
  }, [isTransitioning, activeCard]);

  // Optimized keyboard navigation
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
          setActiveCard(prev => {
            const newCard = prev === 'about' ? 'contact' : 
                            prev === 'experience' ? 'about' : 
                            prev === 'contact' ? 'experience' : 'about';
            handleCardChange(newCard);
            return prev;
          });
          break;
        case 'ArrowRight':
          setActiveCard(prev => {
            const newCard = prev === 'about' ? 'experience' : 
                            prev === 'experience' ? 'contact' : 
                            prev === 'contact' ? 'about' : 'about';
            handleCardChange(newCard);
            return prev;
          });
          break;
        case 'Escape':
        case 'e':
        case 'E':
          setIsCardVisible(!isCardVisible);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isLoading, isTransitioning, isCardVisible, handleCardChange]);

  // Optimized auto-cycle with longer interval for better UX
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
    }, 25000); // Increased to 25 seconds

    return () => clearInterval(interval);
  }, [isLoading, isTransitioning, isCardVisible, handleCardChange]);

  // Memoized card component
  const getCurrentCard = useMemo(() => {
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
  }, [activeCard, isCardVisible]);

  // Memoized theme colors
  const theme = useMemo(() => {
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
  }, [activeCard]);

  // Memoized navigation items
  const navigationItems = useMemo(() => [
    { key: 'about', label: 'About', icon: '🔥', color: 'green', description: 'Personal Story' },
    { key: 'experience', label: 'Experience', icon: '⛏️', color: 'purple', description: 'Professional Journey' },
    { key: 'contact', label: 'Contact', icon: '💎', color: 'cyan', description: 'Let\'s Connect' }
  ], []);

  if (isLoading) {
    return <LoadingScreen onLoadComplete={handleLoadComplete} />;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 overflow-hidden">
      
      {/* Optimized 3D Scene with performance settings */}
      <div className="relative z-10">
        <OptimizedHero activeCard={activeCard} />
      </div>

      {/* Enhanced Central Card Overlay */}
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
              {getCurrentCard}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation Pills */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/20 backdrop-blur-xl border border-white/25 rounded-2xl px-8 py-4 shadow-2xl">
          <div className="flex items-center gap-6">
            {navigationItems.map((item) => (
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
                <span className="text-white/60">Auto</span>
                <span>25s Cycle</span>
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

      {/* Optimized Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Reduced particles for better performance */}
        {[...Array(20)].map((_, i) => (
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
        
        {/* Optimized gradient orbs */}
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

export { MiniModel };
export default Index;