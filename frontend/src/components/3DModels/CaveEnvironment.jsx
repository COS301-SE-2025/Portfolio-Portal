import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Plane, Box } from '@react-three/drei';
import * as THREE from 'three';
import FloatingCrystal from './FloatingCrystal';

const CaveEnvironment = () => {
  const caveRef = useRef();
  
  // Generate crystal positions around the outer perimeter of the cave wall
  const crystalPositions = useMemo(() => {
    const positions = [];
    const crystalCount = 25; // Adjust this number for more/fewer crystals
    const caveRadius = 45; // Slightly smaller than cave wall radius (50) for embedding
    
    for (let i = 0; i < crystalCount; i++) {
      // Distribute crystals evenly around the perimeter
      const theta = (i / crystalCount) * Math.PI * 2; // Even distribution around Y axis
      
      // Add some vertical variation to avoid a perfect ring
      const yOffset = (Math.random() - 0.5) * 30; // Random Y between -15 and 15
      
      // Add slight radius variation to make it more natural
      const radiusVariation = caveRadius + (Math.random() - 0.5) * 8; // Slight radius variation
      
      // Convert to cartesian coordinates - positioned on the cave wall
      const x = radiusVariation * Math.cos(theta);
      const y = yOffset;
      const z = radiusVariation * Math.sin(theta);
      
      // Random scale for variety
      const scale = Math.random() * 20 + 15; // Between 15 and 35
      
      // Random rotation with crystals generally pointing inward toward center
      const rotation = [
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      ];
      
      positions.push({
        position: [x, y, z],
        scale,
        rotation,
        key: i
      });
    }
    
    return positions;
  }, []);
      
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
      
      {/* Crystals positioned around the outer perimeter */}
      {crystalPositions.map((crystal) => (
        <group 
          key={crystal.key}
          position={crystal.position}
          scale={[crystal.scale, crystal.scale, crystal.scale]}
          rotation={crystal.rotation}
        >
          <FloatingCrystal />
        </group>
      ))}
    </group>
  );
};

export default CaveEnvironment;