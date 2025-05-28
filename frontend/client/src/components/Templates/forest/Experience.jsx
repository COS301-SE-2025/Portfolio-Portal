import useCvData from "../../../hooks/useCVData";

const ExperienceAndEducation = () => {
  const { cvData } = useCvData() || {};

  return (
    <section id="experience" className="py-24 bg-gray-50/50 relative">
      <div className="container mx-auto px-4">
        {/* Experience Section */}
        <h2 className="text-3xl font-bold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-700">
          Experience
        </h2>

        <div className="max-w-3xl mx-auto relative mb-24">
          {/* Timeline line */}
          <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-400 to-purple-600 md:left-1/2"></div>

          {/* Experience Cards */}
          <div className="flex flex-col gap-6 group">
            {cvData?.experience?.map((item, index) => (
              <div
                key={`exp-${index}`}
                className={`relative transition-all duration-300 
                  ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} 
                  flex flex-col md:flex group-hover:blur-sm 
                  hover:!blur-none hover:scale-[1.05]`}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 top-7 w-4 h-4 rounded-full bg-blue-500 md:left-1/2 md:-ml-2 z-10"></div>

                {/* Content */}
                <div className="ml-12 md:ml-0 md:w-1/2 md:px-8">
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:border-blue-500 transition-all duration-300">
                    <h3 className="font-bold text-xl text-blue-600">
                      {item.title}
                    </h3>
                    <div className="flex justify-between mb-2">
                      <p className="text-gray-700">{item.company}</p>
                      <p className="text-gray-500 text-sm">{`${item.startDate} - ${item.endDate}`}</p>
                    </div>
                    <ul className="text-gray-600 list-disc list-inside">
                      {item.extra?.map((bullet, bulletIndex) => (
                        <li key={`bullet-${index}-${bulletIndex}`}>
                          {bullet.replace("¢ ", "")}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <h2 className="text-3xl font-bold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          Education
        </h2>

        <div className="max-w-3xl mx-auto relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-purple-400 to-pink-600 md:left-1/2"></div>

          {/* Education Cards */}
          <div className="flex flex-col gap-6 group">
            {cvData?.education?.map((item, index) => (
              <div
                key={`edu-${index}`}
                className={`relative transition-all duration-300 
                  ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} 
                  flex flex-col md:flex group-hover:blur-sm 
                  hover:!blur-none hover:scale-[1.05]`}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 top-7 w-4 h-4 rounded-full bg-purple-500 md:left-1/2 md:-ml-2 z-10"></div>

                {/* Content */}
                <div className="ml-12 md:ml-0 md:w-1/2 md:px-8">
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:border-purple-500 transition-all duration-300">
                    <h3 className="font-bold text-xl text-purple-600">
                      {item.degree}
                    </h3>
                    <div className="flex justify-between mb-2">
                      <p className="text-gray-700">{item.institution}</p>
                      <p className="text-gray-500 text-sm">{item.endDate}</p>
                    </div>
                    {item.field && (
                      <p className="text-gray-600">{item.field}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceAndEducation;
