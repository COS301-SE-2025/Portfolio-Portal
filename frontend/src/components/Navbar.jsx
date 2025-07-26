// frontend/src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLocation } from 'react-router-dom';

const navLinks = [
  { sectionId: 'hero', label: 'Home', isRoute: false },
  { sectionId: 'how-it-works', label: 'How It Works', isRoute: false },
  { sectionId: 'upload-section', label: 'Upload', isRoute: false },
  { sectionId: 'templates-section', label: 'Templates', isRoute: false },
  { sectionId: 'about-section', label: 'About', isRoute: false },
  { sectionId: 'profile-section', label: 'Profile', isRoute: false },
];

const Navbar = () => {
  const { isDark } = useTheme();
  const [activeSection, setActiveSection] = useState('hero');
  const location = useLocation();

  useEffect(() => {
    // Only handle section scrolling for non-route links on the main page
    if (location.pathname === '/') {
      const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0,
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      }, observerOptions);

      navLinks
        .filter((link) => !link.isRoute)
        .forEach((link) => {
          const element = document.getElementById(link.sectionId);
          if (element) observer.observe(element);
        });

      return () => {
        navLinks
          .filter((link) => !link.isRoute)
          .forEach((link) => {
            const element = document.getElementById(link.sectionId);
            if (element) observer.unobserve(element);
          });
      };
    }
  }, [location.pathname]);

  const handleScrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  return (
    <nav className={`w-full px-8 py-6 fixed top-0 z-50 ${isDark ? 'bg-slate-900/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto flex justify-center">
        <ul className="flex space-x-12 font-medium text-lg">
          {navLinks.map((link) => (
            <li key={link.sectionId}>
              <button
                onClick={() => handleScrollToSection(link.sectionId)}
                className={`transition-colors duration-200 ${
                  activeSection === link.sectionId && location.pathname === '/'
                    ? isDark
                      ? 'text-purple-300'
                      : 'text-purple-600'
                    : isDark
                      ? 'text-white hover:text-purple-300'
                      : 'text-slate-900 hover:text-purple-600'
                }`}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;