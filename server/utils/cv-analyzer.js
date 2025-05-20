// Extract and analyze the raw text from the OCR Scanner

// TODO: implement it so that it extracts all sections listed, and for each section, extract relative info

/**
 * Extracts the candidate's email address from the CV lines.
 * First searches for a line labeled with "email", then falls back to full scan if the email isn't clearly labeled. 
 * @param {string[]} lines - Array of lines from the OCR-scanned CV
 * @returns {string|null} The extracted email address or null if not found
 * TODO: (Demo 2) Check wheter the loop is in the candidate section or references to know exactly what email is saved in match.
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
    const linkedIn = joined.match(/linkedin\.com\/[^\s]+/i)?.[0] || null;  // case insensitive matching
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
    const skillsLines = extractSectionLines(lines, "skills");
    if (skillsLines.length === 0) return [];

    const finalSkills = skillsLines.join(", ").split(/[,•\-–]+/).map(skill => skill.trim()).filter(Boolean);
    return finalSkills;
}


/**
 * Extracts all education listed under a "Education" section from the CV lines.
 * @param {string[]} lines - Array of lines from the OCR-scanned CV
 * @returns {string[]} Array of extracted education strings
 * TODO: Implement analyzing different date formats
 */
const extractEducation = (lines) => {
    const edLines = extractSectionLines(lines, "education");
    if (edLines.length === 0) return [];

    const entry = {
        degree: "",
        institution: "",
        field: "",  // TODO
        startDate: "",
        endDate: "",
        extra: []
    };

    for (const line of edLines) {
        const lower = line.toLowerCase();

        if (line.includes(" - ")) {
            // Likely degree tehn institution
            const [degree, institution] = line.split(" - ");
            entry.degree = degree.trim();
            entry.institution = institution.trim();
        } else if (lower.includes("graduated")) {
            const match = line.match(/\b\w+\s+\d{4}\b/); // e.g. December 2025  ->  TODO: other date formats
            if (match) entry.endDate = match[0];
        } else if (/\d{4}\s*[-–]\s*(present|current|\d{4})/i.test(line)) {
            const match = line.match(/(\d{4})\s*[-–]\s*(present|current|\d{4})/i);  // only years  ->  TODO: months
            if (match) {
                entry.startDate = match[1];
                entry.endDate = match[2];
            }
        } else {
            entry.extra.push(line.trim());  // projects, etc...
        }
    }

    return [entry];
}


/**
 * Extracts all lines from a specific CV section based on its header.
 * Stops when a new section starts (based on common section headers).
 *
 * @param {string[]} lines - The OCR-processed lines of the CV
 * @param {string} sectionHeader - The header to look for (e.g., "education")
 * @returns {string[]} Array of lines that belong to that section
 */
const extractSectionLines = (lines, section) => {
    const index = lines.findIndex(line => line.toLowerCase().includes(section.toLowerCase()));
    if (index === -1) {
        return [];
    }

    const sectionLines = [];
    for (let i = index + 1; i < lines.length; i++) {
        const line = lines[i].trim().toLowerCase();
        if (
            line.includes("skills") ||
            line.includes("experience") ||
            line.includes("projects") ||
            line.includes("certifications") ||
            line.includes("references") ||
            line.includes("contact")
        ) {
            break;
        }
        sectionLines.push(line);
    }

    return sectionLines;
};


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
    const lines = text.split(/\s*[\n]\s*/).map(l => l.trim()).filter(Boolean);

    return {
        name: extractName(lines),
        email: extractEmail(lines),
        phone: extractPhone(lines),
        links: extractLinks(lines),
        skills: extractSkills(lines),
        education: extractEducation(lines),
    };
};