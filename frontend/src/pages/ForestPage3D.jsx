// import React, { Suspense, useState, useRef } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { OrbitControls, Environment, Text, Html } from "@react-three/drei";
// import { useSpring, animated } from '@react-spring/three';
// import useCvData from "../hooks/useCVData";

// // Pine Tree Component
// const PineTreePlaceholder = ({ position, onClick, isHighlighted, isInteractive = true }) => {
//   const meshRef = useRef();
//   const [hovered, setHovered] = useState(false);
  
//   useFrame((state) => {
//     if (meshRef.current && (isHighlighted || hovered)) {
//       meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
//     }
//   });

//   const { scale, emissiveIntensity } = useSpring({
//     scale: isHighlighted ? 1.2 : hovered ? 1.05 : 1,
//     emissiveIntensity: (isHighlighted || hovered) ? 0.3 : 0,
//     config: { tension: 300, friction: 10 }
//   });

//   const handlePointerOver = () => {
//     if (isInteractive) {
//       setHovered(true);
//       document.body.style.cursor = 'pointer';
//     }
//   };

//   const handlePointerOut = () => {
//     if (isInteractive) {
//       setHovered(false);
//       document.body.style.cursor = 'auto';
//     }
//   };

//   return (
//     <animated.group
//       ref={meshRef}
//       position={position}
//       onClick={isInteractive ? onClick : undefined}
//       scale={scale}
//       onPointerOver={handlePointerOver}
//       onPointerOut={handlePointerOut}
//     >
//       {/* Trunk */}
//       <mesh position={[0, 1, 0]}>
//         <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
//         <animated.meshLambertMaterial 
//           color={isHighlighted || hovered ? "#a0522d" : "#8b5a3c"}
//           emissive={isHighlighted || hovered ? "#ff6600" : "#000000"}
//           emissiveIntensity={emissiveIntensity}
//         />
//       </mesh>
      
//       {/* Pine layers - bottom to top, getting smaller */}
//       <mesh position={[0, 2.5, 0]}>
//         <coneGeometry args={[1.8, 2, 8]} />
//         <animated.meshLambertMaterial 
//           color={isHighlighted || hovered ? "#32cd32" : "#228b22"}
//           emissive={isHighlighted || hovered ? "#00ff00" : "#000000"}
//           emissiveIntensity={emissiveIntensity}
//         />
//       </mesh>
      
//       <mesh position={[0, 3.5, 0]}>
//         <coneGeometry args={[1.5, 2, 8]} />
//         <animated.meshLambertMaterial 
//           color={isHighlighted || hovered ? "#32cd32" : "#228b22"}
//           emissive={isHighlighted || hovered ? "#00ff00" : "#000000"}
//           emissiveIntensity={emissiveIntensity}
//         />
//       </mesh>
      
//       <mesh position={[0, 4.5, 0]}>
//         <coneGeometry args={[1.2, 2, 8]} />
//         <animated.meshLambertMaterial 
//           color={isHighlighted || hovered ? "#32cd32" : "#228b22"}
//           emissive={isHighlighted || hovered ? "#00ff00" : "#000000"}
//           emissiveIntensity={emissiveIntensity}
//         />
//       </mesh>
      
//       <mesh position={[0, 5.5, 0]}>
//         <coneGeometry args={[0.8, 1.5, 8]} />
//         <animated.meshLambertMaterial 
//           color={isHighlighted || hovered ? "#32cd32" : "#228b22"}
//           emissive={isHighlighted || hovered ? "#00ff00" : "#000000"}
//           emissiveIntensity={emissiveIntensity}
//         />
//       </mesh>
//     </animated.group>
//   );
// };

// const FireplacePlaceholder = ({ position, onClick, isHighlighted }) => {
//   const flameRef = useRef();
//   const [hovered, setHovered] = useState(false);
  
//   useFrame((state) => {
//     if (flameRef.current) {
//       flameRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
//       flameRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;
//     }
//   });

