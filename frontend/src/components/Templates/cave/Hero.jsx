import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
import * as THREE from 'three';

// Import  3D models
import Cave2 from '../../3DModels/Cave';
import Crystal from '../../3DModels/Crystal';
import Campfire from '../../3DModels/Campfire';
import Pickaxe from '../../3DModels/Pickaxe';
import Shovel from '../../3DModels/Shovel';
import Skull from '../../3DModels/Skull';
import floor from './floor.png';
import Lamp from '../../3DModels/Lamp';

// Auto-rotating camera component
function AutoRotatingCamera() {
  const { camera } = useThree();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime() * 0.1; // Slow rotation speed
    const radius = 60; // Doubled from 30 to zoom out twice as far
    const height = 12;
    
    // Limit rotation to 90 degrees total - smaller band view
    const maxAngle = (40 * Math.PI) / 360; // Convert 40e degrees to radians (45 degrees each side)
    const angle = Math.sin(time) * maxAngle; // Oscillates between -maxAngle and +maxAngle
    
    camera.position.x = Math.sin(angle) * radius;
    camera.position.z = Math.cos(angle) * radius;
    camera.position.y = height;
    camera.lookAt(0, -2, 0); // Look at campfire area
  });
  
  return null;
}

// Floor and Wall component with texture
function TexturedFloorAndWalls() {
  const floorTexture = useLoader(THREE.TextureLoader, floor);
  
  // Configure texture properties for better appearance
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(20, 20);
  floorTexture.anisotropy = 16;
  
  return (
    <>
      {/* Main cave floor with texture - increased opacity */}
      <mesh position={[0, -8, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial 
          map={floorTexture}
          transparent 
          opacity={0.4} 
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>
      
      {/* Secondary floor layer for depth - increased opacity */}
      <mesh position={[0, -7.8, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[180, 180]} />
        <meshStandardMaterial 
          map={floorTexture}
          color="#9a9a9a"
          transparent 
          opacity={0.25} 
          roughness={0.7}
          metalness={0.05}
        />
      </mesh>
      
      {/* Base foundation layer - increased opacity and lighter color */}
      <mesh position={[0, -8.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[250, 250]} />
        <meshStandardMaterial 
          map={floorTexture}
          color="#6a6a6a"
          transparent 
          opacity={0.2} 
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>
    </>
  );
}

// Single Crystal Component
function DecorativeCrystal({ position, color = "#8b5cf6", scale = [4, 4, 4] }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() + position[0]) * 0.2;
    }
  });
  
  return (
    <group ref={meshRef} position={position} scale={scale}>
      <Crystal />
      {/* Crystal glow effect - increased intensity */}
      <pointLight position={[0, 2, 0]} intensity={4} color={color} />
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.15} 
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// Mini 3D Model for cards
function MiniModel({ model, scale = [0.3, 0.3, 0.3], position = [0, 0, 0] }) {
  const [rotation, setRotation] = useState([0, 0, 0]);
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
    }
  });

  // Adjust scale based on model type
  const getModelScale = () => {
    if (model === 'pickaxe' || model === 'shovel') {
      return [2, 2, 2]; // Bigger scale for pickaxe and shovel
    }
    return scale; // Default scale for other models
  };

  const renderModel = () => {
    switch(model) {
      case 'pickaxe':
        return <Pickaxe />;
      case 'shovel':
        return <Shovel />;
      case 'crystal':
        return <Crystal />;
      case 'campfire':
        return <Campfire />;
      default:
        return null;
    }
  };

  return (
    <group 
      ref={groupRef}
      position={position}
      scale={getModelScale()}
      rotation={rotation}
    >
      <ambientLight intensity={1.2} />
      <pointLight position={[0.5, 0.5, 0.5]} intensity={0.8} />
      {renderModel()}
    </group>
  );
}

