// hooks/useCVData.js
import { useState, useEffect } from 'react';
import cvDataService from '../services/cvDataService';

export const useCVData = () => {
  const [cvData, setCvData] = useState(cvDataService.getData());

  useEffect(() => {
    // Subscribe to data changes
    const unsubscribe = cvDataService.subscribe(setCvData);
    
    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  return {
    // Raw data
    cvData,
    
    // Convenience getters
    name: cvDataService.getName(),
    email: cvDataService.getEmail(),
    phone: cvDataService.getPhone(),
    about: cvDataService.getAbout(),
    skills: cvDataService.getSkills(),
    experience: cvDataService.getExperience(),
    education: cvDataService.getEducation(),
    certifications: cvDataService.getCertifications(),
    links: cvDataService.getLinks(),
    references: cvDataService.getReferences(),
    
    // Utility functions
    hasData: cvDataService.hasData(),
    setData: (data) => cvDataService.setData(data),
    clearData: () => cvDataService.clearData(),
  };
};