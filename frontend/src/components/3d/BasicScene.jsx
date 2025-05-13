import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const BasicScene = () => {
  const boxRef = useRef()
  const torusRef = useRef()
  
  // Animation loop
  useFrame((state, delta) => {
    if (boxRef.current) {
      boxRef.current.rotation.x += delta * 0.5
      boxRef.current.rotation.y += delta * 0.2
    }
    
    if (torusRef.current) {
      torusRef.current.rotation.x += delta * 0.2
      torusRef.current.rotation.y += delta * 0.5
    }
  })
  
  return (
    <group>
      {/* Box */}
      <mesh ref={boxRef} position={[-2, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#4299e1" />
      </mesh>
      
      {/* Torus */}
      <mesh ref={torusRef} position={[2, 0, 0]}>
        <torusGeometry args={[1, 0.4, 16, 32]} />
        <meshStandardMaterial color="#f56565" wireframe />
      </mesh>
      
      {/* Plane (floor) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
    </group>
  )
}

export default BasicScene