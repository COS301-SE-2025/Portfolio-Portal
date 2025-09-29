import React from "react";
import Hero from "./Hero";
import About from "./About";
import Experience from "./Experience";
import Contact from "./Contact";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800">
      <style>{`
        .green-gradient {
          background: linear-gradient(180deg, #064e3b 0%, #10b981 50%, #059669 100%);
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