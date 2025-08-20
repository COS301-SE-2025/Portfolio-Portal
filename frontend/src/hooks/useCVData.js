// frontend/src/hooks/useCVData.js
import { useState, useEffect, useMemo } from "react";
import cvDataService from "../services/cvDataService";

export const useCVData = () => {
  const [cvDataRaw, setCvDataRaw] = useState(() => cvDataService.getData());

  useEffect(() => {
    // subscribe to changes from cvDataService
    const unsubscribe = cvDataService.subscribe((data) => {
      setCvDataRaw(data);
    });

    // If there's no cached data, try to fetch from /cv/me (backend)
    if (!cvDataService.hasData() && cvDataService.getMyCV) {
      cvDataService.getMyCV()
        .then(res => {
          if (res?.data) {
            cvDataService.setData(res.data);
            // setCvDataRaw will be triggered by the subscription
          }
        })
        .catch(() => {
          // no CV on server or not authenticated — ignore silently
        });
    }

    return () => unsubscribe();
    // run once on mount
  }, []);

  // transform the data's structure
  const transformedData = useMemo(() => {
    const cvData = cvDataRaw;
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
      references: cvData.references || [],
    };
  }, [cvDataRaw]);

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
