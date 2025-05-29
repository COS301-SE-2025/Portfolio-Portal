import { forwardRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import Earth from '../3DModels/Earth';
import { useTheme } from '../../contexts/ThemeContext';

const HeroSection = forwardRef(({ id, show, handleScrollToSection }, ref) => {
  const { isDark } = useTheme();

  return (
    <div id={id} ref={ref} className="flex items-center justify-center min-h-[calc(100vh-80px)] px-8 relative">
      {show && (
        <div className={`max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-fadeIn ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <div className="space-y-6">
            <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
              Bring your
              <br />
              <span className={isDark ? 'text-white' : 'text-slate-900'}>CV to life</span>
            </h1>
            <p className={`text-xl max-w-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
              Upload your CV and let us turn it into a 3D interactive portfolio that{' '}
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>speaks for you.</span>
            </p>
            <button
              onClick={() => handleScrollToSection('how-it-works')}
              className={`mt-8 border-2 font-medium py-4 px-8 rounded-full transition-all duration-300 flex items-center space-x-2 group ${
                isDark ? 'bg-transparent border-white text-white hover:bg-white hover:text-slate-900' : 'bg-transparent border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <span>Find out more</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          <div className="h-96">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <ambientLight intensity={1.5} />
              <pointLight position={[10, 10, 10]} />
              <Suspense fallback={null}>
                <Earth />
                <OrbitControls enableZoom={false} autoRotate={true} />
              </Suspense>
            </Canvas>
          </div>
        </div>
      )}
      <div className={`absolute top-20 right-20 w-4 h-4 rounded-full animate-pulse ${isDark ? 'bg-purple-400 opacity-60' : 'bg-purple-300 opacity-80'}`}></div>
      <div className={`absolute top-40 right-32 w-6 h-6 rounded-full animate-pulse delay-1000 ${isDark ? 'bg-blue-400 opacity-40' : 'bg-blue-300 opacity-60'}`}></div>
      <div className={`absolute top-32 right-16 w-3 h-3 rounded-full animate-pulse delay-500 ${isDark ? 'bg-green-400 opacity-50' : 'bg-green-300 opacity-70'}`}></div>
    </div>
  );
});

export default HeroSection;

const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.8s ease-out;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}