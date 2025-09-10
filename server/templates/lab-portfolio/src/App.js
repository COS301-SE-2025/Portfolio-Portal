import React from 'react';
import portfolioData from './data/portfolioData.js';

function App() {
  const { header, skills, experience, education, projects, contact } = portfolioData;

  return (
    <div className="container">
      {/* Header Section */}
      <header className="header">
        <h1>{header.name}</h1>
        <p>{header.title}</p>
        {header.summary && <p style={{marginTop: '20px', fontSize: '1rem'}}>{header.summary}</p>}
      </header>

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <section className="section">
          <h2>Skills</h2>
          <div className="skills-grid">
            {skills.map((skill, index) => (
              <div key={index} className="skill-item">
                {typeof skill === 'string' ? skill : skill.name}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience Section */}
      {experience && experience.length > 0 && (
        <section className="section">
          <h2>Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="experience-item">
              <h3>{exp.title}</h3>
              {exp.company && <div className="company">{exp.company}</div>}
              {exp.duration && <div className="duration">{exp.duration}</div>}
              {exp.description && <p>{exp.description}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Education Section */}
      {education && education.length > 0 && (
        <section className="section">
          <h2>Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="experience-item">
              <h3>{edu.degree}</h3>
              {edu.institution && <div className="company">{edu.institution}</div>}
              {edu.duration && <div className="duration">{edu.duration}</div>}
              {edu.details && <p>{edu.details}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <section className="section">
          <h2>Projects</h2>
          {projects.map((project, index) => (
            <div key={index} className="project-item">
              <h3>{project.title}</h3>
              {project.description && <p>{project.description}</p>}
              {project.technologies && project.technologies.length > 0 && (
                <div style={{marginTop: '10px'}}>
                  <strong>Technologies:</strong> {project.technologies.join(', ')}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Contact Section */}
      <section className="section">
        <h2>Contact</h2>
        <div className="contact-info">
          {contact.email && (
            <p>Email: <a href={`mailto:${contact.email}`}>{contact.email}</a></p>
          )}
          {contact.phone && (
            <p>Phone: <a href={`tel:${contact.phone}`}>{contact.phone}</a></p>
          )}
          {contact.linkedin && (
            <p>LinkedIn: <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">View Profile</a></p>
          )}
          {contact.github && (
            <p>GitHub: <a href={contact.github} target="_blank" rel="noopener noreferrer">View Profile</a></p>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;