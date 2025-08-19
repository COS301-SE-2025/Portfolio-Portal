import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Text, Html } from '@react-three/drei';
import useCvData from '../hooks/useCVData'; // Using the same hook as other files
import OfficeNavbar from '../components/Templates/office/Navbar';

// Import GLTFLoader directly
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';

export default function Office3DPage() {
  const { cvData } = useCvData(); // Using the same hook as other files
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleWheel = (e) => {
    // Use deltaX for horizontal scrolling
    setScrollPosition(prev => Math.max(0, Math.min(prev + e.deltaX * 0.1, 100)));
  };

  return (
    <div className="relative h-screen" onWheel={handleWheel}>
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
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg">
        <div className="w-48 h-2 bg-gray-600 rounded-full">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-200"
            style={{ width: `${scrollPosition}%` }}
          ></div>
        </div>
        <p className="text-xs mt-1 text-center">Scroll horizontally to navigate</p>
      </div>
    </div>
  );
}

function Office3DScene({ cvData, scrollPosition }) {
  const { scene } = useThree();
  const groupRef = useRef();
  const textElementsRef = useRef([]);
  
  // Mock data fallback (same structure as your other files)
  const mockData = {
    name: "John Doe",
    title: "Full Stack Developer",
    about: "Experienced developer with 5+ years in web technologies. Passionate about creating innovative solutions and user-friendly experiences.",
    email: "john.doe@example.com",
    skills: ["JavaScript", "React", "Node.js", "Three.js", "UI/UX Design"],
    experience: [
      {
        company: "Tech Innovations Inc.",
        position: "Senior Developer",
        period: "2020-2023",
        description: "Led frontend development team for flagship product"
      }
    ],
    education: [
      {
        institution: "Tech University",
        degree: "Bachelor of Computer Science",
        period: "2014-2018"
      }
    ]
  };

  // Use data from hook or fallback to mock data
  const data = cvData || mockData;
  
  // Use the direct loader approach
  const gltf = useLoader(GLTFLoader, '/office/Capstone.glb');
  
  useFrame(() => {
    // Apply horizontal scrolling by moving the entire scene
    if (groupRef.current) {
      groupRef.current.position.x = -scrollPosition * 0.3; // Adjust multiplier as needed
    }
  });

  useEffect(() => {
    if (gltf?.scene) {
      // Store references to text elements
      textElementsRef.current = [];
      
      // Update text elements based on object names
      gltf.scene.traverse((object) => {
        if (object.isMesh && object.name) {
          // Map object names to CV data (same structure as your other files)
          let textContent = '';
          
          switch(object.name) {
            case 'AboutHeading':
              textContent = 'About Me';
              break;
            case 'AboutDescription':
              textContent = data.about || '';
              break;
            case 'Title':
              textContent = data.title || '';
              break;
            case 'Subtitle':
              textContent = data.name || 'Full Stack Developer';
              break;
            case 'ContactEmail':
              textContent = data.email || '';
              break;
            case 'ContactName':
              textContent = data.name || '';
              break;
            case 'ExpertiseHeading':
              textContent = 'Expertise';
              break;
            case 'ExpertiseDescription':
              textContent = data.skills?.join(', ') || '';
              break;
            case 'ExperienceHeading':
              textContent = 'Experience';
              break;
            case 'ExperienceDescription':
              textContent = data.experience?.[0]?.description || 
                           (data.experience?.[0]?.position ? 
                            `${data.experience[0].position} at ${data.experience[0].company}` : '');
              break;
            case 'EducationHeading':
              textContent = 'Education';
              break;
            case 'EducationDescription':
              textContent = data.education?.[0]?.description || 
                           (data.education?.[0]?.degree ? 
                            `${data.education[0].degree} from ${data.education[0].institution}` : '');
              break;
            case 'ContactMessage':
              textContent = 'Get in touch to discuss opportunities';
              break;
            default:
              // For other text elements, keep their original content or hide them
              if (object.name.includes('Text')) {
                object.visible = false; // Hide the original text mesh
              }
          }
          
          // Store reference for later updates
          if (textContent) {
            textElementsRef.current.push({
              object,
              textContent,
              originalVisibility: object.visible
            });
            
            // For now, just hide the original and we'll replace with HTML overlays
            object.visible = false;
          }
        }
      });
    }
  }, [gltf, data]);

  return (
    <group ref={groupRef}>
      {gltf?.scene && <primitive object={gltf.scene} />}
      
      {/* HTML overlays for dynamic text */}
      {textElementsRef.current.map((item, index) => (
        <Html
          key={index}
          position={[
            item.object.position.x,
            item.object.position.y,
            item.object.position.z
          ]}
          transform
          occlude
          className="html-overlay"
        >
          <div className="bg-black/70 text-white p-3 rounded max-w-xs border border-blue-400/30">
            {item.textContent}
          </div>
        </Html>
      ))}
    </group>
  );
}

function LoadingModel() {
  return (
    <Html center>
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Loading 3D environment...</p>
      </div>
    </Html>
  );
}

function FallbackModel() {
  return (
    <Html center>
      <div className="text-red-500 text-center">
        <p>Failed to load 3D office</p>
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