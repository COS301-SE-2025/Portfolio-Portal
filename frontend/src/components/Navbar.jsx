import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLocation, Link } from 'react-router-dom';
import { User, Home, Upload, Info, FileText, Settings, Menu, X } from 'lucide-react';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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
    // Close mobile menu after navigation
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Mobile Burger Menu Button
  const BurgerButton = () => (
    <button
      onClick={toggleMobileMenu}
      className={`fixed top-4 left-4 z-50 p-3 rounded-lg transition-all ${
        isDark 
          ? 'bg-black/20 backdrop-blur-sm border border-gray-700/30 text-white hover:bg-gray-700/50' 
          : 'bg-white/20 backdrop-blur-sm border border-gray-400/60 text-gray-800 hover:bg-gray-100/50'
      }`}
    >
      {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
    </button>
  );

  // Mobile Menu Overlay
  const MobileMenu = () => (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      
      {/* Mobile Menu */}
      <div className={`fixed top-0 left-0 h-screen w-64 z-50 backdrop-blur-sm border-r transition-transform duration-300 ${
        isDark 
          ? 'bg-black/90 border-gray-700/30' 
          : 'bg-white/90 border-gray-400/60'
      } ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-6 pt-20">
          {/* Profile Section */}
          <div className="mb-8 flex items-center space-x-4">
            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
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
            <span className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Profile
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = activeSection === link.sectionId && location.pathname === '/';
                
                return (
                  <li key={link.sectionId}>
                    <button
                      onClick={() => handleScrollToSection(link.sectionId)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                        isActive
                          ? isDark
                            ? 'bg-purple-900/80 text-purple-300'
                            : 'bg-purple-100/80 text-purple-600'
                          : isDark
                            ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                            : 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{link.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );

  // Desktop Sidebar (original design)
  const DesktopSidebar = () => (
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

  return (
    <>
      {isMobile ? (
        <>
          <BurgerButton />
          <MobileMenu />
        </>
      ) : (
        <DesktopSidebar />
      )}
    </>
  );
};

export default Navbar;