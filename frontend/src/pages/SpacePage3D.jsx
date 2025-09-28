//frontend/src/pages/SpacePage3D.jsx
import React, { Suspense, useState, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import useCvData from "../hooks/useCVData"; 

// WASD Movement Hook
const useWASDMovement = () => {
  const { camera } = useThree();
  const [keys, setKeys] = useState({
    w: false, a: false, s: false, d: false,
    shift: false, space: false
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(key)) {
        setKeys(prev => ({ ...prev, [key]: true }));
        event.preventDefault();
      }
      if (event.key === 'Shift') {
        setKeys(prev => ({ ...prev, shift: true }));
        event.preventDefault();
      }
      if (event.key === ' ') {
        setKeys(prev => ({ ...prev, space: true }));
        event.preventDefault();
      }
    };

    const handleKeyUp = (event) => {
      const key = event.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(key)) {
        setKeys(prev => ({ ...prev, [key]: false }));
      }
      if (event.key === 'Shift') {
        setKeys(prev => ({ ...prev, shift: false }));
      }
      if (event.key === ' ') {
        setKeys(prev => ({ ...prev, space: false }));
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

    const speed = keys.shift ? 25 : 12;
    const moveVector = new THREE.Vector3();

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    const right = new THREE.Vector3();
    right.crossVectors(forward, camera.up).normalize();

    if (keys.w) moveVector.add(forward);
    if (keys.s) moveVector.sub(forward);
    if (keys.d) moveVector.add(right);
    if (keys.a) moveVector.sub(right);
    if (keys.space) moveVector.add(camera.up);
    if (keys.shift && !keys.space) moveVector.sub(camera.up);

    if (moveVector.length() > 0) {
      moveVector.normalize().multiplyScalar(speed * delta);
      camera.position.add(moveVector);
    }
  });
};

// Central Sun Component
const Sun = () => {
  const meshRef = useRef();
  const glowRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y -= 0.002;
    }
  });

  return (
    <group>
      {/* Main sun body */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshStandardMaterial 
          color="#ffaa00"
          emissive="#ff4400"
          emissiveIntensity={0.3}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      
      {/* Glowing atmosphere */}
      <mesh ref={glowRef} position={[0, 0, 0]}>
        <sphereGeometry args={[5.5, 16, 16]} />
        <meshBasicMaterial 
          color="#ff6600"
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Light source */}
      <pointLight position={[0, 0, 0]} intensity={1.8} color="#ffaa00" distance={150} />
    </group>
  );
};


const Planet = ({ 
  position, 
  size, 
  color, 
  onClick, 
  isHighlighted, 
  orbitRadius, 
  orbitSpeed = 0.01,
  hasRing = false
}) => {
  const meshRef = useRef();
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (groupRef.current && orbitRadius) {
      groupRef.current.rotation.y += orbitSpeed;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
      if (isHighlighted || hovered) {
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.3;
      }
    }
  });

  const { scale } = useSpring({
    scale: isHighlighted ? 1.4 : hovered ? 1.2 : 1,
    config: { tension: 300, friction: 10 }
  });

  const planetElement = (
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
      <mesh>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          color={isHighlighted || hovered ? "#ffffff" : color}
          emissive={isHighlighted || hovered ? color : "#000000"}
          emissiveIntensity={isHighlighted || hovered ? 0.3 : 0}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Simple atmosphere */}
      <mesh>
        <sphereGeometry args={[size * 1.1, 16, 16]} />
        <meshBasicMaterial 
          color={color}
          transparent
          opacity={isHighlighted || hovered ? 0.4 : 0.15}
        />
      </mesh>
      
      {/* Optional ring */}
      {hasRing && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 1.3, size * 1.6, 32]} />
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.6} 
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </animated.group>
  );

  if (orbitRadius) {
    return (
      <group ref={groupRef}>
        {planetElement}
      </group>
    );
  }

  return planetElement;
};

