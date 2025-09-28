import portfolioData from '../data/portfolioData.js';

const ExperienceAndEducation = () => {

  return (
    <section id="experience" className="py-24 bg-gray-900/50 relative">
      <div className="container mx-auto px-4">
        {/* Experience Section */}
        <h2 className="text-3xl font-bold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          Experience
        </h2>

        <div className="max-w-3xl mx-auto relative mb-24">
          {/* Timeline line */}
          <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-400 to-purple-600 md:left-1/2"></div>

          {/* Experience Cards */}
          <div className="flex flex-col gap-6 group">
            {portfolioData?.experience?.map((item, index) => (
              <div
                key={`exp-${index}`}
                className="relative transition-all duration-300 group-hover:blur-sm hover:!blur-none hover:scale-[1.05]"
              >
                {/* Timeline dot */}
                <div className="absolute left-4 top-7 w-4 h-4 rounded-full bg-blue-500 md:left-1/2 md:-ml-2 z-10"></div>

                {/* Content - alternating sides */}
                <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:ml-auto md:text-left'}`}>
                  <div className="bg-gray-800/70 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-300">
                    <h3 className="font-bold text-xl text-blue-400">
                      {item.title}
                    </h3>
                    <div className="mb-2">
                      <p className="text-gray-300">{item.company}</p>
                      <p className="text-gray-400 text-sm">{`${item.startDate} - ${item.endDate}`}</p>
                    </div>
                    <ul className="text-white list-disc pl-5">
                  {item.extra?.map((bullet, bulletIndex) => (
                    <li key={`bullet-${index}-${bulletIndex}`}>{bullet}</li>
                  ))}
                </ul>                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <h2 className="text-3xl font-bold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Education
        </h2>

        <div className="max-w-3xl mx-auto relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-purple-400 to-pink-600 md:left-1/2"></div>

          {/* Education Cards */}
          <div className="flex flex-col gap-6 group">
            {portfolioData?.education?.map((item, index) => (
              <div
                key={`edu-${index}`}
                className="relative transition-all duration-300 group-hover:blur-sm hover:!blur-none hover:scale-[1.05]"
              >
                {/* Timeline dot */}
                <div className="absolute left-4 top-7 w-4 h-4 rounded-full bg-purple-500 md:left-1/2 md:-ml-2 z-10"></div>

                {/* Content - alternating sides */}
                <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:ml-auto md:text-left'}`}>
                  <div className="bg-gray-800/70 p-6 rounded-lg border border-gray-700 hover:border-purple-500 transition-all duration-300">
                    <h3 className="font-bold text-xl text-purple-400">
                      {item.degree}
                    </h3>
                    <div className="mb-2">
                      <p className="text-gray-300">{item.institution}</p>
                      <p className="text-gray-400 text-sm">{item.endDate}</p>
                    </div>
                    {item.field && (
                      <p className="text-gray-400">{item.field}</p>
                    )}
                    {item.gpa && <p className="text-white">GPA: {item.gpa}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background blob */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
    </section>
  );
};

export default ExperienceAndEducation;