// components/Templates/labpro/About.jsx
import useCvData from "../../../hooks/useCVData";

const About = () => {
  const { cvData } = useCvData() || {};

  return (
    <section id="about" className="relative w-full py-20 mx-auto bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-cyan-600 text-4xl font-bold mb-4">Research Methodology</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-emerald-500 mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-cyan-200/50 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="text-gray-800 text-2xl font-bold mb-6">Scientific Approach</h3>
            <p className="text-gray-600 mb-4">
              {cvData?.about}
            </p>
            <div className="flex items-center mt-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-100 to-emerald-100 border border-cyan-300 flex items-center justify-center mr-4">
                <span className="text-cyan-600 text-2xl">🔬</span>
              </div>
              <div>
                <p className="text-gray-800 font-medium">Available for research collaborations</p>
                <p className="text-emerald-600 text-sm">Peer-reviewed projects only</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-cyan-200/50 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="text-gray-800 text-2xl font-bold mb-6">Research Domains</h3>
            <div className="space-y-6">
              {cvData?.skills?.slice(0, 4).map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-800">{skill}</span>
                    <span className="text-cyan-600">{95 - (index * 5)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${95 - (index * 5)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {cvData?.skills?.length > 4 && (
              <div className="mt-6 pt-6 border-t border-gray-300">
                <h4 className="text-gray-800 text-lg font-semibold mb-3">Additional Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {cvData.skills.slice(4).map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-cyan-100 to-emerald-100 text-cyan-700 rounded-full text-sm border border-cyan-200"
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