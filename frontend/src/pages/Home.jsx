//frontend/src/pages/Home.jsx
import { useState, useEffect, useRef } from "react";
import ThemeToggleButton from "../components/ThemeToggleButton";
import HeroSection from "../components/sections/HeroSection";
import HowItWorksSection from "../components/sections/HowItWorksSection";
import UploadSection from "../components/sections/UploadSection";
import TemplatesSection from "../components/sections/TemplatesSection";
import AboutSection from "../components/sections/AboutSection";
import HelpMenu from "../components/HelpMenu";
import { useTheme } from "../contexts/ThemeContext";

const Home = () => {
  const [showHero, setShowHero] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const heroRef = useRef(null);
  const howItWorksRef = useRef(null);
  const uploadRef = useRef(null);
  const templatesRef = useRef(null);
  const aboutRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.id === "hero") setShowHero(true);
          if (entry.target.id === "how-it-works") setShowHowItWorks(true);
          if (entry.target.id === "upload-section") setShowUpload(true);
          if (entry.target.id === "templates-section") setShowTemplates(true);
          if (entry.target.id === "about-section") setShowAbout(true);
        }
      });
    }, observerOptions);

    if (heroRef.current) observer.observe(heroRef.current);
    if (howItWorksRef.current) observer.observe(howItWorksRef.current);
    if (uploadRef.current) observer.observe(uploadRef.current);
    if (templatesRef.current) observer.observe(templatesRef.current);
    if (aboutRef.current) observer.observe(aboutRef.current);

    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
      if (howItWorksRef.current) observer.unobserve(howItWorksRef.current);
      if (uploadRef.current) observer.unobserve(uploadRef.current);
      if (templatesRef.current) observer.unobserve(templatesRef.current);
      if (aboutRef.current) observer.unobserve(aboutRef.current);
    };
  }, []);

  const handleScrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        isDark
          ? 'bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white'
          : 'bg-gradient-to-br from-gray-100 via-white to-gray-100 text-gray-900'
      }`}
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/4 left-1/4 w-32 h-32 rounded-full blur-3xl animate-pulse opacity-70 ${
            isDark
              ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/5'
              : 'bg-gradient-to-r from-purple-300/20 to-blue-300/10'
          }`}
        ></div>
        <div
          className={`absolute bottom-1/3 right-1/4 w-40 h-40 rounded-full blur-3xl animate-pulse delay-1000 opacity-60 ${
            isDark
              ? 'bg-gradient-to-r from-pink-500/8 to-purple-500/8'
              : 'bg-gradient-to-r from-pink-300/15 to-purple-300/15'
          }`}
        ></div>
        <div
          className={`absolute top-1/2 right-1/3 w-24 h-24 rounded-full blur-3xl animate-pulse delay-2000 opacity-50 ${
            isDark
              ? 'bg-gradient-to-r from-cyan-500/6 to-blue-500/6'
              : 'bg-gradient-to-r from-cyan-300/10 to-blue-300/10'
          }`}
        ></div>
      </div>

      {/* Starfield Background */}
      <div className="fixed inset-0 -z-10">
        <div
          className={`absolute inset-0 bg-gradient-to-b ${
            isDark ? 'from-gray-900 via-blue-900/20 to-black' : 'from-gray-200 via-blue-100/20 to-gray-100'
          }`}
        ></div>
        {[...Array(200)].map((_, i) => (
          <div
            key={`star-${i}`}
            className={`absolute w-px h-px rounded-full ${
              isDark ? 'bg-white' : 'bg-gray-400'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
              animation: `twinkle ${2 + Math.random() * 3}s infinite`,
            }}
          />
        ))}
        {[...Array(3)].map((_, i) => (
          <div
            key={`shooting-${i}`}
            className={`absolute w-px h-px rounded-full ${
              isDark ? 'bg-white' : 'bg-gray-400'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 30}%`,
              animation: `shootingStar ${3 + Math.random() * 4}s infinite`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Theme Toggle Button */}
      <div className="absolute top-4 right-4 flex items-center space-x-4 z-50">
        <div
          className={`rounded-full p-2 transition-all ${
            isDark
              ? 'bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20'
              : 'bg-gray-200/50 backdrop-blur-sm border border-gray-300/50 hover:bg-gray-300/50'
          }`}
        >
          <ThemeToggleButton />
        </div>
      </div>

      {/* Sections */}
      <div className="relative z-10">
        <HeroSection
          id="hero"
          ref={heroRef}
          show={showHero}
          handleScrollToSection={handleScrollToSection}
          className={isDark ? 'text-white' : 'text-gray-900'}
        />
        <HowItWorksSection
          id="how-it-works"
          ref={howItWorksRef}
          show={showHowItWorks}
          handleScrollToSection={handleScrollToSection}
          className={isDark ? 'text-white' : 'text-gray-900'}
        />
        <UploadSection
          id="upload-section"
          ref={uploadRef}
          show={showUpload}
          isDark={isDark}
          className={isDark ? 'text-white' : 'text-gray-900'}
        />
        <TemplatesSection
          id="templates-section"
          ref={templatesRef}
          show={showTemplates}
          isDark={isDark}
          className={isDark ? 'text-white' : 'text-gray-900'}
        />
        <AboutSection
          id="about-section"
          ref={aboutRef}
          show={showAbout}
          className={isDark ? 'text-white' : 'text-gray-900'}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none z-5">
        {[...Array(25)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className={`absolute w-1 h-1 rounded-full ${
              isDark
                ? 'bg-gradient-to-r from-blue-400 to-purple-400'
                : 'bg-gradient-to-r from-blue-600 to-purple-600'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.6 + Math.random() * 0.4,
            }}
          />
        ))}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes shootingStar {
          0% {
            transform: translateX(-100px) translateY(100px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(100vw) translateY(-100px);
            opacity: 0;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-10px) translateX(-15px);
            opacity: 1;
          }
          75% {
            transform: translateY(-25px) translateX(5px);
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
