// components/Templates/labpro/Hero.jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import useCvData from '../../../hooks/useCVData';
import LabProModel from '../../3DModels/Labpro'; 

const Hero = () => {
  const { name, description } = useCvData() || {};

  return (
    <section className="relative w-full h-screen mx-auto bg-gradient-to-br from-gray-900 via-emerald-900/10 to-gray-900 flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center justify-between h-full">
        <div className="flex-1 max-w-2xl space-y-6">
          <h1 className="text-white font-black text-5xl sm:text-6xl lg:text-7xl">
            Dr. <span className="text-emerald-400">{name || "Researcher"}</span>
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl max-w-lg">
            {description || "Leading research scientist pioneering innovative solutions through rigorous experimentation and data-driven analysis."}
          </p>
          <button 
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-gray-800 hover:from-emerald-700 hover:to-gray-900 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            View Research Portfolio
          </button>
        </div>

        <div className="flex-1 w-full h-full max-w-2xl">
          <Canvas
            camera={{ 
              position: [2000, 1000, 2000], 
              fov: 45,
              near: 0.1,    // Very close near plane
              far: 10000    // Very far far plane to prevent clipping
            }}
            gl={{ preserveDrawingBuffer: true }}
            className="w-full h-full"
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.7} />
              <directionalLight position={[1000, 1000, 1000]} intensity={0.8} />
              <pointLight position={[-500, -500, -500]} intensity={0.5} />
              <LabProModel scale={[0.3, 0.3, 0.3]} position={[0, -100, 0]} />
              <OrbitControls
                enableZoom={true}
                enablePan={false}
                autoRotate={true}
                autoRotateSpeed={1}
                maxDistance={5000}    // Allow very far zoom out
                minDistance={800}     // Prevent getting too close
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={0}
              />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </section>
  );
};

export default Hero;