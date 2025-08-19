import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Html } from '@react-three/drei';
import useCvData from '../hooks/useCVData';
import OfficeNavbar from '../components/Templates/office/Navbar';

// Import GLTFLoader directly
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

export default function Office3DPage() {
  const { cvData } = useCvData();
  const [scrollPosition, setScrollPosition] = useState(-50); // Start higher up
  const scrollContainerRef = useRef();
  const scrollTimeoutRef = useRef();

  // Handle natural mouse wheel scrolling with smoothing
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      
      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Apply smoothing with correct direction and limited range
      setScrollPosition(prev => {
        const newPos = prev + e.deltaY * 0.15;
        return Math.max(-50, Math.min(newPos, 150)); // Start at -50, end at 150 for shorter range
      });

      // Set timeout to clear smooth scrolling
      scrollTimeoutRef.current = setTimeout(() => {
        scrollTimeoutRef.current = null;
      }, 100);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        container.removeEventListener('wheel', handleWheel);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }
  }, []);

  return (
    <div className="relative h-screen overflow-hidden" ref={scrollContainerRef}>
      <OfficeNavbar />
      <Canvas
        camera={{ 
          position: [0, 15, 25],
          rotation: [-Math.PI/6, 0, 0],
          fov: 45
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[15, 15, 10]} intensity={0.8} />
        <Environment preset="apartment" />
        
        <ErrorBoundary fallback={<FallbackModel />}>
          <Suspense fallback={<LoadingModel />}>
            <Office3DScene cvData={cvData} scrollPosition={scrollPosition} />
          </Suspense>
        </ErrorBoundary>

        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI/6}
          maxPolarAngle={Math.PI/2}
        />
      </Canvas>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
        <div className="w-48 h-2 bg-gray-600 rounded-full">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-200 ease-out"
            style={{ width: `${Math.min(((scrollPosition + 50) / 200) * 100, 100)}%` }}
          ></div>
        </div>
        <p className="text-xs mt-1 text-center">Scroll to navigate the office ({Math.round(((scrollPosition + 50) / 200) * 100)}%)</p>
      </div>
    </div>
  );
}

