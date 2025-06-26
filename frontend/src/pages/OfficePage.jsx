import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Model from '../components/3DModels/Office';

const OfficePage = () => {
  return (
    <div className="w-full h-screen bg-[#0e0e2c] overflow-hidden">
      <Canvas
        camera={{ position: [300, 200, 300], fov: 40 }}
        style={{ background: '#0e0e2c' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[100, 100, 100]} intensity={1} />
        <Suspense fallback={null}>
          <group position={[0, -100, 0]} scale={0.6}>
            <Model />
          </group>
          <Environment preset="city" />
          <OrbitControls
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2.2}
            minDistance={150}          //  Prevent zooming in too much
            maxDistance={750}          //  Prevent zooming out too far
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default OfficePage;
