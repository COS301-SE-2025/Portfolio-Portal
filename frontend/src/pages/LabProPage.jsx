// Enhanced LabProPage.jsx with improved backgrounds and chemistry elements
import React from 'react';

const LabProPage = () => {
  return (
    <div className='relative z-0 bg-gray-900 text-white overflow-hidden'>
      {/* Enhanced background effects with floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 -left-20 w-60 h-60 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-500"></div>
        <div className="absolute bottom-1/4 -right-20 w-60 h-60 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-1500"></div>
        
        {/* Medium gradient orbs */}
        <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-bounce delay-700"></div>
        <div className="absolute bottom-1/3 right-1/3 w-32 h-32 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-bounce delay-1200"></div>
        
        {/* Floating white glowing dots */}
        {[...Array(30)].map((_, index) => (
          <div
            key={index}
            className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              filter: 'blur(0.5px)',
            }}
          />
        ))}
        
        {/* Larger glowing particles */}
        {[...Array(15)].map((_, index) => (
          <div
            key={`large-${index}`}
            className="absolute w-3 h-3 bg-emerald-300 rounded-full opacity-20 animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
        
        {/* Chemistry-themed floating elements */}
        {[...Array(8)].map((_, index) => (
          <div
            key={`molecule-${index}`}
            className="absolute text-white opacity-10 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${12 + Math.random() * 8}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          >
            {['⚛️', '🧪', '⚗️', '🔬', '💎', '🧬'][Math.floor(Math.random() * 6)]}
          </div>
        ))}
        
        {/* Molecular structure lines */}
        <svg className="absolute inset-0 w-full h-full opacity-5">
          {[...Array(10)].map((_, index) => (
            <line
              key={index}
              x1={`${Math.random() * 100}%`}
              y1={`${Math.random() * 100}%`}
              x2={`${Math.random() * 100}%`}
              y2={`${Math.random() * 100}%`}
              stroke="white"
              strokeWidth="1"
              className="animate-pulse"
              style={{ animationDelay: `${index * 0.5}s` }}
            />
          ))}
        </svg>
      </div>

      {/* Enhanced CSS for custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(90deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
          75% { transform: translateY(-10px) rotate(270deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes shimmer {
          0% { opacity: 0.3; }
          50% { opacity: 0.8; }
          100% { opacity: 0.3; }
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>

      {/* Page content with ErrorBoundaries */}
      <ErrorBoundary>
        <Navbar />
      </ErrorBoundary>
      <ErrorBoundary>
        <Hero />
      </ErrorBoundary>
      <ErrorBoundary>
        <About />
      </ErrorBoundary>
      <ErrorBoundary>
        <Experience />
      </ErrorBoundary>
      <ErrorBoundary>
        <Contact />
      </ErrorBoundary>
    </div>
  );
};

// Simple ErrorBoundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h2 className="font-bold">Something went wrong.</h2>
          <p>Please refresh the page or try again later.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Enhanced About component with chemistry themes
const About = () => {
  // Mock CV data for demonstration
  const cvData = {
    about: "Pioneering research scientist specializing in advanced chemical analysis and molecular engineering. Dedicated to pushing the boundaries of scientific knowledge through rigorous experimentation and innovative methodologies.",
    skills: ["Quantum Chemistry", "Molecular Dynamics", "Spectroscopy", "Crystallography", "Biochemical Analysis", "Materials Science", "Computational Chemistry", "Laboratory Management"]
  };

  return (
    <section id="about" className="relative w-full py-20 mx-auto bg-gray-900/40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-emerald-400 text-3xl animate-shimmer">⚛️</div>
            <h2 className="text-emerald-400 text-4xl font-bold">Research Methodology</h2>
            <div className="text-emerald-400 text-3xl animate-shimmer">🧪</div>
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-gray-900/70 p-8 rounded-2xl backdrop-blur-sm border border-emerald-400/20 hover:border-emerald-400/50 transition-all duration-500 hover:shadow-lg hover:shadow-emerald-400/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-emerald-400 text-2xl">🔬</div>
              <h3 className="text-white text-2xl font-bold">Scientific Approach</h3>
            </div>
            <p className="text-gray-300 mb-4">
              {cvData?.about}
            </p>
            <div className="flex items-center mt-6">
              <div className="w-16 h-16 rounded-full bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center mr-4">
                <span className="text-emerald-400 text-2xl">🧬</span>
              </div>
              <div>
                <p className="text-white font-medium">Available for research collaborations</p>
                <p className="text-teal-400 text-sm">Peer-reviewed projects only</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/70 p-8 rounded-2xl backdrop-blur-sm border border-teal-400/20 hover:border-teal-400/50 transition-all duration-500 hover:shadow-lg hover:shadow-teal-400/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-teal-400 text-2xl">⚗️</div>
              <h3 className="text-white text-2xl font-bold">Research Domains</h3>
            </div>
            <div className="space-y-6">
              {cvData?.skills?.slice(0, 4).map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-white">{skill}</span>
                    <span className="text-emerald-400">{90 - (index * 5)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-400 to-teal-400 h-2 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${90 - (index * 5)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {cvData?.skills?.length > 4 && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-emerald-400 text-lg">💎</div>
                  <h4 className="text-white text-lg font-semibold">Additional Expertise</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cvData.skills.slice(4).map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-emerald-400/10 text-emerald-400 rounded-full text-sm border border-emerald-400/30 hover:bg-emerald-400/20 transition-all duration-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// Enhanced Experience component
const Experience = () => {
  const cvData = {
    experience: [
      {
        title: "Senior Research Scientist",
        company: "Advanced Materials Laboratory",
        startDate: "2020",
        endDate: "Present",
        extra: [
          "Leading breakthrough research in quantum materials synthesis",
          "Published 15+ peer-reviewed papers in top-tier journals",
          "Secured $2.5M in research funding from NSF and DOE"
        ]
      },
      {
        title: "Research Associate",
        company: "Chemical Innovation Institute",
        startDate: "2018",
        endDate: "2020",
        extra: [
          "Developed novel catalytic processes for green chemistry",
          "Collaborated with international research teams",
          "Mentored 8 graduate students and postdocs"
        ]
      }
    ],
    education: [
      {
        degree: "Ph.D. in Physical Chemistry",
        institution: "Stanford University",
        field: "Quantum Dynamics and Spectroscopy",
        endDate: "2018",
        gpa: "3.9/4.0"
      },
      {
        degree: "M.S. in Chemistry",
        institution: "MIT",
        field: "Materials Science",
        endDate: "2014",
        gpa: "3.8/4.0"
      }
    ]
  };

  return (
    <section id="experience" className="relative w-full py-20 mx-auto bg-gray-900/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-teal-400 text-3xl animate-shimmer">🏆</div>
            <h2 className="text-teal-400 text-4xl font-bold">Research Career</h2>
            <div className="text-teal-400 text-3xl animate-shimmer">📊</div>
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-teal-400 to-emerald-400 mx-auto" />
        </div>

        <div className="space-y-8">
          {cvData?.experience?.map((exp, index) => (
            <div 
              key={index}
              className="bg-gray-900/70 p-8 rounded-2xl backdrop-blur-sm border border-emerald-400/20 hover:border-teal-400/50 transition-all duration-500 hover:shadow-lg hover:shadow-emerald-400/10 hover:transform hover:scale-[1.02]"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-emerald-400 text-xl">🔬</div>
                  <h3 className="text-white text-2xl font-bold">{exp.title}</h3>
                </div>
                <span className="text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full text-sm border border-emerald-400/30">
                  {exp.startDate} - {exp.endDate}
                </span>
              </div>
              <h4 className="text-teal-400 text-lg mb-4">{exp.company}</h4>
              {exp.extra?.length > 0 && (
                <ul className="text-gray-300 space-y-2 pl-5 list-disc">
                  {exp.extra.map((bullet, i) => (
                    <li key={i}>{bullet.replace('• ', '')}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {cvData?.education?.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="text-emerald-400 text-3xl animate-shimmer">🎓</div>
                <h2 className="text-emerald-400 text-4xl font-bold">Academic Credentials</h2>
                <div className="text-emerald-400 text-3xl animate-shimmer">📚</div>
              </div>
              <div className="w-20 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 mx-auto" />
            </div>

            <div className="space-y-8">
              {cvData.education.map((edu, index) => (
                <div 
                  key={index}
                  className="bg-gray-900/70 p-8 rounded-2xl backdrop-blur-sm border border-teal-400/20 hover:border-emerald-400/50 transition-all duration-500 hover:shadow-lg hover:shadow-teal-400/10"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-teal-400 text-xl">🏛️</div>
                      <h3 className="text-white text-2xl font-bold">{edu.degree}</h3>
                    </div>
                    <span className="text-teal-400 bg-teal-400/10 px-3 py-1 rounded-full text-sm border border-teal-400/30">
                      {edu.endDate}
                    </span>
                  </div>
                  <h4 className="text-emerald-400 text-lg mb-2">{edu.institution}</h4>
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

// Enhanced Hero component with 3D chemistry model
const Hero = () => {
  const name = "Dr. Sarah Chen";
  const description = "Leading research scientist pioneering innovative solutions through rigorous experimentation and data-driven analysis in quantum chemistry and materials science.";

  return (
    <section className="relative w-full h-screen mx-auto bg-gradient-to-br from-gray-900 via-emerald-900/30 to-teal-900/20 flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center justify-between h-full">
        <div className="flex-1 max-w-2xl space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-emerald-400 text-4xl animate-shimmer">⚛️</div>
            <h1 className="text-white font-black text-5xl sm:text-6xl lg:text-7xl">
              <span className="text-emerald-400">{name || "Dr. Researcher"}</span>
            </h1>
            <div className="text-emerald-400 text-4xl animate-shimmer">🧪</div>
          </div>
          <p className="text-gray-300 text-lg sm:text-xl max-w-lg">
            {description || "Leading research scientist pioneering innovative solutions through rigorous experimentation and data-driven analysis."}
          </p>
          <button 
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-400/50"
          >
            <div className="flex items-center gap-2">
              <span>View Research Portfolio</span>
              <span className="text-lg">🔬</span>
            </div>
          </button>
        </div>

        <div className="flex-1 w-full h-full max-w-2xl relative">
          {/* 3D Chemistry Flask positioned in hero */}
          <div className="absolute top-1/4 right-1/4 w-32 h-32 z-10">
            <ChemistryFlask scale={[0.8, 0.8, 0.8]} />
          </div>
          
          {/* Placeholder for main 3D model */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-emerald-400/30">
              <div className="text-6xl text-emerald-400 animate-pulse">🏗️</div>
              <p className="text-white/70 text-sm absolute bottom-4">3D LabPro Model</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Enhanced Contact component
const Contact = () => {
  const email = "sarah.chen@researchlab.edu";

  return (
    <section id="contact" className="relative w-full py-20 mx-auto bg-gray-900/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-emerald-400 text-3xl animate-shimmer">🤝</div>
            <h2 className="text-emerald-400 text-4xl font-bold">Research Collaboration</h2>
            <div className="text-emerald-400 text-3xl animate-shimmer">📧</div>
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-gray-900/70 p-8 rounded-2xl backdrop-blur-sm border border-emerald-400/20 hover:border-emerald-400/50 transition-all duration-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-emerald-400 text-2xl">📞</div>
              <h3 className="text-white text-2xl font-bold">Contact Information</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Interested in collaborative research or academic partnerships? Reach out to discuss potential projects and scientific inquiries.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-400/10 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Professional Email</p>
                  <p className="text-white">{email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/70 p-8 rounded-2xl backdrop-blur-sm border border-teal-400/20 hover:border-teal-400/50 transition-all duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-teal-400 text-2xl">✍️</div>
              <h3 className="text-white text-2xl font-bold">Send Message</h3>
            </div>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="text-white block mb-2">Full Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full bg-gray-800 border border-emerald-400/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-300"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-white block mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="w-full bg-gray-800 border border-teal-400/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300"
                />
              </div>
              <div>
                <label htmlFor="message" className="text-white block mb-2">Research Inquiry</label>
                <textarea
                  id="message"
                  rows="5"
                  className="w-full bg-gray-800 border border-emerald-400/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-gray-900 font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-400/50"
              >
                <div className="flex items-center gap-2">
                  <span>Submit Inquiry</span>
                  <span className="text-lg">🚀</span>
                </div>
              </button>
            </form>
          </div>
        </div>

        {/* Download Portfolio Section with Chemistry Flask */}
        <div className="mt-16 text-center">
          <div className="bg-gray-900/70 p-8 rounded-2xl backdrop-blur-sm border border-teal-400/20 max-w-2xl mx-auto relative hover:border-teal-400/50 transition-all duration-500">
            {/* Chemistry Flask positioned in download section */}
            <div className="absolute -top-8 -right-8 w-24 h-24 z-10">
              <ChemistryFlask scale={[0.6, 0.6, 0.6]} />
            </div>
            
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="text-teal-400 text-2xl">📄</div>
              <h3 className="text-white text-2xl font-bold">Download Research Portfolio</h3>
              <div className="text-teal-400 text-2xl">💾</div>
            </div>
            <p className="text-gray-300 mb-6">
              Obtain a complete copy of my research portfolio as a standalone application for academic review and collaboration.
            </p>
            <button 
              className="px-8 py-3 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-gray-900 font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-teal-400/50"
            >
              <div className="flex items-center gap-2">
                <span>Download Portfolio</span>
                <span className="text-lg">⬇️</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Enhanced Navbar component
const Navbar = () => {
  const [active, setActive] = React.useState("");
  const name = "Dr. Sarah Chen";
  
  return (
    <nav className="w-full flex items-center py-5 fixed top-0 z-20 bg-gray-900/90 backdrop-blur-sm border-b border-emerald-400/30">
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="text-emerald-400 text-2xl animate-shimmer">⚛️</div>
          <p className="text-emerald-400 text-[20px] font-bold">
            {name}'s <span className="text-teal-400">Research Lab</span>
          </p>
          <div className="text-teal-400 text-2xl animate-shimmer">🧪</div>
        </div>

        <ul className="list-none hidden sm:flex flex-row gap-10">
          {["about", "experience", "contact"].map((item) => (
            <li
              key={item}
              className={`${
                active === item ? "text-emerald-400" : "text-white"
              } hover:text-teal-400 text-[18px] font-medium cursor-pointer transition-colors duration-300`}
            >
              <button
                onClick={() => {
                  setActive(item);
                  document.getElementById(item)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="block w-full h-full"
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default LabProPage;