// components/Templates/labpro/About.jsx - Enhanced with chemistry themes
import portfolioData from "../data/portfolioData.js";

const About = () => {
  const { cvData } = portfolioData() || {};

  return (
    <section id="about" className="relative w-full py-20 mx-auto bg-gray-900/40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          {/* Enhanced header with chemistry icons */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-emerald-400 text-3xl animate-shimmer"></div>
            <h2 className="text-emerald-50 text-4xl font-bold">Research Methodology</h2>
            <div className="text-emerald-400 text-3xl animate-shimmer"></div>
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-gray-900/70 p-8 rounded-2xl backdrop-blur-sm border border-emerald-400/20 hover:border-emerald-400/50 transition-all duration-500 hover:shadow-lg hover:shadow-emerald-400/20">
            {/* Enhanced section with chemistry icon */}
            <div className="flex items-center gap-3 mb-6">
              <div className="text-emerald-400 text-2xl">🔬</div>
              <h3 className="text-white text-2xl font-bold">Scientific Approach</h3>
            </div>
            <p className="text-gray-300 mb-4">
              {cvData?.about}
            </p>
            <div className="flex items-center mt-6">
              <div className="w-16 h-16 rounded-full bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center mr-4">
                <span className="text-emerald-400 text-2xl">🧬</span>
              </div>
              <div>
                <p className="text-white font-medium">Available for research collaborations</p>
                <p className="text-teal-400 text-sm">Peer-reviewed projects only</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/70 p-8 rounded-2xl backdrop-blur-sm border border-teal-400/20 hover:border-teal-400/50 transition-all duration-500 hover:shadow-lg hover:shadow-teal-400/20">
            {/* Enhanced section with chemistry icon */}
            <div className="flex items-center gap-3 mb-6">
              <div className="text-teal-400 text-2xl">⚗️</div>
              <h3 className="text-white text-2xl font-bold">Research Domains</h3>
            </div>
            <div className="space-y-6">
              {cvData?.skills?.slice(0, 4).map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-white">{skill}</span>
                    <span className="text-emerald-400">{90 - (index * 5)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-400 to-teal-400 h-2 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${90 - (index * 5)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {cvData?.skills?.length > 4 && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                {/* Enhanced additional expertise section */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-emerald-400 text-lg"></div>
                  <h4 className="text-white text-lg font-semibold">Additional Expertise</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cvData.skills.slice(4).map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-emerald-400/10 text-emerald-400 rounded-full text-sm border border-emerald-400/30 hover:bg-emerald-400/20 transition-all duration-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
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

export default About;