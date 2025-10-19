import React, { Suspense, useState, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, Stars } from "@react-three/drei";
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { useMemo } from 'react';
import useCVData from "../hooks/useCVData"; 

// Mock CV data hook for now
// const useCvData = () => ({
//   name: "John Doe",
//   about: "A passionate explorer of digital caves and immersive experiences.",
//   experience: [
//     { title: "Senior Developer", company: "Tech Corp", startDate: "2020", endDate: "Present" },
//     { title: "Junior Developer", company: "StartUp Inc", startDate: "2018", endDate: "2020" }
//   ],
//   education: [
//     { degree: "BS Computer Science", institution: "University", endDate: "2018" }
//   ],
//   skills: ["React", "Three.js", "JavaScript", "3D Graphics", "WebGL", "Node.js"]
// });

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

    const moveSpeed = 8;
    const zoomSpeed = 20;
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

// Pine Tree Component
const PineTree = ({ position, scale = 1 }) => {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
        <meshStandardMaterial color="#8b5a3c" />
      </mesh>
      
      {/* Pine layers */}
      <mesh position={[0, 2.5, 0]}>
        <coneGeometry args={[1.8, 2, 8]} />
        <meshStandardMaterial color="#004526" />
      </mesh>
      
      <mesh position={[0, 3.5, 0]}>
        <coneGeometry args={[1.5, 2, 8]} />
        <meshStandardMaterial color="#004526" />
      </mesh>
      
      <mesh position={[0, 4.5, 0]}>
        <coneGeometry args={[1.2, 2, 8]} />
        <meshStandardMaterial color="#004526" />
      </mesh>
      
      <mesh position={[0, 5.5, 0]}>
        <coneGeometry args={[0.8, 1.5, 8]} />
        <meshStandardMaterial color="#004526" />
      </mesh>
    </group>
  );
};

// // Torch Component
// const Torch = ({ position, intensity = 2 }) => {
//   const flameRef = useRef();
  
//   useFrame((state) => {
//     if (flameRef.current) {
//       flameRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
//       flameRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;
//     }
//   });

//   return (
//     <group position={position}>
//       <mesh position={[0, 0, 0]}>
//         <cylinderGeometry args={[0.1, 0.1, 1.5, 8]} />
//         <meshStandardMaterial color="#3d2817" />
//       </mesh>
      
//       <mesh ref={flameRef} position={[0, 0.8, 0]}>
//         <coneGeometry args={[0.2, 0.6, 4]} />
//         <meshStandardMaterial 
//           color="#ff6600" 
//           emissive="#ff4500" 
//           emissiveIntensity={1}
//         />
//       </mesh>
      
//       <pointLight position={[0, 0.8, 0]} intensity={intensity} color="#ff6600" distance={10} decay={2} />
//     </group>
//   );
// };


// Torch Component
const Torch = ({ position = [0, 0, 0], intensity = 3 }) => {
  const flameRef = useRef();
  const innerFlameRef = useRef();
  const coreFlameRef = useRef();
  const glowRef = useRef();
  const particlesRef = useRef();
  const light1Ref = useRef();
  const light2Ref = useRef();
  
  // Create spark particles
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 20; i++) {
      temp.push({
        offset: [
          (Math.random() - 0.5) * 0.1,
          0,
          (Math.random() - 0.5) * 0.1
        ],
        speed: 0.4 + Math.random() * 0.6,
        life: Math.random(),
        size: 0.02 + Math.random() * 0.03
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // More organic flame movement
    if (flameRef.current) {
      const flicker1 = Math.sin(time * 3.2) * 0.18;
      const flicker2 = Math.sin(time * 5.7) * 0.12;
      const flicker3 = Math.cos(time * 7.3) * 0.08;
      const flicker4 = Math.sin(time * 9.1) * 0.05;
      
      const totalFlicker = flicker1 + flicker2 + flicker3 + flicker4;
      
      flameRef.current.scale.y = 1 + totalFlicker;
      flameRef.current.scale.x = 1 - totalFlicker * 0.25;
      flameRef.current.scale.z = 1 - totalFlicker * 0.25;
      
      // Sway and rotation
      flameRef.current.rotation.z = Math.sin(time * 2.5) * 0.2 + Math.cos(time * 4.1) * 0.1;
      flameRef.current.rotation.x = Math.sin(time * 1.8) * 0.1;
    }
    
    // Inner flame with different timing
    if (innerFlameRef.current) {
      const innerFlicker = Math.sin(time * 4.5 + 0.5) * 0.15 + Math.cos(time * 6.2) * 0.1;
      innerFlameRef.current.scale.y = 1 + innerFlicker;
      innerFlameRef.current.scale.x = 1 - innerFlicker * 0.2;
      innerFlameRef.current.scale.z = 1 - innerFlicker * 0.2;
      innerFlameRef.current.rotation.z = Math.sin(time * 3.8 + 1) * 0.18;
    }
    
    // Bright core
    if (coreFlameRef.current) {
      const coreFlicker = Math.sin(time * 6.5 + 1) * 0.2;
      coreFlameRef.current.scale.y = 1 + coreFlicker;
      coreFlameRef.current.rotation.z = Math.sin(time * 5.2) * 0.15;
    }
    
    // Glow pulses
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.3 + Math.sin(time * 3.5) * 0.15 + Math.cos(time * 5.8) * 0.1;
      glowRef.current.scale.setScalar(1 + Math.sin(time * 2.8) * 0.15);
    }
    
    // Realistic light flickering
    if (light1Ref.current) {
      const lightFlicker = 1 + Math.sin(time * 4) * 0.2 + Math.sin(time * 7.5) * 0.15;
      light1Ref.current.intensity = intensity * lightFlicker;
    }
    
    if (light2Ref.current) {
      const lightFlicker2 = 1 + Math.sin(time * 3.5 + 0.5) * 0.15;
      light2Ref.current.intensity = (intensity * 0.6) * lightFlicker2;
    }
    
    // Animated sparks and embers
    if (particlesRef.current) {
      particlesRef.current.children.forEach((particle, i) => {
        const life = (time * particles[i].speed + particles[i].life) % 1;
        const height = 0.7 + life * 1.2;
        
        // Spiral upward motion
        particle.position.y = height;
        particle.position.x = particles[i].offset[0] + Math.sin(time * 2 + i * 0.5) * 0.08 * life;
        particle.position.z = particles[i].offset[2] + Math.cos(time * 2 + i * 0.5) * 0.08 * life;
        
        // Fade and shrink
        const fadeStart = 0.6;
        const opacity = life < fadeStart ? 1 : 1 - ((life - fadeStart) / (1 - fadeStart));
        particle.material.opacity = opacity * 0.9;
        particle.scale.setScalar(particles[i].size * (1 - life * 0.7));
      });
    }
  });

  return (
    <group position={position}>
      {/* Wooden handle */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.1, 1.4, 8]} />
        <meshStandardMaterial 
          color="#2d1810" 
          roughness={0.95}
          metalness={0}
        />
      </mesh>
      
      {/* Wrapped top section */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.1, 0.25, 8]} />
        <meshStandardMaterial 
          color="#1a1008" 
          roughness={0.85}
        />
      </mesh>
      
      {/* Outer flame - deep orange/red */}
      <mesh ref={flameRef} position={[0, 1, 0]}>
        <coneGeometry args={[0.3, 0.9, 8]} />
        <meshStandardMaterial
          color="#ff4400"
          emissive="#ff2200"
          emissiveIntensity={2.5}
          transparent
          opacity={0.75}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Middle flame - bright orange */}
      <mesh ref={innerFlameRef} position={[0, 1, 0]}>
        <coneGeometry args={[0.2, 0.7, 7]} />
        <meshStandardMaterial
          color="#ff8800"
          emissive="#ff6600"
          emissiveIntensity={3}
          transparent
          opacity={0.85}
        />
      </mesh>
      
      {/* Core flame - bright yellow/white */}
      <mesh ref={coreFlameRef} position={[0, 0.95, 0]}>
        <coneGeometry args={[0.12, 0.5, 6]} />
        <meshStandardMaterial
          color="#ffffaa"
          emissive="#ffdd00"
          emissiveIntensity={4}
          transparent
          opacity={0.95}
        />
      </mesh>
      
      {/* Base glow */}
      <mesh ref={glowRef} position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.25, 12, 12]} />
        <meshBasicMaterial
          color="#ff7722"
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Additional soft glow */}
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.35, 12, 12]} />
        <meshBasicMaterial
          color="#ff9944"
          transparent
          opacity={0.15}
        />
      </mesh>
      
      {/* Ember particles */}
      <group ref={particlesRef}>
        {particles.map((p, i) => (
          <mesh key={i} position={p.offset}>
            <sphereGeometry args={[0.025, 6, 6]} />
            <meshBasicMaterial
              color={i % 3 === 0 ? "#ffcc66" : "#ff8844"}
              transparent
              opacity={0.9}
            />
          </mesh>
        ))}
      </group>
      
      {/* Main flickering light */}
      <pointLight 
        ref={light1Ref}
        position={[0, 1, 0]} 
        intensity={intensity} 
        color="#ff6633" 
        distance={15} 
        decay={2}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
      />
      
      {/* Secondary warm ambient light */}
      <pointLight 
        ref={light2Ref}
        position={[0, 0.8, 0]} 
        intensity={intensity * 0.6} 
        color="#ff8844" 
        distance={10} 
        decay={2}
      />
      
      {/* Subtle top light for glow effect */}
      <pointLight 
        position={[0, 1.2, 0]} 
        intensity={intensity * 0.3} 
        color="#ffaa66" 
        distance={6} 
        decay={2}
      />
    </group>
  );
};


