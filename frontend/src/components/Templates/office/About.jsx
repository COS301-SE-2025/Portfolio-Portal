import { motion } from "framer-motion";
import { fadeIn } from "../../../utils/motion";
import useCvData from "../../../hooks/useCVData";

const About = () => {
  const { cvData } = useCvData() || {};

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
          <div className="flex-1 bg-gray-900/70 p-8 rounded-2xl backdrop-blur-sm border border-blue-400/20">
            <h3 className="text-blue-400 text-2xl font-bold mb-4">
              Professional Philosophy
            </h3>
            <p className="text-white text-lg mb-4">
              {cvData?.about || "I bridge technology and business needs to create efficient digital solutions. Every project I build focuses on performance, usability, and clean code."}
            </p>
            <p className="text-white text-lg">
              When I'm not coding, you'll find me exploring new technologies or mentoring junior developers.
            </p>
          </div>

          <div className="flex-1 flex flex-wrap gap-10 justify-center">
            {cvData?.skills?.slice(0, 4).map((skill, index) => (
              <motion.div
                key={index}
                variants={fadeIn("up", "spring", index * 0.2, 1)}
                className="w-full lg:w-[45%] bg-gray-900/70 p-6 rounded-2xl backdrop-blur-sm border border-blue-400/20"
              >
                <h4 className="text-white font-bold text-xl mb-2">
                  {skill}
                </h4>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-blue-400 h-2.5 rounded-full"
                    style={{ width: `${80 + (index * 5)}%` }}
                  ></div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;