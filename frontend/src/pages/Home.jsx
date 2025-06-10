import { useState, useEffect, useRef } from 'react';
import ThemeToggleButton from '../components/ThemeToggleButton';
import HeroSection from '../components/sections/HeroSection';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import UploadSection from '../components/sections/UploadSection';
import TemplatesSection from '../components/sections/TemplatesSection';
import AboutSection from '../components/sections/AboutSection';
import { useTheme } from '../contexts/ThemeContext';
import { authService } from '../services/auth.service';

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
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.id === 'hero') setShowHero(true);
          if (entry.target.id === 'how-it-works') setShowHowItWorks(true);
          if (entry.target.id === 'upload-section') setShowUpload(true);
          if (entry.target.id === 'templates-section') setShowTemplates(true);
          if (entry.target.id === 'about-section') setShowAbout(true);
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
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

    const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };


  return (
    <div className={`min-h-screen transition-all duration-300 ${isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      
      <div className="absolute top-4 right-4 flex items-center space-x-4">
        <ThemeToggleButton />
        <button 
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
      <HeroSection id="hero" ref={heroRef} show={showHero} handleScrollToSection={handleScrollToSection} />
      <HowItWorksSection id="how-it-works" ref={howItWorksRef} show={showHowItWorks} handleScrollToSection={handleScrollToSection} />
      <UploadSection id="upload-section" ref={uploadRef} show={showUpload} isDark={isDark} />
      <TemplatesSection id="templates-section" ref={templatesRef} show={showTemplates} isDark={isDark} />
      <AboutSection id="about-section" ref={aboutRef} show={showAbout} />
    </div>
  );
};

export default Home;