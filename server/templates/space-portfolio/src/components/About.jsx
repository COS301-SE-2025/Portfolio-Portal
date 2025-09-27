import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import Astronaught from "./3DModels/Astronaught";
import portfolioData from '../data/portfolioData.js';

const About = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Starfield Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-blue-900/20 to-black"></div>
        {/* Static stars */}
        {[...Array(200)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute w-px h-px bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
              animation: `twinkle ${2 + Math.random() * 3}s infinite`,
            }}
          />
        ))}

        {/* Shooting stars */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`shooting-${i}`}
            className="absolute w-px h-px bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 30}%`,
              animation: `shootingStar ${3 + Math.random() * 4}s infinite`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}

        {/* Nebula effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-blue-500/5 rounded-full blur-3xl animate-pulse opacity-70"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-500/8 to-purple-500/8 rounded-full blur-3xl animate-pulse delay-1000 opacity-60"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-cyan-500/6 to-blue-500/6 rounded-full blur-3xl animate-pulse delay-2000 opacity-50"></div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes shootingStar {
          0% {
            transform: translateX(-100px) translateY(100px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(100vw) translateY(-100px);
            opacity: 0;
          }
        }
      `}</style>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl lg:text-5xl font-bold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          About Me
        </h2>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* 3D Character Section */}
          <div className="w-full lg:w-1/2 relative">
            <div className="h-96 lg:h-[500px] relative">
              <Canvas
                camera={{ position: [0, 0, 4], fov: 50 }}
                shadows
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
              >
                {/* Enhanced Lighting setup */}
                <ambientLight intensity={0.4} />
                <directionalLight
                  position={[10, 10, 5]}
                  intensity={0.8}
                  castShadow
                  shadow-mapSize={[2048, 2048]}
                />
                <pointLight
                  position={[-10, -10, -10]}
                  intensity={0.6}
                  color="#8b5cf6"
                />
                <pointLight
                  position={[10, 0, 10]}
                  intensity={0.6}
                  color="#06b6d4"
                />
                <pointLight
                  position={[0, 10, -10]}
                  intensity={0.4}
                  color="#f59e0b"
                />

                <Environment preset="night" />

                <Suspense fallback={null}>
                  <Astronaught />
                  <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    enableRotate={true}
                    autoRotate={true}
                    autoRotateSpeed={-0.8}
                  />
                </Suspense>
              </Canvas>
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="space-y-6">
              <p className="text-lg lg:text-xl text-gray-300 leading-relaxed">
                {portfolioData.header.summary || "Passionate professional dedicated to creating innovative solutions and pushing the boundaries of technology."}
              </p>
            </div>

            {/* Enhanced Skills Section */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-200 mb-4">
                Technologies & Skills
              </h3>
              <div className="flex flex-wrap gap-3">
                {portfolioData.skills && portfolioData.skills.map((skill, index) => {
                  // Cycle through a set of gradient classes for visual variety
                  const gradients = [
                    "from-blue-500 to-cyan-500",
                    "from-yellow-500 to-orange-500",
                    "from-teal-500 to-blue-500",
                    "from-green-500 to-emerald-500",
                    "from-purple-500 to-pink-500",
                    "from-indigo-500 to-purple-500",
                  ];
                  const gradient = gradients[index % gradients.length]; // Cycle through gradients

                  return (
                    <span
                      key={`skill-${index}`}
                      className={`px-4 py-2 bg-gradient-to-r ${gradient} bg-opacity-20 border border-gray-600/50 rounded-full text-sm text-gray-300 backdrop-blur-sm hover:scale-105 transition-transform duration-200 cursor-default`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {typeof skill === 'string' ? skill : skill.name}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Call to action */}
            <div className="mt-8 pt-6">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25">
                Let's Work Together
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating particles - closer and more magical */}
      <div className="absolute inset-0 pointer-events-none z-5">
        {[...Array(25)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.6 + Math.random() * 0.4,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-10px) translateX(-15px);
            opacity: 1;
          }
          75% {
            transform: translateY(-25px) translateX(5px);
            opacity: 0.6;
          }
        }
      `}</style>
    </section>
  );
};

export default About;