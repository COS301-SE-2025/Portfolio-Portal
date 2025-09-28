// //frontend/src/components/Templates/forest/Hero.jsx
import { motion } from "framer-motion";
import { fadeIn } from "../../../utils/motion";
import useCVData from "../../../hooks/useCVData";

const Hero = () => {
  const { name, description, summary, about, _raw } = useCVData();

  // Extract just professional tagline from raw OCR data
  const getProfessionalTagline = () => {
    // 1st, try find a tagline pattern in the raw OCR text
    if (_raw && typeof _raw === 'string') {
      // Look for patterns like "Art Director | Environmental enthusiast"
      const taglineMatch = _raw.match(/^([^\.\n]+\|[^\.\n]+|[^\.\n]+–[^\.\n]+|[^\.\n]+\|[^\.\n]+)/);
      if (taglineMatch) return taglineMatch[0].trim();
    }
    
    // Fallback: use 1st line before "ABOUT ME" / similar sections
    if (description) {
      const lines = description.split('\n');
      for (let line of lines) {
        if (line && line.length > 10 && line.length < 100 && 
            !line.toLowerCase().includes('about') && 
            !line.toLowerCase().includes('experience') &&
            !line.toLowerCase().includes('education')) {
          return line.trim();
        }
      }
    }
    
    return "...";
  };

  const heroDescription = getProfessionalTagline();

  return (
    <section className="relative w-full h-screen mx-auto">
      <div className="absolute inset-0 top-[120px] max-w-7xl mx-auto px-6 flex flex-row items-start gap-5">
        <div className="flex flex-col justify-center items-center mt-5">
          <div className="w-5 h-5 rounded-full bg-green-400" />
          <div className="w-1 sm:h-80 h-40 green-gradient" />
        </div>

        <div>
          <motion.h1
            variants={fadeIn("up", "spring", 0.5, 1)}
            initial="hidden"
            animate="show"
            className="text-white font-black text-5xl sm:text-6xl lg:text-7xl"
          >
            Hi, I'm <span className="text-green-400">{name || " "}</span>
          </motion.h1>
          <motion.p
            variants={fadeIn("up", "spring", 0.7, 1)}
            initial="hidden"
            animate="show"
            className="text-green-200 mt-4 text-xl sm:text-2xl max-w-3xl font-medium"
          >
            {heroDescription}
          </motion.p>
        </div>
      </div>

      <div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center">
        <a href="#about">
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-green-400 flex justify-center items-start p-2">
            <motion.div
              animate={{ y: [0, 24, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-3 h-3 rounded-full bg-green-400 mb-1"
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;