const { fromPath } = require("pdf2pic");
const tesseract = require("node-tesseract-ocr");
const fs = require("fs");
const path = require("path");
const os = require("os");

const config = {
    lang: "eng",
    oem: 1,
    psm: 3,
};

const extractTextFromPDF = async (pdfPath) => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "cvocr-"));
    const options = {
        density: 300,
        saveFilename: "page",
        savePath: tempDir,
        format: "png",
        width: 1200,
        height: 1600,
    };

    const convert = fromPath(pdfPath, options);
    const pageCount = await getPDFPageCount(pdfPath);

    const imagePaths = [];
    for (let i = 1; i <= pageCount; i++) {
        const result = await convert(i);
        imagePaths.push(result.path);
    }

    const ocrResults = await Promise.all(
        imagePaths.map(img => tesseract.recognize(img, config))
    );

    fs.rmSync(tempDir, { recursive: true, force: true });
    return ocrResults.join("\n\n");
};

// Helper to count pages in the PDF
const getPDFPageCount = async (pdfPath) => {
    const { execSync } = require("child_process");
    const output = execSync(`pdfinfo "${pdfPath}"`).toString();
    const match = output.match(/Pages:\s+(\d+)/);
    return match ? parseInt(match[1], 10) : 1;
};

module.exports = {
    extractTextFromFile: extractTextFromPDF,
};
