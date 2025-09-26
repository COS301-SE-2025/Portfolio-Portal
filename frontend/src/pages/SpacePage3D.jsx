import React, { Suspense, useState, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, Text, Html, Stars } from "@react-three/drei";
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';

import useCvData from "../hooks/useCVData";

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
      
      if (['w', 'a', 's', 'd'].includes(key)) {
        setKeys(prev => ({ ...prev, [key]: true }));
        event.preventDefault();
      }
      
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
      
      if (['w', 'a', 's', 'd'].includes(key)) {
        setKeys(prev => ({ ...prev, [key]: false }));
        event.preventDefault();
      }
      
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

    const moveSpeed = 12;
    const zoomSpeed = 25;
    const moveVector = new THREE.Vector3();

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    if (keys.w) moveVector.add(forward);
    if (keys.s) moveVector.sub(forward);
    if (keys.d) moveVector.add(right);
    if (keys.a) moveVector.sub(right);

    if (moveVector.length() > 0) {
      moveVector.normalize().multiplyScalar(moveSpeed * delta);
      camera.position.add(moveVector);
    }

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

const CameraController = () => {
  useWASDMovement();
  return null;
};

// Planet Component
const PlanetPlaceholder = ({ position, onClick, isHighlighted, color = "#4a90e2", size = 1, isInteractive = true }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      if (isHighlighted || hovered) {
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
    }
  });

  const { scale, emissiveIntensity } = useSpring({
    scale: isHighlighted ? 1.3 : hovered ? 1.1 : 1,
    emissiveIntensity: (isHighlighted || hovered) ? 0.4 : 0.1,
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
      scale={scale.to(s => [s * size, s * size, s * size])}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <animated.meshPhongMaterial 
          color={isHighlighted || hovered ? "#00ffff" : color}
          emissive={isHighlighted || hovered ? "#0088ff" : color}
          emissiveIntensity={emissiveIntensity}
          shininess={100}
        />
      </mesh>
      {/* Atmosphere */}
      <mesh>
        <sphereGeometry args={[2.2, 16, 16]} />
        <animated.meshBasicMaterial 
          color={color}
          transparent
          opacity={isHighlighted || hovered ? 0.3 : 0.1}
        />
      </mesh>
    </animated.group>
  );
};

// Space Station Component
const SpaceStationPlaceholder = ({ position, onClick, isHighlighted }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.005;
    }
  });

  const { scale, emissiveIntensity } = useSpring({
    scale: isHighlighted ? 1.2 : hovered ? 1.1 : 1,
    emissiveIntensity: (isHighlighted || hovered) ? 0.6 : 0.2,
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
      {/* Main hub */}
      <mesh>
        <cylinderGeometry args={[1, 1, 2, 8]} />
        <animated.meshPhongMaterial 
          color={isHighlighted || hovered ? "#00ff88" : "#888888"}
          emissive={isHighlighted || hovered ? "#00ff88" : "#444444"}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      
      {/* Rotating ring */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[3, 0.3, 8, 16]} />
        <animated.meshPhongMaterial 
          color={isHighlighted || hovered ? "#ff6600" : "#666666"}
          emissive={isHighlighted || hovered ? "#ff6600" : "#333333"}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      
      {/* Solar panels */}
      <mesh position={[4, 0, 0]} rotation={[0, 0, Math.PI/2]}>
        <boxGeometry args={[0.1, 2, 4]} />
        <animated.meshPhongMaterial 
          color={isHighlighted || hovered ? "#0088ff" : "#001122"}
          emissive={isHighlighted || hovered ? "#0088ff" : "#000011"}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      <mesh position={[-4, 0, 0]} rotation={[0, 0, Math.PI/2]}>
        <boxGeometry args={[0.1, 2, 4]} />
        <animated.meshPhongMaterial 
          color={isHighlighted || hovered ? "#0088ff" : "#001122"}
          emissive={isHighlighted || hovered ? "#0088ff" : "#000011"}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
    </animated.group>
  );
};