// Alien Character Component
const Alien = ({ position, onClick, isHighlighted }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.5;
    }
  });

  const { scale } = useSpring({
    scale: isHighlighted ? 1.3 : hovered ? 1.1 : 1,
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
      {/* Alien Head */}
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshStandardMaterial 
          color={isHighlighted || hovered ? "#00ff88" : "#44aa77"}
          emissive={isHighlighted || hovered ? "#004422" : "#002211"}
          emissiveIntensity={isHighlighted || hovered ? 0.4 : 0.1}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.4, 1.2, 0.8]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial 
          color="#000000"
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      <mesh position={[0.4, 1.2, 0.8]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial 
          color="#000000"
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.8, 0.6, 2, 8]} />
        <meshStandardMaterial 
          color={isHighlighted || hovered ? "#00cc66" : "#339955"}
          emissive={isHighlighted || hovered ? "#003322" : "#001122"}
          emissiveIntensity={isHighlighted || hovered ? 0.3 : 0.1}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-1, 0, 0]} rotation={[0, 0, Math.PI/4]}>
        <cylinderGeometry args={[0.2, 0.2, 1.5, 6]} />
        <meshStandardMaterial 
          color={isHighlighted || hovered ? "#00aa55" : "#227744"}
          emissive={isHighlighted || hovered ? "#002211" : "#001100"}
          emissiveIntensity={isHighlighted || hovered ? 0.3 : 0.1}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[1, 0, 0]} rotation={[0, 0, -Math.PI/4]}>
        <cylinderGeometry args={[0.2, 0.2, 1.5, 6]} />
        <meshStandardMaterial 
          color={isHighlighted || hovered ? "#00aa55" : "#227744"}
          emissive={isHighlighted || hovered ? "#002211" : "#001100"}
          emissiveIntensity={isHighlighted || hovered ? 0.3 : 0.1}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
    </animated.group>
  );
};

// Satellite Component
const Satellite = ({ position, onClick, isHighlighted }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.03;
      meshRef.current.rotation.x += 0.01;
    }
  });

  const { scale } = useSpring({
    scale: isHighlighted ? 1.3 : hovered ? 1.15 : 1,
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
      {/* Main body */}
      <mesh>
        <boxGeometry args={[1.5, 0.8, 2]} />
        <meshStandardMaterial 
          color={isHighlighted || hovered ? "#ffffff" : "#bbbbbb"}
          emissive={isHighlighted || hovered ? "#2244aa" : "#000000"}
          emissiveIntensity={isHighlighted || hovered ? 0.3 : 0}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
      
      {/* Solar panels */}
      <mesh position={[2.5, 0, 0]}>
        <boxGeometry args={[0.1, 3, 1.5]} />
        <meshStandardMaterial 
          color={isHighlighted || hovered ? "#0088ff" : "#003366"}
          emissive={isHighlighted || hovered ? "#004488" : "#000000"}
          emissiveIntensity={isHighlighted || hovered ? 0.4 : 0}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      <mesh position={[-2.5, 0, 0]}>
        <boxGeometry args={[0.1, 3, 1.5]} />
        <meshStandardMaterial 
          color={isHighlighted || hovered ? "#0088ff" : "#003366"}
          emissive={isHighlighted || hovered ? "#004488" : "#000000"}
          emissiveIntensity={isHighlighted || hovered ? 0.4 : 0}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      
      {/* Antenna */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2]} />
        <meshStandardMaterial 
          color={isHighlighted || hovered ? "#ffff00" : "#cccccc"}
          emissive={isHighlighted || hovered ? "#aaaa00" : "#000000"}
          emissiveIntensity={isHighlighted || hovered ? 0.3 : 0}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
      
      {/* Dish */}
      <mesh position={[0, 2, 0]} rotation={[Math.PI/4, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.2, 0.2, 16]} />
        <meshStandardMaterial 
          color={isHighlighted || hovered ? "#ffaa00" : "#dddddd"}
          emissive={isHighlighted || hovered ? "#aa6600" : "#000000"}
          emissiveIntensity={isHighlighted || hovered ? 0.3 : 0}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
    </animated.group>
  );
};

