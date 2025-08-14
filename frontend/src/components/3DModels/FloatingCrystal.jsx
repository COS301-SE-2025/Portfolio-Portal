import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';

const FloatingCrystal = ({ position, color, scale = 1 }) => {
  const crystalRef = useRef();
  
  useFrame((state) => {
    if (crystalRef.current) {
      crystalRef.current.rotation.x += 0.01;
      crystalRef.current.rotation.y += 0.02;
      crystalRef.current.position.y += Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.01;
    }
  });

  return (
    <group ref={crystalRef} position={position} scale={scale}>
      <Box args={[0.5, 1.5, 0.5]}>
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={0.7} 
          emissive={color}
          emissiveIntensity={0.2}
        />
      </Box>
      <pointLight position={[0, 0, 0]} color={color} intensity={0.5} distance={10} />
    </group>
  );
};

export default FloatingCrystal;