// Asteroid Component
const AsteroidPlaceholder = ({ position, onClick, isHighlighted, isInteractive = true }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.005;
    }
  });

  const { scale, emissiveIntensity } = useSpring({
    scale: isHighlighted ? 1.2 : hovered && isInteractive ? 1.1 : 1,
    emissiveIntensity: (isHighlighted || (hovered && isInteractive)) ? 0.3 : 0,
    config: { tension: 300, friction: 10 }
  });

  return (
    <animated.group
      ref={meshRef}
      position={position}
      onClick={isInteractive ? onClick : undefined}
      scale={scale}
      onPointerOver={() => {
        if (isInteractive) {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={() => {
        if (isInteractive) {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }
      }}
    >
      <mesh>
        <sphereGeometry args={[1, 8, 8]} />
        <animated.meshPhongMaterial 
          color={(isHighlighted || (hovered && isInteractive)) ? "#ff8800" : "#666666"}
          emissive={(isHighlighted || (hovered && isInteractive)) ? "#ff4400" : "#000000"}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
    </animated.group>
  );
};

// Crystal Formation Component
const CrystalPlaceholder = ({ position, onClick, isHighlighted }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.2;
    }
  });

  const { scale, emissiveIntensity } = useSpring({
    scale: isHighlighted ? 1.3 : hovered ? 1.2 : 1,
    emissiveIntensity: (isHighlighted || hovered) ? 0.8 : 0.3,
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
      {/* Main crystal */}
      <mesh>
        <coneGeometry args={[1, 3, 6]} />
        <animated.meshPhongMaterial 
          color={isHighlighted || hovered ? "#ff00ff" : "#8800ff"}
          emissive={isHighlighted || hovered ? "#ff00ff" : "#4400aa"}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Smaller crystals */}
      <mesh position={[0.8, -0.5, 0.3]} rotation={[0, 0, Math.PI/6]}>
        <coneGeometry args={[0.4, 1.5, 6]} />
        <animated.meshPhongMaterial 
          color={isHighlighted || hovered ? "#00ffff" : "#0088aa"}
          emissive={isHighlighted || hovered ? "#00ffff" : "#004455"}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      <mesh position={[-0.6, -0.3, -0.4]} rotation={[0, 0, -Math.PI/4]}>
        <coneGeometry args={[0.3, 1, 6]} />
        <animated.meshPhongMaterial 
          color={isHighlighted || hovered ? "#ffff00" : "#aaaa00"}
          emissive={isHighlighted || hovered ? "#ffff00" : "#555500"}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={0.8}
        />
      </mesh>
    </animated.group>
  );
};

// Nebula Component
const NebulaPlaceholder = ({ position, scale = 1, color = "#ff6600" }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      meshRef.current.material.opacity = 0.1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[5, 16, 16]} />
      <meshBasicMaterial 
        color={color}
        transparent
        opacity={0.1}
      />
    </mesh>
  );
};

// Satellite Component
const SatellitePlaceholder = ({ position, scale = 1 }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group ref={meshRef} position={position} scale={scale}>
      {/* Main body */}
      <mesh>
        <boxGeometry args={[0.5, 0.3, 0.8]} />
        <meshPhongMaterial color="#333333" />
      </mesh>
      
      {/* Solar panels */}
      <mesh position={[0.8, 0, 0]}>
        <boxGeometry args={[0.05, 1.5, 0.8]} />
        <meshPhongMaterial color="#001144" />
      </mesh>
      <mesh position={[-0.8, 0, 0]}>
        <boxGeometry args={[0.05, 1.5, 0.8]} />
        <meshPhongMaterial color="#001144" />
      </mesh>
      
      {/* Antenna */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6]} />
        <meshPhongMaterial color="#888888" />
      </mesh>
    </group>
  );
};

