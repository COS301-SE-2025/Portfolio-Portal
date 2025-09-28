// components/Templates/labpro/Hero.jsx - Restored to original with transparent background
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import portfolioData from '../data/portfolioData';
import LabProModel from './3DModels/Labpro';

const Hero = () => {
  const  name  = portfolioData.header.name;
  const  summary = portfolioData.header.summary;

  return (
    <section className="relative w-full h-screen mx-auto flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center justify-between h-full">
        <div className="flex-1 max-w-2xl space-y-6">
          {/* Original hero title - no emojis, no Dr. */}
          <h1 className="text-white font-black text-5xl sm:text-6xl lg:text-7xl">
            Hi, I'm <span className="text-emerald-400">{name || "Researcher"}</span>
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl max-w-lg">
            {summary || "Leading research scientist pioneering innovative solutions through rigorous experimentation and data-driven analysis."}
          </p>
          <button 
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            View Research Portfolio
          </button>
        </div>

        <div className="flex-1 w-full h-full max-w-2xl">
          <Canvas
            camera={{ 
              position: [1800, 900, 1800], 
              fov: 45,
              near: 0.1,
              far: 8000
            }}
            gl={{ preserveDrawingBuffer: true }}
            className="w-full h-full"
          >
            <Suspense fallback={null}>
              <ambientLight intensity={1.5} />
              <directionalLight position={[800, 800, 800]} intensity={1.2} />
              <pointLight position={[-400, 400, -400]} intensity={0.8} />
              <spotLight position={[0, 600, 0]} intensity={0.6} angle={0.5} />
              <LabProModel scale={[0.3, 0.3, 0.3]} position={[0, -120, 0]} />
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate={false}
                maxDistance={1800}
                minDistance={1200}
                maxPolarAngle={Math.PI / 2.1}
                minPolarAngle={Math.PI / 6}
              />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </section>
  );
};

export default Hero;