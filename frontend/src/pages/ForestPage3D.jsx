// frontend/src/pages/ForestPage3D.jsx
import React, { Suspense, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Text, Html } from "@react-three/drei";
import { useSpring, animated } from '@react-spring/three';
import useCvData from "../hooks/useCVData";

// Placeholder components for 3D objects
const TreePlaceholder = ({ position, onClick, isHighlighted }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current && isHighlighted) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const { scale } = useSpring({
    scale: isHighlighted ? 1.2 : 1,
    config: { tension: 300, friction: 10 }
  });

  return (
    <animated.mesh
      ref={meshRef}
      position={position}
      onClick={onClick}
      scale={scale}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      <cylinderGeometry args={[0.3, 0.5, 4, 8]} />
      <meshLambertMaterial color={isHighlighted ? "#4ade80" : "#8b5a3c"} />
      {/* Tree crown */}
      <mesh position={[0, 3, 0]}>
        <sphereGeometry args={[1.5]} />
        <meshLambertMaterial color={isHighlighted ? "#22c55e" : "#22c55e"} />
      </mesh>
    </animated.mesh>
  );
};

const FireplacePlaceholder = ({ position, onClick, isHighlighted }) => {
  const flameRef = useRef();
  
  useFrame((state) => {
    if (flameRef.current) {
      flameRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      flameRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const { scale } = useSpring({
    scale: isHighlighted ? 1.1 : 1,
    config: { tension: 300, friction: 10 }
  });

  return (
    <animated.group 
      position={position} 
      onClick={onClick}
      scale={scale}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      {/* Fire pit base */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.3, 8]} />
        <meshLambertMaterial color="#444" />
      </mesh>
      {/* Logs */}
      <mesh position={[0.5, 0.2, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.1, 0.15, 1.5, 8]} />
        <meshLambertMaterial color="#8b5a3c" />
      </mesh>
      <mesh position={[-0.5, 0.2, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <cylinderGeometry args={[0.1, 0.15, 1.5, 8]} />
        <meshLambertMaterial color="#8b5a3c" />
      </mesh>
      {/* Flame */}
      <mesh ref={flameRef} position={[0, 1, 0]}>
        <coneGeometry args={[0.3, 1, 4]} />
        <meshLambertMaterial color={isHighlighted ? "#ff6b35" : "#ff4500"} />
      </mesh>
    </animated.group>
  );
};

const LogPlaceholder = ({ position, onClick, isHighlighted, rotation = [0, 0, 0] }) => {
  const { scale } = useSpring({
    scale: isHighlighted ? 1.1 : 1,
    config: { tension: 300, friction: 10 }
  });

  return (
    <animated.mesh
      position={position}
      rotation={rotation}
      onClick={onClick}
      scale={scale}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      <cylinderGeometry args={[0.2, 0.25, 2, 8]} />
      <meshLambertMaterial color={isHighlighted ? "#a0522d" : "#8b5a3c"} />
    </animated.mesh>
  );
};

const AnimalPlaceholder = ({ position, onClick, isHighlighted, type = "deer" }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const { scale } = useSpring({
    scale: isHighlighted ? 1.2 : 1,
    config: { tension: 300, friction: 10 }
  });

  return (
    <animated.group
      ref={meshRef}
      position={position}
      onClick={onClick}
      scale={scale}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 0.6, 0.4]} />
        <meshLambertMaterial color={isHighlighted ? "#d2691e" : "#8b4513"} />
      </mesh>
      {/* Head */}
      <mesh position={[0.7, 0.3, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.3]} />
        <meshLambertMaterial color={isHighlighted ? "#d2691e" : "#8b4513"} />
      </mesh>
      {/* Legs */}
      {[[-0.3, -0.5, -0.1], [-0.3, -0.5, 0.1], [0.3, -0.5, -0.1], [0.3, -0.5, 0.1]].map((pos, i) => (
        <mesh key={i} position={pos}>
          <cylinderGeometry args={[0.05, 0.08, 0.5]} />
          <meshLambertMaterial color={isHighlighted ? "#d2691e" : "#8b4513"} />
        </mesh>
      ))}
      {/* Antlers for deer */}
      {type === "deer" && (
        <>
          <mesh position={[0.8, 0.6, -0.1]}>
            <cylinderGeometry args={[0.02, 0.02, 0.6]} />
            <meshLambertMaterial color="#f5deb3" />
          </mesh>
          <mesh position={[0.8, 0.6, 0.1]}>
            <cylinderGeometry args={[0.02, 0.02, 0.6]} />
            <meshLambertMaterial color="#f5deb3" />
          </mesh>
        </>
      )}
    </animated.group>
  );
};

const RockPlaceholder = ({ position, onClick, isHighlighted }) => {
  const { scale } = useSpring({
    scale: isHighlighted ? 1.1 : 1,
    config: { tension: 300, friction: 10 }
  });

  return (
    <animated.mesh
      position={position}
      onClick={onClick}
      scale={scale}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      <sphereGeometry args={[0.5, 8, 6]} />
      <meshLambertMaterial color={isHighlighted ? "#a9a9a9" : "#696969"} />
    </animated.mesh>
  );
};

const InfoPanel = ({ title, content, onClose, position }) => {
  return (
    <Html position={position} center>
      <div className="bg-[#0e0e2c]/95 backdrop-blur-sm border border-green-400/30 rounded-lg p-6 max-w-md text-white shadow-2xl">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-green-400 text-xl font-bold">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ×
          </button>
        </div>
        <div className="text-sm leading-relaxed">
          {content}
        </div>
      </div>
    </Html>
  );
};

const Scene = () => {
  const [selectedObject, setSelectedObject] = useState(null);
  const { name, about, experience, education, skills } = useCvData() || {};

  const interactiveObjects = [
    {
      id: 'about-tree',
      component: TreePlaceholder,
      position: [-3, 2, 2],
      title: 'About Me',
      content: about || "I'm a passionate developer who loves creating immersive digital experiences."
    },
    {
      id: 'experience-fireplace',
      component: FireplacePlaceholder,
      position: [0, 0, 0],
      title: 'Experience',
      content: experience ? (
        <div>
          {experience.slice(0, 2).map((exp, i) => (
            <div key={i} className="mb-3">
              <div className="font-semibold text-green-300">{exp.title}</div>
              <div className="text-gray-300">{exp.company}</div>
              <div className="text-sm text-gray-400">{exp.startDate} - {exp.endDate}</div>
            </div>
          ))}
        </div>
      ) : "Click to explore my professional journey and the projects that fuel my passion."
    },
    {
      id: 'skills-log1',
      component: LogPlaceholder,
      position: [2, 0.2, 1],
      rotation: [0, Math.PI / 4, 0],
      title: 'Technical Skills',
      content: skills ? (
        <div>
          <div className="grid grid-cols-2 gap-2">
            {skills.slice(0, 6).map((skill, i) => (
              <div key={i} className="bg-green-400/20 px-2 py-1 rounded text-xs">
                {skill}
              </div>
            ))}
          </div>
        </div>
      ) : "My technical toolkit spans multiple domains and continues to grow with each project."
    },
    {
      id: 'education-rock',
      component: RockPlaceholder,
      position: [-2, 0.5, -1],
      title: 'Education',
      content: education ? (
        <div>
          {education.slice(0, 2).map((edu, i) => (
            <div key={i} className="mb-3">
              <div className="font-semibold text-green-300">{edu.degree}</div>
              <div className="text-gray-300">{edu.institution}</div>
              <div className="text-sm text-gray-400">{edu.endDate}</div>
            </div>
          ))}
        </div>
      ) : "The foundation of knowledge that shapes my approach to problem-solving."
    },
    {
      id: 'projects-deer',
      component: AnimalPlaceholder,
      position: [3, 1, -2],
      title: 'Projects & Achievements',
      content: "Discover the creative projects and meaningful achievements that define my journey."
    },
    {
      id: 'contact-log2',
      component: LogPlaceholder,
      position: [-1, 0.1, 3],
      rotation: [0, -Math.PI / 3, Math.PI / 12],
      title: 'Get In Touch',
      content: "Ready to collaborate? Let's connect and create something amazing together."
    }
  ];

  const handleObjectClick = (objectId) => {
    setSelectedObject(selectedObject === objectId ? null : objectId);
  };

  const selectedObjectData = selectedObject ? 
    interactiveObjects.find(obj => obj.id === selectedObject) : null;

  return (
    <>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshLambertMaterial color="#2d5016" />
      </mesh>

      {/* Interactive Objects */}
      {interactiveObjects.map((obj) => {
        const Component = obj.component;
        return (
          <Component
            key={obj.id}
            position={obj.position}
            rotation={obj.rotation}
            onClick={() => handleObjectClick(obj.id)}
            isHighlighted={selectedObject === obj.id}
            type={obj.type}
          />
        );
      })}

      {/* Ambient forest elements */}
      <TreePlaceholder position={[5, 2, 3]} onClick={() => {}} isHighlighted={false} />
      <TreePlaceholder position={[-5, 2, -3]} onClick={() => {}} isHighlighted={false} />
      <TreePlaceholder position={[4, 2, -4]} onClick={() => {}} isHighlighted={false} />
      <RockPlaceholder position={[1, 0.5, 4]} onClick={() => {}} isHighlighted={false} />
      <RockPlaceholder position={[-4, 0.5, 2]} onClick={() => {}} isHighlighted={false} />

      {/* Info Panel */}
      {selectedObjectData && (
        <InfoPanel
          title={selectedObjectData.title}
          content={selectedObjectData.content}
          onClose={() => setSelectedObject(null)}
          position={[selectedObjectData.position[0], selectedObjectData.position[1] + 3, selectedObjectData.position[2]]}
        />
      )}

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.8} 
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[0, 2, 0]} intensity={0.5} color="#ff6b35" />
    </>
  );
};

