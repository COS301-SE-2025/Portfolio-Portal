// src/components/Templates/office/Hero.jsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import Office from '../../3DModels/Office'
import useCvData from '../../../hooks/useCVData'

// Preload the preview model
useGLTF.preload('/office/Office.glb')

const Hero = () => {
  const navigate = useNavigate()
  const { name, description } = useCvData() || {}

  return (
    <section className="relative w-full h-screen mx-auto bg-gradient-to-br from-gray-900 via-blue-900/10 to-gray-900 flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center justify-between h-full">
        <div className="flex-1 max-w-2xl space-y-6">
          <h1 className="text-white font-black text-5xl sm:text-6xl lg:text-7xl">
            Hi, I'm <span className="text-blue-400">{name || "Professional"}</span>
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl max-w-lg">
            {description || "Full stack developer creating digital solutions with precision and efficiency."}
          </p>
          <button 
            onClick={() => navigate('/office3d')}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-gray-700 hover:from-blue-700 hover:to-gray-800 text-white font-medium rounded transition-all duration-300 transform hover:scale-105"
          >
            Enter 3D Portfolio
          </button>
        </div>

        <div className="flex-1 w-full h-full max-w-2xl">
          <Canvas
            camera={{ position: [350, 250, 350], fov: 35 }}
            gl={{ preserveDrawingBuffer: true }}
          >
            <Suspense fallback={null}>
              <PreviewModel />
            </Suspense>
          </Canvas>
        </div>
      </div>
      
      <div className="absolute bottom-10 w-full flex justify-center">
        <a href="#about" className="animate-bounce">
          <div className="w-10 h-16 border-4 border-blue-400 rounded-full flex justify-center items-start p-2">
            <div className="w-3 h-3 rounded-full bg-blue-400" />
          </div>
        </a>
      </div>
    </section>
  )
}

function PreviewModel() {
  const { scene } = useGLTF('/office/Office.glb')
  return scene ? <primitive object={scene} scale={[0.3, 0.3, 0.3]} position={[0, -50, 0]} /> : null
}

export default Hero