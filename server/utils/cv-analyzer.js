// Extract and analyze the raw text from the OCR Scanner

// Note: Education and Experience dashes issue

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
 * TODO: Same as with email references section.
 */
const extractPhone = (lines) => {
    const phoneMatch = /(\+?\d{1,3}[-\s]?)?(\(?\d{2,4}\)?[-\s]?)*\d{2,5}([-\s]?\d{2,5}){1,3}/;

    for (const line of lines) {
        if (line.toLowerCase().includes("phone") || line.toLowerCase().includes("mobile") || line.toLowerCase().includes("number")) {
            const match = line.match(phoneMatch);
            if (match) return match[0];
        }
    }

    const match = lines.join(" ").match(phoneMatch);
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
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.length === 0) continue;  // skips empty lines

        const match = trimmed.match(/^(name|full name)[\s:–-]+(.+)$/i);
        if (match) {
            return match[2].trim();
        }

        return trimmed;
    }
    return "Unknown";
};


/**
 * Extracts the "About Me".
 *
 * @param {string[]} lines - Array of lines from the OCR-scanned CV
 * @returns {string|null} The extracted About section or null if not found
 */
const extractAbout = (lines) => {
    const keywords = ["about", "about me", "summary", "profile"];

    for (const keyword of keywords) {
        const aboutLines = sectionLines(lines, keyword);
        if (aboutLines.length > 0) {
            return aboutLines.map(line => line.trim()).filter(Boolean);
        }
    }

    return [];
};


/**
 * Extracts all skills listed under a "Skills" section from the CV lines.
 * @param {string[]} lines - Array of lines from the OCR-scanned CV
 * @returns {string[]} Array of extracted skill strings
 */
const extractSkills = (lines) => {
    const skillsLines = sectionLines(lines, "skills");
    if (skillsLines.length === 0) return [];

    const finalSkills = skillsLines.join(", ").split(/[,•]+/).map(skill => skill.trim()).filter(Boolean);
    return finalSkills;
}


/**
 * Extracts all education listed under a "Education" section from the CV lines.
 * @param {string[]} lines - Array of lines from the OCR-scanned CV
 * @returns {Array<{ degree: string, institution: string, field: string, startDate: string, endDate: string, extra: string[] }>} - Array of extracted education strings
 * TODO: Implement analyzing different date formats
 */
const extractEducation = (lines) => {
    const edLines = sectionLines(lines, "education");
    if (edLines.length === 0) return [];

    const entries = [];
    let entry = null;
    let pendingDates = null;

    for (const line of edLines) {
        const trimmed = line.trim();
        const lower = trimmed.toLowerCase();
        if (!trimmed) continue;

        const dates = dateRange(trimmed);
        if (dates) {
            if (entry) {
                entry.startDate = dates.startDate;
                entry.endDate = dates.endDate;
            } else {
                pendingDates = dates;
            }
            continue;
        }

        if (lower.includes("graduated") || lower.includes("matriculated")) {
            const match = trimmed.match(/\b\w+\s+\d{4}\b/) || trimmed.match(/\b\d{4}\b/);
            if (match) {
                const date = match[0];
                if (entry) {
                    entry.endDate = date;
                } else {
                    pendingDates = { startDate: "", endDate: date };
                }
            } else if (entry) {
                entry.extra.push(trimmed);
            }
            continue;
        }

        if (trimmed.includes("-")) {
            const parts = trimmed.split("-").map(part => part.trim());
            if (parts.length === 2) {
                if (entry) entries.push(entry);

                entry = {
                    degree: parts[0],
                    institution: parts[1],
                    field: "",
                    startDate: pendingDates?.startDate || "",
                    endDate: pendingDates?.endDate || "",
                    extra: []
                };
                pendingDates = null;
                continue;
            }
        }

        if (entry) {
            entry.extra.push(trimmed);
        }
    }

    if (entry) entries.push(entry);
    return entries;
};


/**
 * Extract all experience listed under "Experience" section from the CV lines.
 * @param {string[]} lines - Array of lines from the OCR-scanned CV
 * @returns {Array<{ title: string, company: string, startDate: string, endDate: string, extra: string }>} - Array of extracted experience strings.
 */
