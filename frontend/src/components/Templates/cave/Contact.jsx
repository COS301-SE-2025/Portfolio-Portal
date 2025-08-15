
import React from 'react';
import { Html } from '@react-three/drei';
import FloatingCrystal from '../../3DModels/FloatingCrystal';

const Contact = ({ cvData, onBack }) => {
  return (
    <group position={[0, 0, 15]}>
      <Html
        position={[0, 2, 0]}
        transform
        occlude
        style={{
          width: '450px',
          padding: '30px',
          background: 'rgba(20, 40, 40, 0.9)',
          borderRadius: '20px',
          backdropFilter: 'blur(15px)',
          border: '2px solid rgba(79, 172, 254, 0.3)',
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
          color: '#4facfe',
          textAlign: 'center'
        }}>
          Contact Me
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{
            padding: '15px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            border: '1px solid rgba(79, 172, 254, 0.2)'
          }}>
            <h3 style={{ color: '#00f2fe', marginBottom: '5px' }}>Email</h3>
            <p style={{ color: '#e0e0e0' }}>{cvData.contact.email}</p>
          </div>
          
          <div style={{
            padding: '15px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            border: '1px solid rgba(79, 172, 254, 0.2)'
          }}>
            <h3 style={{ color: '#00f2fe', marginBottom: '5px' }}>Phone</h3>
            <p style={{ color: '#e0e0e0' }}>{cvData.contact.phone}</p>
          </div>
          
          <div style={{
            padding: '15px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            border: '1px solid rgba(79, 172, 254, 0.2)'
          }}>
            <h3 style={{ color: '#00f2fe', marginBottom: '5px' }}>Location</h3>
            <p style={{ color: '#e0e0e0' }}>{cvData.contact.location}</p>
          </div>
          
          <div style={{
            padding: '15px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            border: '1px solid rgba(79, 172, 254, 0.2)'
          }}>
            <h3 style={{ color: '#00f2fe', marginBottom: '5px' }}>LinkedIn</h3>
            <p style={{ color: '#e0e0e0' }}>{cvData.contact.linkedin}</p>
          </div>
          
          <div style={{
            padding: '15px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            border: '1px solid rgba(79, 172, 254, 0.2)'
          }}>
            <h3 style={{ color: '#00f2fe', marginBottom: '5px' }}>GitHub</h3>
            <p style={{ color: '#e0e0e0' }}>{cvData.contact.github}</p>
          </div>
        </div>
      </Html>
      
      <FloatingCrystal position={[-4, 4, -2]} color="#4facfe" />
      <FloatingCrystal position={[4, 2, -3]} color="#00f2fe" />
    </group>
  );
};

export default Contact;