
import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

import CaveEnvironment from '../../3DModels/CaveEnvironment';
import Hero from './Hero';           
import About from './About';         
import Experience from './Experience'; 
import Contact from './Contact';     
import LoadingScreen from './LoadingScreen'; 

// Import hook
import useCvData from '../../../hooks/useCVData';

// Styles
import './index.css';

// Camera Controller Component - ADDED (needed for smooth camera transitions)
const CameraController = ({ targetPosition, currentSection }) => {
  const { camera, controls } = useThree();
  const targetRef = useRef(targetPosition);
  const isAnimating = useRef(false);
  
  useEffect(() => {
    targetRef.current = targetPosition;
    isAnimating.current = true;
    
    // Stop animation after some time
    const timer = setTimeout(() => {
      isAnimating.current = false;
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [targetPosition]);
  
  useFrame(() => {
    if (isAnimating.current) {
      // Smooth camera position animation
      camera.position.lerp(
        new THREE.Vector3(targetRef.current[0], targetRef.current[1], targetRef.current[2]),
        0.05
      );
      
      // Update controls target based on section
      if (controls) {
        let target = new THREE.Vector3(0, 0, 0);
        switch(currentSection) {
          case 'about':
            target.set(-15, 0, -10);
            break;
          case 'experience':
            target.set(15, 0, -10);
            break;
          case 'contact':
            target.set(0, 0, 15);
            break;
          default:
            target.set(0, 0, 0);
        }
        controls.target.lerp(target, 0.05);
        controls.update();
      }
    }
  });
  
  return null;
};

const Index = () => {
  const [currentSection, setCurrentSection] = useState('hero');
  const [cameraPosition, setCameraPosition] = useState([0, 0, 10]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const cvData = useCvData();

  const handleNavigation = (section) => {
    if (isTransitioning) return; // Prevent multiple rapid clicks
    
    setIsTransitioning(true);
    setCurrentSection(section);
    
    // Animate camera to different positions based on section
    switch(section) {
      case 'about':
        setCameraPosition([-12, 2, 0]); // ADJUSTED for better view
        break;
      case 'experience':
        setCameraPosition([12, 2, 0]); // ADJUSTED for better view
        break;
      case 'contact':
        setCameraPosition([0, 2, 20]); // ADJUSTED for better view
        break;
      default:
        setCameraPosition([0, 0, 10]);
    }
    
    // Re-enable transitions after animation
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1500);
  };

  const handleBack = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentSection('hero');
    setCameraPosition([0, 0, 10]);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1500);
  };

  if (!cvData) {
    return <LoadingScreen />;
  }

  return (
    <div className="app">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }} // FIXED: Don't use state for initial camera position
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        {/* Lighting Setup */}
        <ambientLight intensity={0.3} color="#ffffff" />
        
        {/* Main directional light */}
        <directionalLight
          position={[10, 15, 10]}
          intensity={1}
          color="#ffffff"
          castShadow
        />
        
        {/* Colored accent lights */}
        <pointLight position={[0, 10, 0]} intensity={0.8} color="#ffd23e" />
        <pointLight position={[-20, 5, -10]} intensity={0.6} color="#667eea" />
        <pointLight position={[20, 5, -10]} intensity={0.6} color="#f5576c" />
        <pointLight position={[0, 5, 20]} intensity={0.6} color="#4facfe" />
        
        {/* Environment */}
        <Environment preset="night" />
        
        {/* ADDED: Camera Controller for smooth transitions */}
        <CameraController 
          targetPosition={cameraPosition} 
          currentSection={currentSection} 
        />
        
        <Suspense fallback={null}>
          {/* Cave Environment */}
          <CaveEnvironment />
          
          {/* Render current section */}
          {currentSection === 'hero' && (
            <Hero cvData={cvData} onNavigate={handleNavigation} />
          )}
          {currentSection === 'about' && (
            <About cvData={cvData} onBack={handleBack} />
          )}
          {currentSection === 'experience' && (
            <Experience cvData={cvData} onBack={handleBack} />
          )}
          {currentSection === 'contact' && (
            <Contact cvData={cvData} onBack={handleBack} />
          )}
          
          {/* Orbit Controls */}
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            maxDistance={30}
            minDistance={5}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 6}
            autoRotate={currentSection === 'hero' && !isTransitioning}
            autoRotateSpeed={0.5}
            dampingFactor={0.05}
            enableDamping={true}
          />
        </Suspense>
      </Canvas>
      
      {/* UI Controls */}
      <div className="ui-controls">
        <p>🕹️ Use mouse to explore the cave</p>
        <p>🖱️ Click navigation buttons to explore sections</p>
        {isTransitioning && <p>🎬 Transitioning to {currentSection}...</p>}
      </div>
      
      {/* Section indicator */}
      <div className="section-indicator">
        Current: {currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}
      </div>
    </div>
  );
};

export default Index;