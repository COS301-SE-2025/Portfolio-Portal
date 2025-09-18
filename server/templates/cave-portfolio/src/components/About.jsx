import React from 'react';
import portfolioData from '../data/portfolioData.js';

const About = ({ className = '' }) => {
  const { header, skills } = portfolioData;

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">About Me</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-green-400 to-emerald-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-black/20 backdrop-blur-xl border border-green-400/30 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-green-400 mb-4">Personal Story</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                {header.summary || "Passionate about creating immersive digital experiences that tell compelling stories. I believe in the power of technology to connect people and ideas in meaningful ways."}
              </p>
              <div className="mt-6 flex items-center">
                <div className="w-12 h-12 rounded-full bg-green-400/20 border border-green-400/40 flex items-center justify-center mr-4">
                  <span className="text-green-400 text-xl">🔥</span>
                </div>
                <div>
                  <p className="text-white font-medium">Available for projects</p>
                  <p className="text-green-400 text-sm">Let's create something amazing</p>
                </div>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-xl border border-green-400/30 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-green-400 mb-4">Core Skills</h3>
              <div className="space-y-4">
                {skills && skills.slice(0, 4).map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="text-white">{typeof skill === 'string' ? skill : skill.name}</span>
                      <span className="text-green-400">{90 - (index * 5)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${90 - (index * 5)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {skills && skills.length > 4 && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h4 className="text-white text-lg font-semibold mb-3">Additional Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {skills.slice(4).map((skill, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-green-400/10 text-green-400 rounded-full text-sm border border-green-400/30"
                      >
                        {typeof skill === 'string' ? skill : skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;



