import useCvData from '../../../hooks/useCVData';

const OfficeExperience = () => {
  const { cvData } = useCvData() || {};

  return (
    <section id="experience" className="py-24 bg-gray-900/70 relative">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-gray-300">
          Professional Experience
        </h2>

        <div className="max-w-4xl mx-auto relative mb-24">
          <div className="absolute left-4 top-2 bottom-2 w-1 bg-gradient-to-b from-blue-600/70 via-gray-600/50 to-gray-600/70 md:left-1/2"></div>

          <div className="flex flex-col gap-8 group">
            {cvData?.experience?.map((item, index) => (
              <div
                key={`exp-${index}`}
                className={`relative transition-all duration-300 
                  ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} 
                  flex flex-col md:flex group-hover:blur-sm 
                  hover:!blur-none hover:scale-[1.02]`}
              >
                <div className="absolute left-4 top-7 w-4 h-8 bg-blue-600 clip-document-tab md:left-1/2 md:-ml-2 z-10"></div>

                <div className="ml-12 md:ml-0 md:w-1/2 md:px-8">
                  <div className="bg-gray-800/70 p-6 rounded border border-gray-700 hover:border-blue-500 transition-all duration-300 shadow-lg">
                    <h3 className="font-bold text-xl text-blue-400">{item.title}</h3>
                    <div className="flex justify-between mb-2">
                      <p className="text-gray-300">{item.company}</p>
                      <p className="text-gray-400 text-sm">{`${item.startDate} - ${item.endDate}`}</p>
                    </div>
                    <ul className="text-gray-400 list-disc list-inside space-y-1">
                      {item.extra?.map((bullet, bulletIndex) => (
                        <li key={`bullet-${index}-${bulletIndex}`}>{bullet.replace('¢ ', '')}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-blue-600">
          Education & Certifications
        </h2>

        <div className="max-w-4xl mx-auto relative">
          <div className="absolute left-4 top-2 bottom-2 w-1 bg-gradient-to-b from-gray-600/70 via-blue-600/50 to-blue-600/70 md:left-1/2"></div>

          <div className="flex flex-col gap-8 group">
            {cvData?.education?.map((item, index) => (
              <div
                key={`edu-${index}`}
                className={`relative transition-all duration-300 
                  ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} 
                  flex flex-col md:flex group-hover:blur-sm 
                  hover:!blur-none hover:scale-[1.02]`}
              >
                <div className="absolute left-4 top-7 w-4 h-8 bg-gray-600 clip-document-tab md:left-1/2 md:-ml-2 z-10"></div>

                <div className="ml-12 md:ml-0 md:w-1/2 md:px-8">
                  <div className="bg-gray-800/70 p-6 rounded border border-gray-700 hover:border-blue-500 transition-all duration-300 shadow-lg">
                    <h3 className="font-bold text-xl text-gray-300">{item.degree}</h3>
                    <div className="flex justify-between mb-2">
                      <p className="text-gray-300">{item.institution}</p>
                      <p className="text-gray-400 text-sm">{item.endDate}</p>
                    </div>
                    {item.field && <p className="text-gray-400">{item.field}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .clip-document-tab {
          clip-path: polygon(0% 0%, 100% 0%, 100% 75%, 50% 100%, 0% 75%);
        }
      `}</style>
    </section>
  );
};

export default OfficeExperience;