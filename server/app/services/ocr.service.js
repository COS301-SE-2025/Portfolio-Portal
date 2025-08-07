const { fromPath } = require("pdf2pic");
const tesseract = require("node-tesseract-ocr");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { Groq } = require("groq-sdk");

const config = {
    lang: "eng",
    oem: 1,
    psm: 3,
};

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

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

// Extract text from image files
const extractTextFromImage = async (imagePath) => {
    try {
        return await tesseract.recognize(imagePath, config);
    } catch (error) {
        throw new Error(`Error extracting text from image: ${error.message}`);
    }
};

// Extract text based on file type
const extractTextFromFile = async (filePath, mimeType) => {
    if (mimeType === 'application/pdf') {
        return await extractTextFromPDF(filePath);
    } else if (mimeType.startsWith('image/')) {
        return await extractTextFromImage(filePath);
    } else {
        throw new Error('Unsupported file type');
    }
};

// Convert extracted text to structured JSON using Groq
const convertToStructuredCV = async (rawText) => {
    const prompt = `
    Please convert the following CV/Resume text into a structured JSON format. 
    Extract and organize the information into these categories:
    for the description field, please assume the user's Occupation based on other data
    
    {
        "personal_info": {
            "name": "",
            "description": "",
            "email": "",
            "phone": "",
            "address": "",
            "linkedin": "",
            "website": ""
        },
        "summary": "",
        "experience": [
            {
                "company": "",
                "position": "",
                "duration": "",
                "description": ""
            }
        ],
        "education": [
            {
                "institution": "",
                "degree": "",
                "field": "",
                "year": "",
                "gpa": ""
            }
        ],
        "skills": [],
        "certifications": [],
        "languages": [],
        "projects": [
            {
                "name": "",
                "description": "",
                "technologies": []
            }
        ]
    }
    
    CV Text:
    ${rawText}
    
    Please return only the JSON object, no additional text or formatting.
    `;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama3-70b-8192",
            temperature: 0.1,
            max_tokens: 2000
        });

        const generatedText = chatCompletion.choices[0]?.message?.content || '';
        return parseJSONResponse(generatedText);
    } catch (error) {
        throw new Error(`Groq API error: ${error.message}`);
    }
};

// Parse JSON response from Groq
const parseJSONResponse = (generatedText) => {
    let text = generatedText.trim();
    
    // Remove code block markers
    if (text.startsWith('```json')) text = text.substring(7);
    if (text.startsWith('```')) text = text.substring(3);
    if (text.endsWith('```')) text = text.substring(0, text.length - 3);
    
    // Find JSON in the response
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    
    if (firstBrace === -1 || lastBrace === -1) {
        throw new Error('No JSON found in Groq response');
    }
    
    text = text.substring(firstBrace, lastBrace + 1);
    
    try {
        return JSON.parse(text);
    } catch (parseError) {
        throw new Error(`Error parsing JSON: ${parseError.message}`);
    }
};

// Main processing function
const processCVWithAI = async (filePath, mimeType) => {
    const rawText = await extractTextFromFile(filePath, mimeType);
    return await convertToStructuredCV(rawText);
};

module.exports = {
    extractTextFromFile,
    processCVWithAI
};