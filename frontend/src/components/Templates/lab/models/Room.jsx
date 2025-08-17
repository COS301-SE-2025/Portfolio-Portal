import React from "react";
import * as THREE from "three";

export default function Room({ w = 8, d = 6, h = 3, color = "#f5f7fa" }) {
  return (
    <mesh position={[0, h / 2, 0]}>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial
        color={color}
        roughness={0.95}
        side={THREE.BackSide}
      />
    </mesh>
  );
}
