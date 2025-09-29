import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import portfolioData from '../data/portfolioData.js';
import Office from './3DModels/Office.jsx'; 

const Hero = () => {
  const { header } = portfolioData;

  return (
    <section className="relative w-full h-screen mx-auto bg-gradient-to-br from-gray-900 via-blue-900/10 to-gray-900 flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center justify-between h-full">
        <div className="flex-1 max-w-2xl space-y-6">
          <h1 className="text-white font-black text-5xl sm:text-6xl lg:text-7xl">
            Hi, I'm <span className="text-blue-400">{header.name || "Professional"}</span>
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl max-w-lg">
            {header.title }
          </p>
        </div>

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
    </section>
  );
};

export default Hero;
