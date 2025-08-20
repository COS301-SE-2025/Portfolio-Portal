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
  const [scrollPosition, setScrollPosition] = useState(-55);
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
        return Math.max(-50, Math.min(newPos, 150));
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
          position: [0, 12, 20], // Zoomed in by 20% (from [0, 15, 25])
          rotation: [-Math.PI/6, 0, 0],
          fov: 50
        }}
        gl={{ alpha: true }} // Enable transparency
      >
        <color attach="background" args={['#1a202c']} /> {/* Set canvas background color */}
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
        title: "Senior Developer",
        startDate: "2020",
        endDate: "2023",
        extra: ["Led frontend development team for flagship product", "Implemented modern React architecture"]
      }
    ],
    education: [
      {
        institution: "Tech University",
        degree: "Bachelor of Computer Science",
        startDate: "2014",
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
      targetZ.current = -scrollPosition * 0.8;
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
      
      // First, make all planes transparent
      gltf.scene.traverse((object) => {
        if (object.isMesh && object.name && (
          object.name.includes('Title') || 
          object.name.includes('Subtitle') || 
          object.name.includes('About') || 
          object.name.includes('Expertise') || 
          object.name.includes('Experience') || 
          object.name.includes('Education') || 
          object.name.includes('Contact') || 
          object.name.includes('Heading') || 
          object.name.includes('Description')
        )) {
          // Make the plane fully transparent
          object.material.transparent = true;
          object.material.opacity = 0;
          object.material.needsUpdate = true;
          object.renderOrder = 1; // Render after other objects
        }
      });
      
      // Update actual Blender text objects
      gltf.scene.traverse((object) => {
        if (object.name && object.isMesh) {
          let textContent = '';
          
          // Map your specific text object names to content
          switch(object.name) {
            case 'Title':
              textContent = data.name || 'John Doe';
              break;
            case 'Subtitle':
              textContent = data.title || 'Full Stack Developer';
              break;
            case 'AboutDescription':
              textContent = data.about || 'Experienced developer with passion for creating innovative solutions and user-friendly experiences.';
              break;
            case 'ExpertiseDescription':
              textContent = data.skills?.slice(0, 4).join(' • ') || 'JavaScript • React • Node.js • Three.js';
              break;
            case 'ExperienceDescription':
              const exp = data.experience?.[0];
              textContent = exp ? `${exp.title} at ${exp.company} (${exp.startDate}-${exp.endDate})` : 'Senior Developer at Tech Company (2020-2023)';
              break;
            case 'EducationDescription':
              const edu = data.education?.[0];
              textContent = edu ? `${edu.degree} - ${edu.institution} (${edu.startDate}-${edu.endDate})` : 'Bachelor of Computer Science - Tech University (2014-2018)';
              break;
            case 'ContactDescription':
              textContent = data.email || 'contact@johndoe.com';
              break;
            case 'AboutHeading':
              textContent = 'About Me';
              break;
            case 'ExpertiseHeading':
              textContent = 'Experience & Expertise';
              break;
            case 'ExperienceHeading':
              textContent = 'Professional Journey';
              break;
            case 'EducationHeading':
              textContent = 'Education & Background';
              break;
            case 'ContactHeading':
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
              
              // Clear canvas with transparent background
              context.clearRect(0, 0, canvas.width, canvas.height);
              
              // Draw text - increased font size for headings only
              context.fillStyle = object.name.includes('Heading') ? '#3b82f6' : '#ffffff';
              // Increased heading font size from 24px to 32px (about 33% larger)
              context.font = object.name.includes('Heading') ? 'bold 32px Arial' : '18px Arial';
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
              
              // Draw each line - increased line height for headings
              const lineHeight = object.name.includes('Heading') ? 38 : 24; // Increased from 30 to 38
              const startY = canvas.height / 2 - ((lines.length - 1) * lineHeight) / 2;
              
              lines.forEach((line, index) => {
                context.fillText(line, canvas.width / 2, startY + index * lineHeight);
              });
              
              // Create texture and apply to material
              const texture = new THREE.CanvasTexture(canvas);
              texture.needsUpdate = true;
              
              // Fix horizontal inversion by flipping the texture
              texture.wrapS = THREE.RepeatWrapping;
              texture.repeat.x = -1;
              
              // Create a new material for the text
              const newMaterial = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                side: THREE.DoubleSide
              });
              
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