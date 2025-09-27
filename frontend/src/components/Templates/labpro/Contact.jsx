// Contact.jsx
import { email } from "./index";
import { useState } from "react";
import { downloadPortfolio, DownloadButton } from "../../../services/portfolioDownload.jsx";

const Contact = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    const result = await downloadPortfolio(setIsDownloading, 'lab');
    if (!result.success) {
      alert(result.error);
    }
  };
  return (
    <section id="contact" className="relative w-full py-20 mx-auto bg-gray-900/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-green-400 text-4xl font-bold mb-4">Let's Experiment Together</h2>
          <div className="w-20 h-1 bg-green-400 mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-gray-900/70 p-8 rounded-2xl backdrop-blur-sm border border-green-400/20">
            <h3 className="text-white text-2xl font-bold mb-4">Get In Touch</h3>
            <p className="text-gray-300 mb-6">
              Have a research project or want to collaborate on an experiment? Reach out and let's discover something groundbreaking together.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-green-400/10 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white">{email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/70 p-8 rounded-2xl backdrop-blur-sm border border-green-400/20">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="text-white block mb-2">Your Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full bg-gray-800 border border-green-400/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-white block mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="w-full bg-gray-800 border border-green-400/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label htmlFor="message" className="text-white block mb-2">Project Details</label>
                <textarea
                  id="message"
                  rows="5"
                  className="w-full bg-gray-800 border border-green-400/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-green-400 hover:bg-green-500 text-gray-900 font-bold rounded-lg transition-colors duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Download Portfolio Section */}
        <div className="mt-16 text-center">
          <div className="bg-gray-900/70 p-8 rounded-2xl backdrop-blur-sm border border-green-400/20 max-w-2xl mx-auto">
            <h3 className="text-white text-2xl font-bold mb-4">Download Your Portfolio</h3>
            <p className="text-gray-300 mb-6">
              Get your complete portfolio as a standalone React application that you can customize and deploy anywhere.
            </p>
            <DownloadButton 
              isDownloading={isDownloading}
              onClick={handleDownload}
              variant="lab"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;