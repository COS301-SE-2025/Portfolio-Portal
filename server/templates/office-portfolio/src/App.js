import React from 'react';
import portfolioData from './data/portfolioData.js';
import './App.css';

function App() {
  const { header, skills, experience, education, projects, contact } = portfolioData;

  return (
    <div className="office-app">
      {/* Navigation */}
      <nav className="office-nav">
        <div className="nav-container">
          <div className="nav-brand">{header.name}</div>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#experience">Experience</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="office-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">{header.name}</h1>
            <p className="hero-subtitle">{header.title}</p>
            {header.summary && (
              <p className="hero-description">{header.summary}</p>
            )}
            <div className="hero-cta">
              <a href="#contact" className="cta-button primary">Get In Touch</a>
              <a href="#projects" className="cta-button secondary">View Work</a>
            </div>
          </div>
          <div className="hero-image">
            <div className="professional-avatar">
              <div className="avatar-placeholder">
                {header.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="office-section light-bg">
        <div className="section-container">
          <h2 className="section-title">About Me</h2>
          <div className="about-content">
            <div className="about-text">
              <p>{header.summary || "Dedicated professional with a passion for excellence and innovation. Committed to delivering high-quality results and building meaningful professional relationships."}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <section id="skills" className="office-section">
          <div className="section-container">
            <h2 className="section-title">Core Competencies</h2>
            <div className="skills-grid">
              {skills.map((skill, index) => (
                <div key={index} className="skill-item">
                  <div className="skill-icon">●</div>
                  <span className="skill-name">
                    {typeof skill === 'string' ? skill : skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience Section */}
      {experience && experience.length > 0 && (
        <section id="experience" className="office-section light-bg">
          <div className="section-container">
            <h2 className="section-title">Professional Experience</h2>
            <div className="experience-timeline">
              {experience.map((exp, index) => (
                <div key={index} className="experience-item">
                  <div className="experience-header">
                    <h3 className="experience-title">{exp.title}</h3>
                    {exp.company && <div className="experience-company">{exp.company}</div>}
                    {exp.duration && <div className="experience-duration">{exp.duration}</div>}
                  </div>
                  {exp.description && (
                    <div className="experience-description">
                      <p>{exp.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education Section */}
      {education && education.length > 0 && (
        <section id="education" className="office-section">
          <div className="section-container">
            <h2 className="section-title">Education</h2>
            <div className="education-grid">
              {education.map((edu, index) => (
                <div key={index} className="education-card">
                  <div className="education-header">
                    <h3 className="education-degree">{edu.degree}</h3>
                    {edu.institution && <div className="education-institution">{edu.institution}</div>}
                    {edu.duration && <div className="education-duration">{edu.duration}</div>}
                  </div>
                  {edu.details && <p className="education-details">{edu.details}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <section id="projects" className="office-section light-bg">
          <div className="section-container">
            <h2 className="section-title">Key Projects</h2>
            <div className="projects-grid">
              {projects.map((project, index) => (
                <div key={index} className="project-card">
                  <div className="project-header">
                    <h3 className="project-title">{project.title}</h3>
                  </div>
                  <div className="project-content">
                    {project.description && <p className="project-description">{project.description}</p>}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="project-tech">
                        <div className="tech-label">Technologies Used:</div>
                        <div className="tech-list">
                          {project.technologies.map((tech, techIndex) => (
                            <span key={techIndex} className="tech-item">{tech}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="office-section contact-section">
        <div className="section-container">
          <h2 className="section-title">Let's Connect</h2>
          <div className="contact-content">
            <div className="contact-intro">
              <p>Ready to discuss your next project or explore collaboration opportunities? I'd love to hear from you.</p>
            </div>
            <div className="contact-info">
              {contact.email && (
                <div className="contact-item">
                  <div className="contact-label">Email</div>
                  <a href={`mailto:${contact.email}`} className="contact-value">{contact.email}</a>
                </div>
              )}
              {contact.phone && (
                <div className="contact-item">
                  <div className="contact-label">Phone</div>
                  <a href={`tel:${contact.phone}`} className="contact-value">{contact.phone}</a>
                </div>
              )}
              {contact.linkedin && (
                <div className="contact-item">
                  <div className="contact-label">LinkedIn</div>
                  <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="contact-value">View Profile</a>
                </div>
              )}
              {contact.github && (
                <div className="contact-item">
                  <div className="contact-label">GitHub</div>
                  <a href={contact.github} target="_blank" rel="noopener noreferrer" className="contact-value">View Profile</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="office-footer">
        <div className="footer-content">
          <p>&copy; 2024 {header.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;