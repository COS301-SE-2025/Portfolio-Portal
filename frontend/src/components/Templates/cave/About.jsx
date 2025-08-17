import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { useCVData } from '../../../hooks/useCVData';
import { MiniModel } from './Hero'; // Import the MiniModel component

// Floating 3D campfire component
function FloatingCampfire() {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.2;
    }
  });
  
  return (
    <group ref={meshRef} scale={[0.03, 0.03, 0.03]}>
      <MiniModel model="campfire" />
      <pointLight position={[0, 2, 0]} intensity={2} color="#ff6b35" />
    </group>
  );
}

const About = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeSection, setActiveSection] = useState('intro');
  const { name, about, description, skills } = useCVData();

  // Fallback skills if none provided
  const displaySkills = skills.length > 0 ? skills : [
    'React.js', 'Three.js', 'JavaScript', 'TypeScript', 'Node.js', 
    'Python', 'WebGL', '3D Modeling', 'UI/UX Design', 'MongoDB'
  ];

  // Get initials for avatar if no name provided
  const getInitials = (fullName) => {
    if (!fullName) return '🔥';
    return fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const sections = [
    { id: 'intro', label: 'Introduction', icon: '👋' },
    { id: 'philosophy', label: 'Philosophy', icon: '🔮' },
    { id: 'mission', label: 'Mission', icon: '🎯' },
    { id: 'skills', label: 'Skills', icon: '⚡' }
  ];

  const renderContent = () => {
    switch(activeSection) {
      case 'intro':
        return (
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              Welcome to My Digital Cave
            </h3>
            <p className="text-lg leading-relaxed text-white/90">
              {description || "I'm a passionate developer and creative technologist with a deep love for immersive experiences. My journey began in the depths of code caves, where I discovered the magic of bringing digital worlds to life."}
            </p>
            <p className="text-lg leading-relaxed text-white/80">
              {about || "With years of experience crafting interactive applications, I specialize in modern web technologies and believe in creating digital experiences that not only function beautifully but also tell compelling stories."}
            </p>
          </div>
        );
      case 'philosophy':
        return (
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              My Philosophy
            </h3>
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-xl p-6">
              <p className="text-lg leading-relaxed text-white/90 italic">
                "Every line of code is a brushstroke in the canvas of digital reality. I craft experiences that bridge the gap between imagination and technology."
              </p>
            </div>
            <p className="text-white/85">
              I believe in the power of storytelling through technology. Each project is an opportunity to create something meaningful, 
              whether it's solving complex problems or simply bringing joy to users through beautiful, interactive experiences.
            </p>
          </div>
        );
      case 'mission':
        return (
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              My Mission
            </h3>
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 rounded-xl p-6">
              <p className="text-lg leading-relaxed text-white/90 italic">
                "To create immersive experiences that inspire, educate, and push the boundaries of what's possible in modern web development."
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <h4 className="text-cyan-300 font-semibold mb-2">Innovation</h4>
                <p className="text-white/80 text-sm">Pushing the envelope of web technology</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <h4 className="text-blue-300 font-semibold mb-2">User Focus</h4>
                <p className="text-white/80 text-sm">Creating meaningful, accessible experiences</p>
              </div>
            </div>
          </div>
        );
      case 'skills':
        return (
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              Core Skills & Technologies
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {displaySkills.map((skill, index) => (
                <div 
                  key={index}
                  className="group bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-lg p-3 
                           hover:from-yellow-500/20 hover:to-orange-500/20 hover:border-yellow-400/40 
                           transition-all duration-300 hover:scale-105"
                >
                  <span className="text-sm font-medium text-white group-hover:text-yellow-100">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-8 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/30 rounded-xl p-4">
              <p className="text-white/90 text-center italic">
                "Tools are just instruments; the magic happens when they're wielded with passion and creativity."
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header with 3D Campfire */}
      <div className="flex-shrink-0 flex items-center justify-center py-8">
        <div className="flex items-center gap-8">
          {/* 3D Campfire */}
          <div className="w-32 h-32">
            <Canvas>
              <PerspectiveCamera makeDefault position={[0, 0, 5]} />
              <ambientLight intensity={0.6} />
              <pointLight position={[2, 2, 2]} intensity={1} color="#ff6b35" />
              <FloatingCampfire />
            </Canvas>
          </div>
          
          {/* Name and Avatar */}
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg border-2 border-green-300/30 mb-4 mx-auto">
              {getInitials(name)}
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {name ? name.split(' ')[0] : 'Welcome'}
            </h1>
            <p className="text-green-300 font-medium">Digital Cave Explorer</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex-shrink-0 px-8 mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`
                px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2
                ${activeSection === section.id ? 
                  'bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-2 border-green-400/50 text-white scale-105' : 
                  'bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 hover:text-white hover:scale-105'}
              `}
            >
              <span>{section.icon}</span>
              <span className="text-sm font-medium">{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div 
        className="flex-1 px-8 pb-8 overflow-y-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`
          max-w-4xl mx-auto
          transition-all duration-700 transform
          ${isHovered ? 'scale-102' : 'scale-100'}
        `}>
          <div className={`
            bg-black/20 backdrop-blur-md border-2 border-white/15 rounded-2xl p-8 
            shadow-2xl transition-all duration-500
            ${isHovered ? 'bg-black/30 shadow-green-500/20 border-green-400/30' : ''}
          `}>
            {renderContent()}
            
            {/* Interactive Elements */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="text-sm text-green-300 opacity-70">
                  {isHovered ? 'Exploring the mystical depths...' : 'Hover to delve deeper into the cave →'}
                </div>
                <div className="flex gap-2">
                  {sections.map((section, index) => (
                    <div
                      key={section.id}
                      className={`
                        w-2 h-2 rounded-full transition-all duration-300
                        ${activeSection === section.id ? 
                          'bg-gradient-to-r from-green-400 to-emerald-400 scale-125' : 
                          'bg-white/20'}
                      `}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;