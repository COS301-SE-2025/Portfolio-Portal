import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Contact from './components/Contact';
import './App.css';

function App() {
  return (
    <div className="forest-app">
      {/* Background Elements */}
      <div className="forest-background">
        <div className="trees"></div>
        <div className="leaves"></div>
        <div className="fog"></div>
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <About />

      {/* Experience Section */}
      <Experience />

      {/* Contact Section */}
      <Contact />

      {/* Footer */}
      <footer className="forest-footer">
        <div className="footer-content">
          <p>&copy; 2024 Alex. Growing naturally with purpose.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;