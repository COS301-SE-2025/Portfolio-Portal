// components/Templates/labpro/Contact.jsx - Enhanced with chemistry themes
import { email } from "./index";
import { useState } from "react";

const Contact = () => {

  return (
    <section id="contact" className="relative w-full py-20 mx-auto bg-gray-900/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          {/* Enhanced header with chemistry icons */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-emerald-400 text-3xl animate-shimmer"></div>
            <h2 className="text-emerald-50 text-4xl font-bold">Research Collaboration</h2>
            <div className="text-emerald-400 text-3xl animate-shimmer"></div>
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-gray-900/70 p-8 rounded-2xl backdrop-blur-sm border border-emerald-400/20 hover:border-emerald-400/50 transition-all duration-500">
            {/* Enhanced contact info section */}
            <div className="flex items-center gap-3 mb-4">
              <div className="text-emerald-400 text-2xl">📞</div>
              <h3 className="text-white text-2xl font-bold">Contact Information</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Interested in collaborative research or academic partnerships? Reach out to discuss potential projects and scientific inquiries.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-400/10 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Professional Email</p>
                  <p className="text-white">{email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/70 p-8 rounded-2xl backdrop-blur-sm border border-teal-400/20 hover:border-teal-400/50 transition-all duration-500">
            {/* Enhanced form section */}
            <div className="flex items-center gap-3 mb-6">
              <div className="text-teal-400 text-2xl">✍️</div>
              <h3 className="text-white text-2xl font-bold">Send Message</h3>
            </div>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="text-white block mb-2">Full Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full bg-gray-800 border border-emerald-400/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-300"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-white block mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="w-full bg-gray-800 border border-teal-400/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300"
                />
              </div>
              <div>
                <label htmlFor="message" className="text-white block mb-2">Research Inquiry</label>
                <textarea
                  id="message"
                  rows="5"
                  className="w-full bg-gray-800 border border-emerald-400/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-gray-900 font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-400/50"
              >
                {/* Enhanced button with icon */}
                <div className="flex items-center gap-2">
                  <span>Submit Inquiry</span>
                  <span className="text-lg"></span>
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Add CSS for shimmer animation */}
      <style>
        {`
        @keyframes shimmer {
          0% { opacity: 0.3; }
          50% { opacity: 0.8; }
          100% { opacity: 0.3; }
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        `}
      </style>
    </section>
  );
};

export default Contact;