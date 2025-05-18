// Process the raw text from the OCR Scanner

const extract_email = (lines) => {
    for (const line of lines) {
        if (line.toLowerCase().includes("email")) {
            const match = line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
            if (match) return match[0];  // Return first labelled email (most probably candidate)
        }
    }

    // fallback: if no labelled email found, try full scan
    const match = lines.join(" ").match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
    return match ? match[0] : null;
}

const extract_phone = (text) => {
    // extract phone numbers:
    // +27 82 123 4567
    // 082 123 4567
    // 012-345-6789
    // (012) 345 6789
    for (const line of lines) {
        if (line.toLowerCase().includes("phone") || line.toLowerCase().includes("mobile")) {
            const match = line.match(/(\+?\d{1,3}[-\s]?)?(\(?\d{2,4}\)?[-\s]?)?\d{3,4}[-\s]?\d{3,4}/);
        if (match) return match[0];
        }
    }

    const match = lines.join(" ").match(/(\+?\d{1,3}[-\s]?)?(\(?\d{2,4}\)?[-\s]?)?\d{3,4}[-\s]?\d{3,4}/);
    return match ? match[0] : null;
}

const extract_links = (text) => {
    const linkedIn = text.match(/linkedin\.com\/[^\s]+/i)?.[0] || null;
    const github = text.match(/github\.com\/[^\s]+/i)?.[0] || null;
    return { linkedIn, github };
}

const extractName = (lines) => {
    return lines[0] || "Unknown";
};