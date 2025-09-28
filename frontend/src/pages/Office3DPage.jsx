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
        console.log(`Camera ${cameraName} not found in model. Using fallback positions.`);
        // Fallback positions
        const fallbackPositions = {
          nameabout: { position: [0, 3, 8], target: [0, 2, 0] },
          experience: { position: [8, 3, 0], target: [5, 2, 0] },
          education: { position: [0, 3, -8], target: [0, 2, -5] },
          skills: { position: [-8, 3, 0], target: [-5, 2, 0] },
          reference: { position: [6, 3, 6], target: [4, 2, 4] },
          contact: { position: [-6, 3, -6], target: [-4, 2, -4] }
        };
        const pos = fallbackPositions[section];
        if (pos) {
          controlsRef.current.object.position.set(...pos.position);
          controlsRef.current.target.set(...pos.target);
          controlsRef.current.update();
        }
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
          position: [0, 3, 8],
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
      
      console.log("CV Data received:", cvData); // Debug what data we have
      
      // Apply text to all planes
      gltf.scene.traverse((object) => {
        if (object.name && object.isMesh) {
          let textContent = '';
          let isNameAbout = false;
          
          switch(object.name) {
            case 'NameAbout':
              // Use the exact same data structure as your components
              const name = cvData?.name || 'JOHN DOE';
              const title = cvData?.title || 'FULL STACK DEVELOPER';
              const about = cvData?.about || 'Experienced professional with a passion for innovation.';
              
              textContent = `${name.toUpperCase()}\n\n${title.toUpperCase()}\n\n${about}`;
              isNameAbout = true;
              console.log('NameAbout data:', { name, title, about });
              break;
              
            case 'Experience':
              let experienceContent = "EXPERIENCE\n\n";
              if (cvData?.experience?.length > 0) {
                cvData.experience.forEach((exp, index) => {
                  experienceContent += `${exp.title?.toUpperCase() || 'POSITION'}\n${exp.company?.toUpperCase() || 'COMPANY'}\n${exp.startDate || 'START'} - ${exp.endDate || 'END'}`;
                  
                  // Handle both 'extra' array and 'description' field like your Experience.jsx
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
                experienceContent += "Senior Developer\nTech Innovations Inc.\n2020 - 2023\n• Led frontend development team\n• Implemented modern React architecture";
              }
              textContent = experienceContent;
              console.log('Experience data:', cvData?.experience);
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
                educationContent += "Bachelor of Computer Science\nTech University\n2014 - 2018\nGPA: 3.8/4.0";
              }
              textContent = educationContent;
              console.log('Education data:', cvData?.education);
              break;
              
            case 'Skills':
              let skillsContent = "SKILLS\n\n";
              if (cvData?.skills?.length > 0) {
                skillsContent += cvData.skills.join('\n').toUpperCase();
              } else {
                skillsContent += "JAVASCRIPT\nREACT\nNODE.JS\nTHREE.JS\nUI/UX DESIGN";
              }
              textContent = skillsContent;
              console.log('Skills data:', cvData?.skills);
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
                referenceContent += "JANE SMITH\nCTO AT TECH INNOVATIONS\njane.smith@techinnovations.com";
              }
              textContent = referenceContent;
              console.log('References data:', cvData?.references);
              break;
              
            case 'Contact':
              let contactContent = "CONTACT\n\n";
              const email = cvData?.email || 'john.doe@example.com';
              const phone = cvData?.phone || '+1 (555) 123-4567';
              
              contactContent += `${email.toUpperCase()}\n${phone}`;
              textContent = contactContent;
              console.log('Contact data:', { email, phone });
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
    
    if (isNameAbout) {
      // NameAbout section - centered layout
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      
      let currentY = 600;
      
      lines.forEach((line, index) => {
        if (index === 0) {
          // Name - EXTREMELY LARGE
          context.font = 'bold 480px "Arial Black", Arial, sans-serif';
          context.fillText(line, canvas.width / 2, currentY);
          currentY += 600;
        } else if (index === 2) {
          // Title - VERY LARGE
          context.font = 'bold 320px "Arial Black", Arial, sans-serif';
          context.fillText(line, canvas.width / 2, currentY);
          currentY += 500;
        } else if (index === 4) {
          // About - LARGE but readable
          context.font = 'bold 180px "Arial Black", Arial, sans-serif';
          // Split long about text into multiple lines if needed
          const words = line.split(' ');
          let currentLine = '';
          let aboutLines = [];
          
          for (let i = 0; i < words.length; i++) {
            const testLine = currentLine + words[i] + ' ';
            const metrics = context.measureText(testLine);
            if (metrics.width > canvas.width * 0.8 && currentLine !== '') {
              aboutLines.push(currentLine);
              currentLine = words[i] + ' ';
            } else {
              currentLine = testLine;
            }
          }
          aboutLines.push(currentLine);
          
          aboutLines.forEach((aboutLine, aboutIndex) => {
            context.fillText(aboutLine, canvas.width / 2, currentY + (aboutIndex * 220));
          });
        }
      });
    } else {
      // Other sections with headings - left aligned
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
        } else if (line.startsWith('•')) {
          // Bullet points - slightly smaller
          context.font = 'bold 160px "Arial Black", Arial, sans-serif';
          context.fillText(line, 350, currentY);
          currentY += 220;
        } else {
          // Content - VERY LARGE
          context.font = 'bold 200px "Arial Black", Arial, sans-serif';
          context.fillText(line, 300, currentY);
          currentY += 250;
        }
      });
    }
    
    // Create texture with better filtering for sharper text
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 16;
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

// Use your actual CV data hook
function useCvData() {
  try {
    // Import your actual hook - adjust path as needed
    const useCVData = require('../../../hooks/useCVData').default;
    const data = useCVData();
    console.log("Loaded CV Data:", data);
    return { cvData: data };
  } catch (error) {
    console.log('Error loading CV data hook, using mock data:', error);
    // Return mock data that matches your component structure
    return {
      cvData: {
        name: "JOHN DOE",
        title: "FULL STACK DEVELOPER",
        about: "Experienced developer with 5+ years in web technologies. Passionate about creating innovative solutions and user-friendly experiences. Specializing in modern web frameworks and 3D interactive experiences.",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
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
      }
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