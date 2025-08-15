import { forwardRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import Earth from "../3DModels/Earth";
import { useTheme } from '../../contexts/ThemeContext';
import { Sparkles } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

const HeroSection = forwardRef(({ id, show, handleScrollToSection }, ref) => {
  const { isDark } = useTheme();

  return (
    <SectionWrapper id={id} show={show} ref={ref} isDark={isDark}>
      <div className={`relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-fadeIn ${isDark ? 'text-white' : 'text-slate-900'}`}>
        <div className="space-y-6 relative">
          <nav className="relative z-10 container mx-auto px-6 py-6">
            <div className="flex items-center">
              <Sparkles className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <span className={`text-2xl font-bold bg-clip-text text-transparent ${
                isDark ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-gradient-to-r from-purple-600 to-pink-600'
              }`}>
                Portfolio Portal
              </span>
            </div>
          </nav>
          
          <div className={`absolute -left-4 top-0 w-1 h-32 rounded-full ${
            isDark ? 'bg-gradient-to-b from-blue-400 to-indigo-500' : 'bg-gradient-to-b from-purple-500 to-blue-600'
          } animate-pulse`}></div>
          
          <h1 className="text-6xl lg:text-7xl font-bold leading-tight relative">
            <span className="relative inline-block">
              Bring your
              <div className={`absolute -inset-1 rounded-lg blur-lg ${
                isDark ? 'bg-blue-500/20' : 'bg-purple-300/30'
              } -z-10 animate-pulse`}></div>
            </span>
            <br />
            <span className={`relative inline-block bg-gradient-to-r bg-clip-text text-transparent ${
              isDark 
                ? 'from-blue-400 via-indigo-300 to-purple-400' 
                : 'from-purple-600 via-blue-600 to-indigo-600'
            } animate-gradient-shift`}>
              CV to life
            </span>
          </h1>
          
          <p className={`text-xl max-w-lg leading-relaxed relative ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Upload your CV and let us turn it into a 3D interactive portfolio that{' '}
            <span className={`font-semibold bg-gradient-to-r bg-clip-text text-transparent ${
              isDark 
                ? 'from-white to-blue-200' 
                : 'from-slate-900 to-purple-700'
            }`}>speaks for you.</span>
          </p>
          
          <button
            onClick={() => handleScrollToSection('how-it-works')}
            className={`relative mt-8 font-medium py-4 px-8 rounded-full transition-all duration-300 flex items-center space-x-2 group overflow-hidden ${
              isDark 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-lg hover:shadow-blue-500/25' 
                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-purple-500/30'
            } transform hover:scale-105 hover:-translate-y-1`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/20 to-indigo-400/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <span className="relative z-10">Find out more</span>
            <svg className="relative z-10 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        <div className="h-96 relative">
          <div className={`absolute inset-0 rounded-xl ${
            isDark ? 'bg-gradient-to-br from-slate-800/30 to-blue-900/20' : 'bg-gradient-to-br from-purple-100/50 to-blue-100/50'
          } backdrop-blur-sm`}></div>
          
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }} className="rounded-xl">
            <ambientLight intensity={isDark ? 1.5 : 1.8} />
            <pointLight position={[10, 10, 10]} intensity={isDark ? 1 : 0.8} />
            <pointLight position={[-10, -10, -10]} intensity={0.3} color={isDark ? "#3b82f6" : "#6366f1"} />
            <Suspense fallback={null}>
              <Earth />
              <OrbitControls enableZoom={false} autoRotate={true} autoRotateSpeed={1.5} />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </SectionWrapper>
  );
});

export default HeroSection;