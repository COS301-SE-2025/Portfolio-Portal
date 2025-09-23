import React, { useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { motion } from "framer-motion";
import { fadeIn } from "../../../../utils/motion";
import useCvData from "../../../../hooks/useCVData";
import * as THREE from "three";

// Import 3D Models
import Cave2 from "../../../3DModels/Cave2";
import floor from "./floor.png";

// Textured Floor Component
function TexturedFloor() {
  const floorTexture = useLoader(THREE.TextureLoader, floor);
  
  React.useMemo(() => {
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(15, 15);
    floorTexture.anisotropy = 16;
  }, [floorTexture]);

  return (
    <mesh position={[0, -8, 0]} rotation={[-Math.PI / 2, 0, 0]} >
      <planeGeometry args={[150, 150]} />
      <meshStandardMaterial 
        map={floorTexture}
        transparent 
        opacity={0.6} 
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
}

// Static Cave Scene (removed animations)
function CaveScene() {
  return (
    <group>
      {/* Main Cave Model - Centerpiece - Now Static and Much Bigger */}
      <group position={[0, -15, -45]} scale={[25, 25, 25]}>
        <Cave2 />
      </group>
    </group>
  );
}

const Hero = () => {
  const { name, description } = useCvData() || {};

  return (
    <>
      {/* Fixed 3D Background Scene - Stays in place while content scrolls */}
      <div className="fixed inset-0 w-full h-screen">
        <Canvas 
          camera={{ position: [0, 8, 25], fov: 75 }}
          shadows
          gl={{ antialias: true }}
        >
          {/* Professional Lighting Setup */}
          <ambientLight intensity={0.6} color="#6366f1" />
          
          <directionalLight
            position={[10, 15, 10]}
            intensity={1.5}
            color="#ffffff"
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          
          <directionalLight
            position={[-8, 12, 8]}
            intensity={1}
            color="#e0e7ff"
          />
          
          <pointLight position={[0, 5, 0]} intensity={2.5} color="#8b5cf6" />
          <pointLight position={[15, 8, 15]} intensity={1.5} color="#ffffff" />
          <pointLight position={[-15, 8, 15]} intensity={1.5} color="#ffffff" />
          
          {/* 3D Cave Scene - Now Static */}
          <CaveScene />
        </Canvas>
      </div>

      {/* Scrollable Content Section - This will scroll over the fixed 3D scene */}
      <section className="relative w-full min-h-screen mx-auto overflow-hidden bg-black/40 backdrop-blur-sm">
        {/* Content Layout */}
        <div className="absolute inset-0 top-[120px] max-w-7xl mx-auto px-6 flex flex-row items-start gap-5">
          <div className="flex flex-col justify-center items-center mt-5">
            <div className="w-5 h-5 rounded-full bg-purple-400" />
            <div className="w-1 sm:h-80 h-40 purple-gradient" />
          </div>

          <div>
            <motion.h1
              variants={fadeIn("up", "spring", 0.5, 1)}
              initial="hidden"
              animate="show"
              className="text-white font-black text-5xl sm:text-6xl lg:text-7xl"
            >
              Hi, I'm <span className="text-purple-400">{name || "Explorer"}</span>
            </motion.h1>
            <motion.p
              variants={fadeIn("up", "spring", 0.7, 1)}
              initial="hidden"
              animate="show"
              className="text-white mt-4 text-lg sm:text-xl max-w-3xl"
            >
              {description ||
                "Digital cave explorer crafting immersive experiences from the depths of cutting-edge technology."}
            </motion.p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center">
          <a href="#about">
            <div className="w-[35px] h-[64px] rounded-3xl border-4 border-purple-400 flex justify-center items-start p-2">
              <motion.div
                animate={{ y: [0, 24, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                className="w-3 h-3 rounded-full bg-purple-400 mb-1"
              />
            </div>
          </a>
        </div>
      </section>
    </>
  );
};

export default Hero;