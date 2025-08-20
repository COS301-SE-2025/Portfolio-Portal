import React, { useState } from 'react';
import { useCVData } from '../../../hooks/useCVData';

const About = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeSection, setActiveSection] = useState('philosophy');
  
  const { name, about, description, skills } = useCVData();

  const displaySkills = skills.length > 0 ? skills : [
    'React.js', 'Three.js', 'JavaScript', 'TypeScript', 'Node.js', 
    'Python', 'WebGL', '3D Modeling', 'UI/UX Design', 'MongoDB'
  ];

  const getInitials = (fullName) => {
    if (!fullName) return '🔥';
    return fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const sections = [
    { id: 'philosophy', label: 'Description', icon: '🔮' },
    { id: 'mission', label: 'About', icon: '🎯' },
    { id: 'skills', label: 'Skills', icon: '⚡' }
  ];

  const renderContent = () => {
    switch(activeSection) {
      case 'philosophy':
        return (
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Description
            </h3>
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-xl p-6">
              <p className="text-lg leading-relaxed text-white/90 italic">
                {description || 'A passionate web developer with a love for creating immersive digital experiences.'}
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
              {about || 'Mission Statement'}
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
    <div className="min-h-screen overflow-y-auto">
      {/* Header Section */}
      <div className="flex items-center justify-center py-16">
        <div className="flex items-center gap-8">
          <div className="text-6xl animate-pulse">
            🔥
          </div>
          
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

      {/* Description Section */}
      <div className="px-8 mb-16 max-w-4xl mx-auto">
        <div 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            bg-black/20 backdrop-blur-md border-2 border-white/15 rounded-2xl p-8 
            shadow-2xl transition-all duration-500
            ${isHovered ? 'bg-black/30 shadow-green-500/20 border-green-400/30 scale-102' : 'scale-100'}
          `}
        >
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Description
            </h3>
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-xl p-6">
              <p className="text-lg leading-relaxed text-white/90 italic">
                {description || 'A passionate web developer with a love for creating immersive digital experiences.'}
              </p>
            </div>
            <p className="text-white/85">
              I believe in the power of storytelling through technology. Each project is an opportunity to create something meaningful, 
              whether it's solving complex problems or simply bringing joy to users through beautiful, interactive experiences.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="px-8 mb-16 max-w-4xl mx-auto">
        <div className="bg-black/20 backdrop-blur-md border-2 border-white/15 rounded-2xl p-8 shadow-2xl hover:bg-black/30 hover:shadow-cyan-500/20 hover:border-cyan-400/30 transition-all duration-500 hover:scale-102">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              {about || 'Mission Statement'}
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
        </div>
      </div>

      {/* Skills Section */}
      <div className="px-8 mb-16 max-w-4xl mx-auto">
        <div className="bg-black/20 backdrop-blur-md border-2 border-white/15 rounded-2xl p-8 shadow-2xl hover:bg-black/30 hover:shadow-yellow-500/20 hover:border-yellow-400/30 transition-all duration-500 hover:scale-102">
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
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 pb-16 max-w-4xl mx-auto">
        <div className="pt-6 border-t border-white/10">
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
  );
};

export default About;