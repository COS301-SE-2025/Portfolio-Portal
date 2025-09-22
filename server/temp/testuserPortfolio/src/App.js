import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import Model from "./components/3DModels/Forest";
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Contact from './components/Contact';
import './App.css';

function App() {
  return (
    <div className="relative z-0 bg-[#0e0e2c] text-white">
      {/* 3D forest background */}
      <div className="fixed top-0 left-0 w-full h-screen -z-10">
        <Canvas
          camera={{
            position: [-30, 5, 0], // negative x-val to position on the left side
            fov: 45, // field of view
            near: 0.1, // near clipping plane
            far: 1000, // far clipping plane
          }}
          style={{ background: "#0e0e2c" }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Suspense fallback={null}>
            <group position={[0, -5, 0]} scale={[1.5, 1.5, 1.5]}>
              <Model />
            </group>
            <Environment preset="forest" />
            <OrbitControls
              enablePan={false}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 2}
              minDistance={8} // min zoom distance
              maxDistance={25} // max zoom distance
              autoRotate
              autoRotateSpeed={0.5}
            />
          </Suspense>
        </Canvas>
      </div>
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <About />
        <Experience />
        <Contact />
      </div>
    </div>
  );
}

export default App;