//   const { scale, emissiveIntensity } = useSpring({
//     scale: isHighlighted ? 1.1 : hovered ? 1.05 : 1,
//     emissiveIntensity: (isHighlighted || hovered) ? 0.4 : 0.1,
//     config: { tension: 300, friction: 10 }
//   });

//   return (
//     <animated.group 
//       position={position} 
//       onClick={onClick}
//       scale={scale}
//       onPointerOver={() => {
//         setHovered(true);
//         document.body.style.cursor = 'pointer';
//       }}
//       onPointerOut={() => {
//         setHovered(false);
//         document.body.style.cursor = 'auto';
//       }}
//     >
//       {/* Fire pit base */}
//       <mesh position={[0, 0, 0]}>
//         <cylinderGeometry args={[1, 1, 0.3, 8]} />
//         <animated.meshLambertMaterial 
//           color="#444"
//           emissive={isHighlighted || hovered ? "#ff6600" : "#000000"}
//           emissiveIntensity={emissiveIntensity}
//         />
//       </mesh>
//       {/* Logs */}
//       <mesh position={[0.5, 0.2, 0]} rotation={[0, 0, Math.PI / 6]}>
//         <cylinderGeometry args={[0.1, 0.15, 1.5, 8]} />
//         <animated.meshLambertMaterial 
//           color="#8b5a3c"
//           emissive={isHighlighted || hovered ? "#ff6600" : "#000000"}
//           emissiveIntensity={emissiveIntensity}
//         />
//       </mesh>
//       <mesh position={[-0.5, 0.2, 0]} rotation={[0, 0, -Math.PI / 6]}>
//         <cylinderGeometry args={[0.1, 0.15, 1.5, 8]} />
//         <animated.meshLambertMaterial 
//           color="#8b5a3c"
//           emissive={isHighlighted || hovered ? "#ff6600" : "#000000"}
//           emissiveIntensity={emissiveIntensity}
//         />
//       </mesh>
//       {/* Flame */}
//       <mesh ref={flameRef} position={[0, 1, 0]}>
//         <coneGeometry args={[0.3, 1, 4]} />
//         <animated.meshLambertMaterial 
//           color={isHighlighted || hovered ? "#ff6b35" : "#ff4500"}
//           emissive="#ff4500"
//           emissiveIntensity={emissiveIntensity}
//         />
//       </mesh>
//     </animated.group>
//   );
// };

// const LogPlaceholder = ({ position, onClick, isHighlighted, rotation = [0, 0, 0] }) => {
//   const [hovered, setHovered] = useState(false);
  
//   const { scale, emissiveIntensity } = useSpring({
//     scale: isHighlighted ? 1.1 : hovered ? 1.05 : 1,
//     emissiveIntensity: (isHighlighted || hovered) ? 0.3 : 0,
//     config: { tension: 300, friction: 10 }
//   });

//   return (
//     <animated.mesh
//       position={position}
//       rotation={rotation}
//       onClick={onClick}
//       scale={scale}
//       onPointerOver={() => {
//         setHovered(true);
//         document.body.style.cursor = 'pointer';
//       }}
//       onPointerOut={() => {
//         setHovered(false);
//         document.body.style.cursor = 'auto';
//       }}
//     >
//       <cylinderGeometry args={[0.2, 0.25, 2, 8]} />
//       <animated.meshLambertMaterial 
//         color={isHighlighted || hovered ? "#a0522d" : "#8b5a3c"}
//         emissive={isHighlighted || hovered ? "#ff6600" : "#000000"}
//         emissiveIntensity={emissiveIntensity}
//       />
//     </animated.mesh>
//   );
// };

// const AnimalPlaceholder = ({ position, onClick, isHighlighted, type = "deer" }) => {
//   const meshRef = useRef();
//   const [hovered, setHovered] = useState(false);
  
//   useFrame((state) => {
//     if (meshRef.current) {
//       meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
//     }
//   });

