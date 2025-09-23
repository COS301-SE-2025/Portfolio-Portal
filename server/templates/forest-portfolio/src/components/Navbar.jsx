import { useState } from "react";
import portfolioData from '../data/portfolioData.js';

const Navbar = () => {
  const [active, setActive] = useState("");
  const { header } = portfolioData;
  const name = header.name;

  return (
    <nav className="w-full flex items-center py-5 fixed top-0 z-20 bg-[#0e0e2c]/80 backdrop-blur-sm">
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto px-4">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          <p className="text-green-400 text-[18px] font-bold">
            {name}'s <span className="text-white">Portfolio</span>
          </p>
        </div>

        <ul className="list-none hidden sm:flex flex-row gap-10">
          {["about", "experience", "contact"].map((item) => (
            <li
              key={item}
              className={`${
                active === item ? "text-green-400" : "text-white"
              } hover:text-green-300 text-[18px] font-medium cursor-pointer`}
              onClick={() => setActive(item)}
            >
              <a href={`#${item}`}>{item}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
