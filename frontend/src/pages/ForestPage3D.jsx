//frontend/src/pages/ForestPage3D.jsx
import React, { Suspense, useState, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, Text, Html, Stars } from "@react-three/drei";
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import useCvData from "../hooks/useCVData";

// WASD Movement & Zoom Hook
const useWASDMovement = () => {
  const { camera } = useThree();
  const [keys, setKeys] = useState({
    w: false,
    a: false,
    s: false,
    d: false,
  });

  const keysPressed = useRef({
    plus: false,
    minus: false,
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      
      // Movement keys
      if (['w', 'a', 's', 'd'].includes(key)) {
        setKeys(prev => ({ ...prev, [key]: true }));
        event.preventDefault();
      }
      
      // Zoom keys 
      if (event.key === '+' || event.key === '=') {
        keysPressed.current.plus = true;
        event.preventDefault();
      }
      if (event.key === '-' || event.key === '_') {
        keysPressed.current.minus = true;
        event.preventDefault();
      }
    };

    const handleKeyUp = (event) => {
      const key = event.key.toLowerCase();
      
      // Movement keys
      if (['w', 'a', 's', 'd'].includes(key)) {
        setKeys(prev => ({ ...prev, [key]: false }));
        event.preventDefault();
      }
      
      // Zoom keys
      if (event.key === '+' || event.key === '=') {
        keysPressed.current.plus = false;
        event.preventDefault();
      }
      if (event.key === '-' || event.key === '_') {
        keysPressed.current.minus = false;
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (!camera) return;

    const moveSpeed = 8;
    const zoomSpeed = 20;
    const moveVector = new THREE.Vector3();

    // Get camera's forward & right vectors
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0; // Keep movement horizontal
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    // Calc. movement based on pressed keys
    if (keys.w) moveVector.add(forward);
    if (keys.s) moveVector.sub(forward);
    if (keys.d) moveVector.add(right);
    if (keys.a) moveVector.sub(right);

    // Apply movement
    if (moveVector.length() > 0) {
      moveVector.normalize().multiplyScalar(moveSpeed * delta);
      camera.position.add(moveVector);
    }

    // Handle zoom with +/- keys
    if (keysPressed.current.plus) {
      const zoomVector = forward.clone().multiplyScalar(zoomSpeed * delta);
      camera.position.add(zoomVector);
    }
    if (keysPressed.current.minus) {
      const zoomVector = forward.clone().multiplyScalar(-zoomSpeed * delta);
      camera.position.add(zoomVector);
    }
  });
};

// Camera Controller Component
const CameraController = () => {
  useWASDMovement();
  return null;
};

// ADDED: TentPlaceholder Component
const TentPlaceholder = ({ position, onClick, isHighlighted }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current && (isHighlighted || hovered)) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const { scale, emissiveIntensity } = useSpring({
    scale: isHighlighted ? 1.2 : hovered ? 1.05 : 1,
    emissiveIntensity: (isHighlighted || hovered) ? 0.3 : 0,
    config: { tension: 300, friction: 10 }
  });

  const handlePointerOver = () => {
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  return (
    <animated.group
      ref={meshRef}
      position={position}
      onClick={onClick}
      scale={scale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Tent base - rectangular floor */}
      {/* <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.5, 0.2, 2]} />
        <animated.meshLambertMaterial 
          color={isHighlighted || hovered ? "#d2b48c" : "#f5e6d3"}
          emissive={isHighlighted || hovered ? "#ffebcd" : "#000000"}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh> */}
      
      {/* Tent body - triangular prism */}
      <mesh position={[1.8, 0, -8]} rotation={[0, 0, 0]}>
        <coneGeometry args={[3.12, 5.72, 7.8]} />
        <animated.meshLambertMaterial 
          color={isHighlighted || hovered ? "#deb887" : "#f5deb3"}
          emissive={isHighlighted || hovered ? "#fff8dc" : "#000000"}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      
      {/* Tent door - triangular opening */}
      {/* <mesh position={[0, 0.8, 1.05]} rotation={[0, 0, 0]}>
        <planeGeometry args={[0.8, 1.2]} />
        <animated.meshLambertMaterial 
          color={isHighlighted || hovered ? "#8b7355" : "#a0522d"}
          emissive={isHighlighted || hovered ? "#d2691e" : "#000000"}
          emissiveIntensity={emissiveIntensity}
          side={THREE.DoubleSide}
          transparent={true}
          opacity={0.8}
        />
      </mesh> */}
      
      {/* Tent pole in front */}
      {/* <mesh position={[2, 0, -8]}>
        <cylinderGeometry args={[0.03, 0.03, 2.2]} />
        <meshLambertMaterial color="#8b4513" />
      </mesh> */}
      
      {/* Small flag on top */}
      {/* <mesh position={[2, 2.3, -6]}>
        <boxGeometry args={[0.05, 0.3, 0.3]} />
        <meshLambertMaterial color="#ff6b6b" />
      </mesh> */}
    </animated.group>
  );
};

const PineTreePlaceholder = ({ position, onClick, isHighlighted, isInteractive = true }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current && (isHighlighted || hovered)) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const { scale, emissiveIntensity } = useSpring({
    scale: isHighlighted ? 1.2 : hovered ? 1.05 : 1,
    emissiveIntensity: (isHighlighted || hovered) ? 0.3 : 0,
    config: { tension: 300, friction: 10 }
  });

  const handlePointerOver = () => {
    if (isInteractive) {
      setHovered(true);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = () => {
    if (isInteractive) {
      setHovered(false);
      document.body.style.cursor = 'auto';
    }
  };

  return (
    <animated.group
      ref={meshRef}
      position={position}
      onClick={isInteractive ? onClick : undefined}
      scale={scale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Trunk */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
        <animated.meshLambertMaterial 
          color={isHighlighted || hovered ? "#a0522d" : "#8b5a3c"}
          emissive={isHighlighted || hovered ? "#ff6600" : "#000000"}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      
      {/* Pine layers - bottom to top, getting smaller */}
      <mesh position={[0, 2.5, 0]}>
        <coneGeometry args={[1.8, 2, 8]} />
        <animated.meshLambertMaterial 
          color={isHighlighted || hovered ? "#32cd32" : "#228b22"}
          emissive={isHighlighted || hovered ? "#00ff00" : "#000000"}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      
      <mesh position={[0, 3.5, 0]}>
        <coneGeometry args={[1.5, 2, 8]} />
        <animated.meshLambertMaterial 
          color={isHighlighted || hovered ? "#32cd32" : "#228b22"}
          emissive={isHighlighted || hovered ? "#00ff00" : "#000000"}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      
      <mesh position={[0, 4.5, 0]}>
        <coneGeometry args={[1.2, 2, 8]} />
        <animated.meshLambertMaterial 
          color={isHighlighted || hovered ? "#32cd32" : "#228b22"}
          emissive={isHighlighted || hovered ? "#00ff00" : "#000000"}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      
      <mesh position={[0, 5.5, 0]}>
        <coneGeometry args={[0.8, 1.5, 8]} />
        <animated.meshLambertMaterial 
          color={isHighlighted || hovered ? "#32cd32" : "#228b22"}
          emissive={isHighlighted || hovered ? "#00ff00" : "#000000"}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
    </animated.group>
  );
};

const FireplacePlaceholder = ({ position, onClick, isHighlighted }) => {
  const flameRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (flameRef.current) {
      flameRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      flameRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const { scale, emissiveIntensity } = useSpring({
    scale: isHighlighted ? 1.1 : hovered ? 1.05 : 1,
    emissiveIntensity: (isHighlighted || hovered) ? 0.4 : 0.1,
    config: { tension: 300, friction: 10 }
  });

  return (
    <animated.group 
      position={position} 
      onClick={onClick}
      scale={scale}
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Fire pit base */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.3, 8]} />
        <animated.meshLambertMaterial 
          color="#444"
          emissive={isHighlighted || hovered ? "#ca5e16ff" : "#000000"}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      {/* Logs */}
      <mesh position={[0.5, 0.2, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.1, 0.15, 1.5, 8]} />
        <animated.meshLambertMaterial 
          color="#8b5a3c"
          emissive={isHighlighted || hovered ? "#ff6600" : "#000000"}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      <mesh position={[-0.5, 0.2, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <cylinderGeometry args={[0.1, 0.15, 1.5, 8]} />
        <animated.meshLambertMaterial 
          color="#8b5a3c"
          emissive={isHighlighted || hovered ? "#ff6600" : "#000000"}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      {/* Flame */}
      <mesh ref={flameRef} position={[0, 1, 0]}>
        <coneGeometry args={[0.3, 1, 4]} />
        <animated.meshLambertMaterial 
          color={isHighlighted || hovered ? "#ff6b35" : "#ce651aff"}
          emissive="#d7621eff"
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
    </animated.group>
  );
};


const LogPlaceholder = ({ position, onClick, isHighlighted, rotation = [0, 0, 0], isInteractive = true }) => {
  const [hovered, setHovered] = useState(false);
  
  const { scale, emissiveIntensity } = useSpring({
    scale: isHighlighted ? 1.1 : (hovered && isInteractive) ? 1.05 : 1,
    emissiveIntensity: (isHighlighted || (hovered && isInteractive)) ? 0.3 : 0,
    config: { tension: 300, friction: 10 }
  });

  const handlePointerOver = () => {
    if (isInteractive) {
      setHovered(true);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = () => {
    if (isInteractive) {
      setHovered(false);
      document.body.style.cursor = 'auto';
    }
  };

  return (
    <animated.mesh
      position={position}
      rotation={rotation}
      onClick={isInteractive ? onClick : undefined}
      scale={scale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <cylinderGeometry args={[0.2, 0.25, 2, 8]} />
      <animated.meshLambertMaterial 
        color={(isHighlighted || (hovered && isInteractive)) ? "#a0522d" : "#8b5a3c"}
        emissive={(isHighlighted || (hovered && isInteractive)) ? "#ff6600" : "#000000"}
        emissiveIntensity={emissiveIntensity}
      />
    </animated.mesh>
  );
};

const RockPlaceholder = ({ position, onClick, isHighlighted, isInteractive = true }) => {
  const [hovered, setHovered] = useState(false);
  
  const { scale, emissiveIntensity } = useSpring({
    scale: isHighlighted ? 1.1 : (hovered && isInteractive) ? 1.05 : 1,
    emissiveIntensity: (isHighlighted || (hovered && isInteractive)) ? 0.2 : 0,
    config: { tension: 300, friction: 10 }
  });

  const handlePointerOver = () => {
    if (isInteractive) {
      setHovered(true);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = () => {
    if (isInteractive) {
      setHovered(false);
      document.body.style.cursor = 'auto';
    }
  };

  return (
    <animated.mesh
      position={position}
      onClick={isInteractive ? onClick : undefined}
      scale={scale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <sphereGeometry args={[0.5, 8, 6]} />
      <animated.meshLambertMaterial 
        color={(isHighlighted || (hovered && isInteractive)) ? "#a9a9a9" : "#696969"}
        emissive={(isHighlighted || (hovered && isInteractive)) ? "#4444ff" : "#000000"}
        emissiveIntensity={emissiveIntensity}
      />
    </animated.mesh>
  );
};


// Shrub Component - small bushes
const ShrubPlaceholder = ({ position, scale = 1 }) => {
  return (
    <group position={position} scale={scale}>
      {/* Main shrub body */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.4, 6, 4]} />
        <meshLambertMaterial color="#3a7d34" />
      </mesh>
      {/* Smaller top part */}
      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.3, 6, 4]} />
        <meshLambertMaterial color="#4a9d44" />
      </mesh>
    </group>
  );
};

// Flower Component - small colourful flowers
const FlowerPlaceholder = ({ position, scale = 1, color = "#ff6b6b" }) => {
  return (
    <group position={position} scale={scale}>
      {/* Stem */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 4]} />
        <meshLambertMaterial color="#4a7c4a" />
      </mesh>
      {/* Flower head */}
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.1, 6, 4]} />
        <meshLambertMaterial color={color} />
      </mesh>
    </group>
  );
};

// Pebble Component 
const PebblePlaceholder = ({ position, scale = 1 }) => {
  const size = 0.1 + Math.random() * 0.1;
  return (
    <mesh position={position} scale={[scale, scale * 0.7, scale]}>
      <sphereGeometry args={[size, 5, 4]} />
      <meshLambertMaterial color="#7a7a7a" />
    </mesh>
  );
};

// Mushroom Component
const MushroomPlaceholder = ({ position, scale = 1 }) => {
  return (
    <group position={position} scale={scale}>
      {/* Stem */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.2, 4]} />
        <meshLambertMaterial color="#f0f0f0" />
      </mesh>
      {/* Cap */}
      <mesh position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.08, 6, 4]} />
        <meshLambertMaterial color="#ff4444" />
      </mesh>
    </group>
  );
};

const AnimalPlaceholder = ({ position, onClick, isHighlighted, type = "deer" }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const { scale, emissiveIntensity } = useSpring({
    scale: isHighlighted ? 1.2 : hovered ? 1.1 : 1,
    emissiveIntensity: (isHighlighted || hovered) ? 0.2 : 0,
    config: { tension: 300, friction: 10 }
  });

  return (
    <animated.group
      ref={meshRef}
      position={position}
      onClick={onClick}
      scale={scale}
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 0.6, 0.4]} />
        <animated.meshLambertMaterial 
          color={isHighlighted || hovered ? "#d2691e" : "#8b4513"}
          emissive={isHighlighted || hovered ? "#ff6600" : "#000000"}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      {/* Head */}
      <mesh position={[0.7, 0.3, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.3]} />
        <animated.meshLambertMaterial 
          color={isHighlighted || hovered ? "#d2691e" : "#8b4513"}
          emissive={isHighlighted || hovered ? "#ff6600" : "#000000"}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      {/* Legs */}
      {[[-0.3, -0.5, -0.1], [-0.3, -0.5, 0.1], [0.3, -0.5, -0.1], [0.3, -0.5, 0.1]].map((pos, i) => (
        <mesh key={i} position={pos}>
          <cylinderGeometry args={[0.05, 0.08, 0.5]} />
          <animated.meshLambertMaterial 
            color={isHighlighted || hovered ? "#d2691e" : "#8b4513"}
            emissive={isHighlighted || hovered ? "#ff6600" : "#000000"}
            emissiveIntensity={emissiveIntensity}
          />
        </mesh>
      ))}
      {/* Antlers for deer */}
      {type === "deer" && (
        <>
          <mesh position={[0.8, 0.6, -0.1]}>
            <cylinderGeometry args={[0.02, 0.02, 0.6]} />
            <animated.meshLambertMaterial 
              color="#f5deb3"
              emissive={isHighlighted || hovered ? "#ffff88" : "#000000"}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
          <mesh position={[0.8, 0.6, 0.1]}>
            <cylinderGeometry args={[0.02, 0.02, 0.6]} />
            <animated.meshLambertMaterial 
              color="#f5deb3"
              emissive={isHighlighted || hovered ? "#ffff88" : "#000000"}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
        </>
      )}
    </animated.group>
  );
};

