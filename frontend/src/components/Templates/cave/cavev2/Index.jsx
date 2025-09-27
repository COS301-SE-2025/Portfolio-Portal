//frontend/src/components/Templates/cave/cavev2/index.jsx
import React from "react";
import Hero from "./Hero";
import About from "./About";
import Navbar from "./Navbar";
import Experience from "./Experience";
import Contact from "./Contact";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-yellow-950 via-stone-800 to-stone-900">
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Contact />
    </div>
  );
};

export default Index;