// Info Panel Component
const InfoPanel = ({ title, content, onClose, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 max-w-4xl max-h-[90vh]">
      <div className="bg-[#0a0a2e]/95 backdrop-blur-sm border border-blue-400/30 rounded-lg p-6 text-white shadow-2xl mx-4 shadow-blue-500/20">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-cyan-400 text-xl font-bold mr-4">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl hover:bg-red-500/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors flex-shrink-0"
          >
            ×
          </button>
        </div>
        <div className="text-sm leading-relaxed overflow-y-auto max-h-[70vh] pr-2">
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
      case 'station':
        cameraOffset = new THREE.Vector3(3, 2, 6);
        lookAtOffset = new THREE.Vector3(0, 0, 0);
        break;
      case 'planet':
        cameraOffset = new THREE.Vector3(4, 3, 8);
        lookAtOffset = new THREE.Vector3(0, 0, 0);
        break;
      case 'asteroid':
        cameraOffset = new THREE.Vector3(-3, 2, 4);
        lookAtOffset = new THREE.Vector3(0, 0, 0);
        break;
      case 'crystal':
        cameraOffset = new THREE.Vector3(-2, 3, 5);
        lookAtOffset = new THREE.Vector3(0, 1, 0);
        break;
      default:
        cameraOffset = new THREE.Vector3(-4, 3, 6);
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
      animationProgress.current = Math.min(animationProgress.current + delta * 2, 1);
      
      const t = animationProgress.current;
      const smoothStep = t * t * (3 - 2 * t);
      
      const newPosition = new THREE.Vector3();
      newPosition.lerpVectors(originalPosition.current, targetPosition.current, smoothStep);
      camera.position.copy(newPosition);
      
      const newLookAt = new THREE.Vector3();
      newLookAt.lerpVectors(originalLookAt.current, targetLookAt.current, smoothStep);
      camera.lookAt(newLookAt);
      
      if (window.orbitControls) {
        window.orbitControls.target.lerpVectors(originalLookAt.current, targetLookAt.current, smoothStep);
        window.orbitControls.update();
      }
      
      if (animationProgress.current >= 1) {
        animating.current = false;
        camera.lookAt(targetLookAt.current);
      }
    }
  });

  return { moveTo, reset };
};

