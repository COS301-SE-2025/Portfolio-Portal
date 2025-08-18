// src/components/Templates/office/Hero.jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import Office from '../../3DModels/Office';
import useCvData from '../../../hooks/useCVData';

const Hero = () => {
  const navigate = useNavigate();
  const { name, description } = useCvData() || {};

  const handleViewWorkClick = () => {
    navigate('/office'); // Navigates to the 3D portfolio page
  };

  return (
    <section className="relative w-full h-screen mx-auto bg-gradient-to-br from-gray-900 via-blue-900/10 to-gray-900 flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center justify-between h-full">
        {/* Left Text Section */}
        <div className="flex-1 max-w-2xl space-y-6">
          <h1 className="text-white font-black text-5xl sm:text-6xl lg:text-7xl">
            Hi, I'm <span className="text-blue-400">{name || "Professional"}</span>
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl max-w-lg">
            {description || "Full stack developer creating digital solutions with precision and efficiency."}
          </p>
          <div className="flex gap-4 pt-4">
            <button 
              onClick={handleViewWorkClick}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-gray-700 hover:from-blue-700 hover:to-gray-800 text-white font-medium rounded transition-all duration-300 transform hover:scale-105"
            >
              View My Work
            </button>
          </div>
        </div>

        {/* 3D Office Model Section */}
        <div className="flex-1 w-full h-full max-w-2xl">
          <Canvas
            camera={{ position: [350, 250, 350], fov: 35 }}
            gl={{ preserveDrawingBuffer: true }}
            className="w-full h-full"
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.7} />
              <directionalLight position={[100, 100, 100]} intensity={0.6} />
              <pointLight position={[-50, -50, -50]} intensity={0.4} />
              <Office scale={[0.3, 0.3, 0.3]} position={[0, -50, 0]} />
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate={false}
                maxDistance={500}
                minDistance={100}
                maxPolarAngle={Math.PI / 2.1}
                minPolarAngle={Math.PI / 6}
              />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* Scroll Down Mouse Icon */}
      <div className="absolute bottom-10 w-full flex justify-center">
        <a href="#about" className="animate-bounce">
          <div className="w-10 h-16 border-4 border-blue-400 rounded-full flex justify-center items-start p-2">
            <div className="w-3 h-3 rounded-full bg-blue-400" />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;