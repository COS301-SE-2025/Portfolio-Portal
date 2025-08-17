import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Explosion({
  count = 80,
  origin = [0, 0.4, 0],
  gravity = 1.5,
  damping = 0.98,
  lifetime = 1.2,
  size = 0.06,
}) {
  const pointsRef = useRef();
  const matRef = useRef();
  const posAttrRef = useRef();
  const tRef = useRef(0);

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const dir = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      // random unit direction
      dir
        .set(Math.random() - 0.5, Math.random(), Math.random() - 0.5)
        .normalize();
      const speed = 1.5 + Math.random() * 1.5;
      const idx = i * 3;
      velocities[idx] = dir.x * speed;
      velocities[idx + 1] = dir.y * speed;
      velocities[idx + 2] = dir.z * speed;
    }
    return { positions, velocities };
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;

    tRef.current += delta;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;

      velocities[idx] *= damping;
      velocities[idx + 1] = velocities[idx + 1] * damping - gravity * delta;
      velocities[idx + 2] *= damping;

      positions[idx] += velocities[idx] * delta;
      positions[idx + 1] += velocities[idx + 1] * delta;
      positions[idx + 2] += velocities[idx + 2] * delta;
    }

    if (posAttrRef.current) posAttrRef.current.needsUpdate = true;

    // fade out
    if (matRef.current) {
      matRef.current.opacity = Math.max(0, 1 - tRef.current / lifetime);
    }

    if (tRef.current > lifetime && matRef.current?.opacity <= 0.001) {
      pointsRef.current.visible = false;
    }
  });

  return (
    <points ref={pointsRef} position={origin}>
      <bufferGeometry>
        <bufferAttribute
          ref={posAttrRef}
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={size}
        transparent
        opacity={1}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        color={0xffaa55}
      />
    </points>
  );
}
