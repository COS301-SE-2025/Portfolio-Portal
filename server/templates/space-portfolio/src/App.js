import React from 'react';
import portfolioData from './data/portfolioData.js';
import './App.css';

function App() {
  const { header, skills, experience, education, projects, contact } = portfolioData;

  return (
    <div className="space-app">
      {/* Animated background */}
      <div className="space-background">
        <div className="stars"></div>
        <div className="twinkling"></div>
        <div className="clouds"></div>
      </div>

      {/* Navigation */}
      <nav className="space-nav">
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
      <section id="hero" className="space-hero">
        <div className="hero-content">
          <h1 className="hero-title">{header.name}</h1>
          <p className="hero-subtitle">{header.title}</p>
          {header.summary && (
            <p className="hero-description">{header.summary}</p>
          )}
          <div className="hero-cta">
            <a href="#contact" className="cta-button">Get In Touch</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-orb"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="space-section">
        <div className="section-container">
          <h2 className="section-title">About Me</h2>
          <div className="about-content">
            <p>{header.summary || "Passionate professional dedicated to creating innovative solutions and pushing the boundaries of technology."}</p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <section id="skills" className="space-section">
          <div className="section-container">
            <h2 className="section-title">Skills & Technologies</h2>
            <div className="skills-grid">
              {skills.map((skill, index) => (
                <div key={index} className="skill-card">
                  <div className="skill-content">
                    {typeof skill === 'string' ? skill : skill.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience Section */}
      {experience && experience.length > 0 && (
        <section id="experience" className="space-section">
          <div className="section-container">
            <h2 className="section-title">Experience</h2>
            <div className="timeline">
              {experience.map((exp, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h3 className="timeline-title">{exp.title}</h3>
                    {exp.company && <div className="timeline-company">{exp.company}</div>}
                    {exp.duration && <div className="timeline-duration">{exp.duration}</div>}
                    {exp.description && <p className="timeline-description">{exp.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education Section */}
      {education && education.length > 0 && (
        <section id="education" className="space-section">
          <div className="section-container">
            <h2 className="section-title">Education</h2>
            <div className="education-grid">
              {education.map((edu, index) => (
                <div key={index} className="education-card">
                  <h3 className="education-degree">{edu.degree}</h3>
                  {edu.institution && <div className="education-institution">{edu.institution}</div>}
                  {edu.duration && <div className="education-duration">{edu.duration}</div>}
                  {edu.details && <p className="education-details">{edu.details}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <section id="projects" className="space-section">
          <div className="section-container">
            <h2 className="section-title">Projects</h2>
            <div className="projects-grid">
              {projects.map((project, index) => (
                <div key={index} className="project-card">
                  <div className="project-content">
                    <h3 className="project-title">{project.title}</h3>
                    {project.description && <p className="project-description">{project.description}</p>}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="project-tech">
                        <div className="tech-label">Technologies:</div>
                        <div className="tech-tags">
                          {project.technologies.map((tech, techIndex) => (
                            <span key={techIndex} className="tech-tag">{tech}</span>
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
      <section id="contact" className="space-section contact-section">
        <div className="section-container">
          <h2 className="section-title">Get In Touch</h2>
          <div className="contact-content">
            <p className="contact-intro">Ready to collaborate on your next project? Let's connect!</p>
            <div className="contact-info">
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="contact-link">
                  <div className="contact-icon">✉</div>
                  <span>{contact.email}</span>
                </a>
              )}
              {contact.phone && (
                <a href={`tel:${contact.phone}`} className="contact-link">
                  <div className="contact-icon">📞</div>
                  <span>{contact.phone}</span>
                </a>
              )}
              {contact.linkedin && (
                <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link">
                  <div className="contact-icon">💼</div>
                  <span>LinkedIn Profile</span>
                </a>
              )}
              {contact.github && (
                <a href={contact.github} target="_blank" rel="noopener noreferrer" className="contact-link">
                  <div className="contact-icon">🔗</div>
                  <span>GitHub Profile</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="space-footer">
        <div className="footer-content">
          <p>&copy; 2024 {header.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;