function Office3DScene({ cvData, scrollPosition }) {
  const { scene } = useThree();
  const groupRef = useRef();
  const textElementsRef = useRef([]);
  const targetZ = useRef(0);
  
  // Mock data fallback
  const mockData = {
    name: "John Doe",
    title: "Full Stack Developer",
    about: "Experienced developer with 5+ years in web technologies. Passionate about creating innovative solutions and user-friendly experiences.",
    email: "john.doe@example.com",
    skills: ["JavaScript", "React", "Node.js", "Three.js", "UI/UX Design"],
    experience: [
      {
        company: "Tech Innovations Inc.",
        title: "Senior Developer", // Changed from 'position' to 'title'
        startDate: "2020", // Changed from 'period'
        endDate: "2023",
        extra: ["Led frontend development team for flagship product", "Implemented modern React architecture"]
      }
    ],
    education: [
      {
        institution: "Tech University",
        degree: "Bachelor of Computer Science",
        startDate: "2014", // Changed from 'period'
        endDate: "2018"
      }
    ]
  };

  // Use data from hook or fallback to mock data
  const data = cvData || mockData;
  
  // Use the direct loader approach
  const gltf = useLoader(GLTFLoader, '/office/Capstone.glb');
  
  useFrame(() => {
    // Smooth scrolling with lerp for smoother movement - extended range
    if (groupRef.current) {
      targetZ.current = -scrollPosition * 0.8; // Negative to move camera backward when scrolling down
      groupRef.current.position.z += (targetZ.current - groupRef.current.position.z) * 0.1;
    }
  });

  useEffect(() => {
    if (gltf?.scene) {
      // Debug: Log all object names to help identify correct names
      console.log('=== 3D Model Object Names ===');
      gltf.scene.traverse((object) => {
        if (object.name) {
          console.log(`Object name: "${object.name}", type: ${object.type}, geometry: ${object.geometry?.type}`);
        }
      });
      console.log('=== End Object Names ===');
      
      // Update actual Blender text objects
      gltf.scene.traverse((object) => {
        if (object.name && object.isMesh) {
          let textContent = '';
          
          // Map your specific text object names to content
          switch(object.name) {
            case 'Text001':
              textContent = data.name || 'John Doe';
              break;
            case 'Text003':
              textContent = data.title || 'Full Stack Developer';
              break;
            case 'Text':
              textContent = data.about || 'Experienced developer with passion for creating innovative solutions and user-friendly experiences.';
              break;
            case 'Text004':
              textContent = data.skills?.slice(0, 4).join(' • ') || 'JavaScript • React • Node.js • Three.js';
              break;
            case 'Text005':
              const exp = data.experience?.[0];
              textContent = exp ? `${exp.title} at ${exp.company} (${exp.startDate}-${exp.endDate})` : 'Senior Developer at Tech Company (2020-2023)';
              break;
            case 'Text006':
              const edu = data.education?.[0];
              textContent = edu ? `${edu.degree} - ${edu.institution} (${edu.startDate}-${edu.endDate})` : 'Bachelor of Computer Science - Tech University (2014-2018)';
              break;
            case 'Text002':
              textContent = data.email || 'contact@johndoe.com';
              break;
            case 'Text007':
              textContent = 'Experience & Expertise';
              break;
            case 'Text008':
              textContent = 'Education & Background';
              break;
            case 'Text009':
              textContent = 'Get In Touch';
              break;
          }
          
          if (textContent) {
            // Try to update the object's material or create a canvas texture
            if (object.material) {
              // Create a canvas texture with the text
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              canvas.width = 512;
              canvas.height = 128;
              
              // Clear canvas
              context.fillStyle = '#000000';
              context.fillRect(0, 0, canvas.width, canvas.height);
              
              // Draw text
              context.fillStyle = '#ffffff';
              context.font = 'bold 24px Arial';
              context.textAlign = 'center';
              context.textBaseline = 'middle';
              
              // Handle long text by wrapping
              const words = textContent.split(' ');
              const lines = [];
              let currentLine = '';
              
              words.forEach(word => {
                const testLine = currentLine + (currentLine ? ' ' : '') + word;
                const metrics = context.measureText(testLine);
                if (metrics.width > canvas.width - 40 && currentLine !== '') {
                  lines.push(currentLine);
                  currentLine = word;
                } else {
                  currentLine = testLine;
                }
              });
              lines.push(currentLine);
              
              // Draw each line
              const lineHeight = 30;
              const startY = canvas.height / 2 - ((lines.length - 1) * lineHeight) / 2;
              
              lines.forEach((line, index) => {
                context.fillText(line, canvas.width / 2, startY + index * lineHeight);
              });
              
              // Create texture and apply to material
              const texture = new THREE.CanvasTexture(canvas);
              texture.needsUpdate = true;
              
              // Clone material to avoid affecting other objects
              const newMaterial = object.material.clone();
              newMaterial.map = texture;
              newMaterial.transparent = true;
              newMaterial.alphaTest = 0.1;
              object.material = newMaterial;
              
              // Make sure the object is visible
              object.visible = true;
              
              console.log(`Updated text object "${object.name}" with canvas texture: "${textContent}"`);
            }
          }
        }
      });
    }
  }, [gltf, data]);

  return (
    <group ref={groupRef}>
      {gltf?.scene && <primitive object={gltf.scene} />}
    </group>
  );
}

function LoadingModel() {
  return (
    <Html center>
      <div className="text-white text-center bg-black/70 p-6 rounded-lg backdrop-blur-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-lg">Loading 3D environment...</p>
      </div>
    </Html>
  );
}

function FallbackModel() {
  return (
    <Html center>
      <div className="text-red-500 text-center bg-black/70 p-6 rounded-lg">
        <p className="text-lg">Failed to load 3D office</p>
        <p className="text-sm mt-2">Please check if the model file exists</p>
      </div>
    </Html>
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