const InfoPanel = ({ title, content, onClose, position }) => {
  return (
    <Html position={position} center>
      <div className="bg-[#0e0e2c]/95 backdrop-blur-sm border border-green-400/30 rounded-lg p-6 max-w-md text-white shadow-2xl animate-pulse">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-green-400 text-xl font-bold">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl hover:bg-red-500/20 rounded px-2"
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
      component: PineTreePlaceholder,
      position: [-4, 0, 4],
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
      id: 'camping-tent',
      component: TentPlaceholder,
      position: [-1.5, 0, 2.5],
      title: '🏕️ Skills',
      content: skills || "When I'm not coding, you'll find me exploring the great outdoors! I love camping, hiking, and finding inspiration in nature. This tent represents my adventurous spirit and love for discovering new places."
    }
  ];

  const handleObjectClick = (objectId) => {
    setSelectedObject(selectedObject === objectId ? null : objectId);
  };

  const selectedObjectData = selectedObject ? 
    interactiveObjects.find(obj => obj.id === selectedObject) : null;

  return (
    <>
      {/* Camera Controller for WASD movement */}
      <CameraController />
      
      {/* Starry Sky */}
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={0.5}
      />

      {/* Ground - Large forest floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[90, 90]} />
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
      {/* Ambient forest elements - Original Pine trees */}
      <PineTreePlaceholder position={[5, 0, 3]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[-5, 0, -3]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[4, 0, -4]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[-3, 0, -4]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[6, 0, 0]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      
      {/* Additional Pine Trees - Ring 1 (medium distance 7-9 units) */}
      <PineTreePlaceholder position={[8, 0, 5]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[-8, 0, 4]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[7, 0, -7]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[-6, 0, -8]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[9, 0, -2]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[-7, 0, 6]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[5, 0, -9]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[-9, 0, -1]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      
      {/* Additional Pine Trees - Ring 2 (far distance 10-15 units) */}
      <PineTreePlaceholder position={[12, 0, 8]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[-12, 0, 7]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[11, 0, -10]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[-10, 0, -12]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[15, 0, 3]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[-13, 0, 2]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[14, 0, -5]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[-15, 0, -6]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[8, 0, 12]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[-9, 0, 11]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      
      {/* Additional Pine Trees - Ring 3 (very far distance 16-22 units) */}
      <PineTreePlaceholder position={[18, 0, 10]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[-18, 0, 9]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[17, 0, -12]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[-16, 0, -14]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[20, 0, 5]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[-19, 0, 4]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[16, 0, -8]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[-17, 0, -7]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[13, 0, 15]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[-14, 0, 16]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[22, 0, -3]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[-21, 0, -2]} onClick={() => {}} isHighlighted={false} isInteractive={false} />


      <PineTreePlaceholder position={[10, 0, 18]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[9, 0, -18]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[-12, 0, 17]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[-14, 0, -16]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[5, 0, 20]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[4, 0, -19]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[-8, 0, 16]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[-7, 0, -17]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[15, 0, 13]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[16, 0, -14]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[-3, 0, 22]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <PineTreePlaceholder position={[-2, 0, -21]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      
      {/* Original Rocks */}
      <RockPlaceholder position={[1, 0, 4]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <RockPlaceholder position={[-4, 0.1, 2]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      
      {/* Additional Rocks - 20 more scattered throughout */}
      <RockPlaceholder position={[6, 0.1, 7]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <RockPlaceholder position={[-7, 0.1, -5]} onClick={() => {}} isHighlighted={false} isInteractive={false}  />
      <RockPlaceholder position={[9, 0.1, -8]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <RockPlaceholder position={[-8, 0.1, 9]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <RockPlaceholder position={[11, 0.1, 4]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <RockPlaceholder position={[-12, 0.1, -7]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <RockPlaceholder position={[13, 0.1, -11]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <RockPlaceholder position={[-14, 0.1, 8]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <RockPlaceholder position={[16, 0.1, 6]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <RockPlaceholder position={[-15, 0.1, -9]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <RockPlaceholder position={[18, 0.1, -4]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <RockPlaceholder position={[-17, 0.1, 3]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <RockPlaceholder position={[12, 0.1, 14]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <RockPlaceholder position={[-13, 0.1, -15]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <RockPlaceholder position={[20, 0.1, 8]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <RockPlaceholder position={[-19, 0.1, -6]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <RockPlaceholder position={[7, 0.1, -13]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <RockPlaceholder position={[-10, 0.1, 12]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <RockPlaceholder position={[3, 0.1, -7]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <RockPlaceholder position={[-5, 0.1, -11]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      
      {/* Additional Logs - 20 scattered with random rotations */}
      <LogPlaceholder position={[4, 0.1, 6]} rotation={[0, Math.PI / 3, 0]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <LogPlaceholder position={[-6, 0.1, -4]} rotation={[0, -Math.PI / 4, 0]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <LogPlaceholder position={[8, 0.1, -6]} rotation={[0, Math.PI / 6, 0]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <LogPlaceholder position={[-9, 0.1, 5]} rotation={[0, -Math.PI / 2, 0]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <LogPlaceholder position={[10, 0.1, 9]} rotation={[0, Math.PI / 5, 0]} onClick={() => {}} isHighlighted={false} />
      <LogPlaceholder position={[-11, 0.1, -8]} rotation={[0, -Math.PI / 3, 0]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <LogPlaceholder position={[14, 0.1, 7]} rotation={[0, Math.PI / 7, 0]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <LogPlaceholder position={[-13, 0.1, -10]} rotation={[0, -Math.PI / 6, 0]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <LogPlaceholder position={[15, 0.1, -13]} rotation={[0, Math.PI / 4, 0]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <LogPlaceholder position={[-16, 0.1, 11]} rotation={[0, -Math.PI / 5, 0]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <LogPlaceholder position={[17, 0.1, 4]} rotation={[0, Math.PI / 8, 0]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <LogPlaceholder position={[-18, 0.1, -5]} rotation={[0, -Math.PI / 7, 0]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <LogPlaceholder position={[19, 0.1, -9]} rotation={[0, Math.PI / 3, 0]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <LogPlaceholder position={[-20, 0.1, 7]} rotation={[0, -Math.PI / 4, 0]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <LogPlaceholder position={[11, 0.1, -15]} rotation={[0, Math.PI / 6, 0]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <LogPlaceholder position={[-12, 0.1, 13]} rotation={[0, -Math.PI / 8, 0]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <LogPlaceholder position={[6, 0.1, -11]} rotation={[0, Math.PI / 5, 0]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <LogPlaceholder position={[-7, 0.1, 10]} rotation={[0, -Math.PI / 3, 0]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <LogPlaceholder position={[21, 0.1, 2]} rotation={[0, Math.PI / 7, 0]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
      <LogPlaceholder position={[-22, 0.1, -3]} rotation={[0, -Math.PI / 6, 0]} onClick={() => {}} isHighlighted={false} isInteractive={false} />



{/* Random Shrubs - scattered around the forest */}
{/* <ShrubPlaceholder position={[2, 0, 3]} scale={0.8} />
<ShrubPlaceholder position={[-3, 0, 4]} scale={1.1} />
<ShrubPlaceholder position={[5, 0, -2]} scale={0.9} /> */}
<ShrubPlaceholder position={[-6, 0, -3]} scale={1.2} />
<ShrubPlaceholder position={[8, 0, 1]} scale={0.7} />
<ShrubPlaceholder position={[-9, 0, 2]} scale={1.0} />
<ShrubPlaceholder position={[3, 0, -7]} scale={0.8} />
<ShrubPlaceholder position={[-4, 0, -8]} scale={1.1} />
<ShrubPlaceholder position={[10, 0, -5]} scale={0.9} />
<ShrubPlaceholder position={[-11, 0, -6]} scale={1.3} />
<ShrubPlaceholder position={[7, 0, 9]} scale={0.8} />
<ShrubPlaceholder position={[-8, 0, 10]} scale={1.0} />
<ShrubPlaceholder position={[12, 0, 2]} scale={1.1} />
<ShrubPlaceholder position={[-13, 0, 3]} scale={0.9} />
<ShrubPlaceholder position={[4, 0, 12]} scale={1.2} />

{/* Random Flowers - colorful accents */}
{/* <FlowerPlaceholder position={[1, 0, 2]} color="#ff6b6b" />
<FlowerPlaceholder position={[-2, 0, 3]} color="#4ecdc4" />
<FlowerPlaceholder position={[4, 0, -1]} color="#ffd166" />
<FlowerPlaceholder position={[-5, 0, -2]} color="#ff9ff3" />
<FlowerPlaceholder position={[6, 0, 4]} color="#6a0572" />
<FlowerPlaceholder position={[-7, 0, 5]} color="#1a936f" />
<FlowerPlaceholder position={[3, 0, -6]} color="#f28482" />
<FlowerPlaceholder position={[-4, 0, -7]} color="#84a98c" />
<FlowerPlaceholder position={[9, 0, -3]} color="#e76f51" />
<FlowerPlaceholder position={[-10, 0, -4]} color="#2a9d8f" />
<FlowerPlaceholder position={[5, 0, 8]} color="#9b5de5" />
<FlowerPlaceholder position={[-6, 0, 9]} color="#00bbf9" />
<FlowerPlaceholder position={[11, 0, 1]} color="#fee440" />
<FlowerPlaceholder position={[-12, 0, 2]} color="#f15bb5" /> */}

{/* Random Pebbles - small stones scattered around */}
<PebblePlaceholder position={[1.5, 0, 1.2]} />
<PebblePlaceholder position={[-1.8, 0, 2.3]} />
<PebblePlaceholder position={[3.2, 0, -0.8]} />
<PebblePlaceholder position={[-2.5, 0, -1.7]} />
<PebblePlaceholder position={[4.1, 0, 2.8]} />
<PebblePlaceholder position={[-3.3, 0, 3.9]} />
<PebblePlaceholder position={[5.7, 0, -2.4]} />
<PebblePlaceholder position={[-4.9, 0, -3.1]} />
<PebblePlaceholder position={[6.2, 0, 0.5]} />
<PebblePlaceholder position={[-5.4, 0, 1.6]} />
<PebblePlaceholder position={[7.8, 0, -1.9]} />
<PebblePlaceholder position={[-6.7, 0, -2.8]} />
<PebblePlaceholder position={[8.3, 0, 3.2]} />
<PebblePlaceholder position={[-7.5, 0, 4.1]} />
<PebblePlaceholder position={[9.6, 0, -0.3]} />

{/* Random Mushrooms - decorative fungi */}
<MushroomPlaceholder position={[2.2, 0, 1.7]} scale={0.8} />
<MushroomPlaceholder position={[-1.9, 0, 8.8]} scale={1.1} />
<MushroomPlaceholder position={[3.8, 0, -1.2]} scale={0.9} />
<MushroomPlaceholder position={[-7.7, 0, -2.3]} scale={1.2} />
<MushroomPlaceholder position={[5.3, 0, 1.9]} scale={0.7} />
<MushroomPlaceholder position={[-4.1, 0, 9.2]} scale={1.0} />

{/* Cluster of elements around the campfire for a natural look */}
{/* <ShrubPlaceholder position={[1.5, 0, 1]} scale={0.9} /> */}
<FlowerPlaceholder position={[2, 0, 0.5]} color="#ff6b6b" />
<PebblePlaceholder position={[0.8, 0.05, 1.2]} />
<MushroomPlaceholder position={[-1.2, 0, 1.5]} scale={0.8} />

{/* <ShrubPlaceholder position={[-2, 0, -1]} scale={1.1} />
<FlowerPlaceholder position={[-1.5, 0, -1.5]} color="#4ecdc4" />
<PebblePlaceholder position={[-2.3, 0, -0.7]} /> */}

      {/* Info Panel */}
      {selectedObjectData && (
        <InfoPanel
          title={selectedObjectData.title}
          content={selectedObjectData.content}
          onClose={() => setSelectedObject(null)}
          position={[selectedObjectData.position[0], selectedObjectData.position[1] + 4, selectedObjectData.position[2]]}
        />
      )}

      {/* Enhanced Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.8} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 2, 0]} intensity={1} color="#ff6b35" />
      <pointLight position={[5, 3, 5]} intensity={0.3} color="#00ff88" />
      <pointLight position={[-5, 3, -5]} intensity={0.3} color="#0088ff" />
    </>
  );
};

const ForestPage3D = () => {
  const { name } = useCvData() || {};

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0e0e2c] to-[#1a1a2e] overflow-hidden">
      {/* Instructions */}
      <div className="absolute top-4 left-4 z-10 bg-[#0e0e2c]/80 backdrop-blur-sm border border-green-400/30 rounded-lg p-4 max-w-sm shadow-lg">
        <h3 className="text-green-400 font-bold mb-2 text-lg"> Welcome to {name}'s Enchanted Forest🌲</h3>
        <p className="text-white text-sm mb-3">
          Click on glowing objects to explore my portfolio. Hover to see them come alive with magical light!
        </p>
        <div className="bg-blue-500/20 rounded p-2 border border-blue-400/30">
          <p className="text-blue-300 text-xs font-semibold mb-1">🎮 Controls:</p>
          <p className="text-blue-200 text-xs">
            <span className="font-mono bg-blue-400/20 px-1 rounded">W A S D</span> keys to move around<br/>
            <span className="font-mono bg-blue-400/20 px-1 rounded">+ -</span> keys to zoom in/out<br/>
            <span className="font-mono bg-blue-400/20 px-1 rounded">Mouse</span> to look around
          </p>
        </div>
      </div>

      {/* Home button */}
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-green-400/20 hover:bg-green-400/30 border border-green-400/50 text-green-400 px-4 py-2 rounded-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-400/20"
        >
          🏠 Back to Portfolio Portal
        </button>
      </div>

      {/* Magical particles overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-green-400 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
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
            minDistance={3}
            maxDistance={25}
            autoRotate={false}
            enableDamping
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>

      {/* Loading overlay */}
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-[#0e0e2c] z-20">
          <div className="text-center">
            <div className="text-green-400 text-xl mb-4">🌲Growing your magical forest experience...</div>
            <div className="animate-spin w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      }>
        <div />
      </Suspense>
    </div>
  );
};

export default ForestPage3D;