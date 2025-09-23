import { Suspense } from "react";
import ColoredEarth from "./3DModels/ColoredEarth";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import portfolioData from '../data/portfolioData.js';

const Hero = () => {
  const { header } = portfolioData;

  return (
    <section className="relative w-full h-screen mx-auto flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/30">
      {/* Enhanced background with animated elements */}
      <div className="absolute inset-0">
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-48 h-48 rounded-full bg-gradient-to-r from-indigo-500/15 to-purple-500/10 blur-3xl animate-pulse delay-2000"></div>

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 z-10 flex items-center justify-between h-full">
        {/* Left Content */}
        <div className="flex-1 max-w-2xl">
          <div className="space-y-6">
            <h1 className="text-6xl lg:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 leading-tight animate-pulse">
              {header.name}
            </h1>
            <p className="text-2xl lg:text-3xl font-light text-gray-200 mb-8 tracking-wide">
              {header.title}
            </p>

            {/* Call to action button */}
            <div className="pt-4">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25">
                Explore My Work
              </button>
            </div>
          </div>
        </div>

        {/* Right Content - Enhanced 3D Canvas */}
        <div className="flex-1 h-full max-w-2xl relative z-20">
          <div className="w-full h-full min-h-[600px] relative">
            <Canvas
              camera={{ position: [0, 0, 5], fov: 45 }}
              className="w-full h-full"
              gl={{ antialias: true, alpha: true }}
              dpr={[1, 2]}
            >
              {/* Enhanced Lighting Setup */}
              <ambientLight intensity={0.4} color="#ffffff" />

              {/* Key light - main illumination */}
              <directionalLight
                position={[10, 10, 5]}
                intensity={1.2}
                color="#ffffff"
                castShadow
              />

              {/* Fill light - softer secondary light */}
              <directionalLight
                position={[-5, 5, 5]}
                intensity={0.6}
                color="#4f46e5"
              />

              {/* Rim light - creates edge highlighting */}
              <directionalLight
                position={[0, -10, -5]}
                intensity={0.8}
                color="#ec4899"
              />

              {/* Point lights for colorful accents */}
              <pointLight
                position={[5, 0, 5]}
                intensity={0.5}
                color="#06b6d4"
              />
              <pointLight
                position={[-5, 0, 5]}
                intensity={0.5}
                color="#8b5cf6"
              />
              <pointLight
                position={[0, 5, -5]}
                intensity={0.3}
                color="#f59e0b"
              />

              {/* Environment for realistic reflections */}
              <Environment preset="city" />

              <Suspense fallback={null}>
                <ColoredEarth />
                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  maxPolarAngle={Math.PI / 2}
                  minPolarAngle={Math.PI / 4}
                  autoRotate={true}
                  autoRotateSpeed={2}
                  dampingFactor={0.05}
                  enableDamping={true}
                />
              </Suspense>
            </Canvas>

            {/* Glow effect overlay */}
            <div className="absolute inset-0 pointer-events-none z-10">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Scroll Down Mouse Icon */}
      <div className="absolute bottom-10 w-full flex justify-center">
        <a href="#about" className="animate-bounce">
          <div className="w-10 h-16 border-4 border-purple-400 rounded-full flex justify-center items-start p-2">
            <div className="w-3 h-3 rounded-full bg-purple-400" />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
