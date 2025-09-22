import React from 'react';
import portfolioData from '../data/portfolioData.js';

const Experience = () => {

  return (
    <section id="experience" className="relative w-full py-20 mx-auto bg-gray-900/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-blue-400 text-4xl font-bold mb-4">Professional Journey</h2>
          <div className="w-20 h-1 bg-blue-400 mx-auto" />
        </div>

        {/* Experience Section */}
        <div className="space-y-8">
          {portfolioData?.experience?.map((exp, index) => (
            <div 
              key={index}
              className="bg-gray-900/70 p-8 rounded-2xl backdrop-blur-sm border border-blue-400/20 hover:border-blue-400/50 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                <h3 className="text-white text-2xl font-bold">{exp.position}</h3>
                <span className="text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full text-sm">
                  {exp.duration}
                </span>
              </div>
              <h4 className="text-blue-400 text-lg mb-4">{exp.company}</h4>
              <p>{exp.description}</p>
            </div>
          ))}
        </div>

        {/* Education Section */}
        {portfolioData?.education?.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-16">
              <h2 className="text-blue-400 text-4xl font-bold mb-4">Education</h2>
              <div className="w-20 h-1 bg-blue-400 mx-auto" />
            </div>

            <div className="space-y-8">
              {portfolioData.education.map((edu, index) => (
                <div 
                  key={index}
                  className="bg-gray-900/70 p-8 rounded-2xl backdrop-blur-sm border border-blue-400/20 hover:border-blue-400/50 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                    <h3 className="text-white text-2xl font-bold">{edu.degree}</h3>
                    <span className="text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full text-sm">
                      {edu.year}
                    </span>
                  </div>
                  <h4 className="text-blue-400 text-lg mb-2">{edu.institution}</h4>
                  {edu.field && <p className="text-gray-300">{edu.field}</p>}
                  {edu.gpa && <p className="text-gray-300">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};


export default Experience;
