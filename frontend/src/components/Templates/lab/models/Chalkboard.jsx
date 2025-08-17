import React from "react";

export default function Chalkboard({
  w = 3.0,
  h = 1.6,
  depth = 0.04,
  boardColor = "#0a572e",
  frameColor = "#7b4f27",
  ...props
}) {
  return (
    <group {...props}>
      <mesh>
        <boxGeometry args={[w, h, depth]} />
        <meshStandardMaterial color={boardColor} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0, -depth / 2 - 0.01]}>
        <boxGeometry args={[w + 0.08, h + 0.08, 0.02]} />
        <meshStandardMaterial color={frameColor} roughness={0.7} />
      </mesh>
    </group>
  );
}