// Astronaut Component
const Astronaut = ({ position, onClick, isHighlighted }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.3;
      meshRef.current.rotation.y += 0.01;
    }
  });

  const { scale } = useSpring({
    scale: isHighlighted ? 1.2 : hovered ? 1.1 : 1,
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
      {/* Helmet */}
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial 
          color={isHighlighted || hovered ? "#ffffff" : "#cccccc"}
          emissive={isHighlighted || hovered ? "#2244aa" : "#111111"}
          emissiveIntensity={isHighlighted || hovered ? 0.2 : 0.05}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Head inside helmet */}
      <mesh position={[0, 2, 0.3]}>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshStandardMaterial 
          color="#ffddbb"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.8, 0.6, 2, 8]} />
        <meshStandardMaterial 
          color={isHighlighted || hovered ? "#ffffff" : "#eeeeee"}
          emissive={isHighlighted || hovered ? "#aa2222" : "#222222"}
          emissiveIntensity={isHighlighted || hovered ? 0.2 : 0.05}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.9, 1, 0]} rotation={[0, 0, Math.PI/6]}>
        <cylinderGeometry args={[0.25, 0.25, 1.2, 6]} />
        <meshStandardMaterial 
          color={isHighlighted || hovered ? "#ffffff" : "#dddddd"}
          emissive={isHighlighted || hovered ? "#aa2222" : "#111111"}
          emissiveIntensity={isHighlighted || hovered ? 0.2 : 0.05}
          roughness={0.5}
          metalness={0.5}
        />
      </mesh>
      <mesh position={[0.9, 1, 0]} rotation={[0, 0, -Math.PI/6]}>
        <cylinderGeometry args={[0.25, 0.25, 1.2, 6]} />
        <meshStandardMaterial 
          color={isHighlighted || hovered ? "#ffffff" : "#dddddd"}
          emissive={isHighlighted || hovered ? "#aa2222" : "#111111"}
          emissiveIntensity={isHighlighted || hovered ? 0.2 : 0.05}
          roughness={0.5}
          metalness={0.5}
        />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.3, -1, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 1.5, 6]} />
        <meshStandardMaterial 
          color={isHighlighted || hovered ? "#ffffff" : "#dddddd"}
          emissive={isHighlighted || hovered ? "#aa2222" : "#111111"}
          emissiveIntensity={isHighlighted || hovered ? 0.2 : 0.05}
          roughness={0.5}
          metalness={0.5}
        />
      </mesh>
      <mesh position={[0.3, -1, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 1.5, 6]} />
        <meshStandardMaterial 
          color={isHighlighted || hovered ? "#ffffff" : "#dddddd"}
          emissive={isHighlighted || hovered ? "#aa2222" : "#111111"}
          emissiveIntensity={isHighlighted || hovered ? 0.2 : 0.05}
          roughness={0.5}
          metalness={0.5}
        />
      </mesh>
      
      {/* Jetpack */}
      <mesh position={[0, 0.8, -0.8]}>
        <cylinderGeometry args={[0.3, 0.3, 1]} />
        <meshStandardMaterial 
          color={isHighlighted || hovered ? "#ffaa00" : "#666666"}
          emissive={isHighlighted || hovered ? "#aa4400" : "#222222"}
          emissiveIntensity={isHighlighted || hovered ? 0.3 : 0.1}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
    </animated.group>
  );
};

// Simple Asteroid
const Asteroid = ({ position, size = 1 }) => {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.003;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <dodecahedronGeometry args={[size, 0]} />
      <meshStandardMaterial 
        color="#666666"
        roughness={0.9}
        metalness={0.3}
      />
    </mesh>
  );
};

