//frontend/src/components/Templates/forest/Experience.jsx
import { motion } from "framer-motion";
import { fadeIn } from "../../../utils/motion";
import useCVData from "../../../hooks/useCVData";

const Experience = () => {
  const { experience, education, certifications } = useCVData();

  // Group all experience into one container
  const renderExperience = () => {
    if (!experience || !Array.isArray(experience) || experience.length === 0) {
      return <p className="text-white italic">No experience data available</p>;
    }

    return (
      <div className="bg-[#0e0e2c]/70 p-8 rounded-2xl backdrop-blur-sm border border-green-400/20">
        <h3 className="text-green-400 text-3xl font-bold mb-6">Professional Journey</h3>
        
        <div className="space-y-8">
          {experience.map((exp, index) => {
            // Safely access object properties
            const title = exp.title || exp.position || exp.jobTitle || exp.text || '';
            const company = exp.company || exp.employer || exp.organization || '';
            const startDate = exp.startDate || exp.date || exp.duration || '';
            const endDate = exp.endDate || exp.toDate || (startDate ? 'Present' : '');
            const description = exp.description || exp.desc || exp.summary || '';
            const bullets = exp.bullets || exp.extra || exp.points || [];

            // Skip if no meaningful data
            if (!title && !company && !description) return null;

            return (
              <div key={index} className="border-l-4 border-green-400 pl-6 pb-6 last:pb-0">
                {(title || company) && (
                  <div className="flex justify-between items-start mb-3 flex-col sm:flex-row">
                    <div className="mb-2 sm:mb-0">
                      {title && <h4 className="text-white text-xl font-bold">{title}</h4>}
                      {company && <p className="text-green-300 text-lg mt-1">{company}</p>}
                    </div>
                    {(startDate || endDate) && (
                      <span className="text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full text-sm">
                        {startDate} {endDate ? ' - ' : ''} {endDate}
                      </span>
                    )}
                  </div>
                )}
                
                {description && (
                  <p className="text-white mb-3 leading-relaxed">{description}</p>
                )}
                
                {Array.isArray(bullets) && bullets.length > 0 && (
                  <ul className="text-white list-disc pl-5 space-y-1">
                    {bullets.map((bullet, bulletIndex) => (
                      <li key={bulletIndex} className="leading-relaxed">{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Group all education into one container
  const renderEducation = () => {
    if (!education || !Array.isArray(education) || education.length === 0) {
      return <p className="text-white italic">No education data available</p>;
    }

    return (
      <div className="bg-[#0e0e2c]/70 p-8 rounded-2xl backdrop-blur-sm border border-green-400/20">
        <h3 className="text-green-400 text-3xl font-bold mb-6">Educational Background</h3>
        
        <div className="space-y-6">
          {education.map((edu, index) => {
            // Safely access object properties
            const degree = edu.degree || edu.qualification || edu.program || edu.text || '';
            const institution = edu.institution || edu.school || edu.university || edu.college || '';
            const field = edu.field || edu.major || edu.specialization || '';
            const dates = edu.dates || edu.date || edu.duration || edu.year || '';
            const gpa = edu.gpa || edu.grade || '';

            // Skip if no meaningful data
            if (!degree && !institution) return null;

            return (
              <div key={index} className="border-l-4 border-green-400 pl-6 pb-6 last:pb-0">
                <div className="flex justify-between items-start mb-2 flex-col sm:flex-row">
                  <div className="mb-2 sm:mb-0">
                    {degree && <h4 className="text-white text-xl font-bold">{degree}</h4>}
                    {institution && <p className="text-green-50 text-lg mt-1">{institution}</p>}
                  </div>
                  {dates && (
                    <span className="text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full text-sm">
                      {dates}
                    </span>
                  )}
                </div>
                
                <div className="space-y-1">
                  {field && (
                    <p className="text-white text-sm">
                      <span className="text-gray-400">Field: </span>
                      {field}
                    </p>
                  )}
                  {gpa && (
                    <p className="text-white text-sm">
                      <span className="text-gray-400">GPA: </span>
                      {gpa}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Group all certifications into one container
  const renderCertifications = () => {
    if (!certifications || !Array.isArray(certifications) || certifications.length === 0) {
      return null;
    }

    return (
      <div className="bg-[#0e0e2c]/70 p-8 rounded-2xl backdrop-blur-sm border border-green-400/20">
        <h3 className="text-green-400 text-3xl font-bold mb-6">Certifications & Qualifications</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certifications.map((cert, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-white">
                {typeof cert === 'string' ? cert : cert.name || "Certification"}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section id="experience" className="relative w-full py-20 mx-auto">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={fadeIn("left", "spring", 0.5, 1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <h2 className="text-emerald-50 text-4xl font-bold mb-10">
            Professional Experience
          </h2>
          {renderExperience()}

          <h2 className="text-emerald-50 text-4xl font-bold mt-20 mb-10">
            Education
          </h2>
          {renderEducation()}

          {certifications && certifications.length > 0 && (
            <>
              <h2 className="text-green-400 text-4xl font-bold mt-20 mb-10">
                Certifications
              </h2>
              {renderCertifications()}
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;