import React, { Suspense, useRef } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  ScrollControls,
  CameraControls,
  Html,
} from "@react-three/drei";
import {
  EffectComposer,
  Outline,
  Selection,
} from "@react-three/postprocessing";
import Scene from "./scene/Scene";

export default function CanvasStage() {
  const controlsRef = useRef();

  const boundary = new THREE.Box3(
    new THREE.Vector3(-4.3, 0.15, -3.1),
    new THREE.Vector3(4.3, 2.9, 3.1)
  );

  return (
    <Canvas
      shadows
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [3, 1.8, 4.2], fov: 45, near: 0.1, far: 50 }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.45} />
      <directionalLight
        castShadow
        position={[5, 8, 5]}
        intensity={1.05}
        shadow-mapSize={[1024, 1024]}
      />

      <Suspense
        fallback={
          <mesh>
            <Html center>Loading…</Html>
          </mesh>
        }
      >
        <Environment preset="city" />

        <Selection>
          <ScrollControls pages={2} damping={0.15}>
            <Scene controlsRef={controlsRef} />
          </ScrollControls>

          <EffectComposer autoClear={false}>
            <Outline
              blur
              visibleEdgeColor={0xffd400}
              hiddenEdgeColor={0xffd400}
              edgeStrength={40.5}
              width={1024}
            />
          </EffectComposer>
        </Selection>
      </Suspense>

      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.35}
        scale={20}
        blur={2.5}
        far={4}
      />

      <CameraControls
        ref={controlsRef}
        makeDefault
        enabled={true}
        boundary={boundary}
        boundaryEnclosesCamera={true}
        boundaryFriction={0.25}
        minAzimuthAngle={THREE.MathUtils.degToRad(-25)}
        maxAzimuthAngle={THREE.MathUtils.degToRad(25)}
        minPolarAngle={THREE.MathUtils.degToRad(15)}
        maxPolarAngle={THREE.MathUtils.degToRad(75)}
        minDistance={1.5}
        maxDistance={4.0}
        dollyToCursor={false}
        azimuthRotateSpeed={0.4}
        polarRotateSpeed={0.4}
        dollySpeed={0.25}
      />
    </Canvas>
  );
}
