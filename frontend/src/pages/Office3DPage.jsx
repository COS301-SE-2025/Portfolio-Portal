import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Html } from '@react-three/drei';

// Import GLTFLoader directly
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

export default function Office3DPage() {
  const { cvData } = useCvData();
  const [activeSection, setActiveSection] = useState('nameabout');
  const controlsRef = useRef();
  const sceneRef = useRef();
  
  const navigateToSection = (section) => {
    setActiveSection(section);
    if (sceneRef.current && controlsRef.current) {
      const cameraName = `Camera${section.charAt(0).toUpperCase() + section.slice(1)}`;
      const camera = sceneRef.current.getObjectByName(cameraName);
      
      if (camera) {
        controlsRef.current.object.position.copy(camera.position);
        controlsRef.current.object.rotation.copy(camera.rotation);
        controlsRef.current.target.set(0, 2, 0);
        controlsRef.current.update();
      } else {
        console.log(`Camera ${cameraName} not found in model. Please add cameras in Three.js Editor.`);
      }
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Navigation Bar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-gray-200/95 backdrop-blur-lg rounded-2xl px-6 py-3 border border-gray-300/50 shadow-lg">
          <div className="flex gap-3 flex-wrap justify-center">
            {['NameAbout', 'Experience', 'Education', 'Skills', 'Reference', 'Contact'].map((section) => (
              <button
                key={section.toLowerCase()}
                onClick={() => navigateToSection(section.toLowerCase())}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
                  activeSection === section.toLowerCase() 
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-500/40' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-300 hover:text-gray-900 border border-gray-300'
                }`}
              >
                {section.replace('NameAbout', 'About')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Canvas
        camera={{ 
          position: [0, 3, 12],
          fov: 50
        }}
        gl={{ alpha: true }}
      >
        <color attach="background" args={['#e5e7eb']} />
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 15, 10]} intensity={1.8} />
        <pointLight position={[0, 8, 0]} intensity={1.0} />
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
  const gltf = useLoader(GLTFLoader, '/office/new-office-model.glb');

  useEffect(() => {
    if (gltf?.scene) {
      sceneRef.current = gltf.scene;
      
      console.log("Scene loaded, applying text to planes...");
      console.log("CV Data:", cvData); // Debug log to see what data we have
      
      // Apply text to all planes
      gltf.scene.traverse((object) => {
        if (object.name && object.isMesh) {
          let textContent = '';
          let isNameAbout = false;
          
          switch(object.name) {
            case 'NameAbout':
              // Use actual CV data with fallbacks
              const name = cvData?.name || cvData?.userName || 'JOHN DOE';
              const title = cvData?.title || cvData?.jobTitle || 'FULL STACK DEVELOPER';
              const about = cvData?.about || cvData?.summary || 'Experienced professional with a passion for innovation.';
              
              textContent = `${name}\n\n${title}\n\n${about}`;
              isNameAbout = true;
              console.log(`Applying NameAbout: ${name}`);
              break;
              
            case 'Experience':
              let experienceContent = "EXPERIENCE\n\n";
              if (cvData?.experience?.length > 0) {
                cvData.experience.forEach((exp, index) => {
                  experienceContent += `${exp.title?.toUpperCase() || 'POSITION'}\n${exp.company?.toUpperCase() || 'COMPANY'}\n${exp.startDate || 'START'} - ${exp.endDate || 'END'}`;
                  
                  // Add extra bullet points if they exist
                  if (exp.extra?.length > 0) {
                    exp.extra.forEach(extra => {
                      experienceContent += `\n• ${extra.replace('¢ ', '')}`;
                    });
                  } else if (exp.description) {
                    experienceContent += `\n• ${exp.description}`;
                  }
                  
                  if (index < cvData.experience.length - 1) {
                    experienceContent += '\n\n';
                  }
                });
              } else {
                experienceContent += "No experience data available";
              }
              textContent = experienceContent;
              break;
              
            case 'Education':
              let educationContent = "EDUCATION\n\n";
              if (cvData?.education?.length > 0) {
                cvData.education.forEach((edu, index) => {
                  educationContent += `${edu.degree?.toUpperCase() || 'DEGREE'}\n${edu.institution?.toUpperCase() || 'INSTITUTION'}`;
                  
                  if (edu.startDate && edu.endDate) {
                    educationContent += `\n${edu.startDate} - ${edu.endDate}`;
                  } else if (edu.endDate) {
                    educationContent += `\n${edu.endDate}`;
                  }
                  
                  if (edu.field) {
                    educationContent += `\nField: ${edu.field}`;
                  }
                  
                  if (edu.gpa) {
                    educationContent += `\nGPA: ${edu.gpa}`;
                  }
                  
                  if (index < cvData.education.length - 1) {
                    educationContent += '\n\n';
                  }
                });
              } else {
                educationContent += "No education data available";
              }
              textContent = educationContent;
              break;
              
            case 'Skills':
              let skillsContent = "SKILLS\n\n";
              if (cvData?.skills?.length > 0) {
                skillsContent += cvData.skills.join('\n').toUpperCase();
              } else {
                skillsContent += "No skills data available";
              }
              textContent = skillsContent;
              break;
              
            case 'Reference':
              let referenceContent = "REFERENCES\n\n";
              if (cvData?.references?.length > 0) {
                cvData.references.forEach((ref, index) => {
                  referenceContent += `${ref.name?.toUpperCase() || 'NAME'}\n${ref.position?.toUpperCase() || 'POSITION'}\n${ref.contact || 'CONTACT INFO'}`;
                  if (index < cvData.references.length - 1) {
                    referenceContent += '\n\n';
                  }
                });
              } else {
                referenceContent += "No references available";
              }
              textContent = referenceContent;
              break;
              
            case 'Contact':
              let contactContent = "CONTACT\n\n";
              const email = cvData?.email || 'EMAIL@EXAMPLE.COM';
              const phone = cvData?.phone || '+1 (555) 123-4567';
              const location = cvData?.location || '';
              
              contactContent += `${email}\n${phone}`;
              if (location) {
                contactContent += `\n${location}`;
              }
              textContent = contactContent;
              break;
          }
          
          if (textContent) {
            console.log(`Applying text to ${object.name}`);
            applyTextToMesh(object, textContent, isNameAbout);
          }
        }
      });
    }
  }, [gltf, cvData]);

  const applyTextToMesh = (mesh, textContent, isNameAbout = false) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    // Large canvas for sharp text
    canvas.width = 8192;
    canvas.height = 4096;
    
    // Enable image smoothing for better text rendering
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    
    // LIGHT GREY background (softer than white)
    context.fillStyle = '#f1f5f9';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // PURE BLACK text for maximum contrast
    context.fillStyle = '#000000';
    
    const lines = textContent.split('\n');
    const isHeading = !isNameAbout;
    
    if (isNameAbout) {
      // NameAbout section - different styling
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      
      lines.forEach((line, index) => {
        if (index === 0) {
          // Name - EXTREMELY LARGE
          context.font = 'bold 480px "Arial Black", Arial, sans-serif';
          context.fillText(line, canvas.width / 2, 800);
        } else if (index === 2) {
          // Title - VERY LARGE
          context.font = 'bold 320px "Arial Black", Arial, sans-serif';
          context.fillText(line, canvas.width / 2, 1600);
        } else if (index === 4) {
          // About - LARGE but readable
          context.font = 'bold 200px "Arial Black", Arial, sans-serif';
          context.fillText(line, canvas.width / 2, 2600);
        }
      });
    } else {
      // Other sections with headings
      context.textAlign = 'left';
      context.textBaseline = 'top';
      
      let currentY = 300;
      
      lines.forEach((line, index) => {
        if (index === 0) {
          // Section heading - MASSIVE
          context.font = 'bold 400px "Arial Black", Arial, sans-serif';
          context.fillText(line, 300, currentY);
          currentY += 500;
        } else if (line.trim() === '') {
          // Empty line for spacing
          currentY += 200;
        } else {
          // Content - VERY LARGE
          context.font = 'bold 220px "Arial Black", Arial, sans-serif';
          context.fillText(line, 300, currentY);
          currentY += 300;
        }
      });
    }
    
    // Create texture with better filtering for sharper text
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 16; // Improves texture quality at angles
    texture.needsUpdate = true;
    
    mesh.material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: false,
      side: THREE.DoubleSide,
      toneMapped: false
    });
    
    mesh.visible = true;
    console.log(`Text applied to ${mesh.name} successfully`);
  };

  return (
    <group position={[0, 0, 0]}>
      {gltf?.scene && <primitive object={gltf.scene} />}
    </group>
  );
}

// Custom hook for CV data - using your actual hook
function useCvData() {
  // This should use your actual useCVData hook
  try {
    const useCVData = require('../../../hooks/useCVData').default;
    return useCVData() || {};
  } catch (error) {
    console.log('Using mock data for development');
    return {
      name: "JOHN DOE",
      title: "FULL STACK DEVELOPER", 
      about: "Experienced developer with 5+ years in web technologies. Passionate about creating innovative solutions.",
      email: "JOHN.DOE@EXAMPLE.COM",
      phone: "+1 (555) 123-4567",
      skills: ["JAVASCRIPT", "REACT", "NODE.JS", "THREE.JS"],
      experience: [
        {
          company: "Tech Innovations Inc.",
          title: "Senior Developer",
          startDate: "2020",
          endDate: "2023",
          description: "Led frontend development team for flagship product."
        }
      ],
      education: [
        {
          institution: "Tech University",
          degree: "Bachelor of Computer Science",
          startDate: "2014",
          endDate: "2018",
          gpa: "3.8/4.0"
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
  }
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