
import React, { useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import FloatingCrystal from '../3DModels/FloatingCrystal';

const Hero = ({ cvData, onNavigate }) => {
  const heroRef = useRef();
  
  useFrame((state) => {
    if (heroRef.current) {
      heroRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group position={[0, 0, 0]} ref={heroRef}>
      <Html
        position={[0, 2, 0]}
        transform
        occlude
        style={{
          width: '400px',
          padding: '20px',
          background: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '15px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          textAlign: 'center',
          color: 'white'
        }}
      >
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '10px',
          background: 'linear-gradient(45deg, #ff6b35, #f7931e, #ffd23e)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          {cvData.name}
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#ccc' }}>
          {cvData.description}
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button 
            onClick={() => onNavigate('about')}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              border: 'none',
              borderRadius: '25px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 'bold'
            }}
          >
            About
          </button>
          <button 
            onClick={() => onNavigate('experience')}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(45deg, #f093fb, #f5576c)',
              border: 'none',
              borderRadius: '25px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 'bold'
            }}
          >
            Experience
          </button>
          <button 
            onClick={() => onNavigate('contact')}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(45deg, #4facfe, #00f2fe)',
              border: 'none',
              borderRadius: '25px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 'bold'
            }}
          >
            Contact
          </button>
        </div>
      </Html>
      
      <FloatingCrystal position={[-3, 3, -2]} color="#ff6b35" scale={0.8} />
      <FloatingCrystal position={[3, 3, -2]} color="#4facfe" scale={0.8} />
    </group>
  );
};

export default Hero;