// components/Templates/labpro/Experience.jsx
import useCvData from "../../../hooks/useCVData";

const Experience = () => {
  const { cvData } = useCvData() || {};

  return (
    <section id="experience" className="relative w-full py-20 mx-auto bg-gray-900/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-purple-400 text-4xl font-bold mb-4">Research Career</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-cyan-400 mx-auto" />
        </div>

        {/* Experience Section */}
        <div className="space-y-8">
          {cvData?.experience?.map((exp, index) => (
            <div 
              key={index}
              className="bg-gray-900/70 p-8 rounded-2xl backdrop-blur-sm border border-cyan-400/20 hover:border-purple-400/50 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                <h3 className="text-white text-2xl font-bold">{exp.title}</h3>
                <span className="text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full text-sm">
                  {exp.startDate} - {exp.endDate}
                </span>
              </div>
              <h4 className="text-purple-400 text-lg mb-4">{exp.company}</h4>
              {exp.extra?.length > 0 && (
                <ul className="text-gray-300 space-y-2 pl-5 list-disc">
                  {exp.extra.map((bullet, i) => (
                    <li key={i}>{bullet.replace('¢ ', '')}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Education Section */}
        {cvData?.education?.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-16">
              <h2 className="text-cyan-400 text-4xl font-bold mb-4">Academic Credentials</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto" />
            </div>

            <div className="space-y-8">
              {cvData.education.map((edu, index) => (
                <div 
                  key={index}
                  className="bg-gray-900/70 p-8 rounded-2xl backdrop-blur-sm border border-purple-400/20 hover:border-cyan-400/50 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                    <h3 className="text-white text-2xl font-bold">{edu.degree}</h3>
                    <span className="text-purple-400 bg-purple-400/10 px-3 py-1 rounded-full text-sm">
                      {edu.endDate}
                    </span>
                  </div>
                  <h4 className="text-cyan-400 text-lg mb-2">{edu.institution}</h4>
                  {edu.field && <p className="text-gray-300">{edu.field}</p>}
                  {edu.gpa && <p className="text-gray-300">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;