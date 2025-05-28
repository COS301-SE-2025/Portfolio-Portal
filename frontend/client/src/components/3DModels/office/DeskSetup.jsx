import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Box } from "@react-three/drei";

export default function DeskSetup(props) {
  const group = useRef();
  useFrame(() => (group.current.rotation.y += 0.01));

  return (
    <group ref={group} {...props}>
      {/* Desk */}
      <Box args={[3, 0.1, 1.5]} position={[0, -0.5, 0]}>
        <meshStandardMaterial color="#8B5A2B" />
      </Box>

      {/* Monitor */}
      <Box args={[0.8, 0.6, 0.05]} position={[0, 0.2, 0.3]}>
        <meshStandardMaterial color="#333" />
      </Box>

      {/* Monitor Stand */}
      <Box args={[0.2, 0.3, 0.2]} position={[0, -0.1, 0.3]}>
        <meshStandardMaterial color="#555" />
      </Box>

      {/* Laptop */}
      <Box args={[0.6, 0.05, 0.4]} position={[0.8, -0.2, 0]}>
        <meshStandardMaterial color="#999" />
      </Box>

      {/* Coffee Cup */}
      <mesh position={[-0.5, -0.3, 0.5]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.12, 0.2, 32]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
    </group>
  );
}