// Asteroid Field
const AsteroidField = ({ count = 15 }) => {
  const asteroids = [];
  
  for (let i = 0; i < count; i++) {
    const position = [
      (Math.random() - 0.5) * 150,
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 150
    ];
    const size = Math.random() * 1.5 + 0.5;
    
    asteroids.push(
      <Asteroid key={i} position={position} size={size} />
    );
  }
  
  return <>{asteroids}</>;
};

// Info Panel Component
const InfoPanel = ({ title, content, onClose, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 max-w-4xl max-h-[90vh]">
      <div className="bg-gradient-to-br from-purple-900/95 to-blue-900/95 backdrop-blur-md border border-cyan-400/50 rounded-xl p-8 text-white shadow-2xl mx-4 shadow-cyan-400/30">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-cyan-300 text-2xl font-bold mr-4 flex items-center">
            <span className="mr-3">🌟</span>
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl hover:bg-red-500/30 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 flex-shrink-0 hover:scale-110"
          >
            ×
          </button>
        </div>
        <div className="text-base leading-relaxed overflow-y-auto max-h-[70vh] pr-2 text-gray-100">
          {content}
        </div>
      </div>
    </div>
  );
};

// Camera animation hook
const useCameraAnimation = () => {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const originalPosition = useRef(new THREE.Vector3());
  const originalLookAt = useRef(new THREE.Vector3());
  const animating = useRef(false);
  const animationProgress = useRef(0);

  const moveTo = (objectPosition, objectType) => {
    if (originalPosition.current.length() === 0) {
      originalPosition.current.copy(camera.position);
      
      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);
      originalLookAt.current.copy(camera.position).add(direction.multiplyScalar(10));
    }
    
    const objPos = new THREE.Vector3(...objectPosition);
    let cameraOffset, lookAtOffset;
    
    switch (objectType) {
      case 'alien':
        cameraOffset = new THREE.Vector3(-8, 4, 8);
        lookAtOffset = new THREE.Vector3(0, 1, 0);
        break;
      case 'planet':
        cameraOffset = new THREE.Vector3(8, 5, 12);
        lookAtOffset = new THREE.Vector3(0, 0, 0);
        break;
      case 'satellite':
        cameraOffset = new THREE.Vector3(6, 3, 8);
        lookAtOffset = new THREE.Vector3(0, 0, 0);
        break;
      case 'astronaut':
        cameraOffset = new THREE.Vector3(-6, 3, 10);
        lookAtOffset = new THREE.Vector3(0, 0, 0);
        break;
      default:
        cameraOffset = new THREE.Vector3(8, 4, 12);
        lookAtOffset = new THREE.Vector3(0, 0, 0);
    }
    
    targetPosition.current.copy(objPos).add(cameraOffset);
    targetLookAt.current.copy(objPos).add(lookAtOffset);
    
    animating.current = true;
    animationProgress.current = 0;
  };

  const reset = () => {
    if (originalPosition.current.length() > 0) {
      targetPosition.current.copy(originalPosition.current);
      targetLookAt.current.copy(originalLookAt.current);
      animating.current = true;
      animationProgress.current = 0;
    }
  };

  useFrame((state, delta) => {
    if (animating.current) {
      animationProgress.current = Math.min(animationProgress.current + delta * 1.5, 1);
      
      const t = animationProgress.current;
      const smoothStep = t * t * (3 - 2 * t);
      
      const newPosition = new THREE.Vector3();
      newPosition.lerpVectors(originalPosition.current, targetPosition.current, smoothStep);
      camera.position.copy(newPosition);
      
      const newLookAt = new THREE.Vector3();
      newLookAt.lerpVectors(originalLookAt.current, targetLookAt.current, smoothStep);
      camera.lookAt(newLookAt);
      
      if (animationProgress.current >= 1) {
        animating.current = false;
        camera.lookAt(targetLookAt.current);
      }
    }
  });

  return { moveTo, reset };
};

// Camera Controller
const CameraController = () => {
  useWASDMovement();
  return null;
};

