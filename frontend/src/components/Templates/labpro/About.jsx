// components/Templates/labpro/About.jsx
import useCvData from "../../../hooks/useCVData";

const About = () => {
  const { cvData } = useCvData() || {};

  return (
    <section id="about" className="relative w-full py-20 mx-auto bg-gray-900/40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-red-400 text-4xl font-bold mb-4">Research Methodology</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-gray-900/70 p-8 rounded-2xl backdrop-blur-sm border border-red-400/20">
            <h3 className="text-white text-2xl font-bold mb-6">Scientific Approach</h3>
            <p className="text-gray-300 mb-4">
              {cvData?.about}
            </p>
            <div className="flex items-center mt-6">
              <div className="w-16 h-16 rounded-full bg-red-400/10 border border-red-400/30 flex items-center justify-center mr-4">
                <span className="text-red-400 text-2xl">⚗️</span>
              </div>
              <div>
                <p className="text-white font-medium">Available for research collaborations</p>
                <p className="text-orange-400 text-sm">Peer-reviewed projects only</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/70 p-8 rounded-2xl backdrop-blur-sm border border-yellow-400/20">
            <h3 className="text-white text-2xl font-bold mb-6">Research Domains</h3>
            <div className="space-y-6">
              {cvData?.skills?.slice(0, 4).map((skill, index) => {
                const gradients = [
                  'from-red-400 to-orange-400',
                  'from-orange-400 to-yellow-400',
                  'from-yellow-400 to-amber-400',
                  'from-amber-400 to-red-400'
                ];
                return (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="text-white">{skill}</span>
                      <span className="text-red-400">{90 - (index * 5)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r ${gradients[index]} h-2 rounded-full transition-all duration-1000 ease-out`}
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
                      'bg-red-400/10 text-red-400 border-red-400/30',
                      'bg-orange-400/10 text-orange-400 border-orange-400/30',
                      'bg-yellow-400/10 text-yellow-400 border-yellow-400/30',
                      'bg-amber-400/10 text-amber-400 border-amber-400/30',
                      'bg-pink-400/10 text-pink-400 border-pink-400/30',
                      'bg-rose-400/10 text-rose-400 border-rose-400/30'
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