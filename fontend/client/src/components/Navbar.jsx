import React from 'react';

const Navbar = () => {
  return (
    <nav className="w-full px-8 py-6">
      <div className="max-w-7xl mx-auto flex justify-center">
        <ul className="flex space-x-12 text-white font-medium text-lg">
          <li>
            <a 
              href="#home" 
              className="hover:text-gray-300 transition-colors duration-200 cursor-pointer"
            >
              Home
            </a>
          </li>
          <li>
            <a 
              href="#upload" 
              className="hover:text-gray-300 transition-colors duration-200 cursor-pointer"
            >
              Upload
            </a>
          </li>
          <li>
            <a 
              href="#templates" 
              className="hover:text-gray-300 transition-colors duration-200 cursor-pointer"
            >
              Templates
            </a>
          </li>
          <li>
            <a 
              href="#about" 
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