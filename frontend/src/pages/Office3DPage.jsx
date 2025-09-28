import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Html } from '@react-three/drei';

// Import GLTFLoader directly
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

// Import your actual CV data hook
import useCVData from '../hooks/useCVData';

export default function Office3DPage() {
  const { cvData } = useCVData() || {};
  const [activeSection, setActiveSection] = useState('start');
  const controlsRef = useRef();
  const sceneRef = useRef();
  const isInitialLoad = useRef(true);
  
  // Set initial camera position on first load
  useEffect(() => {
    if (sceneRef.current && controlsRef.current && isInitialLoad.current) {
      const startCamera = sceneRef.current.getObjectByName('CameraStart');
      
      if (startCamera && startCamera.isCamera) {
        console.log('Setting initial camera to CameraStart');
        // Set initial position and target directly without animation
        controlsRef.current.object.position.copy(startCamera.position);
        controlsRef.current.object.rotation.copy(startCamera.rotation);
        
        const direction = new THREE.Vector3();
        startCamera.getWorldDirection(direction);
        const target = startCamera.position.clone().add(direction.multiplyScalar(10));
        controlsRef.current.target.copy(target);
        
        controlsRef.current.update();
      }
      isInitialLoad.current = false;
    }
  }, []);
  
  const navigateToSection = (section) => {
    setActiveSection(section);
    if (sceneRef.current && controlsRef.current) {
      const cameraName = `Camera${section.charAt(0).toUpperCase() + section.slice(1)}`;
      const camera = sceneRef.current.getObjectByName(cameraName);
      
      if (camera && camera.isCamera) {
        console.log(`Moving to camera: ${cameraName}`);
        
        // Disable smooth transitions by setting position and rotation directly
        controlsRef.current.object.position.copy(camera.position);
        controlsRef.current.object.rotation.copy(camera.rotation);
        
        // Calculate target based on camera direction
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        const target = camera.position.clone().add(direction.multiplyScalar(10));
        controlsRef.current.target.copy(target);
        
        // Force immediate update without smooth transition
        controlsRef.current.update();
      } else {
        console.log(`Camera ${cameraName} not found in model.`);
      }
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Navigation Bar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-gray-200/95 backdrop-blur-lg rounded-2xl px-6 py-3 border border-gray-300/50 shadow-lg">
          <div className="flex gap-3 flex-wrap justify-center">
            {['Start', 'NameAbout', 'Experience', 'Education', 'Skills', 'Reference', 'Contact'].map((section) => (
              <button
                key={section.toLowerCase()}
                onClick={() => navigateToSection(section.toLowerCase())}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
                  activeSection === section.toLowerCase() 
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-500/40' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-300 hover:text-gray-900 border border-gray-300'
                }`}
              >
                {section === 'NameAbout' ? 'About' : section}
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
          // Disable smooth damping for instant camera moves
          enableDamping={false}
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
      
      console.log("=== CV DATA DEBUG ===");
      console.log("Full CV Data:", cvData);
      console.log("Name:", cvData?.name);
      console.log("About:", cvData?.about);
      console.log("Experience:", cvData?.experience);
      console.log("Education:", cvData?.education);
      console.log("Skills:", cvData?.skills);
      console.log("References:", cvData?.references);
      console.log("Email:", cvData?.email);
      console.log("Phone:", cvData?.phone);
      console.log("=====================");
      
      // Apply text to all planes
      gltf.scene.traverse((object) => {
        if (object.name && object.isMesh) {
          let textContent = '';
          let isNameAbout = false;
          
          switch(object.name) {
            case 'NameAbout':
              // Use the exact data structure from your components
              const name = cvData?.name || 'Default Name';
              const title = cvData?.title || 'Default Title';
              const about = cvData?.about || cvData?.summary || 'Default about text describing professional experience and skills.';
              
              textContent = `${name}\n\n${title}\n\n${about}`;
              isNameAbout = true;
              console.log('Applying NameAbout:', { name, title, about });
              break;
              
            case 'Experience':
              let experienceContent = "EXPERIENCE\n\n";
              if (cvData?.experience && Array.isArray(cvData.experience) && cvData.experience.length > 0) {
                cvData.experience.forEach((exp, index) => {
                  experienceContent += `${exp.title || 'Position'}\n${exp.company || 'Company'}\n${exp.startDate || 'Start'} - ${exp.endDate || 'End'}`;
                  
                  // Handle bullet points - check both 'extra' and 'description'
                  if (exp.extra && Array.isArray(exp.extra) && exp.extra.length > 0) {
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
                experienceContent += "Senior Developer\nTech Innovations Inc.\n2020 - 2023\n• Led development teams\n• Built innovative solutions";
              }
              textContent = experienceContent;
              break;
              
            case 'Education':
              let educationContent = "EDUCATION\n\n";
              if (cvData?.education && Array.isArray(cvData.education) && cvData.education.length > 0) {
                cvData.education.forEach((edu, index) => {
                  educationContent += `${edu.degree || 'Degree'}\n${edu.institution || 'Institution'}`;
                  
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
                educationContent += "Bachelor of Computer Science\nTech University\n2018\nGPA: 3.8";
              }
              textContent = educationContent;
              break;
              
            case 'Skills':
              let skillsContent = "SKILLS\n\n";
              if (cvData?.skills && Array.isArray(cvData.skills) && cvData.skills.length > 0) {
                skillsContent += cvData.skills.join('\n');
              } else {
                skillsContent += "JavaScript\nReact\nNode.js\nThree.js\nUI/UX Design";
              }
              textContent = skillsContent;
              break;
              
            case 'Reference':
              let referenceContent = "REFERENCES\n\n";
              if (cvData?.references && Array.isArray(cvData.references) && cvData.references.length > 0) {
                cvData.references.forEach((ref, index) => {
                  referenceContent += `${ref.name || 'Reference Name'}\n${ref.position || 'Position'}\n${ref.contact || 'Contact Info'}`;
                  if (index < cvData.references.length - 1) {
                    referenceContent += '\n\n';
                  }
                });
              } else {
                referenceContent += "Jane Smith\nCTO at Tech Innovations\njane.smith@company.com";
              }
              textContent = referenceContent;
              break;
              
            case 'Contact':
              let contactContent = "CONTACT\n\n";
              const email = cvData?.email || 'email@example.com';
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
            console.log(`Applying text to ${object.name}:`, textContent);
            applyTextToMesh(object, textContent, isNameAbout);
          } else {
            console.log(`No text content for ${object.name}`);
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
          // Name - LARGE
          context.font = 'bold 380px "Arial Black", Arial, sans-serif';
          context.fillText(line, canvas.width / 2, currentY);
          currentY += 500;
        } else if (index === 2) {
          // Title - LARGE
          context.font = 'bold 280px "Arial Black", Arial, sans-serif';
          context.fillText(line, canvas.width / 2, currentY);
          currentY += 450;
        } else if (index === 4) {
          // About - readable size
          context.font = 'bold 140px "Arial Black", Arial, sans-serif';
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
            context.fillText(aboutLine, canvas.width / 2, currentY + (aboutIndex * 180));
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
          // Section heading - LARGE
          context.font = 'bold 320px "Arial Black", Arial, sans-serif';
          context.fillText(line, 300, currentY);
          currentY += 400;
        } else if (line.trim() === '') {
          // Empty line for spacing
          currentY += 150;
        } else if (line.startsWith('•')) {
          // Bullet points
          context.font = 'bold 120px "Arial Black", Arial, sans-serif';
          context.fillText(line, 350, currentY);
          currentY += 160;
        } else {
          // Content
          context.font = 'bold 160px "Arial Black", Arial, sans-serif';
          context.fillText(line, 300, currentY);
          currentY += 200;
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
    console.log(`✅ Text applied to ${mesh.name}`);
  };

  return (
    <group position={[0, 0, 0]}>
      {gltf?.scene && <primitive object={gltf.scene} />}
    </group>
  );
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