// Mining Cart Component
const MiningCart = ({ position, onClick, isHighlighted }) => {
  const [hovered, setHovered] = useState(false);
  const { scale, emissiveIntensity } = useSpring({
    scale: isHighlighted ? 1.2 : hovered ? 1.1 : 1,
    emissiveIntensity: (isHighlighted || hovered) ? 0.5 : 0,
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
      {/* Cart Bottom */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.0, 0.15, 0.7]} />
        <animated.meshStandardMaterial
          color="#3d2817"
          emissive={(isHighlighted || hovered) ? "#ff8800" : "#000000"}
          emissiveIntensity={emissiveIntensity}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* Cart Front Side (angled) */}
      <mesh position={[0.45, 0.5, 0]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.25, 0.4, 0.7]} />
        <animated.meshStandardMaterial
          color="#5c4033"
          emissive={(isHighlighted || hovered) ? "#ff8800" : "#000000"}
          emissiveIntensity={emissiveIntensity}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* Cart Back Side (angled) */}
      <mesh position={[-0.45, 0.5, 0]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.25, 0.4, 0.7]} />
        <animated.meshStandardMaterial
          color="#5c4033"
          emissive={(isHighlighted || hovered) ? "#ff8800" : "#000000"}
          emissiveIntensity={emissiveIntensity}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* Cart Left Side */}
      <mesh position={[0, 0.5, 0.32]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.9, 0.4, 0.1]} />
        <animated.meshStandardMaterial
          color="#5c4033"
          emissive={(isHighlighted || hovered) ? "#ff8800" : "#000000"}
          emissiveIntensity={emissiveIntensity}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* Cart Right Side */}
      <mesh position={[0, 0.5, -0.32]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.9, 0.4, 0.1]} />
        <animated.meshStandardMaterial
          color="#5c4033"
          emissive={(isHighlighted || hovered) ? "#ff8800" : "#000000"}
          emissiveIntensity={emissiveIntensity}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* Metal Frame - Top Rim */}
      <mesh position={[0, 0.68, 0]}>
        <boxGeometry args={[1.1, 0.05, 0.75]} />
        <animated.meshStandardMaterial
          color="#4a4a4a"
          emissive={(isHighlighted || hovered) ? "#ff8800" : "#000000"}
          emissiveIntensity={emissiveIntensity}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Metal Reinforcement Bands */}
      {[-0.3, 0, 0.3].map((x, i) => (
        <mesh key={`band-${i}`} position={[x, 0.5, 0]}>
          <boxGeometry args={[0.08, 0.5, 0.8]} />
          <animated.meshStandardMaterial
            color="#3a3a3a"
            emissive={(isHighlighted || hovered) ? "#ff8800" : "#000000"}
            emissiveIntensity={emissiveIntensity}
            metalness={0.9}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* Wheels with spokes */}
      {[[-0.4, 0.15, 0.5], [0.4, 0.15, 0.5], [-0.4, 0.15, -0.5], [0.4, 0.15, -0.5]].map((pos, i) => (
        <group key={i} position={pos}>
          {/* Wheel outer rim */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.12, 16]} />
            <animated.meshStandardMaterial
              color="#2c2c2c"
              emissive={(isHighlighted || hovered) ? "#ff8800" : "#000000"}
              emissiveIntensity={emissiveIntensity}
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
          
          {/* Wheel hub */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, 0.14, 8]} />
            <animated.meshStandardMaterial
              color="#1a1a1a"
              emissive={(isHighlighted || hovered) ? "#ff8800" : "#000000"}
              emissiveIntensity={emissiveIntensity}
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>

          {/* Wheel spokes */}
          {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4].map((angle, j) => (
            <mesh
              key={`spoke-${j}`}
              position={[
                Math.cos(angle) * 0.05,
                Math.sin(angle) * 0.05,
                0
              ]}
              rotation={[0, angle, Math.PI / 2]}
            >
              <boxGeometry args={[0.03, 0.16, 0.03]} />
              <animated.meshStandardMaterial
                color="#3a3a3a"
                emissive={(isHighlighted || hovered) ? "#ff8800" : "#000000"}
                emissiveIntensity={emissiveIntensity}
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Axles */}
      <mesh position={[-0.4, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 1.1, 8]} />
        <animated.meshStandardMaterial
          color="#2c2c2c"
          emissive={(isHighlighted || hovered) ? "#ff8800" : "#000000"}
          emissiveIntensity={emissiveIntensity}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0.4, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 1.1, 8]} />
        <animated.meshStandardMaterial
          color="#2c2c2c"
          emissive={(isHighlighted || hovered) ? "#ff8800" : "#000000"}
          emissiveIntensity={emissiveIntensity}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
    </animated.group>
  );
};

