import React from 'react';
import { useCVData } from '../../../hooks/useCVData';

const About = () => {
  const { name, about, description, skills } = useCVData();

  const displaySkills = skills.length > 0 ? skills : [
    'React.js', 'Three.js', 'JavaScript', 'TypeScript', 'Node.js', 
    'Python', 'WebGL', '3D Modeling', 'UI/UX Design', 'MongoDB'
  ];

  const getInitials = (fullName) => {
    if (!fullName) return 'DV';
    return fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="text-white space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto">
          {getInitials(name)}
        </div>
        <h1 className="text-5xl font-bold">
          {name }
        </h1>
        <p className="text-xl text-green-300">Digital Cave Explorer</p>
      </div>

      {/* Description */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-green-400">About Me</h2>
        <p className="text-lg text-white/90 leading-relaxed">
          {description || 'A passionate web developer with a love for creating immersive digital experiences.'}
        </p>
        <p className="text-white/85 leading-relaxed">
          I believe in the power of storytelling through technology. Each project is an opportunity to create something meaningful, 
          whether it's solving complex problems or simply bringing joy to users through beautiful, interactive experiences.
        </p>
      </div>

      {/* Mission */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-cyan-400">Mission</h2>
        <p className="text-lg text-white/90 italic">
          "To create immersive experiences that inspire, educate, and push the boundaries of what's possible in modern web development."
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-cyan-300 font-semibold">Innovation</h3>
            <p className="text-white/80">Pushing the envelope of web technology</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-blue-300 font-semibold">User Focus</h3>
            <p className="text-white/80">Creating meaningful, accessible experiences</p>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-yellow-400">Skills</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {displaySkills.map((skill, index) => (
            <div key={index} className="bg-white/10 border border-white/20 rounded-lg p-3 text-center">
              <span className="text-sm font-medium text-white">{skill}</span>
            </div>
          ))}
        </div>
        <p className="text-white/90 text-center italic">
          "Tools are just instruments; the magic happens when they're wielded with passion and creativity."
        </p>
      </div>

    </div>
  );
};

export default About;
