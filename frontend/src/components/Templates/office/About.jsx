import useCvData from "../../../hooks/useCVData";

const About = () => {
  const { cvData } = useCvData() || {};

  return (
    <section id="about" className="relative w-full py-20 mx-auto bg-gray-900/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-blue-400 text-4xl font-bold mb-4">Professional Philosophy</h2>
          <div className="w-20 h-1 bg-blue-400 mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-gray-900/70 p-8 rounded-2xl backdrop-blur-sm border border-blue-400/20">
            <h3 className="text-white text-2xl font-bold mb-6">About Me</h3>
            <p className="text-gray-300 mb-4">
              {cvData?.about || "With over 8 years of experience in full stack development, I specialize in creating robust, scalable solutions that drive business growth. My approach combines technical excellence with strategic thinking."}
            </p>
            <div className="flex items-center mt-6">
              <div className="w-16 h-16 rounded-full bg-blue-400/10 border border-blue-400/30 flex items-center justify-center mr-4">
                <span className="text-blue-400 text-2xl">👨‍💻</span>
              </div>
              <div>
                <p className="text-white font-medium">Available for freelance</p>
                <p className="text-blue-400 text-sm">Remote or onsite</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/70 p-8 rounded-2xl backdrop-blur-sm border border-blue-400/20">
            <h3 className="text-white text-2xl font-bold mb-6">Core Expertise</h3>
            <div className="space-y-6">
              {cvData?.skills?.slice(0, 4).map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-white">{skill}</span>
                    <span className="text-blue-400">{90 - (index * 5)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-400 h-2 rounded-full" 
                      style={{ width: `${90 - (index * 5)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;