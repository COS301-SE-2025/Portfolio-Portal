import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Box } from "@react-three/drei";

export default function OfficePerson(props) {
  const group = useRef();
  useFrame(() => (group.current.rotation.y += 0.005));

  return (
    <group ref={group} {...props}>
      {/* Head */}
      <Box args={[0.3, 0.3, 0.3]} position={[0, 1, 0]}>
        <meshStandardMaterial color="#f9c5bd" />
      </Box>

      {/* Body */}
      <Box args={[0.5, 0.7, 0.3]} position={[0, 0.2, 0]}>
        <meshStandardMaterial color="#4a6fa5" />
      </Box>

      {/* Arms */}
      <Box args={[0.1, 0.5, 0.1]} position={[-0.4, 0.2, 0]}>
        <meshStandardMaterial color="#f9c5bd" />
      </Box>
      <Box args={[0.1, 0.5, 0.1]} position={[0.4, 0.2, 0]}>
        <meshStandardMaterial color="#f9c5bd" />
      </Box>

      {/* Chair */}
      <Box args={[0.6, 0.1, 0.6]} position={[0, -0.7, 0]}>
        <meshStandardMaterial color="#555" />
      </Box>
      <Box args={[0.1, 0.5, 0.1]} position={[0.2, -0.4, -0.2]}>
        <meshStandardMaterial color="#555" />
      </Box>
      <Box args={[0.1, 0.5, 0.1]} position={[-0.2, -0.4, -0.2]}>
        <meshStandardMaterial color="#555" />
      </Box>
    </group>
  );
}
