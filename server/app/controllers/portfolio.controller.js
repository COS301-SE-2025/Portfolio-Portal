// server/controllers/portfolio.controller.js

/**
 * Portfolio Controller
 *
 * Handles portfolio generation operations, including template selection based on CV content
 */

const templateService = require("../services/template.service");
const Portfolio = require("../models/Portfolio");

/**
 * Analyzes CV data and selects an appropriate template
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.selectTemplate = async (req, res) => {
  try {
    const { cvData } = req.body;

    if (!cvData) {
      return res.status(400).json({
        success: false,
        message: "CV data is required",
      });
    }

    // Use the template selection algorithm
    const templateResult = templateService.selectTemplate(cvData);

    // Return the selected template info and customization options
    return res.status(200).json({
      success: true,
      data: templateResult,
    });
  } catch (error) {
    console.error("Error in template selection:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to select template",
      error: error.message,
    });
  }
};

/**
 * Generates a complete portfolio based on CV data and selected template
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.generatePortfolio = async (req, res) => {
  try {
    const { cvData, templateId, customOptions } = req.body;

    if (!cvData || !templateId) {
      return res.status(400).json({
        success: false,
        message: "CV data and template ID are required",
      });
    }

    // In a real implementation, this would generate the complete portfolio
    // For demo 1, we can return a simplified structure

    // Create a new portfolio record (if using persistence)
    const portfolio = new Portfolio({
      template: templateId,
      customizations: customOptions,
      createdAt: new Date(),
    });

    // Save portfolio to database (if implemented)
    // await portfolio.save();

    // Generate the portfolio content (simplified for demo 1)
    const portfolioData = {
      template: templateId,
      customizations: customOptions || {},
      sections: generatePortfolioSections(cvData, templateId),
    };

    return res.status(200).json({
      success: true,
      data: portfolioData,
    });
  } catch (error) {
    console.error("Error generating portfolio:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate portfolio",
      error: error.message,
    });
  }
};

/**
 * Helper function to generate portfolio sections from CV data
 * @param {Object} cvData - The extracted CV data
 * @param {String} templateId - The selected template ID
 * @returns {Object} Portfolio sections
 */
const generatePortfolioSections = (cvData, templateId) => {
  // Extract relevant information from CV data
  const {
    name,
    title,
    summary,
    skills = [],
    experience = [],
    education = [],
    projects = [],
  } = cvData;

  // Generate sections based on available CV data
  return {
    header: {
      name: name || "Portfolio User",
      title: title || "Professional",
      summary: summary || "",
    },
    skills: skills.map((skill) => ({ name: skill })),
    experience: experience.map((exp) => ({
      title: exp.title,
      company: exp.company,
      duration: `${exp.startDate} - ${exp.endDate || "Present"}`,
      description: exp.description,
    })),
    education: education.map((edu) => ({
      degree: edu.degree,
      institution: edu.institution,
      duration: `${edu.startDate} - ${edu.endDate || "Present"}`,
      details: edu.fieldOfStudy,
    })),
    projects: projects.map((project) => ({
      title: project.title,
      description: project.description,
      technologies: project.technologies || [],
    })),
  };
};

module.exports = exports;
