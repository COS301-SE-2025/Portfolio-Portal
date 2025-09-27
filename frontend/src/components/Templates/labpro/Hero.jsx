// components/Templates/labpro/Hero.jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import useCvData from '../../../hooks/useCVData';
import LabProModel from '../../3DModels/Labpro'; 

const Hero = () => {
  const { name, description } = useCvData() || {};

  return (
    <section className="relative w-full h-screen mx-auto bg-gray-900 flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center justify-between h-full">
        <div className="flex-1 max-w-2xl space-y-6">
          <h1 className="text-white font-black text-5xl sm:text-6xl lg:text-7xl">
            Dr. <span className="text-yellow-400">{name || "Researcher"}</span>
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl max-w-lg">
            {description || "Leading research scientist pioneering innovative solutions through rigorous experimentation and data-driven analysis."}
          </p>
          <button 
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            View Research Portfolio
          </button>
        </div>

        <div className="flex-1 w-full h-full max-w-2xl">
          <Canvas
            camera={{ 
              position: [1500, 700, 1500], 
              fov: 45,
              near: 0.1,
              far: 5000
            }}
            gl={{ preserveDrawingBuffer: true }}
            className="w-full h-full"
          >
            <Suspense fallback={null}>
              <ambientLight intensity={1.3} />
              <directionalLight position={[600, 600, 600]} intensity={1.1} />
              <pointLight position={[-300, 300, -300]} intensity={0.7} />
              <LabProModel scale={[0.3, 0.3, 0.3]} position={[0, -100, 0]} />
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate={false}
                maxDistance={1800}
                minDistance={1000}
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