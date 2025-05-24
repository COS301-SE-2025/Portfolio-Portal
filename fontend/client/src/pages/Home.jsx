import { useState, useEffect, useRef, Suspense } from 'react';
import Upload from './Upload'; // Import the Upload component
import ThreeJSObject from '../components/Ball'; // Add this import
import { Canvas } from '@react-three/fiber' // Fixed: Canvas with capital C
import { OrbitControls } from '@react-three/drei' // Fixed: Added to imports
import Earth from '../components/earth/Earth'

const Home = () => {
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const howItWorksRef = useRef(null);
  const uploadRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      root: null, // Use viewport as root
      rootMargin: '0px',
      threshold: 0.1, // Trigger when 10% of the section is visible
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
      className="min-h-screen transition-opacity duration-300">
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-8">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-6">
            <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
              Bring your
              <br />
              <span className="text-white">CV to life</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-lg leading-relaxed">
              Upload your CV and let us turn it into a 3D interactive portfolio that{' '}
              <span className="font-semibold text-white">speaks for you.</span>
            </p>
            
            <button 
              onClick={handleFindOutMore}
              className="mt-8 bg-transparent border-2 border-white text-white font-medium py-4 px-8 rounded-full hover:bg-white hover:text-slate-900 transition-all duration-300 flex items-center space-x-2 group"
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
          
          {/* Right Content - 3D Canvas */}
          <div className="h-96"> {/* Added container with height */}
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <Suspense fallback={null}>
                <Earth />
                <OrbitControls enableZoom={true} />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-4 h-4 bg-purple-400 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute top-40 right-32 w-6 h-6 bg-blue-400 rounded-full opacity-40 animate-pulse delay-1000"></div>
      <div className="absolute top-32 right-16 w-3 h-3 bg-green-400 rounded-full opacity-50 animate-pulse delay-500"></div>
      
      {/* How it works section */}
      <div 
        id="how-it-works" 
        ref={howItWorksRef}
        className="min-h-screen flex flex-col items-center justify-center px-8 py-16"
      >
        {showHowItWorks && (
          <div className="max-w-4xl w-full text-center text-white space-y-12 animate-fadeIn">
            <h2 className="text-5xl lg:text-6xl font-bold mb-8">How it works</h2>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-16">
              Portfolio Portal uses smart OCR and beautiful templates to turn 
              your resume into a dynamic web experience — no coding required.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
              {/* Step 1 */}
              <div className="flex flex-col items-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-2xl">
                  1
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Upload</h3>
                  <h3 className="text-2xl font-bold mb-4">your CV</h3>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="flex flex-col items-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-2xl">
                  2
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Choose a</h3>
                  <h3 className="text-2xl font-bold mb-4">template</h3>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="flex flex-col items-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-2xl">
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
                className="w-12 h-12 text-white hover:text-purple-300 transition-colors duration-300" 
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
      
      {/* Upload Section */}
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

// Add custom CSS for fade-in and arrow pulse animations
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

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}