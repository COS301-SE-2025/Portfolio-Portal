//frontend/src/components/Templates/forest/Experience.jsx
import { motion } from "framer-motion";
import { fadeIn } from "../../../utils/motion";

const Experience = () => {
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
            My Conservation Journey
          </h2>

          <div className="flex flex-col gap-8">
            {[
              {
                title: "Digital Conservation Specialist",
                company: "World Wildlife Foundation",
                date: "2020 - Present",
                description:
                  "Develop immersive web platforms that visualize climate change impacts and connect donors with conservation projects.",
              },
              {
                title: "Eco-Tech Educator",
                company: "Greenpeace Digital",
                date: "2018 - 2020",
                description:
                  "Created interactive learning modules about biodiversity loss for schools and activist training programs.",
              },
              {
                title: "Wildlife Documentarian",
                company: "National Geographic Explorer",
                date: "2016 - 2018",
                description:
                  "Produced VR experiences that transport viewers into endangered habitats to build empathy for threatened species.",
              },
            ].map((exp, index) => (
              <div
                key={index}
                className="bg-[#0e0e2c]/70 p-6 rounded-2xl backdrop-blur-sm border border-green-400/20"
              >
                <h3 className="text-white text-2xl font-bold">{exp.title}</h3>
                <p className="text-green-400 text-lg">{exp.company}</p>
                <p className="text-gray-400 mb-4">{exp.date}</p>
                <p className="text-white">{exp.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