// Main Scene Component
const Scene = ({ selectedObject, setSelectedObject }) => {
  const { name, about, experience, education, skills } = useCvData() || {};

  const handleObjectClick = (objectId) => {
    setSelectedObject(selectedObject === objectId ? null : objectId);
  };

  return (
    <>
      <CameraController />
      
      {/* Stars */}
      <Stars 
        radius={400} 
        depth={150} 
        count={8000} 
        factor={6} 
        saturation={0.4} 
        fade 
        speed={0.5}
      />

      {/* Central Sun */}
      <Sun />

      {/* Interactive Objects */}
      <Alien 
        position={[-15, 8, 10]}
        onClick={() => handleObjectClick('alien')}
        isHighlighted={selectedObject === 'alien'}
      />

      <Planet
        position={[25, 0, 0]}
        size={3.5}
        color="#4488ff"
        onClick={() => handleObjectClick('about')}
        isHighlighted={selectedObject === 'about'}
        orbitRadius={25}
        orbitSpeed={0.005}
        hasRing={true}
      />

      <Planet
        position={[-20, 5, -15]}
        size={2.8}
        color="#ff44aa"
        onClick={() => handleObjectClick('skills')}
        isHighlighted={selectedObject === 'skills'}
        orbitRadius={22}
        orbitSpeed={0.007}
      />

      <Satellite
        position={[30, 15, -10]}
        onClick={() => handleObjectClick('education')}
        isHighlighted={selectedObject === 'education'}
      />

      <Astronaut
        position={[10, -8, 25]}
        onClick={() => handleObjectClick('experience')}
        isHighlighted={selectedObject === 'experience'}
      />

      {/* Background Planets */}
      <Planet position={[50, 10, 20]} size={4} color="#ff8844" orbitRadius={50} orbitSpeed={0.003} />
      <Planet position={[-45, -5, -30]} size={3.2} color="#44ff88" orbitRadius={45} orbitSpeed={0.004} />
      <Planet position={[60, -15, -25]} size={2.5} color="#8844ff" orbitRadius={60} orbitSpeed={0.002} />
      <Planet position={[-55, 20, 35]} size={5} color="#ffaa44" orbitRadius={55} orbitSpeed={0.0025} hasRing={true} />

      {/* Asteroid Field */}
      <AsteroidField count={20} />

      {/* Lighting */}
      <ambientLight intensity={0.2} color="#112244" />
      <directionalLight 
        position={[50, 50, 50]} 
        intensity={1.2} 
        color="#ffffff"
      />
      <directionalLight 
        position={[-30, 30, -20]} 
        intensity={0.6} 
        color="#4488ff"
      />
      <pointLight position={[30, 20, 30]} intensity={0.8} color="#ff8844" />
      <pointLight position={[-30, -20, -30]} intensity={0.8} color="#44ff88" />
      <pointLight position={[0, 40, 0]} intensity={0.6} color="#ffffff" />
    </>
  );
};

