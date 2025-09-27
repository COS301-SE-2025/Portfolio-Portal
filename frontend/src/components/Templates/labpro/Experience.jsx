// components/Templates/labpro/Experience.jsx
import useCvData from "../../../hooks/useCVData";

const Experience = () => {
  const { cvData } = useCvData() || {};

  return (
    <section id="experience" className="relative w-full py-20 mx-auto bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-green-400 text-4xl font-bold mb-4">Research Career</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-green-400 to-yellow-400 mx-auto" />
        </div>

        {/* Experience Section */}
        <div className="space-y-8">
          {cvData?.experience?.map((exp, index) => {
            const borderColors = ['border-green-400/20', 'border-blue-400/20', 'border-yellow-400/20', 'border-red-400/20'];
            const textColors = ['text-green-400', 'text-blue-400', 'text-yellow-400', 'text-red-400'];
            return (
              <div 
                key={index}
                className={`bg-gray-800/80 p-8 rounded-2xl backdrop-blur-sm ${borderColors[index % borderColors.length]} hover:${borderColors[index % borderColors.length].replace('/20', '/50')} transition-all duration-300`}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                  <h3 className="text-white text-2xl font-bold">{exp.title}</h3>
                  <span className={`${textColors[index % textColors.length]} bg-gray-700/50 px-3 py-1 rounded-full text-sm`}>
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <h4 className={`${textColors[(index + 1) % textColors.length]} text-lg mb-4`}>{exp.company}</h4>
                {exp.extra?.length > 0 && (
                  <ul className="text-gray-300 space-y-2 pl-5 list-disc">
                    {exp.extra.map((bullet, i) => (
                      <li key={i}>{bullet.replace('¢ ', '')}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {/* Education Section */}
        {cvData?.education?.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-16">
              <h2 className="text-purple-400 text-4xl font-bold mb-4">Academic Credentials</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto" />
            </div>

            <div className="space-y-8">
              {cvData.education.map((edu, index) => {
                const borderColors = ['border-purple-400/20', 'border-cyan-400/20', 'border-pink-400/20'];
                const textColors = ['text-purple-400', 'text-cyan-400', 'text-pink-400'];
                return (
                  <div 
                    key={index}
                    className={`bg-gray-800/80 p-8 rounded-2xl backdrop-blur-sm ${borderColors[index % borderColors.length]} hover:${borderColors[index % borderColors.length].replace('/20', '/50')} transition-all duration-300`}
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                      <h3 className="text-white text-2xl font-bold">{edu.degree}</h3>
                      <span className={`${textColors[index % textColors.length]} bg-gray-700/50 px-3 py-1 rounded-full text-sm`}>
                        {edu.endDate}
                      </span>
                    </div>
                    <h4 className={`${textColors[(index + 1) % textColors.length]} text-lg mb-2`}>{edu.institution}</h4>
                    {edu.field && <p className="text-gray-300">{edu.field}</p>}
                    {edu.gpa && <p className="text-gray-300">GPA: {edu.gpa}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;