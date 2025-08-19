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
  const [scrollPosition, setScrollPosition] = useState(0); // Start at 0 (top)
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
      
      // Apply smoothing with correct direction and extended range
      setScrollPosition(prev => {
        const newPos = prev + e.deltaY * 0.15; // Positive for correct direction, increased sensitivity
        return Math.max(0, Math.min(newPos, 300)); // Extended range to 300 for more scrolling
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
            style={{ width: `${Math.min((scrollPosition / 300) * 100, 100)}%` }}
          ></div>
        </div>
        <p className="text-xs mt-1 text-center">Scroll to navigate the office ({Math.round((scrollPosition / 300) * 100)}%)</p>
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
      targetZ.current = scrollPosition * 0.8; // Increased multiplier for more movement
      groupRef.current.position.z += (targetZ.current - groupRef.current.position.z) * 0.1;
    }
  });

  useEffect(() => {
    if (gltf?.scene) {
      // Debug: Log all object names to help identify correct names
      console.log('=== 3D Model Object Names ===');
      gltf.scene.traverse((object) => {
        if (object.name) {
          console.log(`Object name: "${object.name}", type: ${object.type}`);
        }
      });
      console.log('=== End Object Names ===');
      
      // Store references to text elements
      const textElements = [];
      
      // Update text elements based on object names
      gltf.scene.traverse((object) => {
        if (object.name) {
          // Map object names to CV data - expanded list of possible names
          let textContent = '';
          let fontSize = '16px';
          let fontWeight = 'normal';
          let textColor = '#ffffff';
          
          // Convert object name to lowercase for comparison
          const objectName = object.name.toLowerCase();
          
          // About section
          if (objectName.includes('about') && objectName.includes('head')) {
            textContent = 'About Me';
            fontSize = '24px';
            fontWeight = 'bold';
            textColor = '#3498db';
          } else if (objectName.includes('about') && (objectName.includes('desc') || objectName.includes('text'))) {
            textContent = data.about || '';
            fontSize = '16px';
          }
          // Title/Name section
          else if (objectName.includes('title') || objectName.includes('name')) {
            if (objectName.includes('sub')) {
              textContent = data.name || 'Full Stack Developer';
              fontSize = '18px';
              fontWeight = '500';
            } else {
              textContent = data.title || '';
              fontSize = '20px';
              fontWeight = '600';
              textColor = '#2ecc71';
            }
          }
          // Contact section
          else if (objectName.includes('contact')) {
            if (objectName.includes('email')) {
              textContent = data.email || '';
            } else if (objectName.includes('name')) {
              textContent = data.name || '';
            } else if (objectName.includes('message')) {
              textContent = 'Get in touch to discuss opportunities';
            }
          }
          // Skills/Expertise section
          else if (objectName.includes('skill') || objectName.includes('expert')) {
            if (objectName.includes('head')) {
              textContent = 'Expertise';
              fontSize = '22px';
              fontWeight = 'bold';
              textColor = '#3498db';
            } else if (objectName.includes('desc') || objectName.includes('text')) {
              textContent = data.skills?.join(', ') || '';
            }
          }
          // Experience section
          else if (objectName.includes('experience') || objectName.includes('work')) {
            if (objectName.includes('head')) {
              textContent = 'Experience';
              fontSize = '22px';
              fontWeight = 'bold';
              textColor = '#3498db';
            } else if (objectName.includes('desc') || objectName.includes('text')) {
              const exp = data.experience?.[0];
              textContent = exp ? `${exp.title} at ${exp.company} (${exp.startDate}-${exp.endDate})` : '';
            }
          }
          // Education section
          else if (objectName.includes('education') || objectName.includes('school')) {
            if (objectName.includes('head')) {
              textContent = 'Education';
              fontSize = '22px';
              fontWeight = 'bold';
              textColor = '#3498db';
            } else if (objectName.includes('desc') || objectName.includes('text')) {
              const edu = data.education?.[0];
              textContent = edu ? `${edu.degree} from ${edu.institution} (${edu.startDate}-${edu.endDate})` : '';
            }
          }
          // Generic text elements (fallback)
          else if (objectName.includes('text') || objectName.includes('label')) {
            // Try to extract meaningful content based on position or other context
            textContent = `Text Element: ${object.name}`;
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
            
            // Hide the original object to replace with HTML overlay
            object.visible = false;
            
            console.log(`Mapped "${object.name}" to: "${textContent}"`);
          }
        }
      });
      
      textElementsRef.current = textElements;
      console.log(`Total text elements mapped: ${textElements.length}`);
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
          distanceFactor={10} // Reduced for better visibility
          className="html-overlay"
          style={{
            pointerEvents: 'none',
            transition: 'opacity 0.3s ease',
            width: '300px',
            maxWidth: '300px'
          }}
        >
          <div 
            className="bg-black/90 p-3 rounded-lg border border-blue-400/30 backdrop-blur-sm shadow-lg"
            style={{
              fontSize: item.fontSize,
              fontWeight: item.fontWeight,
              color: item.textColor,
              lineHeight: '1.4',
              boxShadow: '0 4px 20px rgba(52, 152, 219, 0.2)',
              textAlign: 'left',
              wordWrap: 'break-word',
              maxWidth: '280px'
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