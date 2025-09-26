import React from "react";
import { motion } from "framer-motion";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a2e]/90 backdrop-blur-sm border-b border-emerald-400/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-emerald-400 text-xl font-bold"
          >
            Portfolio
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden md:flex space-x-8"
          >
            <a href="#about" className="text-white hover:text-emerald-400 transition-colors">
              About
            </a>
            <a href="#experience" className="text-white hover:text-emerald-400 transition-colors">
              Experience
            </a>
            <a href="#contact" className="text-white hover:text-emerald-400 transition-colors">
              Contact
            </a>
          </motion.div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
