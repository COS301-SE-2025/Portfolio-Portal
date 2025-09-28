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
  const sceneRef = useRef();
  
  const navigateToSection = (section) => {
    setActiveSection(section);
    if (sceneRef.current && controlsRef.current) {
      const cameraName = `Camera${section.charAt(0).toUpperCase() + section.slice(1)}`;
      const camera = sceneRef.current.getObjectByName(cameraName);
      
      if (camera) {
        controlsRef.current.object.position.copy(camera.position);
        controlsRef.current.object.rotation.copy(camera.rotation);
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
      } else {
        // Fallback positions if cameras aren't in the model
        const fallbackPositions = {
          name: { position: [0, 3, 12], target: [0, 2, 0] },
          about: { position: [12, 3, 0], target: [8, 2, 0] },
          experience: { position: [0, 3, -12], target: [0, 2, -8] },
          education: { position: [-12, 3, 0], target: [-8, 2, 0] },
          skills: { position: [8, 3, 8], target: [5, 2, 5] },
          reference: { position: [-8, 3, -8], target: [-5, 2, -5] },
          contact: { position: [0, 6, 0], target: [0, 2, 0] }
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
  const mockData = {
    name: "JOHN DOE",
    title: "FULL STACK DEVELOPER",
    about: "Experienced developer with 5+ years in web technologies. Passionate about creating innovative solutions and user-friendly experiences. Specializing in modern web frameworks and 3D interactive experiences.",
    email: "JOHN.DOE@EXAMPLE.COM",
    phone: "+1 (555) 123-4567",
    skills: ["JAVASCRIPT", "REACT", "NODE.JS", "THREE.JS", "UI/UX DESIGN", "WEBGL", "3D GRAPHICS"],
    experience: [
      {
        company: "Tech Innovations Inc.",
        title: "Senior Developer",
        startDate: "2020",
        endDate: "2023",
        description: "Led frontend development team for flagship product. Implemented modern React architecture and improved performance by 40%. Managed team of 5 developers."
      },
      {
        company: "Web Solutions Ltd.",
        title: "Frontend Developer",
        startDate: "2018",
        endDate: "2020",
        description: "Developed responsive web applications and collaborated with design team to implement user interfaces."
      }
    ],
    education: [
      {
        institution: "Tech University",
        degree: "Bachelor of Computer Science",
        startDate: "2014",
        endDate: "2018",
        gpa: "3.8/4.0"
      },
      {
        institution: "Code Academy",
        degree: "Advanced Web Development Certification",
        startDate: "2017",
        endDate: "2018"
      }
    ],
    references: [
      {
        name: "Jane Smith",
        position: "CTO at Tech Innovations",
        contact: "jane.smith@techinnovations.com"
      },
      {
        name: "Mike Johnson",
        position: "Lead Developer at Web Solutions",
        contact: "mike.johnson@websolutions.com"
      },
      {
        name: "Sarah Wilson",
        position: "Professor at Tech University",
        contact: "sarah.wilson@techuniversity.edu"
      }
    ]
  };

  const data = cvData || mockData;
  const gltf = useLoader(GLTFLoader, '/office/new-office-model.glb');

  useEffect(() => {
    if (gltf?.scene) {
      sceneRef.current = gltf.scene;
      
      console.log("Scene loaded, traversing objects...");
      
      // First pass: Ensure all text planes are visible
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
          console.log(`Found text plane: ${object.name}`);
          object.visible = true;
        }
      });
      
      // Second pass: Apply text content
      gltf.scene.traverse((object) => {
        if (object.name && object.isMesh) {
          let textContent = '';
          let isMainHeading = false;
          
          switch(object.name) {
            case 'Name':
              textContent = data.name || 'JOHN DOE';
              isMainHeading = true;
              console.log(`Applying Name: ${textContent}`);
              break;
            case 'About':
              textContent = data.about || 'Experienced professional with a passion for innovation and cutting-edge technology solutions.';
              console.log(`Applying About: ${textContent}`);
              break;
            case 'Experience':
              if (data.experience?.length > 0) {
                const expTexts = data.experience.map(exp => 
                  `${exp.title.toUpperCase()}\n${exp.company.toUpperCase()}\n${exp.startDate} - ${exp.endDate}\n${exp.description || ''}`
                );
                textContent = expTexts.join('\n\n');
              }
              break;
            case 'Education':
              if (data.education?.length > 0) {
                const eduTexts = data.education.map(edu => {
                  let eduText = `${edu.degree.toUpperCase()}\n${edu.institution.toUpperCase()}`;
                  if (edu.startDate && edu.endDate) {
                    eduText += `\n${edu.startDate} - ${edu.endDate}`;
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
              if (data.skills?.length > 0) {
                textContent = data.skills.join('\n').toUpperCase();
              }
              break;
            case 'Reference':
              if (data.references?.length > 0) {
                const refTexts = data.references.map(ref => 
                  `${ref.name.toUpperCase()}\n${ref.position.toUpperCase()}\n${ref.contact}`
                );
                textContent = refTexts.join('\n\n');
              }
              break;
            case 'Contact':
              let contactText = '';
              if (data.email) contactText += `${data.email}\n`;
              if (data.phone) contactText += `${data.phone}\n`;
              if (data.location) contactText += `${data.location}`;
              textContent = contactText || 'JOHN.DOE@EXAMPLE.COM\n+1 (555) 123-4567';
              break;
          }
          
          if (textContent) {
            console.log(`Applying text to ${object.name}`);
            applyTextToMesh(object, textContent, isMainHeading);
          } else {
            console.log(`No text content for ${object.name}`);
          }
        }
      });
    }
  }, [gltf, data]);

  const applyTextToMesh = (mesh, textContent, isMainHeading = false) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    // MASSIVE canvas for extremely large text
    canvas.width = 8192; // Double the previous size
    canvas.height = 4096;
    
    // LIGHT GREY background
    context.fillStyle = '#f3f4f6';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // PURE BLACK text
    context.fillStyle = '#000000';
    
    // EXTREMELY LARGE font sizes
    let fontSize, lineHeight, startX, startY;
    
    if (isMainHeading) {
      fontSize = 400; // HUGE for name
      context.font = `bold ${fontSize}px "Arial Black", Arial, sans-serif`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      lineHeight = 450;
      startX = canvas.width / 2;
      startY = canvas.height / 2;
    } else {
      fontSize = 200; // Still massive for other sections
      context.font = `bold ${fontSize}px "Arial Black", Arial, sans-serif`;
      context.textAlign = 'left';
      context.textBaseline = 'top';
      lineHeight = 240;
      startX = 200; // More padding
      startY = 200;
    }
    
    const lines = textContent.split('\n');
    
    // Strong shadow for maximum visibility
    context.shadowColor = 'rgba(0,0,0,0.5)';
    context.shadowBlur = 20;
    context.shadowOffsetX = 8;
    context.shadowOffsetY = 8;

    lines.forEach((line, index) => {
      if (isMainHeading) {
        context.fillText(line, startX, startY + index * lineHeight);
      } else if (index === 0 && (mesh.name === 'Experience' || mesh.name === 'Education' || mesh.name === 'Reference')) {
        // First line of multi-item sections - extra large
        context.save();
        context.font = `bold 280px "Arial Black", Arial, sans-serif`;
        context.fillText(line, startX, startY + index * lineHeight);
        context.restore();
      } else {
        // Regular content - still extremely large
        context.save();
        context.font = `bold 180px "Arial Black", Arial, sans-serif`;
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
    console.log(`Text applied to ${mesh.name} successfully`);
  };

  return (
    <group position={[0, 0, 0]}>
      {gltf?.scene && <primitive object={gltf.scene} />}
    </group>
  );
}

// Custom hook for CV data
function useCvData() {
  // Mock implementation - replace with your actual hook
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