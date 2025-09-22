import { motion } from "framer-motion";
import { fadeIn } from "../utils/motion";

const Contact = () => {
  return (
    <section id="contact" className="relative w-full py-20 mx-auto">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={fadeIn("up", "spring", 0.5, 1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="bg-[#0e0e2c]/70 p-8 rounded-2xl backdrop-blur-sm border border-green-400/20"
        >
          <h2 className="text-green-400 text-4xl font-bold mb-6">Contact Me</h2>
          <p className="text-white mb-6">
            Interested in collaborating? Contact me and let's create something
            great together!
          </p>

          <form className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-white">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                className="bg-[#0e0e2c] border border-green-400/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-white">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="bg-[#0e0e2c] border border-green-400/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-white">
                Your ideas or comments
              </label>
              <textarea
                id="message"
                rows="5"
                className="bg-[#0e0e2c] border border-green-400/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Tell me about your environmental project or how we might collaborate..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-green-400 hover:bg-green-500 text-[#0e0e2c] font-bold py-3 px-6 rounded-lg transition-colors duration-300 self-start"
            >
              Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;