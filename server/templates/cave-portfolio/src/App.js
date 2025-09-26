import React from "react";
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Contact from './components/Contact';
import './App.css';

function App() {
  return (
    <div className="relative z-0 bg-[#0a0a2e] text-white">
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <About />
        <Experience />
        <Contact />
      </div>
    </div>
  );
}

export default App;
