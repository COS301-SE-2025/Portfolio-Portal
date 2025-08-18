import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Text } from '@react-three/drei';
import { useCVData } from '../hooks/useCVData';
import OfficeNavbar from '../components/Templates/office/Navbar';

// Import GLTFLoader directly
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';

export default function Office3DPage() {
  const { cvData } = useCVData();

  return (
    <div className="relative h-screen">
      <OfficeNavbar />
      <Canvas
        camera={{ 
          position: [0, 10, 15],
          rotation: [-Math.PI/6, 0, 0],
          fov: 50 
        }}
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
  );
}

function Office3DScene({ cvData }) {
  // Use the direct loader approach
  const gltf = useLoader(GLTFLoader, '/office/Capstone.glb');
  
  useEffect(() => {
    if (gltf?.scene) {
      // Update text elements
      const textElements = {
        'AboutHeading': 'About Me',
        'AboutDescription': cvData?.about || '',
        'SkillsHeading': 'Core Expertise',
      };

      Object.entries(textElements).forEach(([name, content]) => {
        const obj = gltf.scene.getObjectByName(name);
        if (obj) obj.userData.text = content;
      });
    }
  }, [gltf, cvData]);

  return gltf?.scene ? <primitive object={gltf.scene} /> : null;
}

function LoadingModel() {
  return (
    <Text position={[0, 2, 0]} color="white" anchorX="center">
      Loading 3D environment...
    </Text>
  );
}

function FallbackModel() {
  return (
    <Text position={[0, 0, 0]} color="red" anchorX="center">
      Failed to load 3D office
    </Text>
  );
}

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError = () => ({ hasError: true });
  componentDidCatch(error) { console.error('3D Error:', error); }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}