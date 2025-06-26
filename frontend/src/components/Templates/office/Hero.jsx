import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import OfficeModel from '../../3DModels/Office';
import useCvData from '../../../hooks/useCVData';

const Hero = () => {
  const { cvData } = useCvData() || {};

  return (
    <section className="relative w-full h-screen mx-auto flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900/10 to-gray-900">
      {/* Office-themed background elements */}
      <div className="absolute inset-0">
        {/* Subtle grid overlay resembling office floor tiles */}
        <div className="absolute inset-0 opacity-10" 
             style={{
               backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.3) 1px, transparent 1px),
                                 linear-gradient(to bottom, rgba(255,255,255,0.3) 1px, transparent 1px)`,
               backgroundSize: '40px 40px'
             }}>
        </div>
        
        {/* Office window light effects */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-500/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/3 bg-gradient-to-t from-amber-500/10 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 z-10 flex items-center justify-between h-full">
        <div className="flex-1 max-w-2xl">
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-gray-300 leading-tight">
              {cvData?.name || "John Doe"}
            </h1>
            <p className="text-xl lg:text-2xl font-light text-gray-300 mb-8 tracking-wide">
              Professional {cvData?.jobTitle || "Full Stack Developer"}
            </p>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-lg">
              Crafting digital solutions with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-gray-300 font-semibold">
                precision and professionalism
              </span>
            </p>
            
            <div className="pt-4">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-gray-700 hover:from-blue-700 hover:to-gray-800 text-white font-medium rounded transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/15">
                View My Work
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 h-full max-w-2xl relative z-20">
          <div className="w-full h-full min-h-[600px] relative">
            <Canvas 
              camera={{ position: [0, 100, 300], fov: 45 }}
              className="w-full h-full"
              gl={{ antialias: true, alpha: true }}
              dpr={[1, 2]}
            >
              <ambientLight intensity={0.5} color="#ffffff" />
              <directionalLight
                position={[100, 100, 100]}
                intensity={1}
                color="#ffffff"
                castShadow
              />
              <directionalLight
                position={[-100, 100, 100]}
                intensity={0.3}
                color="#4f46e5"
              />
              
              <Suspense fallback={null}>
                <OfficeModel />
                <OrbitControls 
                  enableZoom={true}
                  enablePan={false}
                  minPolarAngle={Math.PI / 4}
                  maxPolarAngle={Math.PI / 2}
                  autoRotate={true}
                  autoRotateSpeed={1}
                  minDistance={150}
                  maxDistance={750}
                />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero;