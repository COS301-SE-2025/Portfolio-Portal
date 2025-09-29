import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ChemistryFlask = ({ position = [0, 0, 0], scale = [1, 1, 1] }) => {
  const flaskRef = useRef();
  const liquidRef = useRef();
  const bubbleRefs = useRef([]);

  useFrame((state) => {
    if (flaskRef.current) {
      flaskRef.current.rotation.y += 0.005;
    }
    
    // Animate liquid with subtle movement
    if (liquidRef.current) {
      liquidRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }

    // Animate bubbles
    bubbleRefs.current.forEach((bubble, index) => {
      if (bubble) {
        bubble.position.y += 0.01;
        bubble.position.x = Math.sin(state.clock.elapsedTime + index) * 0.1;
        if (bubble.position.y > 2) {
          bubble.position.y = -0.5;
        }
      }
    });
  });

  // Create flask geometry
  const flaskShape = new THREE.Shape();
  flaskShape.moveTo(0, 0);
  flaskShape.lineTo(0.8, 0);
  flaskShape.lineTo(0.8, 1);
  flaskShape.lineTo(0.6, 1.5);
  flaskShape.lineTo(0.3, 2);
  flaskShape.lineTo(0.3, 2.5);
  flaskShape.lineTo(-0.3, 2.5);
  flaskShape.lineTo(-0.3, 2);
  flaskShape.lineTo(-0.6, 1.5);
  flaskShape.lineTo(-0.8, 1);
  flaskShape.lineTo(-0.8, 0);
  flaskShape.lineTo(0, 0);

  const extrudeSettings = {
    depth: 0.1,
    bevelEnabled: true,
    bevelSegments: 8,
    steps: 1,
    bevelSize: 0.05,
    bevelThickness: 0.05,
  };

  return (
    <group position={position} scale={scale} ref={flaskRef}>
      {/* Flask body */}
      <mesh position={[0, 0, 0]}>
        <extrudeGeometry args={[flaskShape, extrudeSettings]} />
        <meshPhysicalMaterial
          color="#2DD4BF"
          transparent={true}
          opacity={0.3}
          roughness={0.1}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Liquid inside */}
      <mesh position={[0, 0.2, 0]} ref={liquidRef}>
        <cylinderGeometry args={[0.6, 0.7, 1.2, 16]} />
        <meshPhysicalMaterial
          color="#10B981"
          transparent={true}
          opacity={0.6}
          roughness={0.2}
          metalness={0.1}
          emissive="#064E3B"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Bubbles */}
      {[...Array(6)].map((_, index) => (
        <mesh
          key={index}
          position={[
            (Math.random() - 0.5) * 0.8,
            Math.random() * 1.5 - 0.5,
            (Math.random() - 0.5) * 0.1,
          ]}
          ref={(el) => (bubbleRefs.current[index] = el)}
        >
          <sphereGeometry args={[0.02 + Math.random() * 0.03, 8, 8]} />
          <meshPhysicalMaterial
            color="#FFFFFF"
            transparent={true}
            opacity={0.4}
            roughness={0}
            metalness={0}
          />
        </mesh>
      ))}

      {/* Cork/Stopper */}
      <mesh position={[0, 2.6, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.3, 16]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>

      {/* Glow effect */}
      <pointLight
        position={[0, 1, 0]}
        color="#10B981"
        intensity={0.5}
        distance={3}
        decay={2}
      />
    </group>
  );
};

export default ChemistryFlask;