import { useState, useEffect, useRef, Suspense } from 'react';
import Upload from './Upload';
import ThreeJSObject from '../components/Ball';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Earth from '../components/earth/Earth';
import { useTheme } from '../contexts/ThemeContext';

const Home = () => {
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const howItWorksRef = useRef(null);
  const uploadRef = useRef(null);
  const { theme, toggleTheme, isDark } = useTheme();
  
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.id === 'how-it-works') {
            setShowHowItWorks(true);
          }
          if (entry.target.id === 'upload-section') {
            setShowUpload(true);
          }
        }
      });
    }, observerOptions);

    if (howItWorksRef.current) observer.observe(howItWorksRef.current);
    if (uploadRef.current) observer.observe(uploadRef.current);

    return () => {
      if (howItWorksRef.current) observer.unobserve(howItWorksRef.current);
      if (uploadRef.current) observer.unobserve(uploadRef.current);
    };
  }, []);

  const handleFindOutMore = () => {
    setShowHowItWorks(true);
    setTimeout(() => {
      const howItWorksSection = document.getElementById('how-it-works');
      howItWorksSection?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleGetStarted = () => {
    setShowUpload(true);
    setTimeout(() => {
      const uploadSection = document.getElementById('upload-section');
      uploadSection?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div 
      id="home-container" 
      className={`min-h-screen transition-all duration-300 ${
        isDark 
          ? 'bg-slate-900' 
          : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
      }`}
    >
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full backdrop-blur-sm border transition-all duration-300 group ${
          isDark 
            ? 'bg-white/10 border-white/20 hover:bg-white/20' 
            : 'bg-white/80 border-gray-200 hover:bg-white shadow-lg hover:shadow-xl'
        }`}
        aria-label="Toggle theme"
      >
        {isDark ? (
          <svg className="w-6 h-6 text-yellow-400 group-hover:text-yellow-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-slate-700 group-hover:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-8">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`space-y-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
              Bring your
              <br />
              <span className={isDark ? 'text-white' : 'text-slate-900'}>CV to life</span>
            </h1>
            
            <p className={`text-xl max-w-lg leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-slate-600'
            }`}>
              Upload your CV and let us turn it into a 3D interactive portfolio that{' '}
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>speaks for you.</span>
            </p>
            
            <button 
              onClick={handleFindOutMore}
              className={`mt-8 border-2 font-medium py-4 px-8 rounded-full transition-all duration-300 flex items-center space-x-2 group ${
                isDark 
                  ? 'bg-transparent border-white text-white hover:bg-white hover:text-slate-900' 
                  : 'bg-transparent border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <span>Find out more</span>
              <svg 
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
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
      </div>
      
      <div className={`absolute top-20 right-20 w-4 h-4 rounded-full animate-pulse ${
        isDark ? 'bg-purple-400 opacity-60' : 'bg-purple-300 opacity-80'
      }`}></div>
      <div className={`absolute top-40 right-32 w-6 h-6 rounded-full animate-pulse delay-1000 ${
        isDark ? 'bg-blue-400 opacity-40' : 'bg-blue-300 opacity-60'
      }`}></div>
      <div className={`absolute top-32 right-16 w-3 h-3 rounded-full animate-pulse delay-500 ${
        isDark ? 'bg-green-400 opacity-50' : 'bg-green-300 opacity-70'
      }`}></div>
      
      <div 
        id="how-it-works" 
        ref={howItWorksRef}
        className="min-h-screen flex flex-col items-center justify-center px-8 py-16"
      >
        {showHowItWorks && (
          <div className={`max-w-4xl w-full text-center space-y-12 animate-fadeIn ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            <h2 className="text-5xl lg:text-6xl font-bold mb-8">How it works</h2>
            
            <p className={`text-xl max-w-3xl mx-auto leading-relaxed mb-16 ${
              isDark ? 'text-gray-300' : 'text-slate-600'
            }`}>
              Portfolio Portal uses smart OCR and beautiful templates to turn 
              your resume into a dynamic web experience — no coding required.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
              <div className="flex flex-col items-center space-y-6">
                <div className={`w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold ${
                  isDark ? 'shadow-2xl' : 'shadow-2xl shadow-purple-200/50'
                }`}>
                  1
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Upload</h3>
                  <h3 className="text-2xl font-bold mb-4">your CV</h3>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-6">
                <div className={`w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold ${
                  isDark ? 'shadow-2xl' : 'shadow-2xl shadow-purple-200/50'
                }`}>
                  2
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Choose a</h3>
                  <h3 className="text-2xl font-bold mb-4">template</h3>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-6">
                <div className={`w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold ${
                  isDark ? 'shadow-2xl' : 'shadow-2xl shadow-purple-200/50'
                }`}>
                  3
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Enjoy your</h3>
                  <h3 className="text-2xl font-bold mb-4">portfolio!</h3>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleGetStarted}
              className="mt-16 animate-pulseArrow"
            >
              <svg 
                className={`w-12 h-12 transition-colors duration-300 ${
                  isDark 
                    ? 'text-white hover:text-purple-300' 
                    : 'text-slate-700 hover:text-purple-600'
                }`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      <div 
        id="upload-section" 
        ref={uploadRef}
        className="min-h-screen flex items-center justify-center px-8 py-16"
      >
        {showUpload && <Upload />}
      </div>
    </div>
  );
};

export default Home;

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

  @keyframes pulseArrow {
    0% {
      opacity: 0.6;
      transform: scale(1);
      filter: drop-shadow(0 0 0 rgba(255, 255, 255, 0));
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
      filter: drop-shadow(0 0 10px rgba(147, 51, 234, 0.7));
    }
    100% {
      opacity: 0.6;
      transform: scale(1);
      filter: drop-shadow(0 0 0 rgba(255, 255, 255, 0));
    }
  }

  .animate-pulseArrow {
    animation: pulseArrow 2s infinite ease-in-out;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}