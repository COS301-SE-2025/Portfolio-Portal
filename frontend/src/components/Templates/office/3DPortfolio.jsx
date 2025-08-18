// src/pages/3DPortfolio.jsx
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, useGLTF, Environment } from '@react-three/drei'
import { Suspense, useRef, useEffect } from 'react'
import { useCVData } from '../hooks/useCVData'
import { useRouter } from 'next/router'
import { ScrollControls } from '@react-three/drei'

function OfficeModel({ cvData }) {
  const group = useRef()
  const { scene } = useGLTF('/3DModels/Capstone.glb')
  
  // Map your named GLB text objects to CV data
  useEffect(() => {
    if (scene) {
      // Update text content in the GLB model
      const updateText = (objectName, content) => {
        const obj = scene.getObjectByName(objectName)
        if (obj && obj.userData.text !== content) {
          obj.userData.text = content
          // Trigger update if needed
        }
      }

      updateText('AboutHeading', 'About Me')
      updateText('AboutDescription', cvData?.about || '')
      updateText('SkillsHeading', 'Core Expertise')
      cvData?.skills?.forEach((skill, i) => {
        updateText(`Skill_${i}`, skill)
      })
    }
  }, [scene, cvData])

  // Scroll animation
  useFrame(({ camera }) => {
    if (group.current) {
      // Create a slight angled scroll effect
      camera.position.y = -window.scrollY * 0.002
      camera.rotation.x = Math.PI / 4 + window.scrollY * 0.0001
      camera.lookAt(0, 0, 0)
    }
  })

  return <primitive ref={group} object={scene} />
}

export default function ThreeDPortfolio() {
  const { cvData } = useCVData()
  const router = useRouter()

  return (
    <div style={{ height: '300vh' }}>
      <Canvas
        camera={{ 
          position: [0, 5, 15],
          rotation: [Math.PI / 4, 0, 0], // Slight top-down angle
          fov: 50 
        }}
        style={{ position: 'fixed', top: 0 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Environment preset="city" />
        
        <ScrollControls pages={3} damping={0.1}>
          <Suspense fallback={null}>
            <OfficeModel cvData={cvData} />
            
            {/* Fallback dynamic text (in case GLB text isn't updating) */}
            {!cvData?.about && (
              <Text
                position={[0, 2, 0]}
                fontSize={0.5}
                color="black"
                anchorX="center"
              >
                Loading CV data...
              </Text>
            )}
          </Suspense>
        </ScrollControls>

        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI/4} // Limit to top-down view
          maxPolarAngle={Math.PI/2}
        />
      </Canvas>
    </div>
  )
}