//   const { scale, emissiveIntensity } = useSpring({
//     scale: isHighlighted ? 1.2 : hovered ? 1.1 : 1,
//     emissiveIntensity: (isHighlighted || hovered) ? 0.2 : 0,
//     config: { tension: 300, friction: 10 }
//   });

//   return (
//     <animated.group
//       ref={meshRef}
//       position={position}
//       onClick={onClick}
//       scale={scale}
//       onPointerOver={() => {
//         setHovered(true);
//         document.body.style.cursor = 'pointer';
//       }}
//       onPointerOut={() => {
//         setHovered(false);
//         document.body.style.cursor = 'auto';
//       }}
//     >
//       {/* Body */}
//       <mesh position={[0, 0, 0]}>
//         <boxGeometry args={[1, 0.6, 0.4]} />
//         <animated.meshLambertMaterial 
//           color={isHighlighted || hovered ? "#d2691e" : "#8b4513"}
//           emissive={isHighlighted || hovered ? "#ff6600" : "#000000"}
//           emissiveIntensity={emissiveIntensity}
//         />
//       </mesh>
//       {/* Head */}
//       <mesh position={[0.7, 0.3, 0]}>
//         <boxGeometry args={[0.4, 0.4, 0.3]} />
//         <animated.meshLambertMaterial 
//           color={isHighlighted || hovered ? "#d2691e" : "#8b4513"}
//           emissive={isHighlighted || hovered ? "#ff6600" : "#000000"}
//           emissiveIntensity={emissiveIntensity}
//         />
//       </mesh>
//       {/* Legs */}
//       {[[-0.3, -0.5, -0.1], [-0.3, -0.5, 0.1], [0.3, -0.5, -0.1], [0.3, -0.5, 0.1]].map((pos, i) => (
//         <mesh key={i} position={pos}>
//           <cylinderGeometry args={[0.05, 0.08, 0.5]} />
//           <animated.meshLambertMaterial 
//             color={isHighlighted || hovered ? "#d2691e" : "#8b4513"}
//             emissive={isHighlighted || hovered ? "#ff6600" : "#000000"}
//             emissiveIntensity={emissiveIntensity}
//           />
//         </mesh>
//       ))}
//       {/* Antlers for deer */}
//       {type === "deer" && (
//         <>
//           <mesh position={[0.8, 0.6, -0.1]}>
//             <cylinderGeometry args={[0.02, 0.02, 0.6]} />
//             <animated.meshLambertMaterial 
//               color="#f5deb3"
//               emissive={isHighlighted || hovered ? "#ffff88" : "#000000"}
//               emissiveIntensity={emissiveIntensity}
//             />
//           </mesh>
//           <mesh position={[0.8, 0.6, 0.1]}>
//             <cylinderGeometry args={[0.02, 0.02, 0.6]} />
//             <animated.meshLambertMaterial 
//               color="#f5deb3"
//               emissive={isHighlighted || hovered ? "#ffff88" : "#000000"}
//               emissiveIntensity={emissiveIntensity}
//             />
//           </mesh>
//         </>
//       )}
//     </animated.group>
//   );
// };

// const RockPlaceholder = ({ position, onClick, isHighlighted }) => {
//   const [hovered, setHovered] = useState(false);
  
//   const { scale, emissiveIntensity } = useSpring({
//     scale: isHighlighted ? 1.1 : hovered ? 1.05 : 1,
//     emissiveIntensity: (isHighlighted || hovered) ? 0.2 : 0,
//     config: { tension: 300, friction: 10 }
//   });

//   return (
//     <animated.mesh
//       position={position}
//       onClick={onClick}
//       scale={scale}
//       onPointerOver={() => {
//         setHovered(true);
//         document.body.style.cursor = 'pointer';
//       }}
//       onPointerOut={() => {
//         setHovered(false);
//         document.body.style.cursor = 'auto';
//       }}
//     >
//       <sphereGeometry args={[0.5, 8, 6]} />
//       <animated.meshLambertMaterial 
//         color={isHighlighted || hovered ? "#a9a9a9" : "#696969"}
//         emissive={isHighlighted || hovered ? "#4444ff" : "#000000"}
//         emissiveIntensity={emissiveIntensity}
//       />
//     </animated.mesh>
//   );
// };

