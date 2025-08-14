const fs = require("fs");
const { processCVWithAI } = require("../services/ocr.service");
const { saveCVData } = require("../services/cvData.service");

/**
 * Handle uploaded CV file, run OCR, and return structured CV data
 * @param {*} req - Express request (expects req.file from multer)
 * @param {*} res - Express response
 */
const handleUpload = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        // Get user ID from authenticated request
        const authId = req.user?.id;
        if (!authId) {
            return res.status(401).json({ success: false, message: "User authentication required" });
        }

        // Process CV with OCR and AI
        const structuredCV = await processCVWithAI(file.path, file.mimetype);

        // Save structured CV data to database
        try {
            const savedCVData = await saveCVData(authId, structuredCV);
            console.log(`CV data saved to database for user: ${authId}`);
        } catch (dbError) {
            console.error("Database save error:", dbError);
            // Continue with response even if database save fails
            // This ensures the user still gets their processed CV data
        }

        return res.status(200).json({
            success: true,
            data: structuredCV
        });
    } catch (error) {
        console.error("OCR Controller error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to process uploaded CV",
            error: error.message
        });
    } finally {
        // Clean up uploaded file
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
};

module.exports = {
    handleUpload
};