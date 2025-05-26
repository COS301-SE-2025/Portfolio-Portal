const tesseract = require("node-tesseract-ocr");
const { PdfConverter } = require("pdf-poppler");
const fs = require("fs");
const path = require("path");
const os = require("os");

const config = {
    lang: "eng",
    oem: 1,
    psm: 3,
};

/**
 * Convert PDF to images, then run OCR
 * @param {string} pdfPath - Path to uploaded PDF
 * @returns {Promise<string>} - Full OCR text
 */
const extractTextFromPDF = async (pdfPath) => {
    const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "cvocr-"));
    const converter = new PdfConverter(pdfPath);

    await converter.convert(outputDir, {
        pngFile: true,
        resolution: 300,
    });

    const images = fs.readdirSync(outputDir)
        .filter((f) => f.endsWith(".png"))
        .map((f) => path.join(outputDir, f));

    const ocrResults = await Promise.all(images.map(img => tesseract.recognize(img, config)));

    // Cleanup
    fs.rmSync(outputDir, { recursive: true, force: true });

    return ocrResults.join("\n\n");
};

module.exports = {
    extractTextFromFile: extractTextFromPDF,  // same interface expected by controller
};
