import React from "react";
import { RoundedBox } from "@react-three/drei";

export default function Bench({
  w = 2.2,
  d = 0.8,
  h = 0.9,
  top = 0.06,
  radius = 0.03,
  ...props
}) {
  const bodyH = h - top;
  return (
    <group {...props}>
      <RoundedBox
        args={[w, bodyH, d]}
        radius={radius}
        smoothness={4}
        position={[0, bodyH / 2, 0]}
      >
        <meshStandardMaterial
          color="#4b5563"
          roughness={0.6}
          metalness={0.05}
        />
      </RoundedBox>
      <RoundedBox
        args={[w, top, d]}
        radius={radius * 0.7}
        smoothness={4}
        position={[0, bodyH + top / 2, 0]}
      >
        <meshPhysicalMaterial
          color="#8b7355"
          roughness={0.45}
          metalness={0.05}
          clearcoat={0.2}
        />
      </RoundedBox>
      <mesh position={[0, bodyH * 0.55, d / 2 + 0.011]}>
        <boxGeometry args={[w * 0.9, bodyH * 0.7, 0.02]} />
        <meshStandardMaterial color="#374151" roughness={0.55} />
      </mesh>
      <mesh position={[-w * 0.18, bodyH * 0.55, d / 2 + 0.03]}>
        <cylinderGeometry args={[0.01, 0.01, 0.12, 12]} />
        <meshStandardMaterial
          color="#d1d5db"
          roughness={0.25}
          metalness={0.7}
        />
      </mesh>
      <mesh position={[w * 0.18, bodyH * 0.55, d / 2 + 0.03]}>
        <cylinderGeometry args={[0.01, 0.01, 0.12, 12]} />
        <meshStandardMaterial
          color="#d1d5db"
          roughness={0.25}
          metalness={0.7}
        />
      </mesh>
      <mesh position={[0, 0.05, d / 2 - 0.02]}>
        <boxGeometry args={[w * 0.95, 0.06, 0.02]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
    </group>
  );
}
