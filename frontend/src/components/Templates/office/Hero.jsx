import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import useCvData from '../../../hooks/useCVData';

const Hero = () => {
  const navigate = useNavigate();
  const { name, description } = useCvData() || {};

  return (
    <section className="relative w-full h-screen mx-auto bg-gradient-to-br from-gray-900 via-blue-900/10 to-gray-900 flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center justify-between h-full">
        <div className="flex-1 max-w-2xl space-y-6">
          <h1 className="text-white font-black text-5xl sm:text-6xl lg:text-7xl">
            Hi, I'm <span className="text-blue-400">{name || "Professional"}</span>
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl max-w-lg">
            {description || "Full stack developer creating digital solutions with precision and efficiency."}
          </p>
          <button 
            onClick={() => navigate('/office3d')}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-gray-700 hover:from-blue-700 hover:to-gray-800 text-white font-medium rounded transition-all duration-300 transform hover:scale-105"
          >
            View 3D Portfolio
          </button>
        </div>

        <div className="flex-1 w-full h-full max-w-2xl">
          <Canvas
            camera={{ position: [350, 250, 350], fov: 35 }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.7} />
              <directionalLight position={[100, 100, 100]} intensity={0.6} />
              <pointLight position={[-50, -50, -50]} intensity={0.4} />
              <OfficePreview />
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate={true}
                autoRotateSpeed={0.5}
              />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </section>
  );
};

// Simple preview component
function OfficePreview() {
  return (
    <mesh>
      <boxGeometry args={[5, 2, 5]} />
      <meshStandardMaterial color="#3a3a3a" />
    </mesh>
  );
}

export default Hero;