// const InfoPanel = ({ title, content, onClose, position }) => {
//   return (
//     <Html position={position} center>
//       <div className="bg-[#0e0e2c]/95 backdrop-blur-sm border border-green-400/30 rounded-lg p-6 max-w-md text-white shadow-2xl animate-pulse">
//         <div className="flex justify-between items-start mb-4">
//           <h3 className="text-green-400 text-xl font-bold">{title}</h3>
//           <button 
//             onClick={onClose}
//             className="text-gray-400 hover:text-white text-xl hover:bg-red-500/20 rounded px-2"
//           >
//             ×
//           </button>
//         </div>
//         <div className="text-sm leading-relaxed">
//           {content}
//         </div>
//       </div>
//     </Html>
//   );
// };


// // ---------------------------------------------------------------------------

// const Scene = () => {
//   const [selectedObject, setSelectedObject] = useState(null);
//   const { name, about, experience, education, skills } = useCvData() || {};

//   const interactiveObjects = [
//     {
//       id: 'about-tree',
//       component: PineTreePlaceholder,
//       position: [-6, 0, 2],
//       title: 'About Me',
//       content: about || "I'm a passionate developer who loves creating immersive digital experiences."
//     },
//     {
//       id: 'experience-fireplace',
//       component: FireplacePlaceholder,
//       position: [0, 0, 0],
//       title: 'Experience',
//       content: experience ? (
//         <div>
//           {experience.slice(0, 2).map((exp, i) => (
//             <div key={i} className="mb-3">
//               <div className="font-semibold text-green-300">{exp.title}</div>
//               <div className="text-gray-300">{exp.company}</div>
//               <div className="text-sm text-gray-400">{exp.startDate} - {exp.endDate}</div>
//             </div>
//           ))}
//         </div>
//       ) : "Click to explore my professional journey and the projects that fuel my passion."
//     },
//     {
//       id: 'skills-log1',
//       component: LogPlaceholder,
//       position: [2, 0.2, 1],
//       rotation: [0, Math.PI / 4, 0],
//       title: 'Technical Skills',
//       content: skills ? (
//         <div>
//           <div className="grid grid-cols-2 gap-2">
//             {skills.slice(0, 6).map((skill, i) => (
//               <div key={i} className="bg-green-400/20 px-2 py-1 rounded text-xs">
//                 {skill}
//               </div>
//             ))}
//           </div>
//         </div>
//       ) : "My technical toolkit spans multiple domains and continues to grow with each project."
//     },
//     {
//       id: 'education-rock',
//       component: RockPlaceholder,
//       position: [-2, 0.5, -1],
//       title: 'Education',
//       content: education ? (
//         <div>
//           {education.slice(0, 2).map((edu, i) => (
//             <div key={i} className="mb-3">
//               <div className="font-semibold text-green-300">{edu.degree}</div>
//               <div className="text-gray-300">{edu.institution}</div>
//               <div className="text-sm text-gray-400">{edu.endDate}</div>
//             </div>
//           ))}
//         </div>
//       ) : "The foundation of knowledge that shapes my approach to problem-solving."
//     },
//     {
//       id: 'projects-deer',
//       component: AnimalPlaceholder,
//       position: [3, 1, -2],
//       title: 'Projects & Achievements',
//       content: "Discover the creative projects and meaningful achievements that define my journey."
//     },
//     {
//       id: 'contact-log2',
//       component: LogPlaceholder,
//       position: [-1, 0.1, 3],
//       rotation: [0, -Math.PI / 3, Math.PI / 12],
//       title: 'Get In Touch',
//       content: "Ready to collaborate? Let's connect and create something amazing together."
//     }
//   ];

//   const handleObjectClick = (objectId) => {
//     setSelectedObject(selectedObject === objectId ? null : objectId);
//   };

