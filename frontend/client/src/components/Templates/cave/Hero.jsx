import { Suspense } from "react";
import DeskSetup from "../../3DModels/cave/DeskSetup";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import useCvData from "../../../hooks/useCVData";

const Hero = () => {
  const { cvData } = useCvData() || {};

  return (
    <section className="relative w-full h-screen mx-auto flex items-center overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/30">
      {/* Professional cave background */}
      <div className="absolute inset-0">
        {/* Subtle cave pattern */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-gradient-to-r from-blue-100/30 to-purple-100/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full bg-gradient-to-r from-blue-100/20 to-cyan-100/10 blur-3xl animate-pulse delay-1000"></div>

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 z-10 flex items-center justify-between h-full">
        {/* Left Content */}
        <div className="flex-1 max-w-2xl">
          <div className="space-y-6">
            <h1 className="text-6xl lg:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 leading-tight">
              {cvData.name || "John Doe"}
            </h1>
            <p className="text-2xl lg:text-3xl font-light text-gray-700 mb-8 tracking-wide">
              Full stack developer & designer
            </p>
            <p className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
              Creating digital experiences with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 font-semibold">
                professional excellence
              </span>
            </p>

            {/* Call to action button */}
            <div className="pt-4">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-medium rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/15">
                Explore My Work
              </button>
            </div>
          </div>
        </div>

        {/* Right Content - cave Desk Setup */}
        <div className="flex-1 h-full max-w-2xl relative z-20">
          <div className="w-full h-full min-h-[600px] relative">
            <Canvas
              camera={{ position: [0, 0, 5], fov: 45 }}
              className="w-full h-full"
              gl={{ antialias: true, alpha: true }}
              dpr={[1, 2]}
            >
              {/* Professional cave Lighting */}
              <ambientLight intensity={0.8} color="#ffffff" />

              <directionalLight
                position={[10, 10, 5]}
                intensity={1.2}
                color="#ffffff"
                castShadow
              />

              <directionalLight
                position={[-5, 5, 5]}
                intensity={0.6}
                color="#4f46e5"
              />

              <directionalLight
                position={[0, -10, -5]}
                intensity={0.8}
                color="#ec4899"
              />

              <Environment preset="apartment" />

              <Suspense fallback={null}>
                <DeskSetup />
                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  maxPolarAngle={Math.PI / 2}
                  minPolarAngle={Math.PI / 4}
                  autoRotate={true}
                  autoRotateSpeed={1}
                  dampingFactor={0.05}
                  enableDamping={true}
                />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
