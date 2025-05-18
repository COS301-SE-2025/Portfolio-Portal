// Extract the raw text from the OCR Scanner

// TODO: implement it so that it extracts all sections listed, and for each section, extract relative info

/**
 * Extracts the candidate's email address from the CV lines.
 * First searches for a line labeled with "email", then falls back to full scan if the email isn't clearly labeled. 
 * @param {string[]} lines - Array of lines from the OCR-scanned CV
 * @returns {string|null} The extracted email address or null if not found
 * TODO: Check wheter the loop is in the candidate section or references to know exactly what email is saved in match.
 *       Not assuming first email is the candidate's.
 */
const extractEmail = (lines) => {
    for (const line of lines) {
        if (line.toLowerCase().includes("email")) {
            const match = line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
            if (match) return match[0];
        }
    }

    const match = lines.join(" ").match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
    return match ? match[0] : null;
}


/**
 * Extracts a phone number from the CV lines.
 * Looks for a line containing "phone" or "mobile", then uses a regex to match various formats.
 * Falls back to scanning the whole CV text if needed.
 * @param {string[]} lines - Array of lines from the OCR-scanned CV
 * @returns {string|null} The extracted phone number or null if not found
 * TODO: Same as with email references section. Also, additional phone number formats?
 */
const extractPhone = (lines) => {
    // extract phone numbers:
    // +27 82 123 4567
    // 082 123 4567
    // 012-345-6789
    // (012) 345 6789
    for (const line of lines) {
        if (line.toLowerCase().includes("phone") || line.toLowerCase().includes("mobile") || line.toLowerCase().includes("number")) {
            const match = line.match(/(\+?\d{1,3}[-\s]?)?(\(?\d{2,4}\)?[-\s]?)?\d{3,4}[-\s]?\d{3,4}/);
        if (match) return match[0];
        }
    }

    const match = lines.join(" ").match(/(\+?\d{1,3}[-\s]?)?(\(?\d{2,4}\)?[-\s]?)?\d{3,4}[-\s]?\d{3,4}/);
    return match ? match[0] : null;
}


/**
 * Extracts LinkedIn and GitHub URLs from the CV.
 * Performs a full-text scan and extracts the first match for each platform.
 * @param {string[]} lines - Array of lines from the OCR-scanned CV
 * @returns {{linkedIn: string|null, github: string|null}} Object containing the extracted links or nulls
 */
const extractLinks = (lines) => {
    const joined = lines.join(" ");
    const linkedIn = joined.match(/linkedin\.com\/[^\s]+/i)?.[0] || null;
    const github = joined.match(/github\.com\/[^\s]+/i)?.[0] || null;
    return { linkedIn, github };
}


/**
 * Extracts the candidate's name from the CV.
 * Assumes the first non-empty line is the name.
 * @param {string[]} lines - Array of lines from the OCR-scanned CV
 * @returns {string} The extracted name or "Unknown" if not found
 */
const extractName = (lines) => {
    return lines[0] || "Unknown";
};


/**
 * Extracts all skills listed under a "Skills" section from the CV lines.
 * @param {string[]} lines - Array of lines from the OCR-scanned CV
 * @returns {string[]} Array of extracted skill strings
 */
const extractSkills = (lines) => {
    const skillsIndex = lines.findIndex(line => line.toLowerCase().includes("skills"));
    if (skillsIndex === -1) return [];

    const skillsLines = [];

    for (let i = skillsIndex + 1; i < lines.length; i++) {
        const line = lines[i].toLowerCase();

        if (line.includes("education") || line.includes("projects") || line.includes("experience") || line.includes("certifications") || line === ""
            || line === " ") {
                break;  // no more skills to extract
        }

        skillsLines.push(line);
    }

    const finalSkills = skillsLines.join(", ").split(/[,•\-–]+/).map(skill => skill.trim()).filter(Boolean);
    return finalSkills;
}


/**
 * Extracts all education listed under a "Education" section from the CV lines.
 * @param {string[]} lines - Array of lines from the OCR-scanned CV
 * @returns {string[]} Array of extracted education strings
 */
const extractEducation = (lines) => {
    
}

/**
 * Main function to process raw OCR text and extract basic CV metadata.
 * @param {string} text - Raw OCR text output from Tesseract.js
 * @returns {{
 *   name: string,
 *   email: string|null,
 *   phone: string|null,
 *   links: {
 *     linkedIn: string|null,
 *     github: string|null
 *   }
 * }}
 */
exports.processCV = (text) => {
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);  // /[\n\r]+/   ?? Fuzzy logic if not correctly spaced

  return {
    name: extractName(lines),
    email: extractEmail(lines),
    phone: extractPhone(lines),
    links: extractLinks(lines)
  };
};