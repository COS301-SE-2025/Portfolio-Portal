// client/src/contexts/PortfolioContext.jsx

import React, { createContext, useContext, useState } from "react";

// Create the context
const PortfolioContext = createContext();

/**
 * Portfolio Context Provider
 *
 * Manages global state for portfolio generation process
 */
export const PortfolioProvider = ({ children }) => {
  // Initial state
  const [portfolioData, setPortfolioData] = useState({
    cvData: null, // Extracted CV data from OCR
    selectedTemplate: null, // Selected template ID
    customizations: {}, // Template customization options
    generatedPortfolio: null, // Final generated portfolio data
    currentStep: "upload", // Current step in the portfolio creation process
  });

  // Update portfolio data
  const updatePortfolioData = (newData) => {
    setPortfolioData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  // Set CV data from OCR process
  const setCVData = (cvData) => {
    updatePortfolioData({
      cvData,
      currentStep: "template-selection", // Automatically move to template selection
    });
  };

  // Set selected template
  const setSelectedTemplate = (templateId, customizations = {}) => {
    updatePortfolioData({
      selectedTemplate: templateId,
      customizations,
      currentStep: "preview", // Move to preview step
    });
  };

  // Set generated portfolio data
  const setGeneratedPortfolio = (portfolioData) => {
    updatePortfolioData({
      generatedPortfolio: portfolioData,
      currentStep: "result", // Move to result step
    });
  };

  // Navigate to a specific step
  const navigateToStep = (step) => {
    updatePortfolioData({ currentStep: step });
  };

  // Reset the entire process
  const resetPortfolio = () => {
    setPortfolioData({
      cvData: null,
      selectedTemplate: null,
      customizations: {},
      generatedPortfolio: null,
      currentStep: "upload",
    });
  };

  // Context value
  const value = {
    portfolioData,
    updatePortfolioData,
    setCVData,
    setSelectedTemplate,
    setGeneratedPortfolio,
    navigateToStep,
    resetPortfolio,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};

// Custom hook to use the portfolio context
export const usePortfolioContext = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error(
      "usePortfolioContext must be used within a PortfolioProvider"
    );
  }
  return context;
};

export default PortfolioContext;
