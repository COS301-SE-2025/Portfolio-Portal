
import React from 'react';
import { Html } from '@react-three/drei';
import FloatingCrystal from '../3DModels/FloatingCrystal';

const About = ({ cvData, onBack }) => {
  return (
    <group position={[-15, 0, -10]}>
      <Html
        position={[0, 2, 0]}
        transform
        occlude
        style={{
          width: '500px',
          padding: '30px',
          background: 'rgba(20, 20, 40, 0.9)',
          borderRadius: '20px',
          backdropFilter: 'blur(15px)',
          border: '2px solid rgba(102, 126, 234, 0.3)',
          color: 'white'
        }}
      >
        <button 
          onClick={onBack}
          style={{
            position: 'absolute',
            top: '10px',
            right: '15px',
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ×
        </button>
        
        <h2 style={{ 
          fontSize: '2rem', 
          marginBottom: '20px',
          color: '#667eea',
          textAlign: 'center'
        }}>
          About Me
        </h2>
        
        <p style={{ 
          fontSize: '1.1rem', 
          lineHeight: '1.6', 
          marginBottom: '20px',
          color: '#e0e0e0'
        }}>
          {cvData.about.intro}
        </p>
        
        <p style={{ 
          fontSize: '1rem', 
          lineHeight: '1.6', 
          marginBottom: '25px',
          color: '#d0d0d0'
        }}>
          {cvData.about.bio}
        </p>
        
        <h3 style={{ color: '#f093fb', marginBottom: '15px' }}>Skills</h3>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '10px',
          marginBottom: '20px'
        }}>
          {cvData.about.skills.map((skill, index) => (
            <span 
              key={index}
              style={{
                padding: '5px 15px',
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                borderRadius: '20px',
                fontSize: '0.9rem',
                color: 'white'
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </Html>
      
      <FloatingCrystal position={[-5, 4, 2]} color="#667eea" />
      <FloatingCrystal position={[5, 1, 3]} color="#764ba2" />
    </group>
  );
};

export default About;