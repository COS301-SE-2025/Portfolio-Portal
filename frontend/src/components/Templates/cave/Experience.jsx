import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { useCVData } from '../../../hooks/useCVData';
import { MiniModel } from './Hero';

// Floating 3D tools components
function FloatingPickaxe() {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.7) * 0.3;
    }
  });
  
  return (
    <group ref={meshRef} scale={[3, 3, 3]}>
      <MiniModel model="pickaxe" />
      <pointLight position={[0, 2, 0]} intensity={1.5} color="#8b5cf6" />
    </group>
  );
}

function FloatingShovel() {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y -= 0.008;
      meshRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.6) * 0.1;
      meshRef.current.position.y = Math.cos(state.clock.getElapsedTime() * 0.8) * 0.2;
    }
  });
  
  return (
    <group ref={meshRef} scale={[2, 2, 2]}>
      <MiniModel model="shovel" />
      <pointLight position={[0, 2, 0]} intensity={1.5} color="#06b6d4" />
    </group>
  );
}

const Experience = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeTab, setActiveTab] = useState('timeline');
  const { experience, skills } = useCVData();

  // Transform CV data to match the component's expected structure
  const experiences = experience.length > 0 ? experience.map((exp, index) => ({
    id: index + 1,
    title: exp.title || 'Developer',
    company: exp.company || 'Company Name',
    period: `${exp.startDate} - ${exp.endDate}`,
    location: 'Remote',
    description: exp.extra && exp.extra[0] ? exp.extra[0] : 'Contributed to various development projects and initiatives.',
    technologies: skills.slice(0, 5),
    achievements: exp.extra && exp.extra.length > 1 ? exp.extra.slice(1) : [
      'Delivered successful projects on time',
      'Improved development processes',
      'Collaborated effectively with team members'
    ],
    icon: index === 0 ? '⛏️' : index === 1 ? '🛠️' : '⚡'
  })) : [
    {
      id: 1,
      title: 'Senior Developer',
      company: 'Tech Solutions',
      period: '2022 - Present',
      location: 'Remote',
      description: 'Leading development of modern web applications and mentoring junior developers.',
      technologies: ['React.js', 'TypeScript', 'Node.js', 'MongoDB', 'AWS'],
      achievements: [
        'Increased application performance by 40%',
        'Led team of 3 developers',
        'Implemented CI/CD pipelines'
      ],
      icon: '⛏️'
    }
  ];

  const tabs = [
    { id: 'timeline', label: 'Timeline', icon: '⛏️' },
    { id: 'skills', label: 'Tools', icon: '🛠️' },
    { id: 'achievements', label: 'Achievements', icon: '⚡' }
  ];

  const renderTimelineContent = () => (
    <div className="space-y-8">
      {experiences.map((exp, index) => (
        <div
          key={exp.id}
          className={`
            relative overflow-hidden transition-all duration-700 transform
            ${hoveredIndex === index ? 'scale-102' : 'scale-100'}
          `}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-cyan-400 rounded-full"></div>
          
          {/* Timeline dot */}
          <div className="absolute left-6 top-8 w-6 h-6 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full border-4 border-slate-900/30 flex items-center justify-center">
            <span className="text-xs">{exp.icon}</span>
          </div>

          {/* Card */}
          <div className={`
            ml-20 bg-black/20 backdrop-blur-md border-2 border-white/15 rounded-2xl p-6
            shadow-2xl transition-all duration-500
            ${hoveredIndex === index ? 
              'bg-black/30 shadow-purple-500/25 border-purple-400/30' : 
              'hover:bg-black/25'
            }
          `}>
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Main Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <h3 className="text-xl font-bold text-white mb-2 sm:mb-0 flex items-center gap-2">
                    {exp.icon} {exp.title}
                  </h3>
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-500/15 to-cyan-500/15 border border-purple-400/30 rounded-full text-sm text-purple-300 font-medium">
                    {exp.period}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <h4 className="text-lg text-purple-300 font-semibold">
                    {exp.company}
                  </h4>
                  <span className="text-white/60">•</span>
                  <span className="text-white/70">{exp.location}</span>
                </div>

                <p className="text-white/85 leading-relaxed mb-4">
                  {exp.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-white/8 border border-white/15 rounded-full text-sm text-white/90 hover:bg-white/15 hover:border-purple-400/40 transition-all duration-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSkillsContent = () => (
    <div className="grid md:grid-cols-2 gap-8">
      {/* 3D Tools Display */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-purple-300 mb-4">Development Tools</h3>
        
        {/* Pickaxe Display */}
        <div className="bg-black/20 backdrop-blur-md border border-purple-400/30 rounded-xl p-6">
          <div className="flex items-center gap-4">
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Frontend Mining</h4>
              <p className="text-white/80 text-sm">React, Vue, Angular, TypeScript</p>
            </div>
          </div>
        </div>

        {/* Shovel Display */}
        <div className="bg-black/20 backdrop-blur-md border border-cyan-400/30 rounded-xl p-6">
          <div className="flex items-center gap-4">
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Backend Excavation</h4>
              <p className="text-white/80 text-sm">Node.js, Python, MongoDB, AWS</p>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div>
        <h3 className="text-2xl font-bold text-cyan-300 mb-4">Technical Arsenal</h3>
        <div className="grid grid-cols-2 gap-3">
          {skills.length > 0 ? skills.map((skill, index) => (
            <div 
              key={index}
              className="bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-lg p-3 
                       hover:from-purple-500/20 hover:to-cyan-500/20 hover:border-purple-400/40 
                       transition-all duration-300 hover:scale-105"
            >
              <span className="text-sm font-medium text-white">
                {skill}
              </span>
            </div>
          )) : [
            'React.js', 'TypeScript', 'Node.js', 'Python', 'MongoDB', 'AWS',
            'Three.js', 'WebGL', 'Docker', 'Git', 'CI/CD', 'Agile'
          ].map((skill, index) => (
            <div 
              key={index}
              className="bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-lg p-3 
                       hover:from-purple-500/20 hover:to-cyan-500/20 hover:border-purple-400/40 
                       transition-all duration-300 hover:scale-105"
            >
              <span className="text-sm font-medium text-white">
                {skill}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAchievementsContent = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-yellow-300 mb-6">Notable Achievements</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {experiences.map((exp, index) => (
          <div key={index} className="bg-black/20 backdrop-blur-md border border-yellow-400/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              {exp.icon} {exp.company}
            </h4>
            <div className="space-y-3">
              {exp.achievements.map((achievement, achIndex) => (
                <div 
                  key={achIndex}
                  className="flex items-start gap-3 text-white/85 text-sm"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/30 rounded-xl p-6 mt-8">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-yellow-300">{experiences.length}+</div>
            <div className="text-white/70 text-sm">Companies</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-300">{skills.length || 12}+</div>
            <div className="text-white/70 text-sm">Technologies</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-300">100+</div>
            <div className="text-white/70 text-sm">Projects</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'timeline':
        return renderTimelineContent();
      case 'skills':
        return renderSkillsContent();
      case 'achievements':
        return renderAchievementsContent();
      default:
        return renderTimelineContent();
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto">
      {/* Header with 3D Tools */}
      <div className="flex items-center justify-center py-16">
        <div className="flex items-center gap-8">
          {/* 3D Pickaxe */}
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              Professional Journey
            </h1>
            <p className="text-purple-300 font-medium">Carved through digital landscapes</p>
          </div>

          {/* 3D Shovel */}
          <div className="w-20 h-20">
            <Canvas>
              <PerspectiveCamera makeDefault position={[0, 0, 5]} />
              <ambientLight intensity={0.6} />
              <pointLight position={[2, 2, 2]} intensity={1} color="#06b6d4" />
              <FloatingShovel />
            </Canvas>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="px-8 mb-16 max-w-6xl mx-auto">
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div
              key={exp.id}
              className={`
                relative overflow-hidden transition-all duration-700 transform
                ${hoveredIndex === index ? 'scale-102' : 'scale-100'}
              `}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-cyan-400 rounded-full"></div>
              
              {/* Timeline dot */}
              <div className="absolute left-6 top-8 w-6 h-6 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full border-4 border-slate-900/30 flex items-center justify-center">
                <span className="text-xs">{exp.icon}</span>
              </div>

              {/* Card */}
              <div className={`
                ml-20 bg-black/20 backdrop-blur-md border-2 border-white/15 rounded-2xl p-6
                shadow-2xl transition-all duration-500
                ${hoveredIndex === index ? 
                  'bg-black/30 shadow-purple-500/25 border-purple-400/30' : 
                  'hover:bg-black/25'
                }
              `}>
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Main Info */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <h3 className="text-xl font-bold text-white mb-2 sm:mb-0 flex items-center gap-2">
                        {exp.icon} {exp.title}
                      </h3>
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-500/15 to-cyan-500/15 border border-purple-400/30 rounded-full text-sm text-purple-300 font-medium">
                        {exp.period}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <h4 className="text-lg text-purple-300 font-semibold">
                        {exp.company}
                      </h4>
                      <span className="text-white/60">•</span>
                      <span className="text-white/70">{exp.location}</span>
                    </div>

                    <p className="text-white/85 leading-relaxed mb-4">
                      {exp.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 bg-white/8 border border-white/15 rounded-full text-sm text-white/90 hover:bg-white/15 hover:border-purple-400/40 transition-all duration-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Section */}
      <div className="px-8 mb-16 max-w-6xl mx-auto">
        <div className="bg-black/20 backdrop-blur-md border-2 border-white/15 rounded-2xl p-8 shadow-2xl hover:bg-black/30 hover:shadow-purple-500/20 hover:border-purple-400/30 transition-all duration-500 hover:scale-102">
          <div className="grid md:grid-cols-2 gap-8">
            {/* 3D Tools Display */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-purple-300 mb-4">Development Tools</h3>
              
              {/* Pickaxe Display */}
              <div className="bg-black/20 backdrop-blur-md border border-purple-400/30 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Frontend Mining</h4>
                    <p className="text-white/80 text-sm">React, Vue, Angular, TypeScript</p>
                  </div>
                </div>
              </div>

              {/* Shovel Display */}
              <div className="bg-black/20 backdrop-blur-md border border-cyan-400/30 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Backend Excavation</h4>
                    <p className="text-white/80 text-sm">Node.js, Python, MongoDB, AWS</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Grid */}
            <div>
              <h3 className="text-2xl font-bold text-cyan-300 mb-4">Technical Arsenal</h3>
              <div className="grid grid-cols-2 gap-3">
                {skills.length > 0 ? skills.map((skill, index) => (
                  <div 
                    key={index}
                    className="bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-lg p-3 
                             hover:from-purple-500/20 hover:to-cyan-500/20 hover:border-purple-400/40 
                             transition-all duration-300 hover:scale-105"
                  >
                    <span className="text-sm font-medium text-white">
                      {skill}
                    </span>
                  </div>
                )) : [
                  'React.js', 'TypeScript', 'Node.js', 'Python', 'MongoDB', 'AWS',
                  'Three.js', 'WebGL', 'Docker', 'Git', 'CI/CD', 'Agile'
                ].map((skill, index) => (
                  <div 
                    key={index}
                    className="bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-lg p-3 
                             hover:from-purple-500/20 hover:to-cyan-500/20 hover:border-purple-400/40 
                             transition-all duration-300 hover:scale-105"
                  >
                    <span className="text-sm font-medium text-white">
                      {skill}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="px-8 pb-16 max-w-6xl mx-auto">
        <div className="bg-black/20 backdrop-blur-md border-2 border-white/15 rounded-2xl p-8 shadow-2xl hover:bg-black/30 hover:shadow-yellow-500/20 hover:border-yellow-400/30 transition-all duration-500 hover:scale-102">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-yellow-300 mb-6">Notable Achievements</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {experiences.map((exp, index) => (
                <div key={index} className="bg-black/20 backdrop-blur-md border border-yellow-400/30 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    {exp.icon} {exp.company}
                  </h4>
                  <div className="space-y-3">
                    {exp.achievements.map((achievement, achIndex) => (
                      <div 
                        key={achIndex}
                        className="flex items-start gap-3 text-white/85 text-sm"
                      >
                        <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/30 rounded-xl p-6 mt-8">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-yellow-300">{experiences.length}+</div>
                  <div className="text-white/70 text-sm">Companies</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-300">{skills.length || 12}+</div>
                  <div className="text-white/70 text-sm">Technologies</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-300">100+</div>
                  <div className="text-white/70 text-sm">Projects</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;