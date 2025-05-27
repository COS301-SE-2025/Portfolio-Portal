import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeJSObject = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(384, 384); // 96 * 4 = 384px to match w-96 h-96
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    mountRef.current.appendChild(renderer.domElement);
    
    // Create a complex geometric object
    const group = new THREE.Group();
    
    // Main icosahedron
    const icosahedronGeometry = new THREE.IcosahedronGeometry(1.2, 1);
    const icosahedronMaterial = new THREE.MeshPhongMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.8,
      shininess: 100,
      specular: 0x3b82f6
    });
    const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
    icosahedron.castShadow = true;
    group.add(icosahedron);
    
    // Wireframe overlay
    const wireframeGeometry = new THREE.IcosahedronGeometry(1.25, 1);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    group.add(wireframe);
    
    // Floating particles around the object
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 100;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 8;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x10b981,
      transparent: true,
      opacity: 0.6
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    group.add(particlesMesh);
    
    // Add small orbiting spheres
    const orbitingSpheres = [];
    for (let i = 0; i < 3; i++) {
      const sphereGeometry = new THREE.SphereGeometry(0.1, 8, 8);
      const sphereMaterial = new THREE.MeshPhongMaterial({
        color: [0x8b5cf6, 0x3b82f6, 0x10b981][i],
        transparent: true,
        opacity: 0.7
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.castShadow = true;
      orbitingSpheres.push(sphere);
      group.add(sphere);
    }
    
    scene.add(group);
    
    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0x8b5cf6, 0.8, 10);
    pointLight.position.set(-3, 3, 3);
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight(0x3b82f6, 0.6, 8);
    pointLight2.position.set(3, -2, -3);
    scene.add(pointLight2);
    
    // Position camera
    camera.position.z = 4;
    
    // Store refs
    sceneRef.current = scene;
    rendererRef.current = renderer;
    
    // Animation loop
    let time = 0;
    const animate = () => {
      time += 0.01;
      
      // Rotate main group
      group.rotation.x = time * 0.3;
      group.rotation.y = time * 0.5;
      group.rotation.z = time * 0.2;
      
      // Animate wireframe separately
      wireframe.rotation.x = -time * 0.4;
      wireframe.rotation.y = -time * 0.3;
      
      // Animate orbiting spheres
      orbitingSpheres.forEach((sphere, index) => {
        const radius = 2.5;
        const speed = 0.5 + index * 0.3;
        const angle = time * speed + (index * Math.PI * 2 / 3);
        
        sphere.position.x = Math.cos(angle) * radius;
        sphere.position.y = Math.sin(angle * 0.7) * radius * 0.5;
        sphere.position.z = Math.sin(angle) * radius;
      });
      
      // Animate particles
      const positions = particlesMesh.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time + positions[i]) * 0.002;
      }
      particlesMesh.geometry.attributes.position.needsUpdate = true;
      particlesMesh.rotation.y = time * 0.1;
      
      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (rendererRef.current && mountRef.current) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of Three.js objects
      scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="w-96 h-96 rounded-3xl overflow-hidden backdrop-blur-sm border border-white/10"
      style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)'
      }}
    />
  );
};

export default ThreeJSObject;