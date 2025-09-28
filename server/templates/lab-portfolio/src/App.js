import React from 'react';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <div className="lab-app">
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
      <footer className="lab-footer">
        <div className="footer-content">
          <p>&copy; 2024 Portfolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;