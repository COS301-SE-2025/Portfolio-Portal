import { motion } from "framer-motion";
import { fadeIn } from "../../../../utils/motion";
import useCvData from "../../../../hooks/useCVData";

const About = () => {
  const { about, skills } = useCvData() || {};

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
          <div className="flex-1 bg-yellow-950/50 p-8 rounded-2xl backdrop-blur-sm border border-stone-500/20">
            <h3 className="text-stone-500 text-2xl font-bold mb-4">About Me</h3>
            <p className="text-white text-lg mb-4">
              {about ||
                "I explore the digital underground, crafting immersive experiences from the depths of cutting-edge technology."}
            </p>
          </div>

          <div className="flex-1 flex flex-wrap gap-10 justify-center">
            {skills?.map((skill, index) => (
              <div
                key={`skill-${index}`}
                className="w-full lg:w-[45%] bg-yellow-950/50 p-6 rounded-2xl backdrop-blur-sm border border-stone-500/20"
              >
                <h4 className="text-white font-bold text-xl mb-2">{skill}</h4>
                <div className="w-full bg-stone-700 rounded-full h-2.5">
                  <div
                    className="bg-stone-500 h-2.5 rounded-full"
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