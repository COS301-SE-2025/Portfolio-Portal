import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Html } from '@react-three/drei';

// Import GLTFLoader directly
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

export default function Office3DPage() {
  const { cvData } = useCvData();
  const [activeSection, setActiveSection] = useState('name');
  const controlsRef = useRef();
  
  const cameraPositions = {
    name: { position: [0, 6, 3], target: [0, 5, 0] },
    about: { position: [4, 6, 4], target: [3, 5, 3] },
    experience: { position: [-4, 6, 4], target: [-3, 5, 3] },
    education: { position: [4, 6, -4], target: [3, 5, -3] },
    skills: { position: [-4, 6, -4], target: [-3, 5, -3] },
    reference: { position: [0, 6, -3], target: [0, 5, 0] },
    contact: { position: [0, 8, 0], target: [0, 0, 0] }
  };

  const navigateToSection = (section) => {
    setActiveSection(section);
    if (controlsRef.current && cameraPositions[section]) {
      const { position, target } = cameraPositions[section];
      controlsRef.current.target.set(...target);
      controlsRef.current.object.position.set(...position);
      controlsRef.current.update();
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Navigation Bar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-black/90 backdrop-blur-lg rounded-2xl px-6 py-3 border border-gray-700/50">
          <div className="flex gap-4 flex-wrap justify-center">
            {['Name', 'About', 'Experience', 'Education', 'Skills', 'Reference', 'Contact'].map((section) => (
              <button
                key={section.toLowerCase()}
                onClick={() => navigateToSection(section.toLowerCase())}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
                  activeSection === section.toLowerCase() 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {section}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Canvas
        camera={{ 
          position: [0, 8, 0],
          rotation: [0, Math.PI, 0], // Facing opposite direction
          fov: 60
        }}
        gl={{ alpha: true }}
      >
        <color attach="background" args={['#e5e7eb']} />
        <ambientLight intensity={1.0} />
        <directionalLight position={[10, 20, 10]} intensity={1.2} />
        <pointLight position={[0, 10, 0]} intensity={0.8} />
        <Environment preset="city" />
        
        <ErrorBoundary fallback={<FallbackModel />}>
          <Suspense fallback={<LoadingModel />}>
            <Office3DScene cvData={cvData} />
          </Suspense>
        </ErrorBoundary>

        <OrbitControls 
          ref={controlsRef}
          enableZoom={true}
          enablePan={true}
          minPolarAngle={Math.PI/8}
          maxPolarAngle={Math.PI/1.3}
          rotateSpeed={0.8}
          panSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}

function Office3DScene({ cvData }) {
  const mockData = {
    name: "JOHN DOE",
    title: "FULL STACK DEVELOPER",
    about: "Experienced developer with 5+ years in web technologies. Passionate about creating innovative solutions and user-friendly experiences. Specializing in modern web frameworks and 3D interactive experiences.",
    email: "JOHN.DOE@EXAMPLE.COM",
    phone: "+1 (555) 123-4567",
    skills: ["JAVASCRIPT", "REACT", "NODE.JS", "THREE.JS", "UI/UX DESIGN", "WEBGL", "3D GRAPHICS"],
    experience: [
      {
        company: "TECH INNOVATIONS INC.",
        title: "SENIOR DEVELOPER",
        startDate: "2020",
        endDate: "2023",
        description: "Led frontend development team for flagship product. Implemented modern React architecture and improved performance by 40%. Managed team of 5 developers."
      }
    ],
    education: [
      {
        institution: "TECH UNIVERSITY",
        degree: "BACHELOR OF COMPUTER SCIENCE",
        startDate: "2014",
        endDate: "2018",
        gpa: "3.8/4.0"
      }
    ],
    references: [
      {
        name: "JANE SMITH",
        position: "CTO AT TECH INNOVATIONS",
        contact: "JANE.SMITH@TECHINNOVATIONS.COM"
      }
    ]
  };

  const data = cvData || mockData;
  const gltf = useLoader(GLTFLoader, '/office/new-office-model.glb');

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
          object.renderOrder = 999;
        }
      });
      
      gltf.scene.traverse((object) => {
        if (object.name && object.isMesh) {
          let textContent = '';
          let isHeading = false;
          let isMainHeading = false;
          
          switch(object.name) {
            case 'Name':
              textContent = data.name || 'JOHN DOE';
              isMainHeading = true;
              break;
            case 'About':
              textContent = data.about || 'Experienced professional with a passion for innovation and cutting-edge technology solutions.';
              break;
            case 'Experience':
              if (data.experience?.length > 0) {
                const exp = data.experience[0];
                textContent = `${exp.title.toUpperCase()}\nAT ${exp.company.toUpperCase()}\n${exp.startDate} - ${exp.endDate}\n\n${exp.description}`;
              }
              break;
            case 'Education':
              if (data.education?.length > 0) {
                const edu = data.education[0];
                textContent = `${edu.degree.toUpperCase()}\n${edu.institution.toUpperCase()}\n${edu.startDate} - ${edu.endDate}\nGPA: ${edu.gpa}`;
              }
              break;
            case 'Skills':
              if (data.skills?.length > 0) {
                textContent = data.skills.join('\n').toUpperCase();
              }
              break;
            case 'Reference':
              if (data.references?.length > 0) {
                const ref = data.references[0];
                textContent = `${ref.name.toUpperCase()}\n${ref.position.toUpperCase()}\n${ref.contact.toUpperCase()}`;
              }
              break;
            case 'Contact':
              let contactText = '';
              if (data.email) contactText += `${data.email.toUpperCase()}\n`;
              if (data.phone) contactText += `${data.phone}\n`;
              if (data.location) contactText += `${data.location.toUpperCase()}`;
              textContent = contactText || 'JOHN.DOE@EXAMPLE.COM\n+1 (555) 123-4567';
              break;
          }
          
          if (textContent) {
            if (object.material) {
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              canvas.width = 4096; // HUGE canvas for massive text
              canvas.height = 2048;
              
              // White background for maximum contrast
              context.fillStyle = '#ffffff';
              context.fillRect(0, 0, canvas.width, canvas.height);
              
              // Pure black text - EXTREMELY BOLD AND LARGE
              context.fillStyle = '#000000';
              
              if (isMainHeading) {
                context.font = 'bold 200px "Arial Black", Arial, sans-serif';
                context.textAlign = 'center';
                context.textBaseline = 'middle';
              } else {
                context.font = 'bold 96px "Arial Black", Arial, sans-serif';
                context.textAlign = 'left';
                context.textBaseline = 'top';
              }
              
              const lines = textContent.split('\n');
              const lineHeight = isMainHeading ? 240 : 120;
              const startX = isMainHeading ? canvas.width / 2 : 120;
              const startY = isMainHeading ? canvas.height / 2 : 120;

              // Add text shadow for better readability
              context.shadowColor = 'rgba(0,0,0,0.3)';
              context.shadowBlur = 10;
              context.shadowOffsetX = 5;
              context.shadowOffsetY = 5;

              lines.forEach((line, index) => {
                if (isMainHeading) {
                  context.fillText(line, startX, startY + index * lineHeight);
                } else if (index === 0) {
                  // First line of section - extra massive
                  context.save();
                  context.font = 'bold 144px "Arial Black", Arial, sans-serif';
                  context.fillText(line, startX, startY + index * lineHeight);
                  context.restore();
                } else if (index === 1 && (object.name === 'Experience' || object.name === 'Education')) {
                  // Second line for experience/education - still large
                  context.save();
                  context.font = 'bold 120px "Arial Black", Arial, sans-serif';
                  context.fillText(line, startX, startY + index * lineHeight);
                  context.restore();
                } else {
                  context.fillText(line, startX, startY + index * lineHeight);
                }
              });

              // Reset shadow
              context.shadowColor = 'transparent';
              context.shadowBlur = 0;
              context.shadowOffsetX = 0;
              context.shadowOffsetY = 0;
              
              const texture = new THREE.CanvasTexture(canvas);
              texture.needsUpdate = true;
              
              const newMaterial = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: false,
                side: THREE.DoubleSide,
                toneMapped: false
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
    <group position={[0, 0, 0]}>
      {gltf?.scene && <primitive object={gltf.scene} />}
    </group>
  );
}

// Custom hook for CV data
function useCvData() {
  return { cvData: null };
}

function LoadingModel() {
  return (
    <Html center>
      <div className="text-gray-800 text-center bg-white/90 p-8 rounded-2xl backdrop-blur-sm border border-gray-300 shadow-2xl">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
        <p className="text-2xl font-bold">LOADING 3D PORTFOLIO...</p>
      </div>
    </Html>
  );
}

function FallbackModel() {
  return (
    <Html center>
      <div className="text-red-600 text-center bg-white/90 p-8 rounded-2xl border border-gray-300 shadow-2xl">
        <p className="text-2xl font-bold">FAILED TO LOAD 3D OFFICE</p>
        <p className="text-lg mt-4">Please check if the model file exists at /office/new-office-model.glb</p>
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