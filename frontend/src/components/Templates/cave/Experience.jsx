
import React from 'react';
import { Html } from '@react-three/drei';
import FloatingCrystal from '../../3DModels/FloatingCrystal';

const Experience = ({ cvData, onBack }) => {
  return (
    <group position={[15, 0, -10]}>
      <Html
        position={[0, 2, 0]}
        transform
        occlude
        style={{
          width: '550px',
          padding: '30px',
          background: 'rgba(40, 20, 20, 0.9)',
          borderRadius: '20px',
          backdropFilter: 'blur(15px)',
          border: '2px solid rgba(245, 87, 108, 0.3)',
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
          marginBottom: '25px',
          color: '#f5576c',
          textAlign: 'center'
        }}>
          Experience
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {cvData.experience.map((job, index) => (
            <div 
              key={index}
              style={{
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '15px',
                border: '1px solid rgba(245, 87, 108, 0.2)'
              }}
            >
              <h3 style={{ 
                color: '#f093fb', 
                marginBottom: '5px',
                fontSize: '1.3rem'
              }}>
                {job.title}
              </h3>
              <p style={{ 
                color: '#ffd23e', 
                marginBottom: '5px',
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}>
                {job.company}
              </p>
              <p style={{ 
                color: '#ccc', 
                marginBottom: '10px',
                fontSize: '0.9rem',
                fontStyle: 'italic'
              }}>
                {job.period}
              </p>
              <p style={{ 
                color: '#e0e0e0',
                lineHeight: '1.5'
              }}>
                {job.description}
              </p>
            </div>
          ))}
        </div>
      </Html>
      
      <FloatingCrystal position={[-6, 3, 1]} color="#f5576c" />
      <FloatingCrystal position={[6, 5, -1]} color="#f093fb" />
    </group>
  );
};

export default Experience;