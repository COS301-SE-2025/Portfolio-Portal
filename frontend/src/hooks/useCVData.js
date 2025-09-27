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

    const experience = isObjectArray(cvData.experience)
      ? (cvData.experience || []).map((exp) => ({
          title: exp.position || exp.title || "",
          company: exp.company || "",
          startDate:
            (exp.duration && String(exp.duration).split(" - ")[0]) ||
            exp.startDate ||
            "",
          endDate:
            (exp.duration && String(exp.duration).split(" - ")[1]) ||
            exp.endDate ||
            (exp.startDate ? "Present" : ""),
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

    const education = isObjectArray(cvData.education)
      ? (cvData.education || []).map((edu) => ({
          institution: edu.institution || "",
          degree: edu.degree || "",
          field: edu.field || "",
          endDate: edu.year || edu.endDate || "",
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

    return {
      // Personal info
      name: pi.name || "",
      description: pi.description || "",
      email: pi.email || "",
      summary: pi.description || "",
      phone: pi.phone || "",
      about: pi.description || "",
      address: pi.address || "",

      skills: Array.isArray(cvData.skills) ? cvData.skills : [],
      certifications: Array.isArray(cvData.certifications)
        ? cvData.certifications
        : [],
      languages: Array.isArray(cvData.languages) ? cvData.languages : [],
      references: Array.isArray(cvData.references) ? cvData.references : [],
      projects: Array.isArray(cvData.projects) ? cvData.projects : [],

      experience,
      education,

      links: {
        linkedin: pi.linkedin || "",
        website: pi.website || "",
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
    links: transformedData?.links || {},
    references: transformedData?.references || [],
    languages: transformedData?.languages || [],
  };
};

export default useCVData;
