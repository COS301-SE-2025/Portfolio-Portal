import React, { Suspense, useState, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, Stars } from "@react-three/drei";
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';

// Mock CV data hook for now
const useCvData = () => ({
  name: "John Doe",
  about: "A passionate explorer of digital caves and immersive experiences.",
  experience: [
    { title: "Senior Developer", company: "Tech Corp", startDate: "2020", endDate: "Present" },
    { title: "Junior Developer", company: "StartUp Inc", startDate: "2018", endDate: "2020" }
  ],
  education: [
    { degree: "BS Computer Science", institution: "University", endDate: "2018" }
  ],
  skills: ["React", "Three.js", "JavaScript", "3D Graphics", "WebGL", "Node.js"]
});

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

// Torch Component
const Torch = ({ position, intensity = 2 }) => {
  const flameRef = useRef();
  
  useFrame((state) => {
    if (flameRef.current) {
      flameRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      flameRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1.5, 8]} />
        <meshStandardMaterial color="#3d2817" />
      </mesh>
      
      <mesh ref={flameRef} position={[0, 0.8, 0]}>
        <coneGeometry args={[0.2, 0.6, 4]} />
        <meshStandardMaterial 
          color="#ff6600" 
          emissive="#ff4500" 
          emissiveIntensity={1}
        />
      </mesh>
      
      <pointLight position={[0, 0.8, 0]} intensity={intensity} color="#ff6600" distance={10} decay={2} />
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
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.2, 0.6, 0.8]} />
        <animated.meshStandardMaterial 
          color={(isHighlighted || hovered) ? "#8b6f47" : "#5c4033"}
          emissive={(isHighlighted || hovered) ? "#ff8800" : "#000000"}
          emissiveIntensity={emissiveIntensity}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      
      {[[-0.4, 0.1, 0.5], [0.4, 0.1, 0.5], [-0.4, 0.1, -0.5], [0.4, 0.1, -0.5]].map((pos, i) => (
        <mesh key={i} position={pos} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 8]} />
          <animated.meshStandardMaterial 
            color="#2c2c2c"
            emissive={(isHighlighted || hovered) ? "#ff8800" : "#000000"}
            emissiveIntensity={emissiveIntensity}
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      ))}
    </animated.group>
  );
};

// Bat Component
const Bat = ({ position, onClick, isHighlighted }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.2;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1;
    }
  });

  const { scale, emissiveIntensity } = useSpring({
    scale: isHighlighted ? 1.3 : hovered ? 1.15 : 1,
    emissiveIntensity: (isHighlighted || hovered) ? 0.4 : 0,
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
      <mesh>
        <sphereGeometry args={[0.2, 8, 8]} />
        <animated.meshStandardMaterial 
          color={(isHighlighted || hovered) ? "#4a4a4a" : "#1a1a1a"}
          emissive={(isHighlighted || hovered) ? "#ff00ff" : "#000000"}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      
      <mesh position={[-0.3, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.4, 0.02, 0.6]} />
        <animated.meshStandardMaterial 
          color={(isHighlighted || hovered) ? "#4a4a4a" : "#1a1a1a"}
          emissive={(isHighlighted || hovered) ? "#ff00ff" : "#000000"}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      <mesh position={[0.3, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.4, 0.02, 0.6]} />
        <animated.meshStandardMaterial 
          color={(isHighlighted || hovered) ? "#4a4a4a" : "#1a1a1a"}
          emissive={(isHighlighted || hovered) ? "#ff00ff" : "#000000"}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
    </animated.group>
  );
};

