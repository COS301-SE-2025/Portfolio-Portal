//frontend/src/pages/ForestPage.jsx
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import Model from "../components/3DModels/Forest";
import Navbar from "../components/Templates/forest/Navbar";
import Hero from "../components/Templates/forest/Hero";
import About from "../components/Templates/forest/About";
import Experience from "../components/Templates/forest/Experience";
import Contact from "../components/Templates/forest/Contact";

const ForestPage = () => {
  const [searchParams] = useSearchParams();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    // Check if user just returned from GitHub authentication
    const githubAuth = searchParams.get('github_auth');
    if (githubAuth === 'success') {
      setShowSuccessMessage(true);
      // Remove the parameter from URL without page reload
      const newUrl = new URL(window.location);
      newUrl.searchParams.delete('github_auth');
      newUrl.searchParams.delete('user');
      window.history.replaceState({}, '', newUrl);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    }
  }, [searchParams]);

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
              {" "}
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
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>GitHub authentication successful! You can now deploy your portfolio.</span>
            </div>
          </div>
        )}
        
        <Navbar />
        <Hero />
        <About />
        <Experience />
        <Contact />
      </div>
    </div>
  );
};

export default ForestPage;