// Main Scene Component
const Scene = ({ selectedObject, setSelectedObject }) => {
  const { name, about, experience, education, skills } = useCvData();
  const { moveTo, reset } = useCameraAnimation();

  useEffect(() => {
    const interval = setInterval(() => {
      const controls = document.querySelector('canvas')?._r3f?.state?.controls;
      if (controls) {
        window.orbitControls = controls;
        clearInterval(interval);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  const interactiveObjects = [
    {
      id: 'about-planet',
      component: PlanetPlaceholder,
      position: [-8, 2, 8],
      type: 'planet',
      title: 'About Me',
      content: about,
      props: { color: "#4a90e2", size: 1.2 }
    },
    {
      id: 'name-crystal',
      component: CrystalPlaceholder,
      position: [-12, 4, 12],
      type: 'crystal',
      title: 'Who Am I?',
      content: name
    },
    {
      id: 'experience-station',
      component: SpaceStationPlaceholder,
      position: [0, 0, 0],
      type: 'station',
      title: 'Professional Experience',
      content: experience && experience.length > 0 ? (
        <div>
          {experience.slice(0, 3).map((exp, i) => (
            <div key={i} className="mb-4">
              <div className="font-semibold text-cyan-300">{exp.title}</div>
              <div className="text-blue-300">{exp.company}</div>
              <div className="text-sm text-gray-400">{exp.startDate} - {exp.endDate}</div>
              {exp.extra && exp.extra.length > 0 && (
                <div className="text-xs text-gray-300 mt-1">{exp.extra[0]}</div>
              )}
            </div>
          ))}
        </div>
      ) : "Navigate through my professional journey across the digital universe, exploring projects that have shaped my career trajectory."
    },
    {
      id: 'education-asteroid',
      component: AsteroidPlaceholder,
      position: [-5, 1, -8],
      type: 'asteroid',
      title: 'Education & Learning',
      content: education && education.length > 0 ? (
        <div>
          {education.slice(0, 2).map((edu, i) => (
            <div key={i} className="mb-4">
              <div className="font-semibold text-cyan-300">{edu.degree}</div>
              <div className="text-blue-300">{edu.institution}</div>
              <div className="text-sm text-gray-400">{edu.endDate}</div>
              {edu.field && (
                <div className="text-xs text-gray-300 mt-1">{edu.field}</div>
              )}
            </div>
          ))}
        </div>
      ) : "The knowledge foundations that fuel my exploration of new technologies and methodologies in the vast expanse of development."
    },
    {
      id: 'skills-planet2',
      component: PlanetPlaceholder,
      position: [10, 3, -6],
      type: 'planet',
      title: 'Skills & Technologies',
      content: skills && skills.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {skills.map((skill, i) => (
            <div key={i} className="bg-cyan-500/20 border border-cyan-400/30 px-2 py-1 rounded text-center">
              <span className="text-cyan-300 text-sm">{skill}</span>
            </div>
          ))}
        </div>
      ) : "Discover the technical arsenal and cosmic tools that power my development adventures across various digital galaxies.",
      props: { color: "#ff6600", size: 1.0 }
    }
  ];

  const handleObjectClick = (objectId) => {
    if (selectedObject === objectId) {
      setSelectedObject(null);
      reset();
    } else {
      const obj = interactiveObjects.find(o => o.id === objectId);
      if (obj) {
        setSelectedObject(objectId);
        moveTo(obj.position, obj.type);
      }
    }
  };

  return (
    <>
      <CameraController />
      
      {/* Deep Space Stars */}
      <Stars 
        radius={300} 
        depth={100} 
        count={8000} 
        factor={6} 
        saturation={0.3} 
        fade 
        speed={0.3}
      />

      {/* Interactive Objects */}
      {interactiveObjects.map((obj) => {
        const Component = obj.component;
        return (
          <Component
            key={obj.id}
            position={obj.position}
            onClick={() => handleObjectClick(obj.id)}
            isHighlighted={selectedObject === obj.id}
            type={obj.type}
            {...(obj.props || {})}
          />
        );
      })}

      {/* Background Planets */}
      <PlanetPlaceholder position={[25, -5, 20]} color="#ff4444" size={2} isInteractive={false} />
      <PlanetPlaceholder position={[-30, 8, -25]} color="#44ff44" size={1.5} isInteractive={false} />
      <PlanetPlaceholder position={[35, 10, -15]} color="#4444ff" size={1.8} isInteractive={false} />
      <PlanetPlaceholder position={[-25, -10, 30]} color="#ff44ff" size={1.3} isInteractive={false} />

      {/* Background Asteroids */}
      <AsteroidPlaceholder position={[15, 5, 12]} isInteractive={false} />
      <AsteroidPlaceholder position={[-18, -3, -12]} isInteractive={false} />
      <AsteroidPlaceholder position={[22, -8, -18]} isInteractive={false} />
      <AsteroidPlaceholder position={[-20, 12, 15]} isInteractive={false} />
      <AsteroidPlaceholder position={[28, 2, 8]} isInteractive={false} />
      <AsteroidPlaceholder position={[-32, -6, -8]} isInteractive={false} />

      {/* Satellites */}
      <SatellitePlaceholder position={[8, 4, 6]} />
      <SatellitePlaceholder position={[-12, -2, -10]} />
      <SatellitePlaceholder position={[16, 8, -4]} />
      <SatellitePlaceholder position={[-8, 6, 14]} />

      {/* Nebulas */}
      <NebulaPlaceholder position={[40, 15, 30]} color="#ff3366" />
      <NebulaPlaceholder position={[-45, -20, -35]} color="#3366ff" />
      <NebulaPlaceholder position={[50, -10, -20]} color="#66ff33" />

      {/* Enhanced Space Lighting */}
      <ambientLight intensity={0.2} color="#001122" />
      <directionalLight 
        position={[20, 20, 20]} 
        intensity={0.8} 
        color="#ffffff"
        castShadow
      />
      <pointLight position={[0, 0, 0]} intensity={2} color="#88ccff" />
      <pointLight position={[15, 5, 10]} intensity={1} color="#ff8844" />
      <pointLight position={[-15, -5, -10]} intensity={1} color="#44ff88" />
      <pointLight position={[10, 15, -8]} intensity={0.8} color="#ff44ff" />
    </>
  );
};

const ControlledOrbitControls = (props) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef();
  
  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });
  
  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enablePan={true}
      minPolarAngle={0}
      maxPolarAngle={Math.PI}
      minDistance={3}
      maxDistance={80}
      autoRotate={false}
      enableDamping
      dampingFactor={0.05}
      {...props}
    />
  );
};

