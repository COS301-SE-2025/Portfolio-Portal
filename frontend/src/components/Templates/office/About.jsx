import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Head from '../../3DModels/Head';
import useCvData from '../../../hooks/useCVData';

const OfficeAbout = () => {
  const { cvData } = useCvData() || {};
  
  return (
    <section id="about" className="py-24 relative overflow-hidden bg-gray-900/50">
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl lg:text-5xl font-bold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-gray-300">
          About Me
        </h2>
        
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="w-full lg:w-1/2 relative">
            <div className="h-96 lg:h-[500px] relative">
              <Canvas
                camera={{ position: [0, 1, 4], fov: 50 }}
                shadows
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
              >
                <ambientLight intensity={0.5} />
                <directionalLight
                  position={[5, 5, 5]}
                  intensity={0.8}
                  castShadow
                />
                <pointLight position={[-5, 3, -5]} intensity={0.5} color="#3b82f6" />
                
                <Environment preset="apartment" />
                
                <Suspense fallback={null}>
                  <Head />
                  <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate={true}
                    autoRotateSpeed={1}
                  />
                </Suspense>
              </Canvas>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="space-y-6">
              <p className="text-lg lg:text-xl text-gray-300 leading-relaxed">
                {cvData?.about}
              </p>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-200 mb-4">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-3">
                {cvData?.skills?.map((skill, index) => {
                  const colors = [
                    "bg-blue-600/20 border-blue-600/50",
                    "bg-gray-600/20 border-gray-600/50",
                    "bg-blue-800/20 border-blue-800/50",
                  ];
                  const color = colors[index % colors.length];
                  
                  return (
                    <span
                      key={`skill-${index}`}
                      className={`px-4 py-2 ${color} border rounded-full text-sm text-gray-300 hover:scale-105 transition-transform duration-200 cursor-default`}
                    >
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfficeAbout;