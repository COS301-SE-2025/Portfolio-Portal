import React from "react";
import Hero from "./Hero";
import About from "./About";
import Experience from "./Experience";
import Contact from "./Contact";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
      {/* Custom CSS for purple gradient */}
      <style jsx>{`
        .purple-gradient {
          background: linear-gradient(180deg, #8b5cf6 0%, #6366f1 100%);
        }
      `}</style>
      
      <Hero />
      <About />
      <Experience />
      <Contact />
    </div>
  );
};

export default Index;