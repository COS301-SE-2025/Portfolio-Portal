//frontend/src/components/Templates/cave/cavev2/Contact.jsx
import { motion } from "framer-motion";
import { fadeIn } from "../../../../utils/motion";
import { useState } from "react";
import { downloadPortfolio, DownloadButton } from "../../../../services/portfolioDownload.jsx";
import { useCVData } from "../../../../hooks/useCVData.js";

const Contact = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { cvData } = useCVData();

  const handleDownload = async () => {
    const result = await downloadPortfolio(setIsDownloading, 'cave');

    if (!result.success) {
      alert(result.error);
    }
  };

  return (
    <section id="contact" className="relative w-full py-20 mx-auto">
      <div className="max-w-7xl mx-auto px-6">
        {/* Contact Form Section */}
        <motion.div
          variants={fadeIn("up", "spring", 0.5, 1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="bg-stone-900/50 p-8 rounded-2xl backdrop-blur-sm border border-stone-500/20"
        >
          <h2 className="text-orange-200 text-4xl font-bold mb-6">Contact Me</h2>
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
                className="bg-stone-900/70 border border-stone-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-stone-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-white">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="bg-stone-900/70 border border-stone-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-stone-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-white">
                Your ideas or comments
              </label>
              <textarea
                id="message"
                rows="5"
                className="bg-stone-900/70 border border-stone-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-stone-500"
                placeholder="Tell me about your digital exploration project or how we might collaborate..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-stone-500 hover:bg-stone-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 self-start"
            >
              Send Message
            </button>
          </form>

        </motion.div>

        {/* Download Portfolio Section */}
        <motion.div
          variants={fadeIn("up", "spring", 0.7, 1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="bg-stone-900/50 p-8 rounded-2xl backdrop-blur-sm border border-stone-500/20 mt-8"
        >
          <h3 className="text-orange-200 text-2xl font-bold mb-4">Download Your Portfolio</h3>
          <p className="text-white mb-6">
            Get your complete portfolio as a standalone React application that you can customize and deploy anywhere.
          </p>
          <DownloadButton 
            isDownloading={isDownloading}
            onClick={handleDownload}
            variant="default"
            className="bg-gradient-to-r from-stone-600 to-stone-500 hover:from-stone-700 hover:to-stone-600"
          />
        </motion.div>

      </div>
    </section>
  );
};

export default Contact;