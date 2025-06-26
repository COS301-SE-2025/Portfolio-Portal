//frontend/src/components/Templates/forest/About.jsx
import { motion } from "framer-motion";
import { fadeIn } from "../../../utils/motion";

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
            <h3 className="text-green-400 text-2xl font-bold mb-4">
              My Mission
            </h3>
            <p className="text-white text-lg mb-4">
              I bridge technology and ecology to create digital experiences that
              inspire conservation action. Every project I build carries a
              message of environmental stewardship.
            </p>
            <p className="text-white text-lg">
              When I'm not coding, you'll find me volunteering at wildlife
              sanctuaries or documenting endangered ecosystems through
              photography.
            </p>
          </div>

          <div className="flex-1 flex flex-wrap gap-10 justify-center">
            {[
              { title: "Eco-Web Development", value: "90%" },
              { title: "Conservation Storytelling", value: "85%" },
              { title: "Wildlife Photography", value: "80%" },
              { title: "Environmental Education", value: "95%" },
            ].map((item, index) => (
              <div
                key={item.title}
                className="w-full lg:w-[45%] bg-[#0e0e2c]/70 p-6 rounded-2xl backdrop-blur-sm border border-green-400/20"
              >
                <h4 className="text-white font-bold text-xl mb-2">
                  {item.title}
                </h4>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-green-400 h-2.5 rounded-full"
                    style={{ width: item.value }}
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
