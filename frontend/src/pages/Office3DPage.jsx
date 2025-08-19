import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Html } from '@react-three/drei';
import useCvData from '../hooks/useCVData';
import OfficeNavbar from '../components/Templates/office/Navbar';

// Import GLTFLoader directly
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';

export default function Office3DPage() {
  const { cvData } = useCvData();
  const [scrollPosition, setScrollPosition] = useState(0);
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
      
      // Apply smoothing with smaller increments - REVERSED DIRECTION
      setScrollPosition(prev => {
        const newPos = prev - e.deltaY * 0.1; // Negative for correct direction
        return Math.max(0, Math.min(newPos, 100));
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
            style={{ width: `${scrollPosition}%` }}
          ></div>
        </div>
        <p className="text-xs mt-1 text-center">Scroll to navigate the office</p>
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
    // Smooth scrolling with lerp for smoother movement
    if (groupRef.current) {
      targetZ.current = scrollPosition * 0.5;
      groupRef.current.position.z += (targetZ.current - groupRef.current.position.z) * 0.1;
    }
  });

  useEffect(() => {
    if (gltf?.scene) {
      // Store references to text elements
      const textElements = [];
      
      // Update text elements based on object names
      gltf.scene.traverse((object) => {
        if (object.isMesh && object.name) {
          // Map object names to CV data
          let textContent = '';
          let fontSize = '16px';
          let fontWeight = 'normal';
          let textColor = '#ffffff';
          
          switch(object.name) {
            case 'AboutHeading':
              textContent = 'About Me';
              fontSize = '24px';
              fontWeight = 'bold';
              textColor = '#3498db';
              break;
            case 'AboutDescription':
              textContent = data.about || '';
              fontSize = '16px';
              break;
            case 'Title':
              textContent = data.title || '';
              fontSize = '20px';
              fontWeight = '600';
              textColor = '#2ecc71';
              break;
            case 'Subtitle':
              textContent = data.name || 'Full Stack Developer';
              fontSize = '18px';
              fontWeight = '500';
              break;
            case 'ContactEmail':
              textContent = data.email || '';
              break;
            case 'ContactName':
              textContent = data.name || '';
              break;
            case 'ExpertiseHeading':
              textContent = 'Expertise';
              fontSize = '22px';
              fontWeight = 'bold';
              textColor = '#3498db';
              break;
            case 'ExpertiseDescription':
              textContent = data.skills?.join(', ') || '';
              break;
            case 'ExperienceHeading':
              textContent = 'Experience';
              fontSize = '22px';
              fontWeight = 'bold';
              textColor = '#3498db';
              break;
            case 'ExperienceDescription':
              const exp = data.experience?.[0];
              textContent = exp ? `${exp.position} at ${exp.company} (${exp.period})` : '';
              break;
            case 'EducationHeading':
              textContent = 'Education';
              fontSize = '22px';
              fontWeight = 'bold';
              textColor = '#3498db';
              break;
            case 'EducationDescription':
              const edu = data.education?.[0];
              textContent = edu ? `${edu.degree} from ${edu.institution} (${edu.period})` : '';
              break;
            case 'ContactMessage':
              textContent = 'Get in touch to discuss opportunities';
              break;
            default:
              if (object.name.includes('Text') || object.name.includes('Heading') || object.name.includes('Description')) {
                object.visible = false;
              }
          }
          
          if (textContent) {
            textElements.push({
              object,
              textContent,
              fontSize,
              fontWeight,
              textColor,
              originalVisibility: object.visible
            });
            
            object.visible = false;
          }
        }
      });
      
      textElementsRef.current = textElements;
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
          distanceFactor={15} // Increased for better visibility
          className="html-overlay"
          style={{
            pointerEvents: 'none',
            transition: 'opacity 0.3s ease',
            width: '300px' // Fixed width for better layout
          }}
        >
          <div 
            className="bg-black/80 p-4 rounded-lg border border-blue-400/30 backdrop-blur-sm"
            style={{
              fontSize: item.fontSize,
              fontWeight: item.fontWeight,
              color: item.textColor,
              lineHeight: '1.5',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              textAlign: 'left'
            }}
          >
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