const Hero = ({ activeCard }) => {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-800 relative overflow-hidden">
      <Canvas className="w-full h-full" shadows>
        {/* Auto-rotating camera */}
        <AutoRotatingCamera />
        
        {/* Enhanced lighting setup - significantly brighter */}
        <ambientLight intensity={0.8} color="#6366f1" />
        
        {/* Main directional light - much brighter */}
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={2.5} 
          color="#ffffff"
          castShadow 
          shadow-mapSize={[2048, 2048]}
        />
        
        {/* Additional directional lights for better coverage */}
        <directionalLight 
          position={[-10, 10, 5]} 
          intensity={1.5} 
          color="#e0e7ff"
        />
        
        <directionalLight 
          position={[0, 10, -10]} 
          intensity={1.8} 
          color="#f8fafc"
        />
        
        {/* Campfire lighting - enhanced */}
        <pointLight position={[0, 2, 0]} intensity={5} color="#ff6b35" />
        <pointLight position={[0, 0, 0]} intensity={3} color="#ffa500" />
        
        {/* Additional area lights for better illumination */}
        <pointLight position={[20, 10, 20]} intensity={2} color="#ffffff" />
        <pointLight position={[-20, 10, 20]} intensity={2} color="#ffffff" />
        <pointLight position={[20, 10, -20]} intensity={2} color="#ffffff" />
        <pointLight position={[-20, 10, -20]} intensity={2} color="#ffffff" />
        
        {/* Skull spotlight - brighter */}
        <spotLight 
          position={[30, 15, -30]} 
          target-position={[30, 5, -40]}
          angle={Math.PI / 6}
          penumbra={0.3}
          intensity={6}
          color="#ffffff"
          castShadow
        />
        
        {/* Additional skull accent light - brighter */}
        <pointLight position={[30, 8, -40]} intensity={3} color="#f0f0ff" />
        
        {/* Atmospheric lighting - much brighter */}
        <spotLight 
          position={[0, 15, 0]} 
          target-position={[0, -8, 0]}
          angle={Math.PI / 2}
          penumbra={0.8}
          intensity={1.5}
          color="#8b5cf6"
          castShadow
        />
        
        {/* Additional ceiling lights for overall brightness */}
        <pointLight position={[0, 20, 0]} intensity={2} color="#ffffff" />
        <pointLight position={[15, 18, 15]} intensity={1.5} color="#e0e7ff" />
        <pointLight position={[-15, 18, 15]} intensity={1.5} color="#e0e7ff" />
        <pointLight position={[15, 18, -15]} intensity={1.5} color="#e0e7ff" />
        <pointLight position={[-15, 18, -15]} intensity={1.5} color="#e0e7ff" />
        
        {/* Cave Interior Model */}
        <group position={[0, -8, -45]} scale={[15, 15, 15]}>
          <Cave2 />
        </group>

        {/* Central Campfire */}
        <group position={[0, -6.5, 0]} scale={[0.08, 0.08, 0.08]}>
          <Campfire />
        </group>
        
        {/* Dinosaur Skeleton - positioned to the left of the campfire */}
        <group position={[50, 0, 10]} scale={[7, 7, 7]} rotation={[0,0, 0]}>
          <Crystal />
        </group>

        <group position={[-35, 0, 10]} scale={[7, 7, 7]} rotation={[0,0, 0]}>
          <Crystal />
        </group>
        {/* Skull - positioned to the right of the campfire with enhanced lighting */}
        <group position={[30, 5, -40]} scale={[0.05, 0.05, 0.05]} rotation={[0, -Math.PI / 3, 0]}>
          <Skull />
        </group>
        
        {/* Pickaxe - positioned near the campfire */}
        <group position={[45, 5, 8]} scale={[4, 4, 4]} rotation={[0.2, Math.PI / 4, 10]}>
          <Pickaxe />
        </group>
        
        {/* Shovel - positioned opposite to pickaxe */}
        <group position={[12, -4.5, -10]} scale={[4, 4, 4]} rotation={[0, 0, -0.3]}>
          <Shovel />
        </group>

        <group position={[-30, -4.5, -10]} scale={[16, 16, 16]} rotation={[0, 0, 0]}>
          <Lamp />
        </group>
    
        {/* Textured Floor and Walls Component */}
        <TexturedFloorAndWalls />
      </Canvas>
    </div>
  );
};

export { MiniModel };
export default Hero;