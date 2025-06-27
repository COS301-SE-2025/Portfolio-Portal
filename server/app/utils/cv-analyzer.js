/**
 * Extracts the candidate's email address from the CV lines.
 * Prioritizes lines labeled with "email" outside the references section, then scans non-reference lines.
 * @param {string[]} lines - Array of lines from the OCR-scanned CV
 * @returns {string|null} The extracted email address or null if not found
 */
const extractEmail = (lines) => {
    const nonReferenceLines = lines.slice(0, lines.findIndex(line => line.toLowerCase().includes('references')) === -1 ? lines.length : lines.findIndex(line => line.toLowerCase().includes('references')));
    for (const line of nonReferenceLines) {
        if (line.toLowerCase().includes("email")) {
            const match = line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
            if (match) return match[0];
        }
    }
    const match = nonReferenceLines.join(" ").match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
    return match ? match[0] : null;
};

/**
 * Extracts a phone number from the CV lines.
 * Looks for lines labeled "phone," "mobile," or "number" outside references, then scans non-reference lines.
 * @param {string[]} lines - Array of lines from the OCR-scanned CV
 * @returns {string|null} The extracted phone number or null if not found
 */
const extractPhone = (lines) => {
    const phoneMatch = /(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{2,5}([-.\s]?\d{2,5}){1,3}/;
    const nonReferenceLines = lines.slice(0, lines.findIndex(line => line.toLowerCase().includes('references')) === -1 ? lines.length : lines.findIndex(line => line.toLowerCase().includes('references')));
    for (const line of nonReferenceLines) {
        if (line.toLowerCase().includes("phone") || line.toLowerCase().includes("mobile") || line.toLowerCase().includes("number")) {
            const match = line.match(phoneMatch);
            if (match && match[0].replace(/[^0-9]/g, '').length >= 7) return match[0];
        }
    }
    const match = nonReferenceLines.join(" ").match(phoneMatch);
    if (match && match[0].replace(/[^0-9]/g, '').length >= 7) return match[0];
    return null;
};

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
};

/**
 * Extracts the candidate's name from the CV.
 * Prioritizes labeled "name" or "full name," then checks for capitalized name patterns, then takes first non-empty line.
 * @param {string[]} lines - Array of lines from the OCR-scanned CV
 * @returns {string} The extracted name or "Unknown" if not found
 */
const extractName = (lines) => {
    let firstNonEmpty = null;
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.length === 0) continue;
        if (!firstNonEmpty) firstNonEmpty = trimmed;
        const match = trimmed.match(/^(name|full name)[\s:–-]+(.+)$/i);
        if (match) return match[2].trim();
        if (trimmed.match(/^[A-Z][a-z]+\s+[A-Z][a-z]+/)) return trimmed;
    }
    // Skip common headers like "Curriculum Vitae"
    if (firstNonEmpty && !firstNonEmpty.toLowerCase().includes('curriculum vitae')) {
        return firstNonEmpty;
    }
    return "Unknown";
};

/**
 * Extracts the "About Me" section.
 * @param {string[]} lines - Array of lines from the OCR-scanned CV
 * @returns {string[]} Array of lines from the About section, or empty array if not found
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
    const skills = [];
    for (const line of skillsLines) {
        const lineSkills = line.split(/[,•]\s*/).map(skill => skill.trim()).filter(Boolean);
        skills.push(...lineSkills);
    }
    return skills;
};

/**
 * Extracts all education listed under a "Education" section from the CV lines.
 * @param {string[]} lines - Array of lines from the OCR-scanned CV
 * @returns {Array<{ degree: string, institution: string, field: string, startDate: string, endDate: string, extra: string[] }>} Array of extracted education entries
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
            if (parts.length === 2 && parts[0] && parts[1] && 
                parts[0].match(/\b(BSc|MSc|BA|MA|PhD|Diploma|Certificate)\b/i)) {
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
 * Extracts all experience listed under "Experience" section from the CV lines.
 * @param {string[]} lines - Array of lines from the OCR-scanned CV
 * @returns {Array<{ title: string, company: string, startDate: string, endDate: string, extra: string[] }>} Array of extracted experience entries
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
            if (parts.length === 2 && parts[0] && parts[1] && 
                !parts[0].match(/^\s*(•|-|→|\d+\.)/) && !parts[0].match(/\b(worked|developed|built)\b/i)) {
                if (entry) experience.push(entry);
                entry = {
                    title: parts[0],
                    company: parts[1],
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
};

/**
 * Extracts all certifications listed under "Certifications" section from the CV lines.
 * @param {string[]} lines - Array of lines from the OCR-scanned CV
 * @returns {string[]} Array of extracted certification strings
 */
const extractCertifications = (lines) => {
    const certLines = sectionLines(lines, "certifications");
    if (certLines.length === 0) return [];
    return certLines.map(line => line.trim()).filter(Boolean);
};

/**
 * Extracts all references listed under "References" section from the CV lines.
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

        const phoneMatch = line.match(/(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}/);
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
 * @param {string[]} lines - Array of lines from the OCR-scanned CV
 * @param {string} sectionHeader - The header to look for (e.g., "education")
 * @returns {string[]} Array of lines that belong to that section
 */
const sectionLines = (lines, section) => {
    const index = lines.findIndex(line => line.toLowerCase().includes(section.toLowerCase()));
    if (index === -1) return [];

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
        if (sectionHeadings.includes(lowerLine)) break;
        sectionLines.push(line);
    }

    return sectionLines;
};

/**
 * Extracts a date range (start and end date).
 * Supports formats like: June 2023 – August 2023, 2019 - Present, 06/2023 - 08/2023, 2023.06 - 2023.08
 * @param {string} line
 * @returns {{ startDate: string, endDate: string } | null}
 */
const dateRange = (line) => {
    const match = line.match(
        /(\w+\s+\d{4}|\d{4}|(?:\d{2}\/\d{4}|\d{4}\.\d{2}))\s*[-–]\s*(\w+\s+\d{4}|present|current|\d{4}|(?:\d{2}\/\d{4}|\d{4}\.\d{2}))/i
    );
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
 *   links: { linkedIn: string|null, github: string|null },
 *   about: string[],
 *   skills: string[],
 *   education: Array<{ degree: string, institution: string, field: string, startDate: string, endDate: string, extra: string[] }>,
 *   experience: Array<{ title: string, company: string, startDate: string, endDate: string, extra: string[] }>,
 *   certifications: string[],
 *   references: Array<{ name: string, phone?: string, email?: string }>
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