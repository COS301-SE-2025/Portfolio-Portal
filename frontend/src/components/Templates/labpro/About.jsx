// components/Templates/labpro/About.jsx
import useCvData from "../../../hooks/useCVData";

const About = () => {
  const { cvData } = useCvData() || {};

  return (
    <section id="about" className="relative w-full py-20 mx-auto bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-orange-400 text-4xl font-bold mb-4">Research Methodology</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-400 to-purple-400 mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-gray-800/80 p-8 rounded-2xl backdrop-blur-sm border border-orange-400/20">
            <h3 className="text-white text-2xl font-bold mb-6">Scientific Approach</h3>
            <p className="text-gray-300 mb-4">
              {cvData?.about}
            </p>
            <div className="flex items-center mt-6">
              <div className="w-16 h-16 rounded-full bg-orange-400/10 border border-orange-400/30 flex items-center justify-center mr-4">
                <span className="text-orange-400 text-2xl">⚗️</span>
              </div>
              <div>
                <p className="text-white font-medium">Available for research collaborations</p>
                <p className="text-purple-400 text-sm">Peer-reviewed projects only</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/80 p-8 rounded-2xl backdrop-blur-sm border border-blue-400/20">
            <h3 className="text-white text-2xl font-bold mb-6">Research Domains</h3>
            <div className="space-y-6">
              {cvData?.skills?.slice(0, 4).map((skill, index) => {
                const colors = ['from-green-400 to-blue-400', 'from-yellow-400 to-red-400', 'from-purple-400 to-pink-400', 'from-cyan-400 to-indigo-400'];
                return (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="text-white">{skill}</span>
                      <span className="text-green-400">{90 - (index * 5)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r ${colors[index]} h-2 rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${90 - (index * 5)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            
            {cvData?.skills?.length > 4 && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h4 className="text-white text-lg font-semibold mb-3">Additional Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {cvData.skills.slice(4).map((skill, index) => {
                    const colorClasses = [
                      'bg-green-400/10 text-green-400 border-green-400/30',
                      'bg-yellow-400/10 text-yellow-400 border-yellow-400/30',
                      'bg-red-400/10 text-red-400 border-red-400/30',
                      'bg-blue-400/10 text-blue-400 border-blue-400/30',
                      'bg-purple-400/10 text-purple-400 border-purple-400/30',
                      'bg-pink-400/10 text-pink-400 border-pink-400/30'
                    ];
                    return (
                      <span 
                        key={index}
                        className={`px-3 py-1 ${colorClasses[index % colorClasses.length]} rounded-full text-sm border`}
                      >
                        {skill}
                      </span>
                    );
                  })}
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