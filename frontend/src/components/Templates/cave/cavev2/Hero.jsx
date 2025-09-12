import React, { useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { motion } from "framer-motion";
import { fadeIn } from "../../../../utils/motion";
import useCvData from "../../../../hooks/useCVData";
import * as THREE from "three";

// Import 3D Models
import Cave2 from "../../../3DModels/Cave";
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
    <mesh position={[0, -8, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
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

// Professional Cave Scene
function CaveScene() {
  const caveRef = useRef();
  const crystal1Ref = useRef();
  const crystal2Ref = useRef();
  
  useFrame((state) => {
    // Subtle cave rotation
    if (caveRef.current) {
      caveRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.08) * 0.01;
    }
    
    // Crystal animations
    if (crystal1Ref.current) {
      crystal1Ref.current.rotation.y += 0.008;
      crystal1Ref.current.position.y = -2 + Math.sin(state.clock.getElapsedTime()) * 0.15;
    }
    
    if (crystal2Ref.current) {
      crystal2Ref.current.rotation.y -= 0.006;
      crystal2Ref.current.position.y = -1.8 + Math.sin(state.clock.getElapsedTime() + 1) * 0.12;
    }
  });

  return (
    <group>
      {/* Main Cave Model - Centerpiece */}
      <group ref={caveRef} position={[0, -8, -35]} scale={[10, 10, 10]}>
        <Cave2 />
      </group>
      

     
    </group>
  );
}

const Hero = () => {
  const { name, description } = useCvData() || {};

  return (
    <section className="relative w-full h-screen mx-auto overflow-hidden">
      {/* 3D Background Scene */}
      <div className="absolute inset-0">
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
          
          {/* 3D Cave Scene */}
          <CaveScene />
        </Canvas>
      </div>

      {/* Content Layout - Forest Template Structure */}
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
  );
};

export default Hero;