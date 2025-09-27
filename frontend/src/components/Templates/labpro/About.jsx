// About.jsx
import useCvData from "../../../hooks/useCVData";

const About = () => {
  const { cvData } = useCvData() || {};

  return (
    <section id="about" className="relative w-full py-20 mx-auto bg-gray-900/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-green-400 text-4xl font-bold mb-4">Scientific Approach</h2>
          <div className="w-20 h-1 bg-green-400 mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-gray-900/70 p-8 rounded-2xl backdrop-blur-sm border border-green-400/20">
            <h3 className="text-white text-2xl font-bold mb-6">About Me</h3>
            <p className="text-gray-300 mb-4">
              {cvData?.about}
            </p>
            <div className="flex items-center mt-6">
              <div className="w-16 h-16 rounded-full bg-green-400/10 border border-green-400/30 flex items-center justify-center mr-4">
                <span className="text-green-400 text-2xl">🔬</span>
              </div>
              <div>
                <p className="text-white font-medium">Available for research projects</p>
                <p className="text-green-400 text-sm">Remote or lab-based</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/70 p-8 rounded-2xl backdrop-blur-sm border border-green-400/20">
            <h3 className="text-white text-2xl font-bold mb-6">Core Expertise</h3>
            <div className="space-y-6">
              {cvData?.skills?.slice(0, 4).map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-white">{skill}</span>
                    <span className="text-green-400">{90 - (index * 5)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-400 h-2 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${90 - (index * 5)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {cvData?.skills?.length > 4 && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h4 className="text-white text-lg font-semibold mb-3">Additional Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {cvData.skills.slice(4).map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-green-400/10 text-green-400 rounded-full text-sm border border-green-400/30"
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
    </section>
  );
};

export default About;