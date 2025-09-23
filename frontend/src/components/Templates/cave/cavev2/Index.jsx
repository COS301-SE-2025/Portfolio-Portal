import React from "react";
import Hero from "./Hero";
import About from "./About";
import Experience from "./Experience";
import Contact from "./Contact";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800">
      {/* Custom CSS for green gradient */}
      <style jsx>{`
        .green-gradient {
          background: linear-gradient(180deg, #065f46 0%, #10b981 100%);
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