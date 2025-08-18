// src/pages/Office3DPage.jsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Text, Environment } from '@react-three/drei'
import { Suspense, useEffect } from 'react'
import { useCVData } from '../hooks/useCVData'
import OfficeNavbar from '../components/Templates/office/Navbar'

export default function Office3DPage() {
  const { cvData } = useCVData()

  return (
    <div className="relative h-screen">
      <OfficeNavbar />
      <Canvas
        camera={{ 
          position: [0, 10, 15],
          rotation: [-Math.PI/6, 0, 0], // Slight top-down angle
          fov: 50 
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Environment preset="city" />
        
        <Suspense fallback={null}>
          <Office3DScene cvData={cvData} />
        </Suspense>

        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI/6}
          maxPolarAngle={Math.PI/2}
        />
      </Canvas>
    </div>
  )
}

function Office3DScene({ cvData }) {
  const { scene } = useGLTF('/3DModels/Office.glb')
  
  useEffect(() => {
    if (scene) {
      // Update text elements in the GLB model
      const textElements = {
        'AboutHeading': 'About Me',
        'AboutDescription': cvData?.about || '',
        'SkillsHeading': 'Core Expertise',
        // Add more mappings as needed
      }

      Object.entries(textElements).forEach(([name, content]) => {
        const obj = scene.getObjectByName(name)
        if (obj) obj.userData.text = content
      })
    }
  }, [scene, cvData])

  return <primitive object={scene} />
}