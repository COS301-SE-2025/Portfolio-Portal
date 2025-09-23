import { motion } from "framer-motion";
import { fadeIn } from "../utils/motion";
import portfolioData from '../data/portfolioData.js';

const Experience = () => {
  const { experience, education } = portfolioData;

  return (
    <section id="experience" className="relative w-full py-20 mx-auto">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={fadeIn("left", "spring", 0.5, 1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <h2 className="text-green-400 text-4xl font-bold mb-10">
            Professional Experience
          </h2>

          <div className="flex flex-col gap-8">
            {experience?.map((exp, index) => (
              <div
                key={`exp-${index}`}
                className="bg-[#0e0e2c]/70 p-6 rounded-2xl backdrop-blur-sm border border-green-400/20"
              >
                <h3 className="text-white text-2xl font-bold">{exp.position}</h3>
                <p className="text-green-400 text-lg">{exp.company}</p>
                <p className="text-gray-400 mb-4">{exp.duration}</p>
                <p className="text-white">{exp.description}</p>
              </div>
            ))}
          </div>

          <h2 className="text-green-400 text-4xl font-bold mt-20 mb-10">
            Education
          </h2>

          <div className="flex flex-col gap-8">
            {education?.map((edu, index) => (
              <div
                key={`edu-${index}`}
                className="bg-[#0e0e2c]/70 p-6 rounded-2xl backdrop-blur-sm border border-green-400/20"
              >
                <h3 className="text-white text-2xl font-bold">{edu.degree}</h3>
                <p className="text-green-400 text-lg">{edu.institution}</p>
                <p className="text-gray-400 mb-4">{edu.year}</p>
                {edu.field && <p className="text-white">{edu.field}</p>}
                {edu.gpa && <p className="text-white">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;