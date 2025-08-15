
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Plane, Box } from '@react-three/drei';
import * as THREE from 'three';

const CaveEnvironment = () => {
  const caveRef = useRef();
  
  useFrame((state) => {
    if (caveRef.current) {
      caveRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={caveRef}>
      {/* Cave walls */}
      <Sphere args={[50, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#2d1810" 
          side={THREE.BackSide}
          roughness={0.8}
          metalness={0.1}
        />
      </Sphere>
      
      {/* Cave floor */}
      <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -25, 0]}>
        <meshStandardMaterial color="#1a0f08" roughness={0.9} />
      </Plane>
      
      {/* Stalactites */}
      {[...Array(15)].map((_, i) => (
        <group key={i}>
          <Box 
            args={[0.5, Math.random() * 8 + 2, 0.5]} 
            position={[
              (Math.random() - 0.5) * 80,
              20 - (Math.random() * 8 + 2) / 2,
              (Math.random() - 0.5) * 80
            ]}
          >
            <meshStandardMaterial color="#3d2817" roughness={0.8} />
          </Box>
        </group>
      ))}
      
      {/* Stalagmites */}
      {[...Array(10)].map((_, i) => (
        <group key={i}>
          <Box 
            args={[0.8, Math.random() * 6 + 1, 0.8]} 
            position={[
              (Math.random() - 0.5) * 70,
              -25 + (Math.random() * 6 + 1) / 2,
              (Math.random() - 0.5) * 70
            ]}
          >
            <meshStandardMaterial color="#2d1810" roughness={0.9} />
          </Box>
        </group>
      ))}
    </group>
  );
};

export default CaveEnvironment;