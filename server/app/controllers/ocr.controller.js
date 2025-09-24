//server/app/controllers/ocr.controller.js
const fs = require("fs");
const { processCV: ocrProcessCV } = require("../services/ocr.service");
const { processCV: sectionizeCV } = require("../utils/sectionizer");
const { saveCVData } = require("../services/cv.service");
const {
  selectTemplate,
  updateTemplateForUser,
} = require("../services/template.service");

const handleUpload = async (req, res) => {
  try {
    const file = req.file;
    const authId = req.user?.id;

    if (!file || !authId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request" });
    }

    // process CV: OCR -> sectionize into structured JSON
    const rawOCR = await ocrProcessCV(file.path, file.mimetype);
    const structuredCV = sectionizeCV(rawOCR);

    // save structured CV data to database
    try {
      await saveCVData(authId, structuredCV);
    } catch (dbError) {
      console.error("Database save error:", dbError);
    }

    // select appropriate template
    const selectedTemplate = selectTemplate(structuredCV);

    updateTemplateForUser(authId, selectedTemplate);
    return res.status(200).json({
      success: true,
      data: structuredCV,
      template: selectedTemplate,
    });
  } catch (error) {
    console.error("OCR Controller error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process uploaded CV",
      error: error.message,
    });
  } finally {
    // clean up uploaded file
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
};

module.exports = {
  handleUpload,
};
