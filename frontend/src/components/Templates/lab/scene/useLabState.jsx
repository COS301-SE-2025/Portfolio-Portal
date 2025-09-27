// lab/scene/useLabState.js
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";
import useCVData from "../../../../hooks/useCVData";

const Ctx = createContext(null);

export function LabProvider({ children }) {
  const [selected, setSelected] = useState(null);
  const [explodeKey, setExplodeKey] = useState(0);

  const {
    cvData,
    name,
    description,
    email,
    phone,
    about,
    skills,
    certifications,
    education,
    experience,
    links,
  } = useCVData() || {};

  // 3D overlays expect
  const data = useMemo(() => {
    const exp = (experience || []).map((e) => ({
      title: e.title || "",
      company: e.company || "",
      start: e.startDate || "",
      end: e.endDate || "",
      summary: Array.isArray(e.extra) ? e.extra.join(" ") : e.extra || "",
      skills: [],
    }));

    const edu = (education || []).map((ed) => {
      if (typeof ed === "string") return ed;
      return {
        institution: ed.institution || "",
        degree: ed.degree || "",
        field: ed.field || "",
        year: ed.year || ed.endDate || "",
        gpa: ed.gpa || "",
      };
    });

    return {
      user: {
        name: name || "",
        description: description || "",
        email: email || "",
        phone: phone || "",
        address: "",
        linkedin: links?.linkedin || "",
        website: links?.website || "",
      },
      summary: about || cvData?.summary || "",
      skills: skills || [],
      certifications: certifications || [],
      languages: cvData?.languages || [],
      experience: exp,
      education: edu,
      projects: cvData?.projects || [],
    };
  }, [
    cvData,
    name,
    description,
    email,
    phone,
    about,
    skills,
    certifications,
    education,
    experience,
    links,
  ]);

  const reset = useCallback(() => {
    setSelected(null);
    setExplodeKey((k) => k + 1);
  }, []);

  const value = useMemo(
    () => ({
      selected,
      setSelected,
      explodeKey,
      setExplodeKey,
      data,
      reset,
    }),
    [selected, explodeKey, data, reset]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLabState() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useLabState must be used within LabProvider");
  return v;
}
