import React from 'react';
import portfolioData from '../data/portfolioData.js';

const Experience = ({ className = '' }) => {
  const { experience, education } = portfolioData;

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">Professional Journey</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-indigo-400 mx-auto rounded-full"></div>
          </div>

          {/* Experience Section */}
          <div className="space-y-6">
            {experience && experience.map((exp, index) => (
              <div 
                key={index}
                className="bg-black/20 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 hover:border-purple-400/50 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                  <h3 className="text-2xl font-bold text-white">{exp.title}</h3>
                  <span className="text-purple-400 bg-purple-400/10 px-3 py-1 rounded-full text-sm">
                    {exp.duration}
                  </span>
                </div>
                <h4 className="text-purple-400 text-lg mb-4">{exp.company}</h4>
                {exp.description && (
                  <p className="text-gray-300 leading-relaxed">{exp.description}</p>
                )}
              </div>
            ))}
          </div>

          {/* Education Section */}
          {education && education.length > 0 && (
            <div className="mt-12">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-4">Education</h2>
                <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-indigo-400 mx-auto rounded-full"></div>
              </div>

              <div className="space-y-6">
                {education.map((edu, index) => (
                  <div 
                    key={index}
                    className="bg-black/20 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 hover:border-purple-400/50 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                      <h3 className="text-2xl font-bold text-white">{edu.degree}</h3>
                      <span className="text-purple-400 bg-purple-400/10 px-3 py-1 rounded-full text-sm">
                        {edu.duration}
                      </span>
                    </div>
                    <h4 className="text-purple-400 text-lg mb-2">{edu.institution}</h4>
                    {edu.details && <p className="text-gray-300">{edu.details}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Experience;



