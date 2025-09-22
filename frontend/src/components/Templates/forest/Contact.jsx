//frontend/src/components/Templates/forest/Contact.jsx
import { motion } from "framer-motion";
import { fadeIn } from "../../../utils/motion";
import { useState } from "react";
import { downloadPortfolio, DownloadButton } from "../../../services/portfolioDownload.jsx";
import GitHubDeploy from "../../GitHubDeploy.jsx";
import { useCVData } from "../../../hooks/useCVData.js";

const Contact = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { cvData } = useCVData();

  const handleDownload = async () => {
    const result = await downloadPortfolio(setIsDownloading, 'forest');
    if (!result.success) {
      alert(result.error);
    }
  };
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

        {/* Download Portfolio Section */}
        <motion.div
          variants={fadeIn("up", "spring", 0.7, 1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="bg-[#0e0e2c]/70 p-8 rounded-2xl backdrop-blur-sm border border-green-400/20 mt-8"
        >
          <h3 className="text-green-400 text-2xl font-bold mb-4">Download Your Portfolio</h3>
          <p className="text-white mb-6">
            Get your complete portfolio as a standalone React application that you can customize and deploy anywhere.
          </p>
          <DownloadButton 
            isDownloading={isDownloading}
            onClick={handleDownload}
            variant="default"
            className="bg-gradient-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500"
          />
          <p className="text-gray-400 text-sm mt-4">
            Includes complete React app with your data, ready to run with npm install && npm start
          </p>
        </motion.div>

        {/* GitHub Pages Deployment Section */}
        <motion.div
          variants={fadeIn("up", "spring", 0.8, 1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="bg-[#0e0e2c]/70 p-8 rounded-2xl backdrop-blur-sm border border-green-400/20 mt-8"
        >
          <h3 className="text-green-400 text-2xl font-bold mb-4">Deploy to GitHub Pages</h3>
          <p className="text-white mb-6">
            Automatically deploy your portfolio to GitHub Pages with a single click. Your portfolio will be live at username.github.io/portfolio-name
          </p>
          <GitHubDeploy 
            userData={cvData}
            username={cvData?.name?.toLowerCase().replace(/\s+/g, '') || 'portfolio'}
            template="forest"
            variant="success"
            className="text-white"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
