import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function Bubbles({ count = 30, radius = 0.17, height = 0.35 }) {
  const ref = useRef();
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() * 2 - 1) * (radius * 0.65),
        z: (Math.random() * 2 - 1) * (radius * 0.65),
        y: -height / 2 + Math.random() * height,
        s: 0.4 + Math.random() * 0.8,
      })),
    [count, radius, height]
  );
  const mat = useMemo(() => new THREE.Matrix4(), []);

  useFrame((_, dt) => {
    if (!ref.current) return;
    for (let i = 0; i < count; i++) {
      const b = seeds[i];
      b.y += b.s * dt * 0.25;
      if (b.y > height / 2) b.y = -height / 2;
      mat.makeTranslation(b.x, b.y, b.z);
      ref.current.setMatrixAt(i, mat);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[null, null, count]}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshStandardMaterial transparent opacity={0.25} />
    </instancedMesh>
  );
}
