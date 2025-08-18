// frontend/src/hooks/useCVData.js
import { useState, useEffec, useMemo } from "react";
import cvDataService from "../services/cvDataService";

export const useCVData = () => {
  const [cvData, setCvData] = useState(cvDataService.getData());

  // transform the data's structure
  const transformedData = useMemo(() => {
    if (!cvData) return null;

    return {
      name: cvData.personal_info?.name || "",
      description: cvData.personal_info?.description || "",
      email: cvData.personal_info?.email || "",
      summary: cvData.summary || "",
      phone: cvData.personal_info?.phone || "",
      about: cvData.summary || "",
      skills: cvData.skills || [],
      experience: (cvData.experience || []).map((exp) => ({
        title: exp.position,
        company: exp.company,
        startDate: exp.duration?.split(" - ")[0] || "",
        endDate: exp.duration?.split(" - ")[1] || "Present",
        extra: exp.description ? [exp.description] : [],
      })),
      education: (cvData.education || []).map((edu) => ({
        institution: edu.institution,
        degree: edu.degree,
        field: edu.field,
        endDate: edu.year || "",
        gpa: edu.gpa || "",
      })),
      certifications: cvData.certifications || [],
      links: {
        linkedin: cvData.personal_info?.linkedin || "",
        website: cvData.personal_info?.website || "",
      },
    };
  }, [cvData]);

  return {
    cvData: transformedData,
    name: transformedData?.name || "",
    description: transformedData?.description || "",
    summary: transformedData?.summary || "",
    email: transformedData?.email || "",
    phone: transformedData?.phone || "",
    about: transformedData?.about || "",
    skills: transformedData?.skills || [],
    experience: transformedData?.experience || [],
    education: transformedData?.education || [],
    certifications: transformedData?.certifications || [],
    links: transformedData?.links || {},
    references: transformedData?.references || [],
  };
};

export default useCVData;
