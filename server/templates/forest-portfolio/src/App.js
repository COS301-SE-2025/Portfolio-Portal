import React from 'react';
import portfolioData from './data/portfolioData.js';
import './App.css';

function App() {
  const { header, skills, experience, education, projects, contact } = portfolioData;

  return (
    <div className="forest-app">
      {/* Background Elements */}
      <div className="forest-background">
        <div className="trees"></div>
        <div className="leaves"></div>
        <div className="fog"></div>
      </div>

      {/* Navigation */}
      <nav className="forest-nav">
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
      <section id="hero" className="forest-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">{header.name}</h1>
            <p className="hero-subtitle">{header.title}</p>
            {header.summary && (
              <p className="hero-description">{header.summary}</p>
            )}
            <div className="hero-cta">
              <a href="#contact" className="cta-button">Connect With Nature</a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="nature-circle">
              <div className="tree-icon">🌲</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="forest-section">
        <div className="section-container">
          <h2 className="section-title">About Me</h2>
          <div className="about-content">
            <p>{header.summary || "Passionate about creating sustainable solutions and connecting with nature. I believe in the power of organic growth and natural harmony in both life and work."}</p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <section id="skills" className="forest-section alt-bg">
          <div className="section-container">
            <h2 className="section-title">Natural Talents</h2>
            <div className="skills-forest">
              {skills.map((skill, index) => (
                <div key={index} className="skill-leaf">
                  <div className="leaf-content">
                    <span className="leaf-icon">🍃</span>
                    <span className="skill-text">
                      {typeof skill === 'string' ? skill : skill.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience Section */}
      {experience && experience.length > 0 && (
        <section id="experience" className="forest-section">
          <div className="section-container">
            <h2 className="section-title">Growth Journey</h2>
            <div className="experience-tree">
              {experience.map((exp, index) => (
                <div key={index} className="experience-branch">
                  <div className="branch-marker">🌿</div>
                  <div className="branch-content">
                    <h3 className="branch-title">{exp.title}</h3>
                    {exp.company && <div className="branch-company">{exp.company}</div>}
                    {exp.duration && <div className="branch-duration">{exp.duration}</div>}
                    {exp.description && <p className="branch-description">{exp.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education Section */}
      {education && education.length > 0 && (
        <section id="education" className="forest-section alt-bg">
          <div className="section-container">
            <h2 className="section-title">Learning Roots</h2>
            <div className="education-grove">
              {education.map((edu, index) => (
                <div key={index} className="education-tree">
                  <div className="tree-crown">
                    <h3 className="education-degree">{edu.degree}</h3>
                    {edu.institution && <div className="education-institution">{edu.institution}</div>}
                    {edu.duration && <div className="education-duration">{edu.duration}</div>}
                  </div>
                  {edu.details && <p className="tree-roots">{edu.details}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <section id="projects" className="forest-section">
          <div className="section-container">
            <h2 className="section-title">Forest Projects</h2>
            <div className="projects-garden">
              {projects.map((project, index) => (
                <div key={index} className="project-plant">
                  <div className="plant-pot">
                    <h3 className="project-title">{project.title}</h3>
                    {project.description && <p className="project-description">{project.description}</p>}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="project-seeds">
                        <div className="seeds-label">Technologies:</div>
                        <div className="seeds-list">
                          {project.technologies.map((tech, techIndex) => (
                            <span key={techIndex} className="seed">{tech}</span>
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
      <section id="contact" className="forest-section contact-section">
        <div className="section-container">
          <h2 className="section-title">Let's Grow Together</h2>
          <div className="contact-content">
            <div className="contact-intro">
              <p>Ready to plant the seeds of collaboration? Let's connect and create something beautiful together.</p>
            </div>
            <div className="contact-grove">
              {contact.email && (
                <div className="contact-tree">
                  <div className="contact-icon">📧</div>
                  <div className="contact-info">
                    <div className="contact-label">Email</div>
                    <a href={`mailto:${contact.email}`} className="contact-value">{contact.email}</a>
                  </div>
                </div>
              )}
              {contact.phone && (
                <div className="contact-tree">
                  <div className="contact-icon">📱</div>
                  <div className="contact-info">
                    <div className="contact-label">Phone</div>
                    <a href={`tel:${contact.phone}`} className="contact-value">{contact.phone}</a>
                  </div>
                </div>
              )}
              {contact.linkedin && (
                <div className="contact-tree">
                  <div className="contact-icon">💼</div>
                  <div className="contact-info">
                    <div className="contact-label">LinkedIn</div>
                    <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="contact-value">Connect</a>
                  </div>
                </div>
              )}
              {contact.github && (
                <div className="contact-tree">
                  <div className="contact-icon">🌿</div>
                  <div className="contact-info">
                    <div className="contact-label">GitHub</div>
                    <a href={contact.github} target="_blank" rel="noopener noreferrer" className="contact-value">Explore</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="forest-footer">
        <div className="footer-content">
          <p>&copy; 2024 {header.name}. Growing naturally with purpose.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;