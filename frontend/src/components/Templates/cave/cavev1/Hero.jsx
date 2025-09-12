import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
import * as THREE from 'three';

import Cave2 from '../../../3DModels/Cave';
import Crystal from '../../../3DModels/Crystal';
import Campfire from '../../../3DModels/Campfire';
import Pickaxe from '../../../3DModels/Pickaxe';
import Shovel from '../../../3DModels/Shovel';
import Skull from '../../../3DModels/Skull';
import floor from './floor.png';
import Lamp from '../../../3DModels/Lamp';

function AutoRotatingCamera() {
  const { camera } = useThree();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime() * 0.1;
    const radius = 60;
    const height = 12;
    
    const maxAngle = (40 * Math.PI) / 360;
    const angle = Math.sin(time) * maxAngle;
    
    camera.position.x = Math.sin(angle) * radius;
    camera.position.z = Math.cos(angle) * radius;
    camera.position.y = height;
    camera.lookAt(0, -2, 0);
  });
  
  return null;
}

function TexturedFloorAndWalls() {
  const floorTexture = useLoader(THREE.TextureLoader, floor);
  
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(20, 20);
  floorTexture.anisotropy = 16;
  
  return (
    <>
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

function MiniModel({ model, scale = [0.3, 0.3, 0.3], position = [0, 0, 0] }) {
  const [rotation, setRotation] = useState([0, 0, 0]);
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
    }
  });

  const getModelScale = () => {
    if (model === 'pickaxe' || model === 'shovel') {
      return [2, 2, 2];
    }
    return scale;
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
        <AutoRotatingCamera />
        
        <ambientLight intensity={0.8} color="#6366f1" />
        
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={2.5} 
          color="#ffffff"
          castShadow 
          shadow-mapSize={[2048, 2048]}
        />
        
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
        
        <pointLight position={[0, 2, 0]} intensity={5} color="#ff6b35" />
        <pointLight position={[0, 0, 0]} intensity={3} color="#ffa500" />
        
        <pointLight position={[20, 10, 20]} intensity={2} color="#ffffff" />
        <pointLight position={[-20, 10, 20]} intensity={2} color="#ffffff" />
        <pointLight position={[20, 10, -20]} intensity={2} color="#ffffff" />
        <pointLight position={[-20, 10, -20]} intensity={2} color="#ffffff" />
        
        <spotLight 
          position={[30, 15, -30]} 
          target-position={[30, 5, -40]}
          angle={Math.PI / 6}
          penumbra={0.3}
          intensity={6}
          color="#ffffff"
          castShadow
        />
        
        <pointLight position={[30, 8, -40]} intensity={3} color="#f0f0ff" />
        
        <spotLight 
          position={[0, 15, 0]} 
          target-position={[0, -8, 0]}
          angle={Math.PI / 2}
          penumbra={0.8}
          intensity={1.5}
          color="#8b5cf6"
          castShadow
        />
        
        <pointLight position={[0, 20, 0]} intensity={2} color="#ffffff" />
        <pointLight position={[15, 18, 15]} intensity={1.5} color="#e0e7ff" />
        <pointLight position={[-15, 18, 15]} intensity={1.5} color="#e0e7ff" />
        <pointLight position={[15, 18, -15]} intensity={1.5} color="#e0e7ff" />
        <pointLight position={[-15, 18, -15]} intensity={1.5} color="#e0e7ff" />
        
      
    
        <TexturedFloorAndWalls />
      </Canvas>
    </div>
  );
};

export { MiniModel };
export default Hero;
