import React from 'react';

const LoadingScreen = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #0a0a0a, #1a1a2e, #16213e)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      zIndex: 9999
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        border: '4px solid rgba(255, 255, 255, 0.1)',
        borderTop: '4px solid #4facfe',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '20px'
      }} />
      
      <h2 style={{
        fontSize: '2rem',
        marginBottom: '10px',
        background: 'linear-gradient(45deg, #4facfe, #00f2fe)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Entering the Cave...
      </h2>
      
      <p style={{
        fontSize: '1rem',
        opacity: 0.7,
        animation: 'pulse 2s ease-in-out infinite alternate'
      }}>
        Loading your 3D CV experience
      </p>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0% { opacity: 0.7; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;