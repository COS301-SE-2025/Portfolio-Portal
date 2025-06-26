import { motion } from "framer-motion";
import { fadeIn } from "../../../utils/motion";
import { userName, jobTitle } from "./index";

const Hero = () => {
  return (
    <section className="relative w-full h-screen mx-auto bg-gradient-to-br from-gray-900 via-blue-900/10 to-gray-900">
      <div className="absolute inset-0 top-[120px] max-w-7xl mx-auto px-6 flex flex-row items-start gap-5">
        <div className="flex flex-col justify-center items-center mt-5">
          <div className="w-5 h-5 rounded-full bg-blue-400" />
          <div className="w-1 sm:h-80 h-40 blue-gradient" />
        </div>

        <div>
          <motion.h1
            variants={fadeIn("up", "spring", 0.5, 1)}
            initial="hidden"
            animate="show"
            className="text-white font-black text-5xl sm:text-6xl lg:text-7xl"
          >
            Hi, I'm <span className="text-blue-400">{userName}</span>
          </motion.h1>
          <motion.p
            variants={fadeIn("up", "spring", 0.7, 1)}
            initial="hidden"
            animate="show"
            className="text-gray-300 mt-4 text-lg sm:text-xl max-w-3xl"
          >
            Professional {jobTitle} creating digital solutions with precision and efficiency.
          </motion.p>
          <motion.div
            variants={fadeIn("up", "spring", 0.9, 1)}
            initial="hidden"
            animate="show"
            className="mt-8"
          >
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-gray-700 hover:from-blue-700 hover:to-gray-800 text-white font-medium rounded transition-all duration-300 transform hover:scale-105">
              View My Work
            </button>
          </motion.div>
        </div>
      </div>

      <div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center">
        <a href="#about">
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-blue-400 flex justify-center items-start p-2">
            <motion.div
              animate={{ y: [0, 24, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-3 h-3 rounded-full bg-blue-400 mb-1"
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;