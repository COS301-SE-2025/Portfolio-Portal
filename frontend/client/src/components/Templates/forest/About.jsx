//Templates/forest/About.js
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import forestPerson from "../../3DModels/forest/forestPerson";
import useCvData from "../../../hooks/useCVData";

const About = () => {
  const { cvData } = useCvData() || {};
  return (
    <section id="about" className="py-24 relative overflow-hidden bg-white">
      {/* forest Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-gray-50 via-blue-50/20 to-gray-100">
        {/* Paper texture effect */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl lg:text-5xl font-bold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
          About Me
        </h2>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* 3D Professional Section */}
          <div className="w-full lg:w-1/2 relative">
            <div className="h-96 lg:h-[500px] relative border-2 border-gray-200 rounded-xl shadow-md">
              <Canvas
                camera={{ position: [0, 0, 4], fov: 50 }}
                shadows
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
              >
                {/* forest Lighting */}
                <ambientLight intensity={0.6} />
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

                <Environment preset="city" />

                <Suspense fallback={null}>
                  <forestPerson />
                  <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    enableRotate={true}
                    autoRotate={true}
                    autoRotateSpeed={0.5}
                  />
                </Suspense>
              </Canvas>
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="space-y-6">
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
                {cvData?.about}
              </p>
            </div>

            {/* Skills Section */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Technologies & Skills
              </h3>
              <div className="flex flex-wrap gap-3">
                {cvData?.skills?.map((skill, index) => {
                  const gradients = [
                    "from-blue-600 to-blue-400",
                    "from-gray-700 to-gray-500",
                    "from-purple-600 to-purple-400",
                    "from-teal-600 to-teal-400",
                    "from-pink-600 to-pink-400",
                    "from-indigo-600 to-indigo-400",
                  ];
                  const gradient = gradients[index % gradients.length];

                  return (
                    <span
                      key={`skill-${index}`}
                      className={`px-4 py-2 bg-gradient-to-r ${gradient} bg-opacity-10 border border-gray-300 rounded-full text-sm text-gray-700 backdrop-blur-sm hover:scale-105 transition-transform duration-200 cursor-default`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Call to action */}
            <div className="mt-8 pt-6">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-medium rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-md">
                Let's Work Together
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