// Main Component
const SpacePage3D = () => {
  const [selectedObject, setSelectedObject] = useState(null);
  const { name, about, experience, education, skills } = useCvData() || {};

  const getSelectedObjectData = () => {
    if (!selectedObject) return null;
    
    const objectsData = {
      'alien': {
  title: '👽 Who Am I',
  content: (
    <div className="text-center">
      <div className="text-3xl font-bold text-cyan-300 mb-4">{name || 'Your Name'}</div>
    </div>
  )
},
      'about': {
        title: '🪐 About Me',
        content: (
          <div>
            <p className="text-lg leading-relaxed">{about || "I'm a passionate developer who loves creating stellar user experiences across galaxies. With expertise in modern web technologies, I build applications that reach for the stars."}</p>
          </div>
        )
      },
      'skills': {
        title: '🌌 Skills',
        content: skills && skills.length > 0 ? (
          <div>
            <div className="grid grid-cols-3 gap-3">
              {skills.map((skill, i) => (
                <div key={i} className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/40 px-3 py-2 rounded-lg text-center">
                  <span className="text-cyan-300 font-medium">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {['React', 'Three.js', 'Node.js', 'TypeScript', 'WebGL', 'AWS'].map((skill, i) => (
              <div key={i} className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/40 px-3 py-2 rounded-lg text-center">
                <span className="text-cyan-300 font-medium">{skill}</span>
              </div>
            ))}
          </div>
        )
      },
      'education': {
        title: '🛰️ Education & Learning',
        content: education && education.length > 0 ? (
          <div>
            {education.map((edu, i) => (
              <div key={i} className="mb-6 p-4 bg-blue-500/20 border border-blue-400/30 rounded-lg">
                <div className="font-bold text-cyan-300 text-xl">{edu.degree}</div>
                <div className="text-purple-300 text-lg">{edu.institution}</div>
                <div className="text-gray-400">{edu.endDate}</div>
                {edu.field && (
                  <div className="text-gray-300 mt-2">{edu.field}</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-6 p-4 bg-blue-500/20 border border-blue-400/30 rounded-lg">
            <div className="font-bold text-cyan-300 text-xl">Computer Science Degree</div>
            <div className="text-purple-300 text-lg">University of Technology</div>
            <div className="text-gray-400">2020</div>
          </div>
        )
      },
      'experience': {
        title: '🚀 Professional Experience',
        content: experience && experience.length > 0 ? (
          <div>
            {experience.map((exp, i) => (
              <div key={i} className="mb-6 p-4 bg-purple-500/20 border border-purple-400/30 rounded-lg">
                <div className="font-bold text-cyan-300 text-xl">{exp.title}</div>
                <div className="text-purple-300 text-lg">{exp.company}</div>
                <div className="text-gray-400">{exp.startDate} - {exp.endDate}</div>
                {exp.description && (
                  <div className="text-gray-300 mt-2">{exp.description}</div>
                )}
                {exp.extra && exp.extra.length > 0 && (
                  <div className="text-gray-300 mt-2">{exp.extra[0]}</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-6 p-4 bg-purple-500/20 border border-purple-400/30 rounded-lg">
            <div className="font-bold text-cyan-300 text-xl">Senior Full Stack Developer</div>
            <div className="text-purple-300 text-lg">Tech Company Inc</div>
            <div className="text-gray-400">2022 - Present</div>
          </div>
        )
      }
    };

    return objectsData[selectedObject];
  };

  const selectedObjectData = getSelectedObjectData();

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-[#000011] via-[#001133] to-[#002255] overflow-hidden">
      {/* Instructions Panel */}
      <div className="absolute top-6 left-6 z-10 bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-md border border-cyan-400/40 rounded-xl p-6 max-w-sm shadow-2xl shadow-cyan-400/20">
        <h3 className="text-cyan-300 font-bold mb-3 text-xl flex items-center">
          <span className="mr-3">🌟</span>
          {name || 'Your Name'}'s Solar System
        </h3>
        <p className="text-white text-sm mb-4 leading-relaxed">
          Welcome, space explorer! Navigate through my cosmic portfolio by clicking on the glowing interactive objects scattered throughout this solar system.
        </p>
        
        <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg p-4 border border-purple-400/30 mb-4">
          <p className="text-purple-300 text-xs font-bold mb-2">🎮 Flight Controls:</p>
          <div className="text-purple-200 text-xs space-y-1">
            <div><span className="font-mono bg-purple-400/30 px-2 py-1 rounded text-xs">W A S D</span> → Navigate through space</div>
            <div><span className="font-mono bg-purple-400/30 px-2 py-1 rounded text-xs">SHIFT</span> → Turbo boost</div>
            <div><span className="font-mono bg-purple-400/30 px-2 py-1 rounded text-xs">SPACE</span> → Ascend</div>
            <div><span className="font-mono bg-purple-400/30 px-2 py-1 rounded text-xs">Mouse</span> → Look around</div>
          </div>
        </div>

        <div className="text-xs text-gray-300">
          🎯 <strong>Interactive Objects:</strong><br/>
          👽 Alien - Personal Info<br/>
          🪐 Blue Planet - About Me<br/>
          🌸 Pink Planet - Skills<br/>
          🛰️ Satellite - Education<br/>
          🚀 Astronaut - Experience
        </div>
      </div>

      {/* Home Button */}
      <div className="absolute top-6 right-6 z-10">
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-400/50 text-cyan-300 px-6 py-3 rounded-xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-400/30 font-medium"
        >
          🏠 Return to Base Station
        </button>
      </div>

      {/* Navigation Map */}
      <div className="absolute bottom-6 left-6 z-10 bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-md border border-cyan-400/40 rounded-xl p-4 shadow-2xl shadow-cyan-400/20">
        <h4 className="text-cyan-300 font-bold mb-3 text-sm">Navigation Map</h4>
        <div className="grid grid-cols-1 gap-2 text-xs">
          <div className={`flex items-center p-2 rounded-lg transition-all ${selectedObject === 'alien' ? 'bg-green-500/30 border border-green-400/50' : 'bg-gray-500/20'}`}>
            <span className="mr-2">👽</span>
            <span className="text-gray-200">Alien - Who Am I?</span>
          </div>
          <div className={`flex items-center p-2 rounded-lg transition-all ${selectedObject === 'about' ? 'bg-blue-500/30 border border-blue-400/50' : 'bg-gray-500/20'}`}>
            <span className="mr-2">🪐</span>
            <span className="text-gray-200">Blue Planet - About</span>
          </div>
          <div className={`flex items-center p-2 rounded-lg transition-all ${selectedObject === 'skills' ? 'bg-pink-500/30 border border-pink-400/50' : 'bg-gray-500/20'}`}>
            <span className="mr-2">🌸</span>
            <span className="text-gray-200">Pink Planet - Skills</span>
          </div>
          <div className={`flex items-center p-2 rounded-lg transition-all ${selectedObject === 'education' ? 'bg-yellow-500/30 border border-yellow-400/50' : 'bg-gray-500/20'}`}>
            <span className="mr-2">🛰️</span>
            <span className="text-gray-200">Satellite - Education</span>
          </div>
          <div className={`flex items-center p-2 rounded-lg transition-all ${selectedObject === 'experience' ? 'bg-orange-500/30 border border-orange-400/50' : 'bg-gray-500/20'}`}>
            <span className="mr-2">🚀</span>
            <span className="text-gray-200">Astronaut - Experience</span>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      {selectedObjectData && (
        <InfoPanel
          title={selectedObjectData.title}
          content={selectedObjectData.content}
          onClose={() => setSelectedObject(null)}
          isVisible={true}
        />
      )}

      {/* Cosmic Particle Effects */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-cyan-400 rounded-full animate-ping`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
        {[...Array(8)].map((_, i) => (
          <div
            key={`star-${i}`}
            className={`absolute w-0.5 h-0.5 bg-purple-300 rounded-full animate-pulse`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${1.5 + Math.random() * 1.5}s`
            }}
          />
        ))}
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{
          position: [0, 15, 40],
          fov: 75,
          near: 0.1,
          far: 2000,
        }}
        shadows={false}
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          <Scene selectedObject={selectedObject} setSelectedObject={setSelectedObject} />
          <OrbitControls
            enablePan={true}
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
            minDistance={5}
            maxDistance={200}
            autoRotate={false}
            enableDamping
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>

      {/* Loading Overlay */}
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#000011] to-[#002255] z-30">
          <div className="text-center">
            <div className="text-cyan-300 text-2xl mb-6 font-bold">Initializing Solar System...</div>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="animate-spin w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full"></div>
            </div>
            <div className="text-purple-300 text-sm">Loading cosmic portfolio experience</div>
          </div>
        </div>
      }>
        <div />
      </Suspense>
    </div>
  );
};

export default SpacePage3D;