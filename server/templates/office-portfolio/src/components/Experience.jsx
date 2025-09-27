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
                <h3 className="text-white text-2xl font-bold">{exp.title}</h3>
                <p className="text-emerald-400 text-lg">{exp.company}</p>
                <p className="text-gray-400 mb-4">{`${exp.startDate} - ${exp.endDate}`}</p>
                <ul className="text-white list-disc pl-5">
                  {exp.extra?.map((bullet, bulletIndex) => (
                    <li key={`bullet-${index}-${bulletIndex}`}>{bullet}</li>
                  ))}
                </ul>
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
                                  <h3 className="text-white text-2xl font-bold">{edu.degree}</h3>
                <p className="text-emerald-400 text-lg">{edu.institution}</p>
                <p className="text-gray-400 mb-4">{edu.endDate}</p>
                {edu.field && <p className="text-white">{edu.field}</p>}
                {edu.gpa && <p className="text-white">GPA: {edu.gpa}</p>}
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
