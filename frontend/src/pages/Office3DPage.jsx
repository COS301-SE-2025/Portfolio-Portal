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
  
  const navigateToSection = (section) => {
    setActiveSection(section);
    if (sceneRef.current && controlsRef.current) {
      const cameraName = `Camera${section.charAt(0).toUpperCase() + section.slice(1)}`;
      const camera = sceneRef.current.getObjectByName(cameraName);
      
      if (camera && camera.isCamera) {
        console.log(`Moving to camera: ${cameraName}`, camera.position, camera.rotation);
        
        // Reset controls first to prevent rotation issues
        controlsRef.current.reset();
        
        // Set position and rotation directly
        controlsRef.current.object.position.copy(camera.position);
        controlsRef.current.object.rotation.copy(camera.rotation);
        
        // SPECIAL CASE: For Contact camera, apply different rotation
        if (section === 'contact') {
          console.log('Applying special rotation for Contact camera');
          // Try different rotation approach
          const contactRotation = new THREE.Euler(
            camera.rotation.x,
            camera.rotation.y + Math.PI / 2, // 90 degrees right
            camera.rotation.z
          );
          controlsRef.current.object.rotation.copy(contactRotation);
        }
        
        // Calculate target based on camera direction
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        const target = camera.position.clone().add(direction.multiplyScalar(5));
        controlsRef.current.target.copy(target);
        
        // Force immediate update
        controlsRef.current.update();
      } else {
        console.log(`Camera ${cameraName} not found in model. Available objects:`, 
          Array.from(sceneRef.current.children).map(obj => obj.name));
      }
    }
  };

  // Function to set initial camera - will be called from Office3DScene
  const setInitialCamera = () => {
    if (sceneRef.current && controlsRef.current && isInitialLoad.current) {
      const startCamera = sceneRef.current.getObjectByName('CameraStart');
      
      if (startCamera && startCamera.isCamera) {
        console.log('Setting initial camera to CameraStart');
        // Reset controls first
        controlsRef.current.reset();
        
        // Set initial position and target directly
        controlsRef.current.object.position.copy(startCamera.position);
        controlsRef.current.object.rotation.copy(startCamera.rotation);
        
        const direction = new THREE.Vector3();
        startCamera.getWorldDirection(direction);
        const target = startCamera.position.clone().add(direction.multiplyScalar(5));
        controlsRef.current.target.copy(target);
        
        controlsRef.current.update();
        isInitialLoad.current = false;
      } else {
        console.log('CameraStart not found, using default camera position');
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
        gl={{ 
          alpha: true,
          powerPreference: "high-performance",
          antialias: true
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#e5e7eb']} />
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 15, 10]} intensity={1.8} />
        <pointLight position={[0, 8, 0]} intensity={1.0} />
        <Environment preset="city" />
        
        <ErrorBoundary fallback={<FallbackModel />}>
          <Suspense fallback={<LoadingModel />}>
            <Office3DScene 
              cvData={cvData} 
              sceneRef={sceneRef} 
              onSceneLoaded={setInitialCamera}
            />
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
          enableDamping={false}
        />
      </Canvas>
    </div>
  );
}

function Office3DScene({ cvData, sceneRef, onSceneLoaded }) {
  const gltf = useLoader(GLTFLoader, '/office/new-office-model.glb', (loader) => {
    loader.manager.onStart = () => console.log('Loading model...');
  });

  useEffect(() => {
    if (gltf && gltf.scene) {
      sceneRef.current = gltf.scene;
      
      console.log("=== CV DATA DEBUG ===");
      console.log("Full CV Data:", cvData);
      console.log("Name:", cvData && cvData.name);
      console.log("Title:", cvData && cvData.title);
      console.log("Job Title:", cvData && cvData.jobTitle);
      console.log("Profession:", cvData && cvData.profession);
      
      // Check if all cameras exist
      const cameras = ['CameraStart', 'CameraNameabout', 'CameraExperience', 'CameraEducation', 'CameraSkills', 'CameraReference', 'CameraContact'];
      cameras.forEach(camName => {
        const camera = gltf.scene.getObjectByName(camName);
        console.log(`${camName} found:`, !!camera);
        if (camera) {
          console.log(`${camName} position:`, camera.position);
          console.log(`${camName} rotation:`, camera.rotation);
        }
      });
      
      // Apply text to all planes
      gltf.scene.traverse((object) => {
        if (object.name && object.isMesh) {
          let textContent = '';
          let isNameAbout = false;
          
          switch(object.name) {
            case 'NameAbout':
              const name = (cvData && cvData.name) || 'Default Name';
              // Use actual profession from CV data - check multiple possible fields
              const profession = (cvData && (cvData.title || cvData.jobTitle || cvData.profession)) || 'Full Stack Developer';
              const about = (cvData && (cvData.about || cvData.summary)) || 'Experienced professional with a passion for innovation and cutting-edge technology solutions.';
              
              textContent = `${name}\n\n${profession}\n\n${about}`;
              isNameAbout = true;
              console.log('NameAbout data:', { name, profession, about });
              break;
              
            case 'Experience':
              let experienceContent = "EXPERIENCE\n\n";
              if (cvData && cvData.experience && Array.isArray(cvData.experience) && cvData.experience.length > 0) {
                cvData.experience.forEach((exp, index) => {
                  experienceContent += `${exp.title || 'Position'}\n${exp.company || 'Company'}\n${exp.startDate || 'Start'} - ${exp.endDate || 'End'}`;
                  
                  if (exp.extra && Array.isArray(exp.extra) && exp.extra.length > 0) {
                    exp.extra.forEach(extra => {
                      const cleanExtra = extra.replace('¢ ', '');
                      experienceContent += `\n• ${cleanExtra}`;
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
              if (cvData && cvData.education && Array.isArray(cvData.education) && cvData.education.length > 0) {
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
              if (cvData && cvData.skills && Array.isArray(cvData.skills) && cvData.skills.length > 0) {
                skillsContent += cvData.skills.join('\n');
              } else {
                skillsContent += "JavaScript\nReact\nNode.js\nThree.js\nUI/UX Design";
              }
              textContent = skillsContent;
              break;
              
            case 'Reference':
              let referenceContent = "REFERENCES\n\n";
              if (cvData && cvData.references && Array.isArray(cvData.references) && cvData.references.length > 0) {
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
              const email = (cvData && cvData.email) || 'email@example.com';
              const phone = (cvData && cvData.phone) || '+1 (555) 123-4567';
              const location = (cvData && cvData.location) || '';
              
              contactContent += `${email}\n${phone}`;
              if (location) {
                contactContent += `\n${location}`;
              }
              textContent = contactContent;
              console.log('Contact text content applied to Contact plane');
              break;

            default:
              if (object.name.includes('Contact') || object.name.includes('contact')) {
                console.log('Found potential contact plane:', object.name);
              }
          }
          
          if (textContent) {
            console.log(`Applying text to ${object.name}`);
            applyTextToMesh(object, textContent, isNameAbout);
          }
        }
      });
      
      // Call the onSceneLoaded callback after everything is set up
      if (onSceneLoaded) {
        setTimeout(() => {
          onSceneLoaded();
        }, 100);
      }
    }
  }, [gltf, cvData, onSceneLoaded]);

  const applyTextToMesh = (mesh, textContent, isNameAbout = false) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    // HIGH RES for text
    canvas.width = 6144;
    canvas.height = 3072;
    
    // Enable high quality rendering for text
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    
    // LIGHT GREY background
    context.fillStyle = '#c8c8c8ff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // PURE BLACK text for maximum contrast
    context.fillStyle = '#000000';
    
    const lines = textContent.split('\n');
    
    if (isNameAbout) {
      // NameAbout section - centered layout
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      
      let currentY = 450;
      
      lines.forEach((line, index) => {
        if (index === 0) {
          // Name - EXTRA LARGE
          context.font = 'bold 400px "Arial Black", Arial, sans-serif';
          context.fillText(line, canvas.width / 2, currentY);
          currentY += 450;
        } else if (index === 2) {
          // Profession - EXTRA LARGE
          context.font = 'bold 300px "Arial Black", Arial, sans-serif';
          context.fillText(line, canvas.width / 2, currentY);
          currentY += 400;
        } else if (index === 4) {
          // About - LARGER with proper wrapping
          context.font = 'bold 140px "Arial Black", Arial, sans-serif';
          const wrappedLines = wrapText(context, line, canvas.width * 0.8, 140);
          wrappedLines.forEach((wrappedLine, wrappedIndex) => {
            context.fillText(wrappedLine, canvas.width / 2, currentY + (wrappedIndex * 170));
          });
        }
      });
    } else {
      // Other sections with headings - left aligned
      context.textAlign = 'left';
      context.textBaseline = 'top';
      
      let currentY = 225;
      const maxWidth = canvas.width - 450;
      
      lines.forEach((line, index) => {
        if (index === 0) {
          // Section heading - EXTRA LARGE
          context.font = 'bold 320px "Arial Black", Arial, sans-serif';
          context.fillText(line, 225, currentY);
          currentY += 380;
        } else if (line.trim() === '') {
          // Empty line for spacing
          currentY += 150;
        } else if (line.startsWith('•')) {
          // Bullet points - LARGER
          context.font = 'bold 120px "Arial Black", Arial, sans-serif';
          const bulletText = line.substring(1).trim();
          const wrappedBulletLines = wrapText(context, bulletText, maxWidth - 75, 120);
          wrappedBulletLines.forEach((wrappedLine, wrappedIndex) => {
            const prefix = wrappedIndex === 0 ? '• ' : '  ';
            context.fillText(prefix + wrappedLine, 260, currentY + (wrappedIndex * 145));
          });
          currentY += (wrappedBulletLines.length * 145);
        } else {
          // Content - LARGER with wrapping
          context.font = 'bold 150px "Arial Black", Arial, sans-serif';
          const wrappedLines = wrapText(context, line, maxWidth, 150);
          wrappedLines.forEach((wrappedLine, wrappedIndex) => {
            context.fillText(wrappedLine, 225, currentY + (wrappedIndex * 185));
          });
          currentY += (wrappedLines.length * 185);
        }
      });
    }
    
    // Create texture with optimized settings
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 4;
    texture.needsUpdate = true;
    
    // Apply material to the mesh
    mesh.material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: false,
      side: THREE.DoubleSide,
      toneMapped: false
    });
    
    // Reduce mesh complexity for non-text objects
    if (!mesh.name.includes('NameAbout') && !mesh.name.includes('Experience') && 
        !mesh.name.includes('Education') && !mesh.name.includes('Skills') && 
        !mesh.name.includes('Reference') && !mesh.name.includes('Contact')) {
      mesh.material.map.anisotropy = 2;
    }
    
    mesh.visible = true;
    console.log(`✅ Text applied to ${mesh.name}`);
  };

  // Helper function to wrap text to fit within maxWidth
  const wrapText = (context, text, maxWidth, fontSize) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = context.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  return (
    <group position={[0, 0, 0]}>
      {gltf && gltf.scene && <primitive object={gltf.scene} />}
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
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h2 className="font-bold">Something went wrong.</h2>
          <p>Please refresh the page or try again later.</p>
        </div>
      );
    }

    return this.props.children; 
  }
}