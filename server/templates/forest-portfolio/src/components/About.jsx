import { motion } from "framer-motion";
import { fadeIn } from "../utils/motion";
import portfolioData from '../data/portfolioData.js';

const About = () => {

  return (
    <section id="about" className="relative w-full py-20 mx-auto">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={fadeIn("right", "spring", 0.5, 1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row gap-10"
        >
          <div className="flex-1 bg-[#0e0e2c]/70 p-8 rounded-2xl backdrop-blur-sm border border-green-400/20">
            <h3 className="text-green-400 text-2xl font-bold mb-4">About Me</h3>
            <p className="text-white text-lg mb-4">
              {portfolioData.header.summary ||
                "I bridge technology and ecology to create digital experiences that inspire action."}
            </p>
          </div>

          <div className="flex-1 flex flex-wrap gap-10 justify-center">
            {portfolioData.skills?.map((skill, index) => (
              <div
                key={`skill-${index}`}
                className="w-full lg:w-[45%] bg-[#0e0e2c]/70 p-6 rounded-2xl backdrop-blur-sm border border-green-400/20"
              >
                <h4 className="text-white font-bold text-xl mb-2">{skill}</h4>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-green-400 h-2.5 rounded-full"
                    style={{ width: `${Math.floor(Math.random() * 50) + 50}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;