const ForestPage3D = () => {
  const { name } = useCvData() || {};

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-[#0a0a1a] to-[#0e0e2c] overflow-hidden">
      {/* Instructions */}
      <div className="absolute top-4 left-4 z-10 bg-[#0e0e2c]/80 backdrop-blur-sm border border-green-400/30 rounded-lg p-4 max-w-sm">
        <h3 className="text-green-400 font-bold mb-2">Welcome to {name}'s Forest</h3>
        <p className="text-white text-sm">
          Click on different objects to explore my portfolio. Use your mouse to navigate around the 3D scene.
        </p>
      </div>

      {/* Home button */}
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-green-400/20 hover:bg-green-400/30 border border-green-400/50 text-green-400 px-4 py-2 rounded-lg backdrop-blur-sm transition-colors"
        >
          Back to Portfolio Portal
        </button>
      </div>

      <Canvas
        camera={{
          position: [8, 6, 8],
          fov: 60,
          near: 0.1,
          far: 1000,
        }}
        shadows
      >
        <Suspense fallback={null}>
          <Scene />
          <Environment preset="forest" />
          <OrbitControls
            enablePan={true}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.2}
            minDistance={5}
            maxDistance={20}
            autoRotate={false}
            enableDamping
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>

      {/* Loading overlay */}
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-[#0e0e2c] z-20">
          <div className="text-green-400 text-xl">Loading your forest experience...</div>
        </div>
      }>
        <div />
      </Suspense>
    </div>
  );
};

export default ForestPage3D;