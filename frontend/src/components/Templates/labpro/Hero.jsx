// components/Templates/labpro/Hero.jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import useCvData from '../../../hooks/useCVData';
import LabProModel from '../../3DModels/Labpro'; 

const Hero = () => {
  const { name, description } = useCvData() || {};

  return (
    <section className="relative w-full h-screen mx-auto bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20 flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center justify-between h-full">
        <div className="flex-1 max-w-2xl space-y-6">
          <h1 className="text-white font-black text-5xl sm:text-6xl lg:text-7xl">
            Dr. <span className="text-cyan-400">{name || "Researcher"}</span>
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl max-w-lg">
            {description || "Leading research scientist pioneering innovative solutions through rigorous experimentation and data-driven analysis."}
          </p>
          <button 
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            View Research Portfolio
          </button>
        </div>

        <div className="flex-1 w-full h-full max-w-2xl">
          <Canvas
            camera={{ 
              position: [1200, 600, 1200], 
              fov: 40,
              near: 0.1,
              far: 5000
            }}
            gl={{ preserveDrawingBuffer: true }}
            className="w-full h-full"
          >
            <Suspense fallback={null}>
              <ambientLight intensity={1.5} />
              <directionalLight position={[500, 500, 500]} intensity={1.2} />
              <pointLight position={[-200, 200, -200]} intensity={0.8} />
              <spotLight position={[0, 400, 0]} intensity={0.6} angle={0.5} />
              <LabProModel scale={[0.3, 0.3, 0.3]} position={[0, -80, 0]} />
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate={false}
                maxDistance={1500}
                minDistance={800}
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