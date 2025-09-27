import React from "react";
import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import portfolioData from "../data/portfolioData";

// Import 3D Models
import Cave2 from "./3DModels/Cave2";

// Simple fadeIn animation function
const fadeIn = (direction, type, delay, duration) => ({
  hidden: {
    x: direction === "left" ? -100 : direction === "right" ? 100 : 0,
    y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
    opacity: 0,
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      type: type,
      delay: delay,
      duration: duration,
      ease: "easeOut",
    },
  },
});

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
  const { name, summary } = portfolioData.header;

  return (
    <>
      {/* Fixed 3D Background Scene - Stays in place while content scrolls */}
      <div className="fixed inset-0 w-full h-screen">
        <Canvas 
          camera={{ position: [0, 8, 25], fov: 75 }}
          shadows
          gl={{ antialias: true }}
        >
          {/* Professional Lighting Setup - Green Tinted */}
          <ambientLight intensity={0.6} color="#10b981" />
          
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
            color="#f0fdf4"
          />
          
          <pointLight position={[0, 5, 0]} intensity={2.5} color="#059669" />
          <pointLight position={[15, 8, 15]} intensity={1.5} color="#ffffff" />
          <pointLight position={[-15, 8, 15]} intensity={1.5} color="#ffffff" />
          
          {/* 3D Cave Scene - Now Static */}
          <CaveScene />
        </Canvas>
      </div>

      {/* Scrollable Content Section - This will scroll over the fixed 3D scene */}
      <section className="relative w-full min-h-screen mx-auto overflow-hidden bg-slate-900/60 backdrop-blur-sm">
        {/* Content Layout */}
        <div className="absolute inset-0 top-[120px] max-w-7xl mx-auto px-6 flex flex-row items-start gap-5">
          <div className="flex flex-col justify-center items-center mt-5">
            <div className="w-5 h-5 rounded-full bg-emerald-500" />
            <div className="w-1 sm:h-80 h-40 green-gradient" />
          </div>

          <div>
            <motion.h1
              variants={fadeIn("up", "spring", 0.5, 1)}
              initial="hidden"
              animate="show"
              className="text-white font-black text-5xl sm:text-6xl lg:text-7xl"
            >
              Hi, I'm <span className="text-emerald-400">{name || "Explorer"}</span>
            </motion.h1>
            <motion.p
              variants={fadeIn("up", "spring", 0.7, 1)}
              initial="hidden"
              animate="show"
              className="text-slate-200 mt-4 text-lg sm:text-xl max-w-3xl"
            >
              {summary || "Digital cave explorer crafting immersive experiences from the depths of cutting-edge technology."}
            </motion.p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center">
          <a href="#about">
            <div className="w-[35px] h-[64px] rounded-3xl border-4 border-emerald-500 flex justify-center items-start p-2">
              <motion.div
                animate={{ y: [0, 24, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                className="w-3 h-3 rounded-full bg-emerald-500 mb-1"
              />
            </div>
          </a>
        </div>
      </section>
    </>
  );
};

export default Hero;