// Main SpacePage3D Component
const SpacePage3D = () => {
  const { name, about, experience, education, skills } = useCvData();
  const [selectedObject, setSelectedObject] = useState(null);

  const getSelectedObjectData = () => {
    if (!selectedObject) return null;
    
    const objectsData = {
      'about-planet': {
        title: 'About Me',
        content: about || "Welcome to my digital cosmos! I'm a developer who loves creating immersive experiences that push the boundaries of web technology."
      },
      'name-crystal': {
        title: 'Who Am I?',
        content: name || "Greetings, space traveler! I am your guide through this cosmic portfolio journey."
      },
      'experience-station': {
        title: 'Professional Experience',
        content: experience && experience.length > 0 ? (
          <div>
            {experience.slice(0, 3).map((exp, i) => (
              <div key={i} className="mb-4">
                <div className="font-semibold text-cyan-300">{exp.title}</div>
                <div className="text-blue-300">{exp.company}</div>
                <div className="text-sm text-gray-400">{exp.startDate} - {exp.endDate}</div>
                {exp.extra && exp.extra.length > 0 && (
                  <div className="text-xs text-gray-300 mt-1">{exp.extra[0]}</div>
                )}
              </div>
            ))}
          </div>
        ) : "Navigate through my professional journey across the digital universe, exploring projects that have shaped my career trajectory."
      },
      'education-asteroid': {
        title: 'Education & Learning',
        content: education && education.length > 0 ? (
          <div>
            {education.slice(0, 2).map((edu, i) => (
              <div key={i} className="mb-4">
                <div className="font-semibold text-cyan-300">{edu.degree}</div>
                <div className="text-blue-300">{edu.institution}</div>
                <div className="text-sm text-gray-400">{edu.endDate}</div>
                {edu.field && (
                  <div className="text-xs text-gray-300 mt-1">{edu.field}</div>
                )}
              </div>
            ))}
          </div>
        ) : "The knowledge foundations that fuel my exploration of new technologies and methodologies in the vast expanse of development."
      },
      'skills-planet2': {
        title: 'Skills & Technologies',
        content: skills && skills.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {skills.map((skill, i) => (
              <div key={i} className="bg-cyan-500/20 border border-cyan-400/30 px-2 py-1 rounded text-center">
                <span className="text-cyan-300 text-sm">{skill}</span>
              </div>
            ))}
          </div>
        ) : "Discover the technical arsenal and cosmic tools that power my development adventures across various digital galaxies."
      }
    };

    return objectsData[selectedObject];
  };

  const selectedObjectData = getSelectedObjectData();

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-[#000011] via-[#001122] to-[#002244] overflow-hidden">
      {/* Instructions */}
      <div className="absolute top-4 left-4 z-10 bg-[#001122]/90 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-4 max-w-sm shadow-lg shadow-blue-500/20">
        <h3 className="text-cyan-400 font-bold mb-2 text-lg">🚀 Welcome to {name}'s Space Station</h3>
        <p className="text-white text-sm mb-3">
          Navigate through the cosmos and discover my portfolio by interacting with glowing celestial objects!
        </p>
        <div className="bg-purple-500/20 rounded p-2 border border-purple-400/30">
          <p className="text-purple-300 text-xs font-semibold mb-1">🎮 Navigation Controls:</p>
          <p className="text-purple-200 text-xs">
            <span className="font-mono bg-purple-400/20 px-1 rounded">W A S D</span> keys for space travel<br/>
            <span className="font-mono bg-purple-400/20 px-1 rounded">+ -</span> keys for warp drive<br/>
            <span className="font-mono bg-purple-400/20 px-1 rounded">Mouse</span> to look around the cosmos
          </p>
        </div>
      </div>

      {/* Home button */}
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-cyan-400/20 hover:bg-cyan-400/30 border border-cyan-400/50 text-cyan-400 px-4 py-2 rounded-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/20"
        >
          🏠 Return to Portfolio Base
        </button>
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

      {/* Cosmic particles overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-green-400 rounded-full animate-ping" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-2/3 right-1/6 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '5s'}}></div>
      </div>

      <Canvas
        camera={{
          position: [2, 8, 20],
          fov: 75,
          near: 0.1,
          far: 2000,
        }}
        shadows
      >
        <Suspense fallback={null}>
          <Scene selectedObject={selectedObject} setSelectedObject={setSelectedObject} />
          <Environment preset="night" />
          <ControlledOrbitControls />
        </Suspense>
      </Canvas>

      {/* Loading overlay */}
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-[#001122] z-20">
          <div className="text-center">
            <div className="text-cyan-400 text-xl mb-4">🌌 Initializing space travel systems...</div>
            <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      }>
        <div />
      </Suspense>
    </div>
  );
};

export default SpacePage3D;