// Bat Component
const Bat = ({ position, onClick, isHighlighted }) => {
  const meshRef = useRef();
  const leftWingRef = useRef();
  const rightWingRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Animation for flapping and hovering
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(t * 3) * 0.1;
      meshRef.current.rotation.z = Math.sin(t * 2) * 0.15;
    }
    const flap = Math.sin(t * 7) * 0.45;
    if (leftWingRef.current && rightWingRef.current) {
      leftWingRef.current.rotation.z = Math.PI / 3 + flap;
      rightWingRef.current.rotation.z = -Math.PI / 3 - flap;
    }
  });
  
  const { scale, emissiveIntensity } = useSpring({
    scale: isHighlighted ? 1.3 : hovered ? 1.15 : 1,
    emissiveIntensity: (isHighlighted || hovered) ? 0.4 : 0.05,
    config: { tension: 300, friction: 10 }
  });
  
  // Create curved wing geometry for left wing
  const createLeftWingShape = () => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(0.25, 0.4, 0.6, 0);
    shape.quadraticCurveTo(0.3, -0.25, 0, 0);
    return shape;
  };
  
  // Create curved wing geometry for right wing (mirrored)
  const createRightWingShape = () => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(-0.25, 0.4, -0.6, 0);
    shape.quadraticCurveTo(-0.3, -0.25, 0, 0);
    return shape;
  };
  
  const leftWingGeometry = new THREE.ShapeGeometry(createLeftWingShape());
  const rightWingGeometry = new THREE.ShapeGeometry(createRightWingShape());
  
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
      <mesh>
        <sphereGeometry args={[0.22, 16, 16]} />
        <animated.meshStandardMaterial
          color={(isHighlighted || hovered) ? "#3a3a3a" : "#1a1a1a"}
          emissive={(isHighlighted || hovered) ? "#6600ff" : "#000000"}
          emissiveIntensity={emissiveIntensity}
          roughness={0.5}
          metalness={0.25}
        />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0.18, 0.05]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <animated.meshStandardMaterial
          color="#1a1a1a"
          emissive={(isHighlighted || hovered) ? "#6600ff" : "#000000"}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[0.05, 0.22, 0.12]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial emissive="#ff0044" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[-0.05, 0.22, 0.12]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial emissive="#ff0044" emissiveIntensity={1.2} />
      </mesh>
      
      {/* Left Wing */}
      <mesh
        ref={leftWingRef}
        position={[-0.25, 0.05, 0]}
        rotation={[0, 0, Math.PI / 3]}
        geometry={leftWingGeometry}
      >
        <animated.meshStandardMaterial
          color="#111"
          transparent
          opacity={0.8}
          emissive={(isHighlighted || hovered) ? "#5500ff" : "#000000"}
          emissiveIntensity={emissiveIntensity}
          side={THREE.DoubleSide}
          roughness={0.4}
        />
      </mesh>
      
      {/* Right Wing */}
      <mesh
        ref={rightWingRef}
        position={[0.25, 0.05, 0]}
        rotation={[0, 0, -Math.PI / 3]}
        geometry={rightWingGeometry}
      >
        <animated.meshStandardMaterial
          color="#111"
          transparent
          opacity={0.8}
          emissive={(isHighlighted || hovered) ? "#5500ff" : "#000000"}
          emissiveIntensity={emissiveIntensity}
          side={THREE.DoubleSide}
          roughness={0.4}
        />
      </mesh>
    </animated.group>
  );
};

// Rock Formation
const Rock = ({ position, scale = 1 }) => {
  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[0.5, 6, 5]} />
      <meshStandardMaterial 
        color="#3d3d3d"
        metalness={0.1}
        roughness={0.9}
      />
    </mesh>
  );
};

