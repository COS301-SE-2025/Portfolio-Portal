import React from 'react';
import { useCVData } from '../../../../hooks/useCVData';

const Experience = () => {
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
    ]
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
      ]
    }
  ];

  const allSkills = skills.length > 0 ? skills : [
    'React.js', 'TypeScript', 'Node.js', 'Python', 'MongoDB', 'AWS',
    'Three.js', 'WebGL', 'Docker', 'Git', 'CI/CD', 'Agile'
  ];

  return (
    <div className="text-white space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-purple-400">Professional Journey</h1>
        <p className="text-xl text-purple-300">Carved through digital landscapes</p>
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-purple-400">Experience Timeline</h2>
        {experiences.map((exp, index) => (
          <div key={exp.id} className="border-l-4 border-purple-400 pl-6 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <h3 className="text-2xl font-bold text-white">{exp.title}</h3>
              <span className="text-purple-300 font-medium">{exp.period}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <h4 className="text-lg text-purple-300 font-semibold">{exp.company}</h4>
              <span className="text-white/60">•</span>
              <span className="text-white/70">{exp.location}</span>
            </div>

            <p className="text-white/85 leading-relaxed">{exp.description}</p>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2">
              {exp.technologies.map((tech, techIndex) => (
                <span
                  key={techIndex}
                  className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm text-white/90"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-cyan-400">Technical Skills</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {allSkills.map((skill, index) => (
            <div key={index} className="bg-white/10 border border-white/20 rounded-lg p-3 text-center">
              <span className="text-sm font-medium text-white">{skill}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-yellow-400">Achievements</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {experiences.map((exp, index) => (
            <div key={index} className="space-y-3">
              <h3 className="text-lg font-semibold text-white">{exp.company}</h3>
              <ul className="space-y-2">
                {exp.achievements.map((achievement, achIndex) => (
                  <li key={achIndex} className="flex items-start gap-3 text-white/85">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-6 text-center mt-8 p-6 bg-white/5 rounded-lg">
          <div>
            <div className="text-2xl font-bold text-yellow-300">{experiences.length}+</div>
            <div className="text-white/70">Companies</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-300">{allSkills.length}+</div>
            <div className="text-white/70">Technologies</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-300">100+</div>
            <div className="text-white/70">Projects</div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Experience;
