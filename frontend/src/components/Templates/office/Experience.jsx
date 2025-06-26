import { motion } from "framer-motion";
import { fadeIn } from "../../../utils/motion";
import useCvData from "../../../hooks/useCVData";

const Experience = () => {
  const { cvData } = useCvData() || {};

  return (
    <section id="experience" className="relative w-full py-20 mx-auto">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={fadeIn("left", "spring", 0.5, 1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <h2 className="text-blue-400 text-4xl font-bold mb-10">
            Professional Journey
          </h2>

          <div className="flex flex-col gap-8">
            {cvData?.experience?.map((exp, index) => (
              <motion.div
                key={index}
                variants={fadeIn("up", "spring", index * 0.2, 1)}
                className="bg-gray-900/70 p-6 rounded-2xl backdrop-blur-sm border border-blue-400/20"
              >
                <h3 className="text-white text-2xl font-bold">{exp.title}</h3>
                <p className="text-blue-400 text-lg">{exp.company}</p>
                <p className="text-gray-400 mb-4">{`${exp.startDate} - ${exp.endDate}`}</p>
                <ul className="text-white list-disc pl-5 space-y-1">
                  {exp.extra?.map((bullet, i) => (
                    <li key={i}>{bullet.replace('¢ ', '')}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;