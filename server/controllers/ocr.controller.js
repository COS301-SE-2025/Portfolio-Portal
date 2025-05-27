const { extractTextFromFile } = require("../services/ocr.service");
const { processCV } = require("../utils/cv-analyzer");

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

        const rawText = await extractTextFromFile(file.path);
        const structuredCV = processCV(rawText);

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
    }
};

module.exports = {
    handleUpload
};