// Enhanced Pebble Component with better scattering
const PebbleCluster = ({ position, count = 10, spread = 3, sizeRange = [0.1, 0.4] }) => {
  return (
    <group position={position}>
      {Array.from({ length: count }, (_, i) => {
        const size = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);
        const colors = ['#4a4a4a', '#3d3d3d', '#555555', '#2a2a2a', '#505050'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        return (
          <mesh 
            key={i}
            position={[
              (Math.random() - 0.5) * spread,
              -0.1,
              (Math.random() - 0.5) * spread
            ]} 
            scale={[
              size,
              size * (0.4 + Math.random() * 0.4),
              size
            ]}
            rotation={[
              Math.random() * 0.5,
              Math.random() * Math.PI * 2,
              Math.random() * 0.5
            ]}
          >
            <sphereGeometry args={[1, 4 + Math.floor(Math.random() * 3), 3 + Math.floor(Math.random() * 2)]} />
            <meshStandardMaterial 
              color={color}
              metalness={0.1}
              roughness={0.95}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// Enhanced Mountain Component with more variations
const Mountain = ({ position, scale = 1, rotation = [0, 0, 0], variant = 0 }) => {
  const heightVariations = [1.5, 1.8, 1.3, 1.6];
  const widthVariations = [0.9, 1.1, 0.8, 1.2];
  
  const mainHeight = heightVariations[variant % heightVariations.length];
  const mainWidth = widthVariations[variant % widthVariations.length];
  
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Main mountain peak */}
      <mesh position={[0, 0, 0]} scale={[mainWidth, mainHeight, mainWidth]}>
        <coneGeometry args={[4, 8, 6 + Math.floor(Math.random() * 3)]} />
        <meshStandardMaterial 
          color={`#${Math.floor(40 + Math.random() * 15).toString(16).repeat(3)}`}
          metalness={0.2}
          roughness={0.9}
        />
      </mesh>
      
      {/* Secondary peaks for irregular shape */}
      {[
        { pos: [scale * 1.8, -1, scale * 0.8], scale: [0.7, 1.2, 0.7] },
        { pos: [-scale * 1.5, -0.5, -scale * 0.5], scale: [0.6, 1.1, 0.6] },
        { pos: [scale * 0.5, -1.5, -scale * 1.2], scale: [0.5, 0.9, 0.5] },
        { pos: [-scale * 0.8, -1.2, scale * 1.5], scale: [0.4, 0.8, 0.4] }
      ].map((peak, i) => (
        <mesh key={i} position={peak.pos} scale={peak.scale}>
          <coneGeometry args={[3, 5 + Math.random() * 2, 5 + Math.floor(Math.random() * 3)]} />
          <meshStandardMaterial 
            color={`#${Math.floor(30 + Math.random() * 10).toString(16).repeat(3)}`}
            metalness={0.15}
            roughness={0.92}
          />
        </mesh>
      ))}
      
      {/* Rocky base formations - enhanced with more variation */}
      {Array.from({ length: 6 + Math.floor(Math.random() * 4) }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const distance = scale * (2 + Math.random() * 1.5);
        return (
          <mesh 
            key={`rock-${i}`} 
            position={[
              Math.cos(angle) * distance,
              -2.5 + Math.random() * 0.5,
              Math.sin(angle) * distance
            ]} 
            scale={[
              scale * (0.6 + Math.random() * 0.4),
              scale * (0.4 + Math.random() * 0.3),
              scale * (0.6 + Math.random() * 0.4)
            ]}
            rotation={[
              Math.random() * 0.3,
              Math.random() * Math.PI * 2,
              Math.random() * 0.3
            ]}
          >
            <sphereGeometry args={[1.2, 4 + Math.floor(Math.random() * 4), 3 + Math.floor(Math.random() * 3)]} />
            <meshStandardMaterial 
              color={`#${Math.floor(45 + Math.random() * 15).toString(16).repeat(3)}`}
              metalness={0.1}
              roughness={0.95}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// Treasure Chest Component
const TreasureChest = ({ position, onClick, isHighlighted }) => {
  const [hovered, setHovered] = useState(false);
  
  const { scale, emissiveIntensity } = useSpring({
    scale: isHighlighted ? 1.2 : hovered ? 1.1 : 1,
    emissiveIntensity: (isHighlighted || hovered) ? 0.8 : 0,
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
      {/* Chest Base - main box */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[1, 0.5, 0.7]} />
        <animated.meshStandardMaterial
          color={(isHighlighted || hovered) ? "#8b6f47" : "#6b4423"}
          emissive={(isHighlighted || hovered) ? "#ffd700" : "#000000"}
          emissiveIntensity={emissiveIntensity}
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      
      {/* Wood planks detail on base */}
      {[-0.3, -0.1, 0.1, 0.3].map((x, i) => (
        <mesh key={`plank-${i}`} position={[x, 0.25, 0.36]}>
          <boxGeometry args={[0.15, 0.52, 0.02]} />
          <animated.meshStandardMaterial
            color={(isHighlighted || hovered) ? "#7a5c3a" : "#5a3c1a"}
            emissive={(isHighlighted || hovered) ? "#aa8800" : "#000000"}
            emissiveIntensity={emissiveIntensity * 0.5}
            roughness={0.9}
          />
        </mesh>
      ))}
      
      {/* Rounded Lid */}
      <mesh position={[0, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.35, 0.35, 1, 20, 1, false, 0, Math.PI]} />
        <animated.meshStandardMaterial
          color={(isHighlighted || hovered) ? "#8b6f47" : "#6b4423"}
          emissive={(isHighlighted || hovered) ? "#ffd700" : "#000000"}
          emissiveIntensity={emissiveIntensity}
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      
      {/* Lid back panel */}
      <mesh position={[0, 0.6, -0.35]}>
        <boxGeometry args={[1, 0.35, 0.02]} />
        <animated.meshStandardMaterial
          color={(isHighlighted || hovered) ? "#8b6f47" : "#6b4423"}
          emissive={(isHighlighted || hovered) ? "#ffd700" : "#000000"}
          emissiveIntensity={emissiveIntensity}
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      
      {/* Metal reinforcement bands on lid */}
      <mesh position={[0, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.37, 0.37, 0.08, 20, 1, false, 0, Math.PI]} />
        <animated.meshStandardMaterial
          color="#c9a961"
          emissive={(isHighlighted || hovered) ? "#ffd700" : "#000000"}
          emissiveIntensity={emissiveIntensity}
          metalness={0.95}
          roughness={0.15}
        />
      </mesh>
      <mesh position={[0, 0.6, 0.2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.37, 0.37, 0.08, 20, 1, false, 0, Math.PI]} />
        <animated.meshStandardMaterial
          color="#c9a961"
          emissive={(isHighlighted || hovered) ? "#ffd700" : "#000000"}
          emissiveIntensity={emissiveIntensity}
          metalness={0.95}
          roughness={0.15}
        />
      </mesh>
      
      {/* Vertical corner reinforcements */}
      {[[-0.48, 0], [0.48, 0]].map((pos, i) => (
        <mesh key={`corner-${i}`} position={[pos[0], 0.25, 0.34]}>
          <boxGeometry args={[0.06, 0.52, 0.06]} />
          <animated.meshStandardMaterial
            color="#b8924a"
            emissive={(isHighlighted || hovered) ? "#ffd700" : "#000000"}
            emissiveIntensity={emissiveIntensity}
            metalness={0.92}
            roughness={0.2}
          />
        </mesh>
      ))}
      
      {/* Horizontal base bands */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[1.05, 0.06, 0.75]} />
        <animated.meshStandardMaterial
          color="#b8924a"
          emissive={(isHighlighted || hovered) ? "#ffd700" : "#000000"}
          emissiveIntensity={emissiveIntensity}
          metalness={0.92}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[1.05, 0.06, 0.75]} />
        <animated.meshStandardMaterial
          color="#b8924a"
          emissive={(isHighlighted || hovered) ? "#ffd700" : "#000000"}
          emissiveIntensity={emissiveIntensity}
          metalness={0.92}
          roughness={0.2}
        />
      </mesh>
      
      {/* Lock plate */}
      <mesh position={[0, 0.5, 0.37]}>
        <boxGeometry args={[0.2, 0.28, 0.04]} />
        <animated.meshStandardMaterial
          color="#d4af37"
          emissive={(isHighlighted || hovered) ? "#ffff00" : "#ffd700"}
          emissiveIntensity={emissiveIntensity * 1.2}
          metalness={1}
          roughness={0.08}
        />
      </mesh>
      
      {/* Keyhole */}
      <mesh position={[0, 0.48, 0.4]}>
        <cylinderGeometry args={[0.03, 0.03, 0.05, 16]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.43, 0.4]}>
        <boxGeometry args={[0.015, 0.08, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.5} />
      </mesh>
      
      {/* Hinges on back */}
      {[-0.3, 0.3].map((x, i) => (
        <group key={`hinge-${i}`} position={[x, 0.52, -0.35]}>
          <mesh>
            <boxGeometry args={[0.12, 0.08, 0.04]} />
            <animated.meshStandardMaterial
              color="#8b7355"
              emissive={(isHighlighted || hovered) ? "#aa8800" : "#000000"}
              emissiveIntensity={emissiveIntensity * 0.5}
              metalness={0.85}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, 0, -0.03]}>
            <cylinderGeometry args={[0.025, 0.025, 0.1, 8]} />
            <animated.meshStandardMaterial
              color="#6b5845"
              emissive={(isHighlighted || hovered) ? "#aa8800" : "#000000"}
              emissiveIntensity={emissiveIntensity * 0.5}
              metalness={0.9}
              roughness={0.25}
            />
          </mesh>
        </group>
      ))}
      
      {/* Gold coins spilling out */}
      {[
        [0.15, 0.52, 0.25],
        [-0.12, 0.52, 0.28],
        [0.25, 0.52, 0.18],
        [-0.22, 0.52, 0.22],
        [0.05, 0.52, 0.32],
        [0.32, 0.52, 0.12],
        [-0.05, 0.52, 0.3]
      ].map((pos, i) => (
        <mesh
          key={`coin-${i}`}
          position={pos}
          rotation={[Math.random() * 0.5, Math.random() * Math.PI, Math.random() * 0.5]}
        >
          <cylinderGeometry args={[0.045, 0.045, 0.01, 16]} />
          <animated.meshStandardMaterial
            color="#ffd700"
            emissive="#ffaa00"
            emissiveIntensity={(isHighlighted || hovered) ? 1.2 : 0.6}
            metalness={1}
            roughness={0.1}
          />
        </mesh>
      ))}
      
      {/* Gems/jewels */}
      {[
        { pos: [0.18, 0.54, 0.2], color: "#ff0055" },
        { pos: [-0.15, 0.54, 0.25], color: "#00ff88" },
        { pos: [0.08, 0.54, 0.28], color: "#0088ff" }
      ].map((gem, i) => (
        <mesh
          key={`gem-${i}`}
          position={gem.pos}
          rotation={[0, Math.random() * Math.PI, 0]}
        >
          <octahedronGeometry args={[0.04, 0]} />
          <animated.meshStandardMaterial
            color={gem.color}
            emissive={gem.color}
            emissiveIntensity={(isHighlighted || hovered) ? 1.5 : 0.8}
            metalness={0.2}
            roughness={0.1}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
    </animated.group>
  );
};


// Crystal Component
const Crystal = ({ position, onClick, isHighlighted, hanging = false }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  const { scale, emissiveIntensity } = useSpring({
    scale: isHighlighted ? 1.3 : hovered ? 1.15 : 1,
    emissiveIntensity: (isHighlighted || hovered) ? 1 : 0.3,
    config: { tension: 300, friction: 10 }
  });

  return (
    <animated.group
      ref={meshRef}
      position={position}
      onClick={onClick}
      scale={scale}
      rotation={hanging ? [Math.PI, 0, 0] : [0, 0, 0]}
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
        <coneGeometry args={[0.3, 1.5, 6]} />
        <animated.meshStandardMaterial 
          color={(isHighlighted || hovered) ? "#00ffff" : "#4dd0e1"}
          emissive="#00ffff"
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={0.8}
          metalness={0.1}
          roughness={0.2}
        />
      </mesh>
      <pointLight 
        position={[0, 0, 0]} 
        intensity={(isHighlighted || hovered) ? 2 : 0.5} 
        color="#00ffff" 
        distance={5} 
      />
    </animated.group>
  );
};


// Water Puddle Component (Interactive)
const WaterPuddle = ({ position, onClick, isHighlighted }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Create irregular puddle shape
  const createPuddleShape = () => {
    const shape = new THREE.Shape();
    const points = 16;
    const baseRadius = 1.6;
    
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      // Add irregular variations to radius
      const radiusVariation = baseRadius * (0.7 + Math.random() * 0.4);
      const x = Math.cos(angle) * radiusVariation;
      const y = Math.sin(angle) * radiusVariation;
      
      if (i === 0) {
        shape.moveTo(x, y);
      } else {
        // Use quadratic curves for organic edges
        const prevAngle = ((i - 1) / points) * Math.PI * 2;
        const prevRadius = baseRadius * (0.8 + Math.random() * 0.3);
        const cpX = Math.cos((angle + prevAngle) / 2) * prevRadius;
        const cpY = Math.sin((angle + prevAngle) / 2) * prevRadius;
        shape.quadraticCurveTo(cpX, cpY, x, y);
      }
    }
    
    return shape;
  };
  
  const puddleGeometry = new THREE.ShapeGeometry(createPuddleShape());

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // Very subtle opacity variation for water movement
    if (meshRef.current) {
      meshRef.current.material.opacity = 0.7 + Math.sin(t * 0.8) * 0.05;
    }
  });
  
  const { scale, emissiveIntensity } = useSpring({
    scale: isHighlighted ? 1.2 : hovered ? 1.1 : 1,
    emissiveIntensity: (isHighlighted || hovered) ? 0.3 : 0,
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
      {/* Dark base - for depth */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} geometry={puddleGeometry}>
        <meshStandardMaterial
          color="#0a1a24"
          transparent
          opacity={0.85}
          roughness={0.8}
        />
      </mesh>
      
      {/* Main water surface */}
      <mesh 
        ref={meshRef} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0.02, 0]} 
        geometry={puddleGeometry}
      >
        <animated.meshStandardMaterial
          color={(isHighlighted || hovered) ? "#2d5a6e" : "#1a3d4d"}
          emissive={(isHighlighted || hovered) ? "#004d66" : "#001a26"}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={0.7}
          metalness={0.4}
          roughness={0.2}
        />
      </mesh>
      
      {/* Subtle reflection highlight - slightly smaller than main puddle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[1.0, 32]} />
        <animated.meshStandardMaterial
          color="#5a7a8a"
          emissive={(isHighlighted || hovered) ? "#6699aa" : "#334455"}
          emissiveIntensity={(isHighlighted || hovered) ? 0.3 : 0.1}
          transparent
          opacity={0.15}
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>
      
      {/* Small scattered wet spots around puddle for realism */}
      {[
        { pos: [1.2, 0.8], size: 0.3 },
        { pos: [-1.3, 0.6], size: 0.25 },
        { pos: [0.9, -1.1], size: 0.35 },
        { pos: [-0.8, -1.0], size: 0.28 },
        { pos: [1.5, -0.3], size: 0.22 }
      ].map((spot, i) => (
        <mesh
          key={`wet-spot-${i}`}
          rotation={[-Math.PI / 2, 0, Math.random() * Math.PI]}
          position={[spot.pos[0], 0.01, spot.pos[1]]}
        >
          <circleGeometry args={[spot.size, 16]} />
          <meshStandardMaterial
            color="#2a4a5a"
            transparent
            opacity={0.4}
            roughness={0.6}
            metalness={0.2}
          />
        </mesh>
      ))}
      
      {/* Subtle ambient light */}
      {(isHighlighted || hovered) && (
        <pointLight 
          position={[0, 0.5, 0]} 
          intensity={0.6} 
          color="#3d7a99" 
          distance={4} 
          decay={2} 
        />
      )}
    </animated.group>
  );
};

// Stalagmite
const Stalagmite = ({ position, scale = 1 }) => {
  return (
    <mesh position={position} scale={scale}>
      <coneGeometry args={[0.3, 1.2, 6]} />
      <meshStandardMaterial 
        color="#666666" 
        metalness={0.2}
        roughness={0.8}
      />
    </mesh>
  );
};


// Cave Entrance Arch
const CaveEntrance = () => {
  return (
    <group position={[0, 0, -5]}>
      {/* Left wall - irregular shape */}
      <mesh position={[-7, 2.5, 0]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[3, 7, 12]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.95} />
      </mesh>

      <mesh position={[-8.5, 1, -2]} rotation={[0.2, 0.3, -0.2]}>
        <boxGeometry args={[2, 4, 3]} />
        <meshStandardMaterial color="#252525" roughness={0.9} />
      </mesh>

      <mesh position={[-6.5, 5, 3]} rotation={[-0.1, -0.2, 0.1]}>
        <boxGeometry args={[1.5, 2, 4]} />
        <meshStandardMaterial color="#252525" roughness={0.9} />
      </mesh>

      {/* Right wall */}
      <mesh position={[7, 2.5, 0]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[3, 7, 12]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.95} />
      </mesh>

      <mesh position={[8.5, 1.5, -1]} rotation={[0.1, -0.3, 0.15]}>
        <boxGeometry args={[2, 3.5, 4]} />
        <meshStandardMaterial color="#252525" roughness={0.9} />
      </mesh>

      <mesh position={[6, 6, 2]} rotation={[-0.15, 0.1, -0.1]}>
        <boxGeometry args={[2, 1.5, 5]} />
        <meshStandardMaterial color="#252525" roughness={0.9} />
      </mesh>

      {/* Top arch - more natural */}
      <mesh position={[-4.5, 6.2, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[3.5, 1.2, 11]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      <mesh position={[4.5, 6.2, 0]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[3.5, 1.2, 11]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      <mesh position={[0, 6.8, 0]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[7.2, 0.8, 10.5]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      {/* Ceiling round rocks */}
      {[
        [-3.5, 7, -2], [-2, 7, 1], [0, 7, 0],
        [2, 7.2, -1], [3.5, 7.4, 2]
      ].map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.5 + Math.random() * 0.2, 8, 8]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.95} />
        </mesh>
      ))}

      {/* Back wall - irregular, rocky surface */}
      <mesh position={[0, 3, -6]}>
        <boxGeometry args={[16, 9, 1.5]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.95} />
      </mesh>
            {/* Back wall rock formations */}
      <mesh position={[-5, 5, -5.5]} rotation={[0.1, 0.2, -0.1]}>
        <boxGeometry args={[2, 2, 1]} />
        <meshStandardMaterial color="#252525" roughness={0.9} />
      </mesh>
      
      <mesh position={[4, 2, -5.5]} rotation={[-0.1, -0.15, 0.1]}>
        <boxGeometry args={[3, 1.5, 1]} />
        <meshStandardMaterial color="#252525" roughness={0.9} />
      </mesh>
      
      <mesh position={[0, 6.5, -5.5]} rotation={[0.05, 0, 0.05]}>
        <boxGeometry args={[4, 1, 1]} />
        <meshStandardMaterial color="#252525" roughness={0.9} />
      </mesh>
      
      <mesh position={[-2, 1, -5.5]} rotation={[-0.1, 0.1, -0.05]}>
        <boxGeometry args={[2.5, 1.2, 1]} />
        <meshStandardMaterial color="#252525" roughness={0.9} />
      </mesh>

      {/* Floor and back wall rocks */}
      <mesh position={[0, -1.5, 0]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[14, 1, 12]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.95} />
      </mesh>

      <mesh position={[-3, -1, 2]} rotation={[0.2, -0.1, 0.1]}>
        <boxGeometry args={[1.5, 0.6, 2]} />
        <meshStandardMaterial color="#333333" roughness={0.9} />
      </mesh>

      <mesh position={[4, -1.2, -1]} rotation={[-0.1, 0.2, -0.15]}>
        <boxGeometry args={[2, 0.8, 1.5]} />
        <meshStandardMaterial color="#333333" roughness={0.9} />
      </mesh>
    </group>
  );
};




// Info Panel
const InfoPanel = ({ title, content, onClose, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 max-w-4xl max-h-[90vh]">
      <div className="bg-black/95 backdrop-blur-sm border border-orange-400/30 rounded-lg p-6 text-white shadow-2xl mx-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-orange-400 text-xl font-bold mr-4">{title}</h3>
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
      case 'cart':
        cameraOffset = new THREE.Vector3(2, 1.5, 2);
        lookAtOffset = new THREE.Vector3(0, 0.5, 0);
        break;
      case 'bat':
        cameraOffset = new THREE.Vector3(0, -1, 2);
        lookAtOffset = new THREE.Vector3(0, 0, 0);
        break;
      case 'chest':
        cameraOffset = new THREE.Vector3(2, 1, 2);
        lookAtOffset = new THREE.Vector3(0, 0.5, 0);
        break;
      case 'crystal':
        cameraOffset = new THREE.Vector3(1.5, 1, 2);
        lookAtOffset = new THREE.Vector3(0, 0, 0);
        break;
      case 'puddle':
        cameraOffset = new THREE.Vector3(2, 2, 2);
        lookAtOffset = new THREE.Vector3(0, 0, 0);
        break;
      default:
        cameraOffset = new THREE.Vector3(2, 2, 3);
        lookAtOffset = new THREE.Vector3(0, 1, 0);
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
      animationProgress.current = Math.min(animationProgress.current + delta * 3, 1);
      
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

// Main Scene
const Scene = ({ selectedObject, setSelectedObject }) => {
  const { name, about, experience, education, skills, summary, description, certifications, projects } = useCVData() || {};
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
    id: 'name-cart',
    component: MiningCart,
    position: [-3, -0.4, -2.5],
    type: 'cart',
    title: 'Who Am I?',
    content: name ? (
      <div>
        <div className="font-semibold text-orange-300 text-lg mb-2">{name}</div>
        {description && <div className="text-gray-300 mb-3">{description}</div>}
        {summary && <div className="text-gray-400 text-sm">{summary}</div>}
      </div>
    ) : "Explorer of digital caves..."
  },
  {
    id: 'experience-bat',
    component: Bat,
    position: [2, 4.5, -5],
    type: 'bat',
    title: 'Experience',
    content: experience && experience.length > 0 ? (
      <div>
        {experience.slice(0, 3).map((exp, i) => (
          <div key={i} className="mb-4 p-3 bg-orange-500/10 rounded-lg border border-orange-400/20">
            <div className="font-semibold text-orange-300">{exp.title}</div>
            <div className="text-gray-300">{exp.company}</div>
            <div className="text-sm text-gray-400 mb-2">
              {exp.startDate} - {exp.endDate || 'Present'}
            </div>
            {exp.extra && exp.extra.length > 0 && (
              <ul className="text-xs text-gray-300 list-disc list-inside">
                {exp.extra.slice(0, 2).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
        {experience.length > 3 && (
          <div className="text-center text-orange-400 text-sm mt-2">
            +{experience.length - 3} more experiences
          </div>
        )}
      </div>
    ) : "My professional journey through the caves of tech..."
  },
  {
    id: 'skills-chest',
    component: TreasureChest,
    position: [5, -0.45, -1.5],
    type: 'chest',
    title: 'Skills & Expertise',
    content: skills && skills.length > 0 ? (
      <div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {skills.slice(0, 8).map((skill, i) => (
            <div key={i} className="bg-orange-500/20 border border-orange-400/30 px-2 py-1 rounded text-center">
              <span className="text-orange-300 text-sm">{skill}</span>
            </div>
          ))}
        </div>
        {certifications && certifications.length > 0 && (
          <div className="mt-4">
            <div className="font-semibold text-cyan-300 mb-2">Certifications</div>
            {certifications.slice(0, 2).map((cert, i) => (
              <div key={i} className="text-gray-300 text-sm mb-1">
                • {cert.title}
              </div>
            ))}
          </div>
        )}
        {skills.length > 8 && (
          <div className="text-center text-orange-400 text-sm mt-2">
            +{skills.length - 8} more skills
          </div>
        )}
      </div>
    ) : "Treasures of knowledge and expertise..."
  },
  {
    id: 'education-crystal',
    component: Crystal,
    position: [-2, 0, -5],
    type: 'crystal',
    title: 'Education',
    content: education && education.length > 0 ? (
      <div>
        {education.slice(0, 2).map((edu, i) => (
          <div key={i} className="mb-4 p-3 bg-cyan-500/10 rounded-lg border border-cyan-400/20">
            <div className="font-semibold text-cyan-300">{edu.degree}</div>
            <div className="text-gray-300">{edu.institution}</div>
            <div className="text-sm text-gray-400">
              {edu.field && <div>{edu.field}</div>}
              {edu.endDate && <div>Completed: {edu.endDate}</div>}
              {edu.gpa && <div>GPA: {edu.gpa}</div>}
            </div>
          </div>
        ))}
        {education.length > 2 && (
          <div className="text-center text-cyan-400 text-sm mt-2">
            +{education.length - 2} more education entries
          </div>
        )}
      </div>
    ) : "Crystallized knowledge foundation..."
  },
  {
    id: 'about-puddle',
    component: WaterPuddle,
    position: [0, -0.45, -4],
    type: 'puddle',
    title: 'About Me',
    content: about ? (
      <div className="space-y-3">
        <div className="text-gray-300 leading-relaxed">{about}</div>
        {projects && projects.length > 0 && (
          <div className="mt-4">
            <div className="font-semibold text-blue-300 mb-2">Recent Projects</div>
            {projects.slice(0, 2).map((project, i) => (
              <div key={i} className="text-gray-300 text-sm mb-2">
                • <span className="font-medium">{project.title}</span>
                {project.description && (
                  <div className="text-gray-400 ml-2">{project.description}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    ) : "Reflecting on my journey through technology and innovation..."
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
      
      {/* Stars in the sky (visible at entrance) */}
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={0.5}
      />
      
      {/* Forest floor (entrance area) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 5]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#01411C" />
      </mesh>

      {/* Cave floor (inside cave) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, -5]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} metalness={0.1} />
      </mesh>

        {/* MOUNTAIN RING TO HIDE BOUNDARIES */}
      
      {/* Far background mountains - hide distant boundaries */}
      <Mountain position={[-25, -1, 15]} scale={3} variant={0} />
      <Mountain position={[25, -1, 15]} scale={2.8} variant={1} />
      <Mountain position={[-20, -1, 20]} scale={2.5} variant={2} />
      <Mountain position={[20, -1, 20]} scale={3.2} variant={3} />
      <Mountain position={[0, -1, 25]} scale={2.7} variant={0} />
      
      {/* Side mountains for forest area */}
      <Mountain position={[-18, -1, 8]} scale={1.8} variant={1} />
      <Mountain position={[18, -1, 8]} scale={2.1} variant={2} />
      <Mountain position={[-22, -1, 2]} scale={1.6} variant={3} />
      <Mountain position={[22, -1, 2]} scale={1.9} variant={0} />
      
      {/* Cave interior boundary mountains */}
      <Mountain position={[-12, 0, -15]} scale={2.5} variant={1} rotation={[0, Math.PI/4, 0]} />
      <Mountain position={[12, 0, -15]} scale={2.3} variant={2} rotation={[0, -Math.PI/4, 0]} />
      <Mountain position={[0, 0, -18]} scale={2.8} variant={3} />
      <Mountain position={[-8, 0, -20]} scale={2.1} variant={0} rotation={[0, Math.PI/6, 0]} />
      <Mountain position={[8, 0, -20]} scale={2.4} variant={1} rotation={[0, -Math.PI/6, 0]} />
      
      {/* Additional mountains for complete enclosure */}
      <Mountain position={[-15, 0, -12]} scale={1.8} variant={2} />
      <Mountain position={[15, 0, -12]} scale={2.0} variant={3} />

{/* DENSE PEBBLE AND ROCK SCATTERING */}
      
      {/* Forest area pebbles */}
      <PebbleCluster position={[-5, -0.6, 18]} count={15} spread={4} />
      <PebbleCluster position={[5, -0.6, 16]} count={12} spread={3.5} />
      <PebbleCluster position={[3, -0.6, 14]} count={18} spread={4.5} />
      <PebbleCluster position={[8, -0.6, 13]} count={14} spread={3.8} />
      
      {/* Cave entrance transition pebbles */}
      {/* <PebbleCluster position={[-6, -0.4, 0]} count={25} spread={4} /> */}
      <PebbleCluster position={[6, -0.5, -1]} count={22} spread={4.2} />
      <PebbleCluster position={[0, -0.4, -6]} count={30} spread={5} />
      
      {/* Cave interior dense pebbles */}
      {/* <PebbleCluster position={[-4, -0.4, -5]} count={35} spread={3} sizeRange={[0.05, 0.3]} /> */}
      {/* <PebbleCluster position={[4, -0.4, -4]} count={32} spread={3.2} sizeRange={[0.05, 0.3]} /> */}
      <PebbleCluster position={[2, -0.4, 10]} count={38} spread={3.8} sizeRange={[0.05, 0.25]} />
      
      {/* Path pebbles leading to interactive objects */}
      <PebbleCluster position={[-2.5, -0.4, 13]} count={15} spread={2} />
      <PebbleCluster position={[4.5, -0.4, 12]} count={12} spread={1.8} />
      <PebbleCluster position={[-4, -0.4, -4.5]} count={18} spread={2.2} />

      {/* Cave Entrance Structure */}
      <CaveEntrance />

      {/* Pine Trees at entrance (forest area) */}
      <PineTree position={[-8, -0.8, 8]} scale={1.2} />
      <PineTree position={[8, -0.8, 7]} scale={1.1} />
      <PineTree position={[-6, -0.8, 10]} scale={1.0} />
      <PineTree position={[6, -0.8, 9]} scale={1.3} />
      <PineTree position={[-10, -0.8, 6]} scale={0.9} />
      <PineTree position={[10, -0.8, 5]} scale={1.1} />
      <PineTree position={[-4, -0.8, 12]} scale={1.2} />
      <PineTree position={[4, -0.8, 11]} scale={1.0} />
      <PineTree position={[0, -0.8, 13]} scale={1.4} />
      <PineTree position={[-12, -0.8, 8]} scale={1.1} />
      <PineTree position={[12, -0.8, 7]} scale={1.0} />

      {/* Interactive Objects (inside cave) */}
      {interactiveObjects.map((obj) => {
        const Component = obj.component;
        return (
          <Component
            key={obj.id}
            position={obj.position}
            onClick={() => handleObjectClick(obj.id)}
            isHighlighted={selectedObject === obj.id}
            hanging={obj.type === 'bat'}
          />
        );
      })}

      {/* Torches inside cave */}
      <Torch position={[-5, 1, -3]} intensity={3} />
      <Torch position={[5, 1, -3]} intensity={3} />
      <Torch position={[-4, 1, -7]} intensity={2.5} />
      <Torch position={[4, 1, -7]} intensity={2.5} />
      <Torch position={[0, 1, -10]} intensity={2} />

      {/* Decorative hanging crystals (inside cave) */}
      <Crystal position={[3, 5.8, -5]} hanging={true} />
      <Crystal position={[-3, 5.8, -7]} hanging={true} />
      <Crystal position={[1, 6, -9]} hanging={true} />
      <Crystal position={[-1, 5.8, -4]} hanging={true} />

      {/* Ground stalagmites (inside cave) */}
      <Stalagmite position={[4, 0, -6]} scale={0.9} />
      <Stalagmite position={[-4, 0, -5]} scale={1.1} />
      <Stalagmite position={[2, 0, -8]} scale={0.8} />
      <Stalagmite position={[-3, 0, -9]} scale={1.0} />
      <Stalagmite position={[5, 0, -10]} scale={1.2} />
      <Stalagmite position={[-5, 0, -11]} scale={0.9} />
      <Stalagmite position={[1, 0, -12]} scale={1.1} />

      {/* Rocks inside cave */}
      <Rock position={[6, -0.3, -4]} scale={1.3} />
      <Rock position={[-6, -0.2, -6]} scale={1.2} />
      <Rock position={[4, -0.25, -9]} scale={1.4} />
      <Rock position={[-4, -0.3, -10]} scale={1.1} />
      <Rock position={[7, -0.2, -7]} scale={1.5} />
      <Rock position={[-7, -0.25, -8]} scale={1.3} />
      <Rock position={[3, -0.2, -11]} scale={1.0} />
      <Rock position={[-3, -0.3, -12]} scale={1.2} />

      {/* Rocks at cave entrance/transition */}
      <Rock position={[-7, -0.2, 2]} scale={1.6} />
      <Rock position={[7, -0.2, 2]} scale={1.5} />
      <Rock position={[-8, -0.3, 0]} scale={1.8} />
      <Rock position={[8, -0.3, 0]} scale={1.7} />

      {/* Rocks in forest area */}
      <Rock position={[-5, -0.2, 7]} scale={0.8} />
      <Rock position={[5, -0.2, 6]} scale={0.9} />
      <Rock position={[-3, -0.2, 9]} scale={0.7} />
      <Rock position={[3, -0.2, 8]} scale={0.8} />

      {/* Lighting - Bright at entrance, dim inside */}
      <ambientLight intensity={0.07} />
      
      {/* Directional light simulating sunlight at entrance */}
      <directionalLight 
        position={[5, 10, 10]} 
        intensity={1.2} 
        color="#fff8dc"
        castShadow
      />
      
      {/* Softer light transitioning into cave */}
      <pointLight position={[0, 4, 0]} intensity={0.5} color="#ff9955" distance={15} decay={2} />
      
      {/* Dim cave ambient */}
      <pointLight position={[0, 3, -10]} intensity={0.3} color="#ff6600" distance={20} decay={2} />
      
      {/* Hemisphere light for natural outdoor/indoor transition */}
      <hemisphereLight 
        skyColor="#87ceeb" 
        groundColor="#2d5016" 
        intensity={0.6} 
        position={[0, 10, 5]}
      />
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
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.2}
      minDistance={3}
      maxDistance={25}
      autoRotate={false}
      enableDamping
      dampingFactor={0.05}
      {...props}
    />
  );
};

// Main Component
const CavePage3D = () => {
  const { name, description } = useCVData() || {};
  const [selectedObject, setSelectedObject] = useState(null);

  const getSelectedObjectData = () => {
    if (!selectedObject) return null;
  
    const objectsData = {
      'name-cart': {
        title: 'Who Am I?',
        content: name ? (
          <div>
            <div className="font-semibold text-orange-300 text-lg mb-2">{name}</div>
            {description && <div className="text-gray-300">{description}</div>}
          </div>
        ) : "Explorer of digital caves..."
      },
      'experience-bat': {
        title: 'Experience',
        content: "Click on the flying bat to see my professional journey..."
      },
      'skills-chest': {
        title: 'Skills',
        content: "Click on the treasure chest to discover my skills..."
      },
      'education-crystal': {
        title: 'Education',
        content: "Click on the crystal to see my educational background..."
      },
      'about-puddle': {
        title: 'About Me',
        content: "Click on the water puddle to learn more about me..."
      }
    };

    return objectsData[selectedObject];
  };

  const selectedObjectData = getSelectedObjectData();

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black overflow-hidden">
      {/* Instructions */}
      <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-sm border border-orange-400/30 rounded-lg p-4 max-w-sm shadow-lg">
        <h3 className="text-orange-400 font-bold mb-2 text-lg">
          🌲 Welcome to {name || "Explorer"}'s Cave Entrance
        </h3>
        <p className="text-white text-sm mb-3">
          Explore the mystical cave hidden in the forest. Click on glowing objects inside the cave to discover my professional profile!
        </p>
        <div className="bg-cyan-500/20 rounded p-2 border border-cyan-400/30">
          <p className="text-cyan-300 text-xs font-semibold mb-1">🎮 Controls:</p>
          <p className="text-cyan-200 text-xs">
            <span className="font-mono bg-cyan-400/20 px-1 rounded">W A S D</span> keys to move around<br/>
            <span className="font-mono bg-cyan-400/20 px-1 rounded">+ -</span> keys to zoom in/out<br/>
            <span className="font-mono bg-cyan-400/20 px-1 rounded">Mouse</span> to look around
          </p>
        </div>
      </div>

      {/* Home button */}
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-orange-400/20 hover:bg-orange-400/30 border border-orange-400/50 text-orange-400 px-4 py-2 rounded-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-400/20"
        >
          🏠 Back to Surface
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

      {/* Atmospheric overlay effects */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-orange-400 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-green-400 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
      </div>

      <Canvas
        camera={{
          position: [0, 3, 12],
          fov: 65,
          near: 0.1,
          far: 1000,
        }}
        shadows
      >
        <Suspense fallback={null}>
          <Scene selectedObject={selectedObject} setSelectedObject={setSelectedObject} />
          <Environment preset="forest" />
          <ControlledOrbitControls />
        </Suspense>
      </Canvas>

      {/* Loading overlay */}
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
          <div className="text-center">
            <div className="text-orange-400 text-xl mb-4">🔦 Entering the mystical cave...</div>
            <div className="animate-spin w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      }>
        <div />
      </Suspense>
    </div>
  );
};

export default CavePage3D;