import { useState } from "react";
import portfolioData from '../data/portfolioData.js';

const Navbar = () => {
  const [active, setActive] = useState("");
  const { header } = portfolioData;

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setActive(sectionId);
  };

  return (
    <nav className="w-full flex items-center py-5 fixed top-0 z-20 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto px-4">
        <button
          onClick={() => scrollToSection('hero')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <p className="text-purple-400 text-[18px] font-bold">
            {header.name}'s <span className="text-white">Portfolio</span>
          </p>
        </button>

        <ul className="list-none hidden sm:flex flex-row gap-10">
          {["about", "experience", "contact"].map((item) => (
            <li
              key={item}
              className={`${
                active === item ? "text-purple-400" : "text-white"
              } hover:text-purple-300 text-[18px] font-medium cursor-pointer transition-colors duration-300`}
            >
              <button
                onClick={() => scrollToSection(item)}
                className="block w-full h-full"
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;