//   const selectedObjectData = selectedObject ? 
//     interactiveObjects.find(obj => obj.id === selectedObject) : null;

//   return (
//     <>
//       {/* Ground */}
//       <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
//         <planeGeometry args={[200, 200]} />
//         <meshLambertMaterial color="#2d5016" />
//       </mesh>

//       {/* Interactive Objects */}
//       {interactiveObjects.map((obj) => {
//         const Component = obj.component;
//         return (
//           <Component
//             key={obj.id}
//             position={obj.position}
//             rotation={obj.rotation}
//             onClick={() => handleObjectClick(obj.id)}
//             isHighlighted={selectedObject === obj.id}
//             type={obj.type}
//           />
//         );
//       })}

//       {/* Ambient forest elements - Pine trees */}
//       <PineTreePlaceholder position={[5, 0, 3]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
//       <PineTreePlaceholder position={[-5, 0, -3]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
//       <PineTreePlaceholder position={[4, 0, -4]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
//       <PineTreePlaceholder position={[-3, 0, -4]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
//       <PineTreePlaceholder position={[6, 0, 0]} onClick={() => {}} isHighlighted={false} isInteractive={false} />

//       <PineTreePlaceholder position={[6, 0, -10]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
//        <PineTreePlaceholder position={[4, 0, -16]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
//        <PineTreePlaceholder position={[10, 0, -6]} onClick={() => {}} isHighlighted={false} isInteractive={false} />

//         <PineTreePlaceholder position={[15, 0, -8]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
//          <PineTreePlaceholder position={[9, 0, -20]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
//           <PineTreePlaceholder position={[20, 0, -7]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
//            <PineTreePlaceholder position={[15, 0, 8]} onClick={() => {}} isHighlighted={false} isInteractive={false} />


//            <PineTreePlaceholder position={[-6, 0, 8]} onClick={() => {}} isHighlighted={false} isInteractive={false} />
           
//            <PineTreePlaceholder position={[-8, 0, 12]} onClick={() => {}} isHighlighted={false} isInteractive={false} />


//       <RockPlaceholder position={[1, 0.5, 4]} onClick={() => {}} isHighlighted={false} />
//       <RockPlaceholder position={[-4, 0.5, 2]} onClick={() => {}} isHighlighted={false} />

//       {/* Info Panel */}
//       {selectedObjectData && (
//         <InfoPanel
//           title={selectedObjectData.title}
//           content={selectedObjectData.content}
//           onClose={() => setSelectedObject(null)}
//           position={[selectedObjectData.position[0], selectedObjectData.position[1] + 4, selectedObjectData.position[2]]}
//         />
//       )}

//       {/* Enhanced Lighting */}
//       <ambientLight intensity={0.3} />
//       <directionalLight 
//         position={[10, 10, 5]} 
//         intensity={0.8} 
//         castShadow
//         shadow-mapSize-width={2048}
//         shadow-mapSize-height={2048}
//       />
//       <pointLight position={[0, 2, 0]} intensity={1} color="#ff6b35" />
//       <pointLight position={[5, 3, 5]} intensity={0.3} color="#00ff88" />
//       <pointLight position={[-5, 3, -5]} intensity={0.3} color="#0088ff" />
//     </>
//   );
// };

// const ForestPage3D = () => {
//   const { name } = useCvData() || {};

//   return (
//     <div className="relative w-full h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0e0e2c] to-[#1a1a2e] overflow-hidden">
//       {/* Instructions */}
//       <div className="absolute top-4 left-4 z-10 bg-[#0e0e2c]/80 backdrop-blur-sm border border-green-400/30 rounded-lg p-4 max-w-sm shadow-lg">
//         <h3 className="text-green-400 font-bold mb-2 text-lg">🌲 Welcome to {name}'s Enchanted Forest</h3>
//         <p className="text-white text-sm">
//           Click on glowing objects to explore my portfolio. Hover to see them come alive with magical light! Use your mouse to navigate around the 3D scene.
//         </p>
//       </div>

