const experienceData = [
  {
    role: "Senior Frontend Developer",
    company: "Cosmic Technologies",
    period: "2022 - Present",
    description: "Leading the development of responsive web applications using React, managing a team of 3 developers and implementing modern web standards."
  },
  {
    role: "Web Developer",
    company: "Stellar Designs",
    period: "2020 - 2022",
    description: "Created dynamic user interfaces and improved website performance by 40% through code optimization and modern frontend practices."
  },
  {
    role: "UI/UX Intern",
    company: "Galaxy Digital",
    period: "2019 - 2020",
    description: "Assisted in designing user interfaces for mobile applications and conducted user research to improve overall design quality."
  }
];

const Experience = () => {
  return (
    <section id="experience" className="py-24 bg-gray-900/50 relative">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          Experience
        </h2>

        <div className="max-w-3xl mx-auto relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-400 to-purple-600 md:left-1/2"></div>

          {/* Cards group container */}
          <div className="flex flex-col gap-6 group">
            {experienceData.map((item, index) => (
              <div
                key={index}
                className={`relative transition-all duration-300 
                  ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} 
                  flex flex-col md:flex group-hover:blur-sm 
                  hover:!blur-none hover:scale-[1.05]`}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 top-7 w-4 h-4 rounded-full bg-blue-500 md:left-1/2 md:-ml-2 z-10"></div>

                {/* Content */}
                <div className="ml-12 md:ml-0 md:w-1/2 md:px-8">
                  <div className="bg-gray-800/70 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-300">
                    <h3 className="font-bold text-xl text-blue-400">{item.role}</h3>
                    <div className="flex justify-between mb-2">
                      <p className="text-gray-300">{item.company}</p>
                      <p className="text-gray-400 text-sm">{item.period}</p>
                    </div>
                    <p className="text-gray-400">{item.description}</p>
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

export default Experience