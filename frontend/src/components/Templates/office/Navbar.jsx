import { Link } from "react-scroll";
import { useState, useEffect } from "react";
import useCvData from '../../../hooks/useCVData' 

const Navbar = () => {
  const [active, setActive] = useState("");
  const { name } = useCvData() || {};
  return (
    <nav className="w-full flex items-center py-5 fixed top-0 z-20 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto px-4">
        <Link
          to="hero"
          smooth={true}
          duration={500}
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => {
            setActive("");
          }}
        >
          <p className="text-blue-400 text-[18px] font-bold">
            {name}'s <span className="text-white">Portfolio</span>
          </p>
        </Link>

        <ul className="list-none hidden sm:flex flex-row gap-10">
          {["about", "experience", "contact"].map((item) => (
            <li
              key={item}
              className={`${
                active === item ? "text-blue-400" : "text-white"
              } hover:text-blue-300 text-[18px] font-medium cursor-pointer transition-colors duration-300`}
            >
              <Link
                to={item}
                smooth={true}
                duration={500}
                spy={true}
                offset={-80}
                onSetActive={() => setActive(item)}
                className="block w-full h-full"
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;