//       {/* Home button */}
//       <div className="absolute top-4 right-4 z-10">
//         <button 
//           onClick={() => window.location.href = '/'}
//           className="bg-green-400/20 hover:bg-green-400/30 border border-green-400/50 text-green-400 px-4 py-2 rounded-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-400/20"
//         >
//           🏠 Back to Portfolio Portal
//         </button>
//       </div>

//       {/* Magical particles overlay */}
//       <div className="absolute inset-0 pointer-events-none opacity-30">
//         <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-green-400 rounded-full animate-ping"></div>
//         <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
//         <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
//         <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
        
//         <div className="absolute top-1/7 left-1/7 w-1 h-1 bg-green-400 rounded-full animate-ping"></div>
//         <div className="absolute top-1/6 right-1/6 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
//         <div className="absolute bottom-1/7 left-1/7 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
//         <div className="absolute bottom-1/6 right-1/6 w-1 h-1 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
//       </div>

//       <Canvas
//         camera={{
//           position: [8, 6, 8],
//           fov: 60,
//           near: 0.1,
//           far: 1000,
//         }}
//         shadows
//       >
//         <Suspense fallback={null}>
//           <Scene />
//           <Environment preset="forest" />
//           <OrbitControls
//             enablePan={true}
//             minPolarAngle={Math.PI / 6}
//             maxPolarAngle={Math.PI / 2.2}
//             minDistance={5}
//             maxDistance={20}
//             autoRotate={false}
//             enableDamping
//             dampingFactor={0.05}
//           />
//         </Suspense>
//       </Canvas>

//       {/* Loading overlay */}
//       <Suspense fallback={
//         <div className="absolute inset-0 flex items-center justify-center bg-[#0e0e2c] z-20">
//           <div className="text-center">
//             <div className="text-green-400 text-xl mb-4">🌲 Growing your magical forest experience...</div>
//             <div className="animate-spin w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full mx-auto"></div>
//           </div>
//         </div>
//       }>
//         <div />
//       </Suspense>
//     </div>
//   );
// };

// export default ForestPage3D;



import React, { Suspense, useState, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, Text, Html, Stars } from "@react-three/drei";
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import useCvData from "../hooks/useCVData";

// WASD Movement Hook
const useWASDMovement = () => {
  const { camera } = useThree();
  const [keys, setKeys] = useState({
    w: false,
    a: false,
    s: false,
    d: false,
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(key)) {
        setKeys(prev => ({ ...prev, [key]: true }));
        event.preventDefault();
      }
    };

    const handleKeyUp = (event) => {
      const key = event.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(key)) {
        setKeys(prev => ({ ...prev, [key]: false }));
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
    const moveVector = new THREE.Vector3();

    // Get camera's forward and right vectors
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0; // Keep movement horizontal
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    // Calculate movement based on pressed keys
    if (keys.w) moveVector.add(forward);
    if (keys.s) moveVector.sub(forward);
    if (keys.d) moveVector.add(right);
    if (keys.a) moveVector.sub(right);

    // Apply movement
    if (moveVector.length() > 0) {
      moveVector.normalize().multiplyScalar(moveSpeed * delta);
      camera.position.add(moveVector);
    }
  });
};

// Camera Controller Component
const CameraController = () => {
  useWASDMovement();
  return null;
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
          emissive={isHighlighted || hovered ? "#ff6600" : "#000000"}
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
          color={isHighlighted || hovered ? "#ff6b35" : "#ff4500"}
          emissive="#ff4500"
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
    </animated.group>
  );
};

