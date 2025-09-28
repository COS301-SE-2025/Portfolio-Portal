import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Html } from '@react-three/drei';

// Import GLTFLoader directly
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

export default function Office3DPage() {
  const { cvData } = useCvData();
  
  return (
    <div className="relative h-screen overflow-hidden">
      <Canvas
        camera={{ 
          position: [0, 8, 0], // Higher camera position
          fov: 60
        }}
        gl={{ alpha: true }}
      >
        <color attach="background" args={['#f5f5f7']} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 15, 10]} intensity={0.9} />
        <Environment preset="city" />
        
        <ErrorBoundary fallback={<FallbackModel />}>
          <Suspense fallback={<LoadingModel />}>
            <Office3DScene cvData={cvData} />
          </Suspense>
        </ErrorBoundary>

        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          minPolarAngle={Math.PI/6}
          maxPolarAngle={Math.PI/1.5}
          rotateSpeed={0.5}
          panSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}

function Office3DScene({ cvData }) {
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
          object.renderOrder = 1;
        }
      });
      
      gltf.scene.traverse((object) => {
        if (object.name && object.isMesh) {
          let textContent = '';
          let isHeading = false;
          
          switch(object.name) {
            case 'Name':
              textContent = data.name || 'John Doe';
              isHeading = true;
              break;
            case 'About':
              textContent = data.about || 'Experienced professional with a passion for innovation.';
              break;
            case 'Experience':
              if (data.experience?.length > 0) {
                const exp = data.experience[0]; // Take first experience
                textContent = `${exp.title}\n${exp.company}\n${exp.startDate} - ${exp.endDate}`;
                if (exp.description) {
                  textContent += `\n\n${exp.description}`;
                }
              }
              break;
            case 'Education':
              if (data.education?.length > 0) {
                const edu = data.education[0]; // Take first education
                textContent = `${edu.degree}\n${edu.institution}\n${edu.startDate} - ${edu.endDate}`;
                if (edu.gpa) {
                  textContent += `\nGPA: ${edu.gpa}`;
                }
              }
              break;
            case 'Skills':
              if (data.skills?.length > 0) {
                textContent = data.skills.join('\n');
              }
              break;
            case 'Reference':
              if (data.references?.length > 0) {
                const ref = data.references[0]; // Take first reference
                textContent = `${ref.name}\n${ref.position}\n${ref.contact}`;
              }
              break;
            case 'Contact':
              let contactText = '';
              if (data.email) contactText += `${data.email}\n`;
              if (data.phone) contactText += `${data.phone}`;
              textContent = contactText || 'john.doe@example.com\n+1 (555) 123-4567';
              break;
          }
          
          if (textContent) {
            if (object.material) {
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              canvas.width = 1024; // Larger canvas for better quality
              canvas.height = 512;
              
              // White background for the text plane
              context.fillStyle = '#ffffff';
              context.fillRect(0, 0, canvas.width, canvas.height);
              
              // Darker, bolder black text
              context.fillStyle = '#000000';
              context.font = 'bold 32px Arial'; // Bigger, bolder default font
              
              if (isHeading) {
                context.font = 'bold 56px Arial'; // Even bigger for headings
                context.textAlign = 'center';
                context.textBaseline = 'middle';
              } else {
                context.textAlign = 'left';
                context.textBaseline = 'top';
              }
              
              const lines = textContent.split('\n');
              const lineHeight = isHeading ? 60 : 36; // Increased line height
              const startX = isHeading ? canvas.width / 2 : 40;
              const startY = isHeading ? canvas.height / 2 : 40;

              lines.forEach((line, index) => {
                // For non-headings, make first line bold and bigger
                if (!isHeading && index === 0) {
                  context.save();
                  context.font = 'bold 28px Arial';
                  context.fillText(line, startX, startY + index * lineHeight);
                  context.restore();
                } else {
                  context.fillText(line, startX, startY + index * lineHeight);
                }
              });
              
              const texture = new THREE.CanvasTexture(canvas);
              texture.needsUpdate = true;
              
              const newMaterial = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: false,
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
    <group position={[0, 0, 0]}>
      {gltf?.scene && <primitive object={gltf.scene} />}
    </group>
  );
}

// Custom hook for CV data (you can replace this with your actual hook)
function useCvData() {
  // Mock implementation - replace with your actual hook
  return { cvData: null };
}

function LoadingModel() {
  return (
    <Html center>
      <div className="text-gray-800 text-center bg-white/80 p-6 rounded-lg backdrop-blur-sm border border-gray-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
        <p className="text-lg">Loading 3D environment...</p>
      </div>
    </Html>
  );
}

function FallbackModel() {
  return (
    <Html center>
      <div className="text-red-600 text-center bg-white/80 p-6 rounded-lg border border-gray-300">
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