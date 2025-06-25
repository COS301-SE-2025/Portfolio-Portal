// JUST FOR TESTING PURPOSES

import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import Model from '../components/3DModels/Office';


const OfficePage = () => {
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [150, 150, 150], fov: 35 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[100, 100, 100]} intensity={0.8} />
        <Suspense fallback={null}>
          <Model />
          <OrbitControls />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default OfficePage
