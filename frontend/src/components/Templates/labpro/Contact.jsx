// components/Templates/labpro/Contact.jsx
import { email } from "./index";
import { useState } from "react";
import { downloadPortfolio, DownloadButton } from "../../../services/portfolioDownload.jsx";

const Contact = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    const result = await downloadPortfolio(setIsDownloading, 'labpro');
    if (!result.success) {
      alert(result.error);
    }
  };
  return (
    <section id="contact" className="relative w-full py-20 mx-auto bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-cyan-600 text-4xl font-bold mb-4">Research Collaboration</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-emerald-500 mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-cyan-200/50 shadow-sm">
            <h3 className="text-gray-800 text-2xl font-bold mb-4">Contact Information</h3>
            <p className="text-gray-600 mb-6">
              Interested in collaborative research or academic partnerships? Reach out to discuss potential projects and scientific inquiries.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center mr-4 border border-cyan-200">
                  <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Professional Email</p>
                  <p className="text-gray-800">{email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-cyan-200/50 shadow-sm">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="text-gray-800 block mb-2">Full Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-gray-800 block mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="message" className="text-gray-800 block mb-2">Research Inquiry</label>
                <textarea
                  id="message"
                  rows="5"
                  className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-bold rounded-lg transition-colors duration-300"
              >
                Submit Inquiry
              </button>
            </form>
          </div>
        </div>

        {/* Download Portfolio Section */}
        <div className="mt-16 text-center">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-cyan-200/50 shadow-sm max-w-2xl mx-auto">
            <h3 className="text-gray-800 text-2xl font-bold mb-4">Download Research Portfolio</h3>
            <p className="text-gray-600 mb-6">
              Obtain a complete copy of my research portfolio as a standalone application for academic review and collaboration.
            </p>
            <DownloadButton 
              isDownloading={isDownloading}
              onClick={handleDownload}
              variant="labpro"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;