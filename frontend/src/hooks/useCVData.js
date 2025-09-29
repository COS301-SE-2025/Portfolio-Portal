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
      cvDataService
        .getMyCV()
        .then((res) => {
          if (res?.data) {
            // backend may return { success, data, template }; keep only the .data payload
            const onlyData = res.data?.data ?? res.data;
            cvDataService.setData(onlyData);
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

  const transformedData = useMemo(() => {
    const cvData = cvDataRaw?.data ?? cvDataRaw;
    if (!cvData) return null;

    const pi = cvData.personal_info || {};

    const isStringArray = (arr) =>
      Array.isArray(arr) && arr.every((x) => typeof x === "string");
    const isObjectArray = (arr) =>
      Array.isArray(arr) && arr.every((x) => x && typeof x === "object");

    // Handle new structured experience format
    const experience = isObjectArray(cvData.experience)
      ? (cvData.experience || []).map((exp) => ({
          title: exp.title || exp.position || "",
          company: exp.company || "",
          startDate: exp.dateRange ? exp.dateRange.split(" - ")[0]?.trim() : 
                   (exp.duration && String(exp.duration).split(" - ")[0]) ||
                   exp.startDate || "",
          endDate: exp.dateRange ? exp.dateRange.split(" - ")[1]?.trim() || "Present" :
                  (exp.duration && String(exp.duration).split(" - ")[1]) ||
                  exp.endDate || (exp.startDate ? "Present" : ""),
          extra: exp.description
            ? [exp.description]
            : Array.isArray(exp.extra)
            ? exp.extra
            : [],
        }))
      : isStringArray(cvData.experience)
      ? cvData.experience.map((line) => ({
          title: line,
          company: "",
          startDate: "",
          endDate: "",
          extra: [],
        }))
      : [];

    // Handle new structured education format
    const education = isObjectArray(cvData.education)
      ? (cvData.education || []).map((edu) => ({
          institution: edu.institution || "",
          degree: edu.degree || "",
          field: edu.field || "",
          endDate: edu.dateRange || edu.year || edu.endDate || "",
          gpa: edu.gpa || "",
        }))
      : isStringArray(cvData.education)
      ? cvData.education.map((line) => ({
          institution: line,
          degree: "",
          field: "",
          endDate: "",
          gpa: "",
        }))
      : [];

    // Handle new structured skills format (categorized)
    const skills = cvData.skills && typeof cvData.skills === 'object' && !Array.isArray(cvData.skills)
      ? [
          ...(cvData.skills.technical || []),
          ...(cvData.skills.soft || []),
          ...(cvData.skills.tools || [])
        ]
      : Array.isArray(cvData.skills) 
      ? cvData.skills 
      : [];

    // Handle new structured certifications format
    const certifications = isObjectArray(cvData.certifications)
      ? (cvData.certifications || []).map((cert) => ({
          title: cert.title || "",
          issuer: cert.issuer || "",
          dateIssued: cert.dateIssued || "",
          dateExpires: cert.dateExpires || "",
          description: cert.description || "",
        }))
      : Array.isArray(cvData.certifications)
      ? cvData.certifications
      : [];

    // Handle new structured projects format
    const projects = isObjectArray(cvData.projects)
      ? (cvData.projects || []).map((project) => ({
          title: project.title || "",
          description: project.description || "",
          technologies: project.technologies || [],
          dateRange: project.dateRange || "",
          url: project.url || "",
        }))
      : Array.isArray(cvData.projects)
      ? cvData.projects
      : [];

    return {
      // Personal info
      name: pi.name || "",
      description: pi.description || "", // Brief professional title for Hero
      email: pi.email || "",
      summary: pi.description || "", // Brief professional title for Hero (same as description)
      phone: pi.phone || "",
      about: cvData.summary || pi.description || "", // Longer description for About Me
      address: pi.address || "",

      skills,
      certifications,
      languages: Array.isArray(cvData.languages) ? cvData.languages : [],
      references: Array.isArray(cvData.references) ? cvData.references : [],
      projects,

      experience,
      education,

      links: {
        linkedin: pi.linkedin || "",
        website: pi.website || "",
      },

      // Provide access to structured data for advanced use cases
      _structured: {
        skills: cvData.skills,
        certifications: cvData.certifications,
        projects: cvData.projects,
      },

      _raw: {
        experience: cvData.experience || [],
        education: cvData.education || [],
      },
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
    address: transformedData?.address || "",
    skills: transformedData?.skills || [],
    experience: transformedData?.experience || [],
    education: transformedData?.education || [],
    certifications: transformedData?.certifications || [],
    projects: transformedData?.projects || [],
    links: transformedData?.links || {},
    references: transformedData?.references || [],
    languages: transformedData?.languages || [],
    // Provide access to structured data for advanced use cases
    structuredSkills: transformedData?._structured?.skills,
    structuredCertifications: transformedData?._structured?.certifications,
    structuredProjects: transformedData?._structured?.projects,
  };
};

export default useCVData;
