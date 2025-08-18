// src/pages/Office3DPage.jsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF, Text } from '@react-three/drei'
import { Suspense, useEffect } from 'react'
import { useCVData } from '../hooks/useCVData'
import OfficeNavbar from '../components/Templates/office/Navbar'

// Preload the model (must be outside component)
useGLTF.preload('/office/Office.glb')

export default function Office3DPage() {
  const { cvData } = useCVData()

  return (
    <div className="relative h-screen">
      <OfficeNavbar />
      <Canvas
        camera={{ 
          position: [0, 10, 15],
          rotation: [-Math.PI/6, 0, 0],
          fov: 50 
        }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Environment preset="city" />
        
        <ErrorBoundary fallback={<FallbackModel />}>
          <Suspense fallback={<LoadingModel />}>
            <Office3DScene cvData={cvData} />
          </Suspense>
        </ErrorBoundary>

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
  const { scene, error } = useGLTF('/office/Office.glb')
  
  useEffect(() => {
    if (error) console.error('Model loading error:', error)
    if (scene) {
      // Update text elements
      const updateText = (name, content) => {
        const obj = scene.getObjectByName(name)
        if (obj) obj.userData.text = content
      }
      updateText('AboutHeading', 'About Me')
      updateText('AboutDescription', cvData?.about || '')
    }
  }, [scene, error, cvData])

  if (error) return <FallbackModel />
  if (!scene) return <LoadingModel />

  return <primitive object={scene} />
}

function LoadingModel() {
  return (
    <Text position={[0, 2, 0]} color="white" anchorX="center">
      Loading 3D environment...
    </Text>
  )
}

function FallbackModel() {
  return (
    <Text position={[0, 0, 0]} color="red" anchorX="center">
      Failed to load 3D office
    </Text>
  )
}

class ErrorBoundary extends React.Component {
  state = { hasError: false }
  static getDerivedStateFromError = () => ({ hasError: true })
  componentDidCatch(error) { console.error('3D Error:', error) }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}