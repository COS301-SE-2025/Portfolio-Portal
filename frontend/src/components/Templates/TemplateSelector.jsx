// client/src/components/Templates/TemplateSelector.jsx

import React, { useState, useEffect } from "react";
import { usePortfolioContext } from "../../contexts/PortfolioContext";
import axios from "axios";

// Template preview components
const OfficePreview = () => (
  <div className="template-preview office-preview">
    <h3>Office Template</h3>
    <div className="preview-image">
      <img
        src="/assets/templates/office-preview.jpg"
        alt="Office Template Preview"
      />
    </div>
    <p>
      Professional environment suitable for corporate roles and business
      professionals
    </p>
  </div>
);

const SpacePreview = () => (
  <div className="template-preview space-preview">
    <h3>Space Template</h3>
    <div className="preview-image">
      <img
        src="/assets/templates/space-preview.jpg"
        alt="Space Template Preview"
      />
    </div>
    <p>
      Futuristic theme ideal for tech professionals, developers, and innovators
    </p>
  </div>
);

const ForestPreview = () => (
  <div className="template-preview forest-preview">
    <h3>Forest Template</h3>
    <div className="preview-image">
      <img
        src="/assets/templates/forest-preview.jpg"
        alt="Forest Template Preview"
      />
    </div>
    <p>
      Natural setting perfect for creative professionals and
      environmentally-focused roles
    </p>
  </div>
);

/**
 * Template Selector Component
 *
 * This component analyzes CV data and suggests appropriate templates, while
 * also allowing manual selection.
 */
const TemplateSelector = () => {
  const { portfolioData, updatePortfolioData } = usePortfolioContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [suggestedTemplate, setSuggestedTemplate] = useState(null);
  const [templateAnalysis, setTemplateAnalysis] = useState(null);

  useEffect(() => {
    // When CV data is available, call the template selection algorithm
    if (
      portfolioData &&
      portfolioData.cvData &&
      Object.keys(portfolioData.cvData).length > 0
    ) {
      selectTemplateBasedOnCV();
    }
  }, [portfolioData.cvData]);

  /**
   * Call the API to suggest a template based on CV content
   */
  const selectTemplateBasedOnCV = async () => {
    try {
      setLoading(true);
      setError(null);

      // Call the backend API with the CV data
      const response = await axios.post("/api/portfolio/select-template", {
        cvData: portfolioData.cvData,
      });

      if (response.data.success) {
        setSuggestedTemplate(response.data.data.template);
        setTemplateAnalysis(response.data.data);
        setSelectedTemplate(response.data.data.template); // Auto-select the suggested template

        // Update portfolio context with selected template
        updatePortfolioData({
          ...portfolioData,
          selectedTemplate: response.data.data.template,
          customizations: response.data.data.customizations,
        });
      } else {
        setError("Failed to analyze CV and suggest template");
      }
    } catch (err) {
      console.error("Error selecting template:", err);
      setError("An error occurred while analyzing your CV");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle manual template selection
   * @param {String} template - The template ID
   */
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);

    // Update portfolio context with the manually selected template
    updatePortfolioData({
      ...portfolioData,
      selectedTemplate: template,
      // Keep any existing customizations or reset them if needed
      customizations: portfolioData.customizations || {},
    });
  };

  /**
   * Render template recommendation explanation
   */
  const renderAnalysisExplanation = () => {
    if (!templateAnalysis) return null;

    return (
      <div className="template-analysis">
        <h4>Template Selection Analysis</h4>
        <p>
          Based on your CV content, we've selected the{" "}
          <strong>{templateAnalysis.template}</strong> template with a
          confidence score of {Math.round(templateAnalysis.confidence * 100)}%.
        </p>
        {templateAnalysis.template === "office" && (
          <p>
            Your CV indicates professional experience in business, management,
            or corporate environments, which aligns well with the Office
            template's professional aesthetic.
          </p>
        )}
        {templateAnalysis.template === "space" && (
          <p>
            Your CV shows strong technical skills and experience in technology,
            engineering, or innovation, making the Space template an excellent
            match for showcasing your cutting-edge expertise.
          </p>
        )}
        {templateAnalysis.template === "forest" && (
          <p>
            Your CV reflects creative talents or environmental focus, which
            pairs perfectly with the natural and organic aesthetic of the Forest
            template.
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="template-selector-container">
      <h2>Select Portfolio Template</h2>

      {loading && <p>Analyzing your CV to suggest the best template...</p>}
      {error && <p className="error-message">{error}</p>}

      {suggestedTemplate && (
        <div className="suggested-template">
          <h3>Recommended Template Based on Your CV</h3>
          <p>
            We've analyzed your CV and recommend the{" "}
            <strong>{suggestedTemplate}</strong> template for your portfolio
            website.
          </p>
          {renderAnalysisExplanation()}
          <p>You can select this template or choose another one below.</p>
        </div>
      )}

      <div className="template-options">
        <div
          className={`template-option ${
            selectedTemplate === "office" ? "selected" : ""
          }`}
          onClick={() => handleTemplateSelect("office")}
        >
          <OfficePreview />
          <button
            className={`select-button ${
              selectedTemplate === "office" ? "selected" : ""
            }`}
          >
            {selectedTemplate === "office" ? "Selected" : "Select Template"}
          </button>
        </div>

        <div
          className={`template-option ${
            selectedTemplate === "space" ? "selected" : ""
          }`}
          onClick={() => handleTemplateSelect("space")}
        >
          <SpacePreview />
          <button
            className={`select-button ${
              selectedTemplate === "space" ? "selected" : ""
            }`}
          >
            {selectedTemplate === "space" ? "Selected" : "Select Template"}
          </button>
        </div>

        <div
          className={`template-option ${
            selectedTemplate === "forest" ? "selected" : ""
          }`}
          onClick={() => handleTemplateSelect("forest")}
        >
          <ForestPreview />
          <button
            className={`select-button ${
              selectedTemplate === "forest" ? "selected" : ""
            }`}
          >
            {selectedTemplate === "forest" ? "Selected" : "Select Template"}
          </button>
        </div>
      </div>

      {selectedTemplate && (
        <div className="template-actions">
          <button
            className="next-button"
            onClick={() => {
              // Navigate to the next step - could be customization or preview
              // This would typically use a router or context to navigate
            }}
          >
            Continue with{" "}
            {selectedTemplate.charAt(0).toUpperCase() +
              selectedTemplate.slice(1)}{" "}
            Template
          </button>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