const LogPlaceholder = ({ position, onClick, isHighlighted, rotation = [0, 0, 0] }) => {
  const [hovered, setHovered] = useState(false);
  
  const { scale, emissiveIntensity } = useSpring({
    scale: isHighlighted ? 1.1 : hovered ? 1.05 : 1,
    emissiveIntensity: (isHighlighted || hovered) ? 0.3 : 0,
    config: { tension: 300, friction: 10 }
  });

  return (
    <animated.mesh
      position={position}
      rotation={rotation}
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
      <cylinderGeometry args={[0.2, 0.25, 2, 8]} />
      <animated.meshLambertMaterial 
        color={isHighlighted || hovered ? "#a0522d" : "#8b5a3c"}
        emissive={isHighlighted || hovered ? "#ff6600" : "#000000"}
        emissiveIntensity={emissiveIntensity}
      />
    </animated.mesh>
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

const RockPlaceholder = ({ position, onClick, isHighlighted }) => {
  const [hovered, setHovered] = useState(false);
  
  const { scale, emissiveIntensity } = useSpring({
    scale: isHighlighted ? 1.1 : hovered ? 1.05 : 1,
    emissiveIntensity: (isHighlighted || hovered) ? 0.2 : 0,
    config: { tension: 300, friction: 10 }
  });

  return (
    <animated.mesh
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
      <sphereGeometry args={[0.5, 8, 6]} />
      <animated.meshLambertMaterial 
        color={isHighlighted || hovered ? "#a9a9a9" : "#696969"}
        emissive={isHighlighted || hovered ? "#4444ff" : "#000000"}
        emissiveIntensity={emissiveIntensity}
      />
    </animated.mesh>
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
      position: [-3, 0, 2],
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
        <planeGeometry args={[200, 200]} />
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
      
      {/* Original Rocks */}
      <RockPlaceholder position={[1, 0.5, 4]} onClick={() => {}} isHighlighted={false} />
      <RockPlaceholder position={[-4, 0.5, 2]} onClick={() => {}} isHighlighted={false} />
      
      {/* Additional Rocks - 20 more scattered throughout */}
      <RockPlaceholder position={[6, 0.5, 7]} onClick={() => {}} isHighlighted={false} />
      <RockPlaceholder position={[-7, 0.5, -5]} onClick={() => {}} isHighlighted={false} />
      <RockPlaceholder position={[9, 0.5, -8]} onClick={() => {}} isHighlighted={false} />
      <RockPlaceholder position={[-8, 0.5, 9]} onClick={() => {}} isHighlighted={false} />
      <RockPlaceholder position={[11, 0.5, 4]} onClick={() => {}} isHighlighted={false} />
      <RockPlaceholder position={[-12, 0.5, -7]} onClick={() => {}} isHighlighted={false} />
      <RockPlaceholder position={[13, 0.5, -11]} onClick={() => {}} isHighlighted={false} />
      <RockPlaceholder position={[-14, 0.5, 8]} onClick={() => {}} isHighlighted={false} />
      <RockPlaceholder position={[16, 0.5, 6]} onClick={() => {}} isHighlighted={false} />
      <RockPlaceholder position={[-15, 0.5, -9]} onClick={() => {}} isHighlighted={false} />
      <RockPlaceholder position={[18, 0.5, -4]} onClick={() => {}} isHighlighted={false} />
      <RockPlaceholder position={[-17, 0.5, 3]} onClick={() => {}} isHighlighted={false} />
      <RockPlaceholder position={[12, 0.5, 14]} onClick={() => {}} isHighlighted={false} />
      <RockPlaceholder position={[-13, 0.5, -15]} onClick={() => {}} isHighlighted={false} />
      <RockPlaceholder position={[20, 0.5, 8]} onClick={() => {}} isHighlighted={false} />
      <RockPlaceholder position={[-19, 0.5, -6]} onClick={() => {}} isHighlighted={false} />
      <RockPlaceholder position={[7, 0.5, -13]} onClick={() => {}} isHighlighted={false} />
      <RockPlaceholder position={[-10, 0.5, 12]} onClick={() => {}} isHighlighted={false} />
      <RockPlaceholder position={[3, 0.5, -7]} onClick={() => {}} isHighlighted={false} />
      <RockPlaceholder position={[-5, 0.5, -11]} onClick={() => {}} isHighlighted={false} />
      
      {/* Additional Logs - 20 scattered with random rotations */}
      <LogPlaceholder position={[4, 0.1, 6]} rotation={[0, Math.PI / 3, 0]} onClick={() => {}} isHighlighted={false} />
      <LogPlaceholder position={[-6, 0.1, -4]} rotation={[0, -Math.PI / 4, 0]} onClick={() => {}} isHighlighted={false} />
      <LogPlaceholder position={[8, 0.1, -6]} rotation={[0, Math.PI / 6, 0]} onClick={() => {}} isHighlighted={false} />
      <LogPlaceholder position={[-9, 0.1, 5]} rotation={[0, -Math.PI / 2, 0]} onClick={() => {}} isHighlighted={false} />
      <LogPlaceholder position={[10, 0.1, 9]} rotation={[0, Math.PI / 5, 0]} onClick={() => {}} isHighlighted={false} />
      <LogPlaceholder position={[-11, 0.1, -8]} rotation={[0, -Math.PI / 3, 0]} onClick={() => {}} isHighlighted={false} />
      <LogPlaceholder position={[14, 0.1, 7]} rotation={[0, Math.PI / 7, 0]} onClick={() => {}} isHighlighted={false} />
      <LogPlaceholder position={[-13, 0.1, -10]} rotation={[0, -Math.PI / 6, 0]} onClick={() => {}} isHighlighted={false} />
      <LogPlaceholder position={[15, 0.1, -13]} rotation={[0, Math.PI / 4, 0]} onClick={() => {}} isHighlighted={false} />
      <LogPlaceholder position={[-16, 0.1, 11]} rotation={[0, -Math.PI / 5, 0]} onClick={() => {}} isHighlighted={false} />
      <LogPlaceholder position={[17, 0.1, 4]} rotation={[0, Math.PI / 8, 0]} onClick={() => {}} isHighlighted={false} />
      <LogPlaceholder position={[-18, 0.1, -5]} rotation={[0, -Math.PI / 7, 0]} onClick={() => {}} isHighlighted={false} />
      <LogPlaceholder position={[19, 0.1, -9]} rotation={[0, Math.PI / 3, 0]} onClick={() => {}} isHighlighted={false} />
      <LogPlaceholder position={[-20, 0.1, 7]} rotation={[0, -Math.PI / 4, 0]} onClick={() => {}} isHighlighted={false} />
      <LogPlaceholder position={[11, 0.1, -15]} rotation={[0, Math.PI / 6, 0]} onClick={() => {}} isHighlighted={false} />
      <LogPlaceholder position={[-12, 0.1, 13]} rotation={[0, -Math.PI / 8, 0]} onClick={() => {}} isHighlighted={false} />
      <LogPlaceholder position={[6, 0.1, -11]} rotation={[0, Math.PI / 5, 0]} onClick={() => {}} isHighlighted={false} />
      <LogPlaceholder position={[-7, 0.1, 10]} rotation={[0, -Math.PI / 3, 0]} onClick={() => {}} isHighlighted={false} />
      <LogPlaceholder position={[21, 0.1, 2]} rotation={[0, Math.PI / 7, 0]} onClick={() => {}} isHighlighted={false} />
      <LogPlaceholder position={[-22, 0.1, -3]} rotation={[0, -Math.PI / 6, 0]} onClick={() => {}} isHighlighted={false} />

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
        <h3 className="text-green-400 font-bold mb-2 text-lg">🌲 Welcome to {name}'s Enchanted Forest</h3>
        <p className="text-white text-sm mb-3">
          Click on glowing objects to explore my portfolio. Hover to see them come alive with magical light!
        </p>
        <div className="bg-blue-500/20 rounded p-2 border border-blue-400/30">
          <p className="text-blue-300 text-xs font-semibold mb-1">🎮 Movement Controls:</p>
          <p className="text-blue-200 text-xs">
            <span className="font-mono bg-blue-400/20 px-1 rounded">W A S D</span> keys to move around<br/>
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
          🏠 Back to Portfolio
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
            <div className="text-green-400 text-xl mb-4">🌲 Growing your magical forest experience...</div>
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