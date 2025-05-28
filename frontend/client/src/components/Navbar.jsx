import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigateAndScroll = (path, sectionId) => {
    // If already on the target page, just scroll
    if (location.pathname === path) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    // Navigate to the new page and scroll after a delay
    navigate(path);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Fallback: retry after a longer delay if element not found
        setTimeout(() => {
          const fallbackElement = document.getElementById(sectionId);
          if (fallbackElement) {
            fallbackElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 500);
      }
    }, 300); // Increased delay to ensure DOM updates
  };

  return (
    <nav className="w-full px-8 py-6">
      <div className="max-w-7xl mx-auto flex justify-center">
        <ul className="flex space-x-12 text-white font-medium text-lg">
          <li>
            <a 
              onClick={() => handleNavigateAndScroll('/home', 'home-container')}
              className="hover:text-gray-300 transition-colors duration-200 cursor-pointer"
            >
              Home
            </a>
          </li>
          <li>
            <a 
              onClick={() => handleNavigateAndScroll('/upload', 'upload-section')}
              className="hover:text-gray-300 transition-colors duration-200 cursor-pointer"
            >
              Upload
            </a>
          </li>
          <li>
            <a 
              onClick={() => handleNavigateAndScroll('/templates', 'templates')}
              className="hover:text-gray-300 transition-colors duration-200 cursor-pointer"
            >
              Templates
            </a>
          </li>
          <li>
            <a 
              onClick={() => handleNavigateAndScroll('/about', 'about')}
              className="hover:text-gray-300 transition-colors duration-200 cursor-pointer"
            >
              About
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;