// Treasure Chest Component
const TreasureChest = ({ position, onClick, isHighlighted }) => {
  const [hovered, setHovered] = useState(false);
  
  const { scale, emissiveIntensity } = useSpring({
    scale: isHighlighted ? 1.2 : hovered ? 1.1 : 1,
    emissiveIntensity: (isHighlighted || hovered) ? 0.6 : 0,
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
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1, 0.6, 0.7]} />
        <animated.meshStandardMaterial 
          color={(isHighlighted || hovered) ? "#8b6f47" : "#654321"}
          emissive={(isHighlighted || hovered) ? "#ffd700" : "#000000"}
          emissiveIntensity={emissiveIntensity}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
      
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[1, 0.2, 0.7]} />
        <animated.meshStandardMaterial 
          color={(isHighlighted || hovered) ? "#8b6f47" : "#654321"}
          emissive={(isHighlighted || hovered) ? "#ffd700" : "#000000"}
          emissiveIntensity={emissiveIntensity}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
      
      <mesh position={[0, 0.3, 0.36]}>
        <boxGeometry args={[0.2, 0.3, 0.05]} />
        <animated.meshStandardMaterial 
          color="#ffd700"
          emissive={(isHighlighted || hovered) ? "#ffd700" : "#000000"}
          emissiveIntensity={emissiveIntensity}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
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
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const { scale, emissiveIntensity } = useSpring({
    scale: isHighlighted ? 1.3 : hovered ? 1.15 : 1,
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
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 32]} />
        <animated.meshStandardMaterial 
          color={(isHighlighted || hovered) ? "#4dd0e1" : "#1a5f7a"}
          emissive={(isHighlighted || hovered) ? "#00ffff" : "#000000"}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={0.6}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      {(isHighlighted || hovered) && (
        <pointLight position={[0, 0.5, 0]} intensity={1} color="#00ffff" distance={4} />
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

// Cave Entrance Arch
// // Cave Entrance Arch
// const CaveEntrance = () => {
//   return (
//     <group position={[0, 0, -5]}>
//       {/* Left wall - irregular shape */}
//       <mesh position={[-7, 2.5, 0]} rotation={[0, 0, -0.1]}>
//         <boxGeometry args={[3, 7, 12]} />
//         <meshStandardMaterial color="#1a1a1a" roughness={0.95} />
//       </mesh>
      
//       {/* Left wall additional rock formations */}
//       <mesh position={[-8.5, 1, -2]} rotation={[0.2, 0.3, -0.2]}>
//         <boxGeometry args={[2, 4, 3]} />
//         <meshStandardMaterial color="#252525" roughness={0.9} />
//       </mesh>
      
//       <mesh position={[-6.5, 5, 3]} rotation={[-0.1, -0.2, 0.1]}>
//         <boxGeometry args={[1.5, 2, 4]} />
//         <meshStandardMaterial color="#252525" roughness={0.9} />
//       </mesh>

//       {/* Right wall - irregular shape */}
//       <mesh position={[7, 2.5, 0]} rotation={[0, 0, 0.1]}>
//         <boxGeometry args={[3, 7, 12]} />
//         <meshStandardMaterial color="#1a1a1a" roughness={0.95} />
//       </mesh>
      
//       {/* Right wall additional rock formations */}
//       <mesh position={[8.5, 1.5, -1]} rotation={[0.1, -0.3, 0.15]}>
//         <boxGeometry args={[2, 3.5, 4]} />
//         <meshStandardMaterial color="#252525" roughness={0.9} />
//       </mesh>
      
//       <mesh position={[6, 6, 2]} rotation={[-0.15, 0.1, -0.1]}>
//         <boxGeometry args={[2, 1.5, 5]} />
//         <meshStandardMaterial color="#252525" roughness={0.9} />
//       </mesh>

//       {/* Top arch - more natural, rocky appearance */}
//       <mesh position={[-4.5, 6.2, 0]} rotation={[0, 0, -0.4]}>
//         <boxGeometry args={[3.5, 1.2, 11]} />
//         <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
//       </mesh>
      
//       <mesh position={[4.5, 6.2, 0]} rotation={[0, 0, 0.4]}>
//         <boxGeometry args={[3.5, 1.2, 11]} />
//         <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
//       </mesh>
      
//       <mesh position={[0, 7.8, 0]} rotation={[0.1, 0, 0]}>
//         <boxGeometry args={[3.2, 0.8, 10.5]} />
//         <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
//       </mesh>

//       {/* Additional ceiling rocks */}
//       <mesh position={[-2, 7, 2]} rotation={[0.2, 0.1, -0.3]}>
//         <boxGeometry args={[2, 0.6, 3]} />
//         <meshStandardMaterial color="#252525" roughness={0.9} />
//       </mesh>
      
//       <mesh position={[1.5, 6.8, -3]} rotation={[0.15, -0.1, 0.2]}>
//         <boxGeometry args={[2.5, 0.7, 4]} />
//         <meshStandardMaterial color="#252525" roughness={0.9} />
//       </mesh>

//       {/* Back wall - irregular, rocky surface */}
//       <mesh position={[0, 3, -6]}>
//         <boxGeometry args={[16, 9, 1.5]} />
//         <meshStandardMaterial color="#1a1a1a" roughness={0.95} />
//       </mesh>
      
//       {/* Back wall rock formations */}
//       <mesh position={[-5, 5, -5.5]} rotation={[0.1, 0.2, -0.1]}>
//         <boxGeometry args={[2, 2, 1]} />
//         <meshStandardMaterial color="#252525" roughness={0.9} />
//       </mesh>
      
//       <mesh position={[4, 2, -5.5]} rotation={[-0.1, -0.15, 0.1]}>
//         <boxGeometry args={[3, 1.5, 1]} />
//         <meshStandardMaterial color="#252525" roughness={0.9} />
//       </mesh>
      
//       <mesh position={[0, 6.5, -5.5]} rotation={[0.05, 0, 0.05]}>
//         <boxGeometry args={[4, 1, 1]} />
//         <meshStandardMaterial color="#252525" roughness={0.9} />
//       </mesh>
      
//       <mesh position={[-2, 1, -5.5]} rotation={[-0.1, 0.1, -0.05]}>
//         <boxGeometry args={[2.5, 1.2, 1]} />
//         <meshStandardMaterial color="#252525" roughness={0.9} />
//       </mesh>

//       {/* Floor - rough, uneven surface */}
//       <mesh position={[0, -1.5, 0]} rotation={[-0.1, 0, 0]}>
//         <boxGeometry args={[14, 1, 12]} />
//         <meshStandardMaterial color="#2a2a2a" roughness={0.95} />
//       </mesh>
      
//       {/* Floor rocks */}
//       <mesh position={[-3, -1, 2]} rotation={[0.2, -0.1, 0.1]}>
//         <boxGeometry args={[1.5, 0.6, 2]} />
//         <meshStandardMaterial color="#333333" roughness={0.9} />
//       </mesh>
      
//       <mesh position={[4, -1.2, -1]} rotation={[-0.1, 0.2, -0.15]}>
//         <boxGeometry args={[2, 0.8, 1.5]} />
//         <meshStandardMaterial color="#333333" roughness={0.9} />
//       </mesh>
//     </group>
//   );
// };
// Cave Entrance Arch
const CaveEntrance = () => {
  return (
    <group position={[0, 0, -5]}>
      {/* Left wall - irregular shape */}
      <mesh position={[-7, 2.5, 0]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[3, 7, 12]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.95} />
      </mesh>
      
      {/* Left wall additional rock formations */}
      <mesh position={[-8.5, 1, -2]} rotation={[0.2, 0.3, -0.2]}>
        <boxGeometry args={[2, 4, 3]} />
        <meshStandardMaterial color="#252525" roughness={0.9} />
      </mesh>
      
      <mesh position={[-6.5, 5, 3]} rotation={[-0.1, -0.2, 0.1]}>
        <boxGeometry args={[1.5, 2, 4]} />
        <meshStandardMaterial color="#252525" roughness={0.9} />
      </mesh>

      {/* Right wall - irregular shape */}
      <mesh position={[7, 2.5, 0]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[3, 7, 12]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.95} />
      </mesh>
      
      {/* Right wall additional rock formations */}
      <mesh position={[8.5, 1.5, -1]} rotation={[0.1, -0.3, 0.15]}>
        <boxGeometry args={[2, 3.5, 4]} />
        <meshStandardMaterial color="#252525" roughness={0.9} />
      </mesh>
      
      <mesh position={[6, 6, 2]} rotation={[-0.15, 0.1, -0.1]}>
        <boxGeometry args={[2, 1.5, 5]} />
        <meshStandardMaterial color="#252525" roughness={0.9} />
      </mesh>

      {/* Top arch - more natural, rocky appearance */}
      <mesh position={[-4.5, 6.2, 0]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[3.5, 1.2, 11]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
      
      <mesh position={[4.5, 6.2, 0]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[3.5, 1.2, 11]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
      
      <mesh position={[0, 7.8, 0]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[3.2, 0.8, 10.5]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      {/* Additional ceiling rocks */}
      <mesh position={[-2, 7, 2]} rotation={[0.2, 0.1, -0.3]}>
        <boxGeometry args={[2, 0.6, 3]} />
        <meshStandardMaterial color="#252525" roughness={0.9} />
      </mesh>
      
      <mesh position={[1.5, 6.8, -3]} rotation={[0.15, -0.1, 0.2]}>
        <boxGeometry args={[2.5, 0.7, 4]} />
        <meshStandardMaterial color="#252525" roughness={0.9} />
      </mesh>

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

      {/* Floor - rough, uneven surface */}
      <mesh position={[0, -1.5, 0]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[14, 1, 12]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.95} />
      </mesh>
      
      {/* Floor rocks */}
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
  const { name, about, experience, education, skills } = useCvData() || {};
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
      content: name || "Explorer of digital caves..."
    },
    {
      id: 'experience-bat',
      component: Bat,
      position: [2, 5, -6],
      type: 'bat',
      title: 'Experience',
      content: experience ? (
        <div>
          {experience.slice(0, 2).map((exp, i) => (
            <div key={i} className="mb-3">
              <div className="font-semibold text-orange-300">{exp.title}</div>
              <div className="text-gray-300">{exp.company}</div>
              <div className="text-sm text-gray-400">{exp.startDate} - {exp.endDate}</div>
            </div>
          ))}
        </div>
      ) : "My professional journey through the caves of tech..."
    },
    {
      id: 'skills-chest',
      component: TreasureChest,
      position: [5, -0.4, -2.5],
      type: 'chest',
      title: 'Skills',
      content: skills ? (
        <div className="grid grid-cols-2 gap-2">
          {skills.map((skill, i) => (
            <div key={i} className="bg-orange-500/20 border border-orange-400/30 px-2 py-1 rounded text-center">
              <span className="text-orange-300 text-sm">{skill}</span>
            </div>
          ))}
        </div>
      ) : "Treasures of knowledge and expertise..."
    },
    {
      id: 'education-crystal',
      component: Crystal,
      position: [-2, 0, -5],
      type: 'crystal',
      title: 'Education',
      content: education ? (
        <div>
          {education.slice(0, 2).map((edu, i) => (
            <div key={i} className="mb-3">
              <div className="font-semibold text-cyan-300">{edu.degree}</div>
              <div className="text-gray-300">{edu.institution}</div>
              <div className="text-sm text-gray-400">{edu.endDate}</div>
            </div>
          ))}
        </div>
      ) : "Crystallized knowledge foundation..."
    },
    {
      id: 'about-puddle',
      component: WaterPuddle,
      position: [0, -0.45, -4],
      type: 'puddle',
      title: 'About Me',
      content: about || "Reflecting on my journey through technology and innovation..."
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

      {/* Cave ceiling */}
      {/* <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 8, -40]}>
        <planeGeometry args={[40, 30]} />
        <meshStandardMaterial color="#0d0d0d" roughness={1} />
      </mesh> */}

      {/* Cave Entrance Structure */}
      <CaveEntrance />

      {/* Pine Trees at entrance (forest area) */}
      <PineTree position={[-8, -0.4, 8]} scale={1.2} />
      <PineTree position={[8, -0.4, 7]} scale={1.1} />
      <PineTree position={[-6, -0.4, 10]} scale={1.0} />
      <PineTree position={[6, -0.4, 9]} scale={1.3} />
      <PineTree position={[-10, -0.4, 6]} scale={0.9} />
      <PineTree position={[10, -0.4, 5]} scale={1.1} />
      <PineTree position={[-4, -0.4, 12]} scale={1.2} />
      <PineTree position={[4, -0.4, 11]} scale={1.0} />
      <PineTree position={[0, -0.4, 13]} scale={1.4} />
      <PineTree position={[-12, -0.4, 8]} scale={1.1} />
      <PineTree position={[12, -0.4, 7]} scale={1.0} />

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
      <Crystal position={[3, 6, -5]} hanging={true} />
      <Crystal position={[-3, 6, -7]} hanging={true} />
      <Crystal position={[1, 6.8, -9]} hanging={true} />
      <Crystal position={[-1, 6, -4]} hanging={true} />

      {/* Ground stalagmites (inside cave) */}
      <Stalagmite position={[4, 0, -6]} scale={0.9} />
      <Stalagmite position={[-4, 0, -5]} scale={1.1} />
      <Stalagmite position={[2, 0, -8]} scale={0.8} />
      <Stalagmite position={[-3, 0, -9]} scale={1.0} />
      <Stalagmite position={[5, 0, -10]} scale={1.2} />
      <Stalagmite position={[-5, 0, -11]} scale={0.9} />
      <Stalagmite position={[1, 0, -12]} scale={1.1} />

      {/* Rocks inside cave */}
      <Rock position={[6, 0.3, -4]} scale={1.3} />
      <Rock position={[-6, 0.2, -6]} scale={1.2} />
      <Rock position={[4, 0.25, -9]} scale={1.4} />
      <Rock position={[-4, 0.3, -10]} scale={1.1} />
      <Rock position={[7, 0.2, -7]} scale={1.5} />
      <Rock position={[-7, 0.25, -8]} scale={1.3} />
      <Rock position={[3, 0.2, -11]} scale={1.0} />
      <Rock position={[-3, 0.3, -12]} scale={1.2} />

      {/* Rocks at cave entrance/transition */}
      <Rock position={[-7, 0.3, 2]} scale={1.6} />
      <Rock position={[7, 0.3, 2]} scale={1.5} />
      <Rock position={[-8, 0.4, 0]} scale={1.8} />
      <Rock position={[8, 0.4, 0]} scale={1.7} />

      {/* Rocks in forest area */}
      <Rock position={[-5, 0.2, 7]} scale={0.8} />
      <Rock position={[5, 0.2, 6]} scale={0.9} />
      <Rock position={[-3, 0.2, 9]} scale={0.7} />
      <Rock position={[3, 0.2, 8]} scale={0.8} />

      {/* Lighting - Bright at entrance, dim inside */}
      <ambientLight intensity={0.1} />
      
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
  const { name } = useCvData() || {};
  const [selectedObject, setSelectedObject] = useState(null);

  const getSelectedObjectData = () => {
    if (!selectedObject) return null;
  
    const objectsData = {
      'name-cart': {
        title: 'Who Am I?',
        content: name || "Explorer of digital caves..."
      },
      'experience-bat': {
        title: 'Experience',
        content: "My professional journey through the caves of tech..."
      },
      'skills-chest': {
        title: 'Skills',
        content: "Treasures of knowledge and expertise..."
      },
      'education-crystal': {
        title: 'Education',
        content: "Crystallized knowledge foundation..."
      },
      'about-puddle': {
        title: 'About Me',
        content: "Reflecting on my journey through technology and innovation..."
      }
    };

    return objectsData[selectedObject];
  };

  const selectedObjectData = getSelectedObjectData();

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black overflow-hidden">
      {/* Instructions */}
      <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-sm border border-orange-400/30 rounded-lg p-4 max-w-sm shadow-lg">
        <h3 className="text-orange-400 font-bold mb-2 text-lg">🌲 Welcome to {name}'s Cave Entrance</h3>
        <p className="text-white text-sm mb-3">
          Explore the mystical cave hidden in the forest. Click on glowing objects inside the cave to discover treasures!
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