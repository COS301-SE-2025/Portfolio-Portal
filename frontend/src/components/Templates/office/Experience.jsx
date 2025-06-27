import useCvData from "../../../hooks/useCVData";

// Mock data for when CV data is not available
const mockExperienceData = [
  {
    title: "Senior Full Stack Developer",
    company: "TechCorp Solutions",
    startDate: "2022",
    endDate: "Present",
    extra: [
      "Led development of microservices architecture serving 1M+ users",
      "Implemented CI/CD pipelines reducing deployment time by 60%",
      "Mentored junior developers and conducted code reviews",
      "Collaborated with cross-functional teams to deliver projects on time"
    ]
  },
  {
    title: "Full Stack Developer",
    company: "Digital Innovations Inc.",
    startDate: "2020",
    endDate: "2022",
    extra: [
      "Developed responsive web applications using React and Node.js",
      "Optimized database queries improving application performance by 40%",
      "Integrated third-party APIs and payment systems",
      "Maintained and updated legacy systems"
    ]
  },
  {
    title: "Frontend Developer",
    company: "StartupXYZ",
    startDate: "2018",
    endDate: "2020",
    extra: [
      "Built modern user interfaces with React and TypeScript",
      "Implemented responsive designs and improved mobile experience",
      "Collaborated with UX/UI designers to create intuitive interfaces",
      "Participated in agile development processes"
    ]
  }
];

const Experience = () => {
  const { cvData } = useCvData() || {};

  // Use CV data if available, otherwise fall back to mock data
  const experienceData = cvData?.experience?.length > 0 ? cvData.experience : mockExperienceData;

  return (
    <section id="experience" className="relative w-full py-20 mx-auto bg-gray-900/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-blue-400 text-4xl font-bold mb-4">Professional Journey</h2>
          <div className="w-20 h-1 bg-blue-400 mx-auto" />
        </div>

        <div className="space-y-8">
          {experienceData.map((exp, index) => (
            <div 
              key={index}
              className="bg-gray-900/70 p-8 rounded-2xl backdrop-blur-sm border border-blue-400/20 hover:border-blue-400/50 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                <h3 className="text-white text-2xl font-bold">{exp.title}</h3>
                <span className="text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full text-sm">
                  {exp.startDate} - {exp.endDate}
                </span>
              </div>
              <h4 className="text-blue-400 text-lg mb-4">{exp.company}</h4>
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
      </div>
    </section>
  );
};

export default Experience;