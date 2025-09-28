//server/app/controllers/ocr.controller.js
const fs = require("fs");
const { processCVWithAI } = require("../services/ocr.service");
const { processCV: processBasicCV } = require("../services/ocr.basic.service");
const { processCV: sectionizeCV } = require("../utils/sectionizer");
const { saveCVData } = require("../services/cv.service");
const {
  selectTemplate,
  updateTemplateForUser,
} = require("../services/template.service");

/**
 * Normalize CV structure to ensure consistency between AI and basic processing
 * @param {Object} cvData - Raw CV data from either processing method
 * @returns {Object} Normalized CV structure
 */
const normalizeCVStructure = (cvData) => {
  // Handle both AI format and basic format
  const isBasicFormat = cvData.name && cvData.remainingCV;
  
  if (isBasicFormat) {
    // Convert basic format to structured format
    return {
      personal_info: {
        name: cvData.name || "",
        description: "", // Will be filled by sectionizer
        email: "",
        phone: "",
        address: "",
        linkedin: "",
        website: ""
      },
      summary: "",
      experience: [],
      education: [],
      skills: [],
      certifications: [],
      languages: [],
      projects: [],
      // Keep raw data for sectionizer processing
      _rawText: cvData.remainingCV || ""
    };
  }
  
  // AI format - ensure all required fields exist
  return {
    personal_info: {
      name: cvData.personal_info?.name || "",
      description: cvData.personal_info?.description || "",
      email: cvData.personal_info?.email || "",
      phone: cvData.personal_info?.phone || "",
      address: cvData.personal_info?.address || "",
      linkedin: cvData.personal_info?.linkedin || "",
      website: cvData.personal_info?.website || ""
    },
    summary: cvData.summary || "",
    experience: Array.isArray(cvData.experience) ? cvData.experience : [],
    education: Array.isArray(cvData.education) ? cvData.education : [],
    skills: Array.isArray(cvData.skills) ? cvData.skills : [],
    certifications: Array.isArray(cvData.certifications) ? cvData.certifications : [],
    languages: Array.isArray(cvData.languages) ? cvData.languages : [],
    projects: Array.isArray(cvData.projects) ? cvData.projects : [],
  };
};

const handleUpload = async (req, res) => {
  try {
    const file = req.file;
    const authId = req.user?.id;
    const useAI = req.body.useAI === 'true'; // Parse string to boolean

    if (!file || !authId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request" });
    }

    let structuredCV;

    if (useAI) {
      // Use AI-powered processing (Groq + structured output)
      try {
        structuredCV = await processCVWithAI(file.path, file.mimetype);
      } catch (aiError) {
        console.error("AI processing failed, falling back to basic OCR:", aiError);
        // Fallback to basic processing if AI fails
        const rawOCR = await processBasicCV(file.path, file.mimetype);
        structuredCV = sectionizeCV(rawOCR);
      }
    } else {
      // Use basic OCR processing + sectionizer
      const rawOCR = await processBasicCV(file.path, file.mimetype);
      structuredCV = sectionizeCV(rawOCR);
    }

    // Ensure structuredCV has the expected format
    if (!structuredCV || typeof structuredCV !== 'object') {
      throw new Error("Failed to extract structured data from CV");
    }

    // Normalize the structure to ensure consistency between AI and basic processing
    const normalizedCV = normalizeCVStructure(structuredCV);

    // Save structured CV data to database
    try {
      await saveCVData(authId, normalizedCV);
    } catch (dbError) {
      console.error("Database save error:", dbError);
      // Continue processing even if database save fails
    }

    // Select appropriate template
    const selectedTemplate = selectTemplate(normalizedCV);
    
    // Update template for user
    try {
      updateTemplateForUser(authId, selectedTemplate);
    } catch (templateError) {
      console.error("Template update error:", templateError);
      // Continue with default template
    }

    return res.status(200).json({
      success: true,
      data: normalizedCV,
      template: selectedTemplate,
      processingMethod: useAI ? 'AI' : 'Basic'
    });

  } catch (error) {
    console.error("OCR Controller error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process uploaded CV",
      error: error.message,
    });
  } finally {
    // Clean up uploaded file
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error("File cleanup error:", cleanupError);
      }
    }
  }
};

module.exports = {
  handleUpload,
};