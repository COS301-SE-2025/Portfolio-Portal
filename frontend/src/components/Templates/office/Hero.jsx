import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import OfficeModel from '../../3DModels/Office';
import { userName, jobTitle } from "./index";

const Hero = () => {
  return (
    <section className="relative w-full h-screen mx-auto bg-gradient-to-br from-gray-900 via-blue-900/10 to-gray-900">
      <div className="absolute inset-0 max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex-1 max-w-2xl">
          <div className="space-y-6">
            <h1 className="text-white font-black text-5xl sm:text-6xl lg:text-7xl">
              Hi, I'm <span className="text-blue-400">{userName}</span>
            </h1>
            <p className="text-gray-300 text-lg sm:text-xl max-w-lg">
              Professional {jobTitle} creating digital solutions with precision and efficiency.
            </p>
            <div className="flex gap-4 pt-4">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-gray-700 hover:from-blue-700 hover:to-gray-800 text-white font-medium rounded transition-all duration-300 transform hover:scale-105">
                View My Work
              </button>
              <button className="px-8 py-3 border border-blue-400 text-blue-400 hover:bg-blue-400/10 font-medium rounded transition-all duration-300">
                Download CV
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 h-full max-w-xl relative hidden md:block">
          <Canvas 
            camera={{ position: [0, 2, 5], fov: 50 }}
            className="w-full h-96"
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Suspense fallback={null}>
              <OfficeModel scale={[0.8, 0.8, 0.8]} position={[0, -1, 0]} />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
            </Suspense>
          </Canvas>
        </div>
      </div>

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