const extractExperience = (lines) => {
    const expLines = sectionLines(lines, "experience");
    if (expLines.length === 0) return [];

    const experience = [];
    let pendingDates = null;
    let entry = null;

    for (let i = 0; i < expLines.length; i++) {
        const line = expLines[i].trim();
        if (!line) continue;

        const dates = dateRange(line);
        if (dates) {
            if (entry) {
                entry.startDate = dates.startDate;
                entry.endDate = dates.endDate;
            } else {
                pendingDates = dates;
            }
            continue;
        }

        if (line.includes("-")) {
            const parts = line.split("-").map(part => part.trim());
            if (parts.length === 2) {
                if (entry) experience.push(entry);

                entry = {
                    title: parts[0].trim(),
                    company: parts[1].trim(),
                    startDate: pendingDates?.startDate || "",
                    endDate: pendingDates?.endDate || "",
                    extra: []
                };
                pendingDates = null;
                continue;
            }
        }

        if (entry) {
            entry.extra.push(line.replace(/^(\s*(•|-|→|\d+\.)\s*)/, "").trim());
        }
    }

    if (entry) experience.push(entry);

    return experience;
}


/**
 * Extract all certifications listed under "Certifications" section from the CV lines.
 * @param {string[]} lines - Array of lines from the OCR-scanned CV
 * @returns {string[]} - Array of extracted certification strings.
 */
const extractCertifications = (lines) => {
    const certLines = sectionLines(lines, "certifications");
    if (certLines.length === 0) return [];

    return certLines.map(line => line.trim()).filter(Boolean);
};


/**
 * Extract all references listed under "References" section from the CV lines.
 * @param {string[]} lines - Array of lines from the OCR-scanned CV
 * @returns {Array<{ name: string, phone?: string, email?: string }>} Array of extracted reference objects
 */
const extractReferences = (lines) => {
    const refLines = sectionLines(lines, "references");
    if (refLines.length === 0) return [];

    const references = [];
    let current = {};

    for (const line of refLines) {
        const lower = line.toLowerCase();
        if (!lower.trim()) continue;

        const phoneMatch = line.match(/(\+?\d{1,3}[-\s]?)?(\(?\d{2,4}\)?[-\s]?)?\d{3,4}[-\s]?\d{3,4}/);
        const emailMatch = line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);

        if (emailMatch) {
            current.email = emailMatch?.[0] || "";
        } else if (lower.includes("mobile") || lower.includes("phone") || lower.includes("number") || phoneMatch) {
            current.phone = phoneMatch?.[0] || "";
        } else {
            if (Object.keys(current).length > 0) {
                references.push(current);
                current = {};
            }
            current.name = line.trim();
        }
    }

    if (Object.keys(current).length > 0) {
        references.push(current);
    }

    return references;
};


/**
 * Extracts all lines from a specific CV section based on its header.
 * Stops when a new section starts (based on common section headers).
 *
 * @param {string[]} lines - Array of lines from the OCR-scanned CV
 * @param {string} sectionHeader - The header to look for (e.g., "education")
 * @returns {string[]} Array of lines that belong to that section
 */
const sectionLines = (lines, section) => {
    const index = lines.findIndex(line => line.toLowerCase().includes(section.toLowerCase()));
    if (index === -1) {
        return [];
    }

    const sectionLines = [];
    const sectionHeadings = [
        "skills",
        "experience",
        "projects",
        "certifications",
        "references",
        "education",
        "about",
        "about me",
        "summary",
        "profile",
    ];

    for (let i = index + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        const lowerLine = line.toLowerCase();

        if (sectionHeadings.includes(lowerLine)) {
            break;
        }

        sectionLines.push(line);
    }

    return sectionLines;
};


/**
 * Extracts a date range (start and end date).
 * Supports formats like:
 *   - June 2023 – August 2023
 *   - 2019 - Present
 *   - Feb 2020 - 2021
 *
 * @param {string} line
 * @returns {{ startDate: string, endDate: string } | null}
 */
const dateRange = (line) => {
    const match = line.match(/(\w+\s+\d{4}|\d{4})\s*[-–]\s*(\w+\s+\d{4}|present|current|\d{4})/i);

    if (match) {
        let [, start, end] = match;
        return {
            startDate: start,
            endDate: end.toLowerCase() === 'present' || end.toLowerCase() === 'current' ? 'present' : end
        };
    }

    return null;
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
const processCV = (text) => {
    const lines = text.split(/\s*[\n]\s*/).map(l => l.trim()).filter(Boolean);

    return {
        name: extractName(lines),
        email: extractEmail(lines),
        phone: extractPhone(lines),
        links: extractLinks(lines),
        about: extractAbout(lines),
        skills: extractSkills(lines),
        education: extractEducation(lines),
        experience: extractExperience(lines),
        certifications: extractCertifications(lines),
        references: extractReferences(lines),
    };
};

module.exports = {
    extractEmail,
    extractPhone,
    extractName,
    extractLinks,
    extractAbout,
    extractCertifications,
    extractSkills,
    extractEducation,
    extractExperience,
    extractReferences,
    processCV
};