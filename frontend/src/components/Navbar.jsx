import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLocation, Link } from 'react-router-dom';
import { User, Home, Upload, Info, FileText, Settings } from 'lucide-react';

const navLinks = [
  { sectionId: 'hero', label: 'Home', icon: Home },
  { sectionId: 'how-it-works', label: 'How It Works', icon: Info },
  { sectionId: 'upload-section', label: 'Upload', icon: Upload },
  { sectionId: 'templates-section', label: 'Templates', icon: FileText },
  { sectionId: 'about-section', label: 'About', icon: Settings },
];

const Navbar = () => {
  const { isDark } = useTheme();
  const [activeSection, setActiveSection] = useState('hero');
  const [profileImage, setProfileImage] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const imageUrl = localStorage.getItem('imageURL');
    if (imageUrl) {
      setProfileImage(imageUrl);
    }
  }, []);

  useEffect(() => {
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

      navLinks.forEach((link) => {
        const element = document.getElementById(link.sectionId);
        if (element) observer.observe(element);
      });

      return () => {
        navLinks.forEach((link) => {
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
    <aside
      className={`fixed top-0 left-0 h-screen w-20 z-50 backdrop-blur-sm border-r ${
        isDark 
          ? 'bg-black/10 border-gray-700/30' 
          : 'bg-white/10 border-gray-400/60'
      }`}
    >
      <div className="flex flex-col h-full p-3">
        {/* Profile Icon */}
        <div className="mb-6 p-2 flex justify-center">
          <Link to="/profile">
            <div className="relative">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                  onError={() => setProfileImage(null)}
                />
              ) : (
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isDark 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                    : 'bg-gradient-to-br from-blue-400 to-purple-500'
                }`}>
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* Navigation Icons */}
        <nav className="flex-1">
          <ul className="space-y-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeSection === link.sectionId && location.pathname === '/';
              
              return (
                <li key={link.sectionId} className="flex justify-center">
                  <button
                    onClick={() => handleScrollToSection(link.sectionId)}
                    className={`p-3 rounded-lg transition-all relative ${
                      isActive
                        ? isDark
                          ? 'bg-purple-900/80 text-purple-300 shadow-[0_0_15px_rgba(192,132,252,0.6)]'
                          : 'bg-purple-100/80 text-purple-600 shadow-[0_0_15px_rgba(126,34,206,0.4)]'
                        : isDark
                          ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                          : 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-900'
                    }`}
                    title={link.label}
                  >
                    <Icon className="w-6 h-6" />
                    {isActive && (
                      <>
                        <span className={`absolute inset-0 rounded-lg border-2 ${
                          isDark ? 'border-purple-400' : 'border-purple-500'
                        } animate-ping opacity-75`}></span>
                        <span className={`absolute inset-0 rounded-lg border-2 ${
                          isDark ? 'border-purple-300' : 'border-purple-400'
                        }`}></span>
                      </>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Navbar;