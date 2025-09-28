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
  const [scrollPosition, setScrollPosition] = useState(-80);
  const [targetScrollPosition, setTargetScrollPosition] = useState(-80);
  const scrollContainerRef = useRef();
  const scrollTimeoutRef = useRef();
  const animationFrameRef = useRef();

  // Smooth scrolling animation
  useEffect(() => {
    const animate = () => {
      setScrollPosition(prev => {
        const diff = targetScrollPosition - prev;
        if (Math.abs(diff) < 0.1) {
          return targetScrollPosition;
        }
        return prev + diff * 0.08;
      });
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetScrollPosition]);

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      setTargetScrollPosition(prev => {
        const newPos = prev + e.deltaY * 0.04;
        return Math.max(-60, Math.min(newPos, 60));
      });

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

  const progressPercentage = Math.max(0, Math.min(100, ((scrollPosition + 80) / 140) * 100));

  return (
    <div className="relative h-screen overflow-hidden" ref={scrollContainerRef}>
      <OfficeNavbar />
      <Canvas
        camera={{ 
          position: [0, 5, 8], // Centered camera position
          rotation: [-Math.PI/6, 0, 0],
          fov: 45
        }}
        gl={{ alpha: true }}
      >
        <color attach="background" args={['#1a202c']} />
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
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-lg backdrop-blur-sm border border-gray-600/30">
        <div className="w-56 h-3 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-300 ease-out shadow-lg"
            style={{ 
              width: `${progressPercentage}%`,
              boxShadow: progressPercentage > 5 ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

function Office3DScene({ cvData, scrollPosition }) {
  const groupRef = useRef();
  const targetZ = useRef(0);
  
  const mockData = {
    name: "John Doe",
    title: "Full Stack Developer",
    about: "Experienced developer with 5+ years in web technologies. Passionate about creating innovative solutions and user-friendly experiences.",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    skills: ["JavaScript", "React", "Node.js", "Three.js", "UI/UX Design"],
    experience: [
      {
        company: "Tech Innovations Inc.",
        title: "Senior Developer",
        startDate: "2020",
        endDate: "2023",
        description: "Led frontend development team for flagship product. Implemented modern React architecture and improved performance by 40%."
      }
    ],
    education: [
      {
        institution: "Tech University",
        degree: "Bachelor of Computer Science",
        startDate: "2014",
        endDate: "2018",
        gpa: "3.8"
      }
    ],
    references: [
      {
        name: "Jane Smith",
        position: "CTO at Tech Innovations",
        contact: "jane.smith@techinnovations.com"
      }
    ]
  };

  const data = cvData || mockData;
  // Updated model path - replace with your new model
  const gltf = useLoader(GLTFLoader, '/office/new-office-model.glb');
  
  useFrame(() => {
    if (groupRef.current) {
      targetZ.current = -scrollPosition * 0.9;
      groupRef.current.position.z += (targetZ.current - groupRef.current.position.z) * 0.1;
    }
  });

  useEffect(() => {
    if (gltf?.scene) {
      gltf.scene.traverse((object) => {
        if (object.isMesh && object.name && (
          object.name.includes('Name') || 
          object.name.includes('About') || 
          object.name.includes('Experience') || 
          object.name.includes('Education') || 
          object.name.includes('Skills') || 
          object.name.includes('Reference') || 
          object.name.includes('Contact')
        )) {
          object.material.transparent = true;
          object.material.opacity = 1;
          object.material.needsUpdate = true;
          object.renderOrder = 1;
        }
      });
      
      gltf.scene.traverse((object) => {
        if (object.name && object.isMesh) {
          let textContent = '';
          
          switch(object.name) {
            case 'Name':
              textContent = data.name || 'John Doe';
              break;
            case 'About':
              textContent = data.about || 'Experienced professional with a passion for innovation.';
              break;
            case 'Experience':
              if (data.experience?.length > 0) {
                const expTexts = data.experience.map((exp) => {
                  let expText = `${exp.title} at ${exp.company}`;
                  if (exp.startDate && exp.endDate) {
                    expText += ` (${exp.startDate}-${exp.endDate})`;
                  }
                  if (exp.description) {
                    expText += `\n${exp.description}`;
                  }
                  return expText;
                });
                textContent = expTexts.join('\n\n');
              }
              break;
            case 'Education':
              if (data.education?.length > 0) {
                const eduTexts = data.education.map((edu) => {
                  let eduText = `${edu.degree} - ${edu.institution}`;
                  if (edu.startDate && edu.endDate) {
                    eduText += ` (${edu.startDate}-${edu.endDate})`;
                  }
                  if (edu.gpa) {
                    eduText += `\nGPA: ${edu.gpa}`;
                  }
                  return eduText;
                });
                textContent = eduTexts.join('\n\n');
              }
              break;
            case 'Skills':
              textContent = data.skills?.join(', ') || 'JavaScript, React, Node.js, Three.js';
              break;
            case 'Reference':
              if (data.references?.length > 0) {
                const refTexts = data.references.map((ref) => {
                  return `${ref.name}\n${ref.position}\n${ref.contact}`;
                });
                textContent = refTexts.join('\n\n');
              }
              break;
            case 'Contact':
              let contactText = '';
              if (data.email) contactText += `Email: ${data.email}\n`;
              if (data.phone) contactText += `Phone: ${data.phone}\n`;
              if (data.location) contactText += `Location: ${data.location}`;
              textContent = contactText || 'Email: john.doe@example.com\nPhone: +1 (555) 123-4567';
              break;
          }
          
          if (textContent) {
            if (object.material) {
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              canvas.width = 512;
              canvas.height = 256; // Increased height for more content
              
              context.clearRect(0, 0, canvas.width, canvas.height);
              context.fillStyle = object.name === 'Name' ? '#3b82f6' : '#ffffff';
              
              // Font sizes based on section
              if (object.name === 'Name') {
                context.font = 'bold 48px Arial';
                context.textAlign = 'center';
                context.textBaseline = 'middle';
              } else if (object.name === 'About') {
                context.font = '18px Arial';
                context.textAlign = 'left';
                context.textBaseline = 'top';
              } else {
                context.font = '16px Arial';
                context.textAlign = 'left';
                context.textBaseline = 'top';
              }
              
              const words = textContent.split(' ');
              const lines = [];
              let currentLine = '';
              let maxWidth = canvas.width - 40;
              
              words.forEach(word => {
                const testLine = currentLine + (currentLine ? ' ' : '') + word;
                const metrics = context.measureText(testLine);
                if (metrics.width > maxWidth && currentLine !== '') {
                  lines.push(currentLine);
                  currentLine = word;
                } else {
                  currentLine = testLine;
                }
              });
              lines.push(currentLine);
              
              let lineHeight = object.name === 'Name' ? 50 : 20;
              let startX = object.name === 'Name' ? canvas.width / 2 : 20;
              let startY = object.name === 'Name' ? canvas.height / 2 : 20;

              lines.forEach((line, index) => {
                context.fillText(line, startX, startY + index * lineHeight);
              });
              
              const texture = new THREE.CanvasTexture(canvas);
              texture.needsUpdate = true;
              
              const newMaterial = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                side: THREE.DoubleSide
              });
              
              object.material = newMaterial;
              object.visible = true;
            }
          }
        }
      });
    }
  }, [gltf, data]);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
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