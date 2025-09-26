import { motion } from "framer-motion";
import portfolioData from "../data/portfolioData";

// Simple fadeIn animation function
const fadeIn = (direction, type, delay, duration) => ({
  hidden: {
    x: direction === "left" ? -100 : direction === "right" ? 100 : 0,
    y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
    opacity: 0,
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      type: type,
      delay: delay,
      duration: duration,
      ease: "easeOut",
    },
  },
});

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
          <h2 className="text-emerald-400 text-4xl font-bold mb-10">
            Professional Journey
          </h2>

          <div className="flex flex-col gap-8">
            {experience?.map((exp, index) => (
              <div
                key={`exp-${index}`}
                className="bg-[#0a0a2e]/70 p-6 rounded-2xl backdrop-blur-sm border border-emerald-400/20"
              >
                <h3 className="text-white text-2xl font-bold">{exp.title}</h3>
                <p className="text-emerald-400 text-lg">{exp.company}</p>
                <p className="text-gray-400 mb-4">{`${exp.startDate} - ${exp.endDate}`}</p>
                <ul className="text-white list-disc pl-5">
                  {exp.extra?.map((bullet, bulletIndex) => (
                    <li key={`bullet-${index}-${bulletIndex}`}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h2 className="text-emerald-400 text-4xl font-bold mt-20 mb-10">
            Education
          </h2>

          <div className="flex flex-col gap-8">
            {education?.map((edu, index) => (
              <div
                key={`edu-${index}`}
                className="bg-[#0a0a2e]/70 p-6 rounded-2xl backdrop-blur-sm border border-emerald-400/20"
              >
                <h3 className="text-white text-2xl font-bold">{edu.degree}</h3>
                <p className="text-emerald-400 text-lg">{edu.institution}</p>
                <p className="text-gray-400 mb-4">{edu.endDate}</p>
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