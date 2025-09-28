import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useCamera } from '@react-three/drei';

// Import GLTFLoader directly
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

export default function Office3DPage() {
  const { cvData } = useCvData();
  const [activeSection, setActiveSection] = useState('name');
  const controlsRef = useRef();
  const sceneRef = useRef();
  
  const navigateToSection = (section) => {
    setActiveSection(section);
    if (sceneRef.current && controlsRef.current) {
      const cameraName = `Camera${section.charAt(0).toUpperCase() + section.slice(1)}`;
      const camera = sceneRef.current.getObjectByName(cameraName);
      
      if (camera) {
        // Switch to the predefined camera
        controlsRef.current.object.position.copy(camera.position);
        controlsRef.current.object.rotation.copy(camera.rotation);
        controlsRef.current.target.set(0, 0, 0); // Look at center
        controlsRef.current.update();
      }
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Navigation Bar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-gray-200/95 backdrop-blur-lg rounded-2xl px-6 py-3 border border-gray-300/50 shadow-lg">
          <div className="flex gap-3 flex-wrap justify-center">
            {['Name', 'About', 'Experience', 'Education', 'Skills', 'Reference', 'Contact'].map((section) => (
              <button
                key={section.toLowerCase()}
                onClick={() => navigateToSection(section.toLowerCase())}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
                  activeSection === section.toLowerCase() 
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-500/40' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-300 hover:text-gray-900 border border-gray-300'
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
          position: [0, 5, 10],
          fov: 50
        }}
        gl={{ alpha: true }}
      >
        <color attach="background" args={['#e5e7eb']} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 15, 10]} intensity={1.5} />
        <pointLight position={[0, 8, 0]} intensity={0.8} />
        <Environment preset="city" />
        
        <ErrorBoundary fallback={<FallbackModel />}>
          <Suspense fallback={<LoadingModel />}>
            <Office3DScene cvData={cvData} sceneRef={sceneRef} />
          </Suspense>
        </ErrorBoundary>

        <OrbitControls 
          ref={controlsRef}
          enableZoom={true}
          enablePan={true}
          minPolarAngle={Math.PI/12}
          maxPolarAngle={Math.PI/1.2}
          rotateSpeed={0.8}
          panSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}

function Office3DScene({ cvData, sceneRef }) {
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
      sceneRef.current = gltf.scene;
      
      // Make sure all text planes are visible and have materials
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
          console.log(`Found text plane: ${object.name}`); // Debug log
          object.visible = true;
          
          // Ensure material exists
          if (!object.material) {
            object.material = new THREE.MeshBasicMaterial({ color: 0xf3f4f6 });
          }
        }
      });
      
      // Apply text to all planes
      gltf.scene.traverse((object) => {
        if (object.name && object.isMesh) {
          let textContent = '';
          
          switch(object.name) {
            case 'Name':
              textContent = data.name || 'JOHN DOE';
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
            console.log(`Applying text to ${object.name}:`, textContent); // Debug log
            applyTextToMesh(object, textContent, object.name === 'Name');
          }
        }
      });
    }
  }, [gltf, data]);

  const applyTextToMesh = (mesh, textContent, isMainHeading = false) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    // HUGE canvas for massive text
    canvas.width = 4096;
    canvas.height = 2048;
    
    // LIGHT GREY background
    context.fillStyle = '#f3f4f6';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // PURE BLACK text
    context.fillStyle = '#000000';
    
    // MASSIVE font sizes
    let fontSize, lineHeight, startX, startY;
    
    if (isMainHeading) {
      fontSize = 240;
      context.font = `bold ${fontSize}px "Arial Black", Arial, sans-serif`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      lineHeight = 280;
      startX = canvas.width / 2;
      startY = canvas.height / 2;
    } else {
      fontSize = 120;
      context.font = `bold ${fontSize}px "Arial Black", Arial, sans-serif`;
      context.textAlign = 'left';
      context.textBaseline = 'top';
      lineHeight = 150;
      startX = 100;
      startY = 100;
    }
    
    const lines = textContent.split('\n');
    
    // Strong shadow for visibility
    context.shadowColor = 'rgba(0,0,0,0.4)';
    context.shadowBlur = 15;
    context.shadowOffsetX = 5;
    context.shadowOffsetY = 5;

    lines.forEach((line, index) => {
      if (isMainHeading) {
        context.fillText(line, startX, startY + index * lineHeight);
      } else if (index === 0) {
        // First line - extra massive
        context.save();
        context.font = `bold 180px "Arial Black", Arial, sans-serif`;
        context.fillText(line, startX, startY + index * lineHeight);
        context.restore();
      } else {
        // Regular content - still huge
        context.save();
        context.font = `bold 100px "Arial Black", Arial, sans-serif`;
        context.fillText(line, startX, startY + index * lineHeight);
        context.restore();
      }
    });

    // Reset shadow
    context.shadowColor = 'transparent';
    context.shadowBlur = 0;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    mesh.material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: false,
      side: THREE.DoubleSide,
      toneMapped: false
    });
    
    mesh.visible = true;
  };

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
      <div className="text-gray-800 text-center bg-gray-100/90 p-8 rounded-2xl backdrop-blur-sm border border-gray-300 shadow-2xl">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
        <p className="text-2xl font-bold">LOADING 3D PORTFOLIO...</p>
      </div>
    </Html>
  );
}

function FallbackModel() {
  return (
    <Html center>
      <div className="text-red-600 text-center bg-gray-100/90 p-8 rounded-2xl border border-gray-300 shadow-2xl">
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