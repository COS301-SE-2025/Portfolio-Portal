import { useContext } from 'react';
import { PortfolioContext } from '../contexts/PortfolioContexts';

export const useCVData = () => {
  const context = useContext(PortfolioContext);
  
  if (!context) {
    // Return default/empty data if context is not available
    return {
      personalInfo: {},
      experience: [],
      education: [],
      skills: [],
      projects: [],
      contact: {}
    };
  }
  
  return context;
};