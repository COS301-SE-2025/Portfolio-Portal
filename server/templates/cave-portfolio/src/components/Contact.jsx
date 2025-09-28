import { motion } from "framer-motion";

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

const Contact = () => {
  return (
    <section id="contact" className="relative w-full py-20 mx-auto">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={fadeIn("up", "spring", 0.5, 1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="bg-[#0a0a2e]/70 p-8 rounded-2xl backdrop-blur-sm border border-emerald-400/20"
        >
          <h2 className="text-emerald-400 text-4xl font-bold mb-6">Contact Me</h2>
          <p className="text-white mb-6">
            Ready to explore digital caverns together? Let's connect and create
            something extraordinary!
          </p>

          <form className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-white">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                className="bg-[#0a0a2e] border border-emerald-400/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-white">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="bg-[#0a0a2e] border border-emerald-400/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-white">
                Your ideas or comments
              </label>
              <textarea
                id="message"
                rows="5"
                className="bg-[#0a0a2e] border border-emerald-400/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Tell me about your digital exploration project or how we might collaborate..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-emerald-400 hover:bg-emerald-500 text-[#0a0a2e] font-bold py-3 px-6 rounded-lg transition-colors duration-300 self-start"
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