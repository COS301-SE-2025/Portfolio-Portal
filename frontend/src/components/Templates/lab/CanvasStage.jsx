import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, ScrollControls, CameraControls } from "@react-three/drei";
import Scene from "./scene/Scene";

export default function CanvasStage() {
  const controlsRef = useRef();

  return (
    <Canvas
      shadows
      camera={{ position: [3, 2, 6], fov: 45, near: 0.1, far: 100 }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.45} />
      <directionalLight castShadow position={[5, 8, 5]} intensity={1.05} shadow-mapSize={[1024, 1024]} />
      <Suspense fallback={null}>
        <Environment preset="city" />
        <ScrollControls pages={2} damping={0.15}>
          <Scene controlsRef={controlsRef} />
        </ScrollControls>
      </Suspense>
      <ContactShadows position={[0, -0.001, 0]} opacity={0.35} scale={20} blur={2.5} far={4} />
      <CameraControls ref={controlsRef} makeDefault />
    </Canvas>
  );
}