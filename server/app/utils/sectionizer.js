// Input: { name, remainingCV }

const SECTION_KEYWORDS = require("./section-keywords");

const norm = (s) =>
  (s || "")
    .toLowerCase()
    .replace(/[•·●\-\u2022:]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const splitLines = (text) =>
  (text || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Header helpers
const allHeadersList = () =>
  Object.values(SECTION_KEYWORDS)
    .flatMap((v) => v?.inline || [])
    .map(norm);

const sectionHeadersFor = (sectionName) =>
  (SECTION_KEYWORDS[sectionName]?.inline || []).map(norm);

const isAnyHeader = (line, all) => {
  const n = norm(line);
  return all.some((h) => n.startsWith(h));
};

const isSectionHeader = (line, heads) => {
  const n = norm(line);
  return heads.some((h) => n.startsWith(h));
};

// Extract by "header -> next header (or EOF)"
// Returns { sectionLines, cleaned }
const extractSectionByHeader = (lines, sectionName) => {
  const thisHeads = sectionHeadersFor(sectionName);
  if (!thisHeads.length) return { sectionLines: [], cleaned: lines.slice() };

  const allHeads = allHeadersList();
  const start = lines.findIndex((ln) => isSectionHeader(ln, thisHeads));
  if (start === -1) return { sectionLines: [], cleaned: lines.slice() };

  let endExclusive = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (isAnyHeader(lines[i], allHeads)) {
      endExclusive = i;
      break;
    }
  }

  const sectionLines = lines.slice(start + 1, endExclusive); // exclude the header
  const cleaned = lines.slice(0, start).concat(lines.slice(endExclusive));
  return { sectionLines, cleaned };
};

// Personal info helpers
const emailRegexGlobal = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/g;
const phoneRegexGlobal =
  /(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{2,5}([-.\s]?\d{2,5}){1,3}/g;
const urlRegexGlobal =
  /\b((https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-z]{2,})(\/[^\s]*)?\b/g;

const isLikelyAddress = (line) => {
  const n = norm(line);
  const addrWords = (SECTION_KEYWORDS.address?.inline || []).map(norm);
  const hasNum = /\b\d{1,5}\b/.test(line);
  return hasNum && addrWords.some((w) => n.includes(w));
};

// Pull labeled value on the same line or the next line
const pullLabeledValue = (lines, labels) => {
  if (!labels?.length) return null;

  const rx = new RegExp(
    `\\b(${labels.map(escapeRegExp).join("|")})\\b\\s*[:\\-–]?\\s*(.+)?$`,
    "i"
  );

  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(rx);
    if (m) {
      const trimTail = (val) =>
        (val || "").split(/\s*(?:[|,;•·\-—–])\s*/)[0].trim();

      const same = trimTail(m[2] || "");
      if (same) return { value: same, idx: i, usedNext: false };

      const next = trimTail((lines[i + 1] || "").trim());
      if (next) return { value: next, idx: i, usedNext: true };
    }
  }
  return null;
};

const removePicked = (arr, idx, usedNext) => {
  const keep = [];
  for (let i = 0; i < arr.length; i++) {
    if (i === idx) continue;
    if (usedNext && i === idx + 1) continue;
    keep.push(arr[i]);
  }
  return keep;
};

// Main sectionize function
const sectionize = ({ name: ocrName, remainingCV }) => {
  let lines = splitLines(remainingCV);

  // 1) References — generic header-based extraction (header excluded)
  const { sectionLines: references, cleaned: cleanedAfterRefs } =
    extractSectionByHeader(lines, "references");
  lines = cleanedAfterRefs;

  // 2) Personal info
  const personal = {
    name: (ocrName || "").trim(),
    description: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    website: "",
  };

  // 2.a) Name via labels (only if not extracted from OCR)
  if (!personal.name) {
    const nameLabels = SECTION_KEYWORDS.name?.inline || [];
    const got = pullLabeledValue(lines, nameLabels);
    if (got) {
      personal.name = got.value;
      lines = removePicked(lines, got.idx, got.usedNext);
    }
  }

  // 2.b) Email — prefer labels; then fallback to regex anywhere
  const emailLabeled = pullLabeledValue(
    lines,
    SECTION_KEYWORDS.email?.inline || []
  );
  if (emailLabeled) {
    personal.email = emailLabeled.value;
    lines = removePicked(lines, emailLabeled.idx, emailLabeled.usedNext);
  } else {
    const emails = [...lines.join(" ").matchAll(emailRegexGlobal)].map(
      (m) => m[0]
    );
    if (emails.length) {
      personal.email = [...new Set(emails)][0];
      lines = lines.filter((l) => !l.includes(personal.email));
    }
  }

  // 2.c) Phone — prefer labels; then fallback to regex anywhere
  const phoneLabeled = pullLabeledValue(
    lines,
    SECTION_KEYWORDS.phone?.inline || []
  );
  if (phoneLabeled) {
    personal.phone = phoneLabeled.value;
    lines = removePicked(lines, phoneLabeled.idx, phoneLabeled.usedNext);
  } else {
    const phones = [...lines.join(" ").matchAll(phoneRegexGlobal)]
      .map((m) => m[0].trim())
      .filter((num) => num.replace(/[^0-9]/g, "").length >= 7);
    if (phones.length) {
      personal.phone = [...new Set(phones)][0];
      lines = lines.filter((l) => !l.includes(personal.phone));
    }
  }

  // 2.d) LinkedIn — prefer labels; else scan URLs and pick those with linkedin.com
  const linkedinLabeled = pullLabeledValue(
    lines,
    SECTION_KEYWORDS.linkedin?.inline || []
  );
  if (linkedinLabeled) {
    personal.linkedin = linkedinLabeled.value;
    lines = removePicked(lines, linkedinLabeled.idx, linkedinLabeled.usedNext);
  }

  // 2.e) Website — prefer labels; else scan URLs for first non-LinkedIn
  const websiteLabeled = pullLabeledValue(
    lines,
    SECTION_KEYWORDS.website?.inline || []
  );
  if (websiteLabeled) {
    personal.website = websiteLabeled.value;
    lines = removePicked(lines, websiteLabeled.idx, websiteLabeled.usedNext);
  }

  // If still needed, scan all URLs
  if (!personal.linkedin || !personal.website) {
    const urls = [...lines.join(" ").matchAll(urlRegexGlobal)]
      .map((m) => (m[0].startsWith("http") ? m[0] : `https://${m[0]}`))
      .filter((u) => !u.includes("@"));
    const uniqUrls = [...new Set(urls)];

    if (!personal.linkedin) {
      const li = uniqUrls.find((u) => u.toLowerCase().includes("linkedin.com"));
      if (li) personal.linkedin = li;
    }
    if (!personal.website) {
      const w = uniqUrls.find((u) => !u.toLowerCase().includes("linkedin.com"));
      if (w) personal.website = w;
    }

    if (uniqUrls.length) {
      lines = lines.filter(
        (l) => !uniqUrls.some((u) => l.includes(u.replace(/^https?:\/\//, "")))
      );
    }
  }

  // 2.f) About/Summary — generic extractor by header (header excluded)
  const { sectionLines: aboutBlock, cleaned: cleanedAfterAbout } =
    extractSectionByHeader(lines, "about");
  lines = cleanedAfterAbout;
  if (aboutBlock.length) {
    personal.description = aboutBlock.slice(0, 6).join(" ");
  }

  // 2.g) Address — prefer labeled; else heuristic
  const addressLabels = SECTION_KEYWORDS.address?.inline || [];
  const labeledAddr = addressLabels.length
    ? pullLabeledValue(lines, addressLabels)
    : null;
  if (labeledAddr) {
    personal.address = labeledAddr.value;
    lines = removePicked(lines, labeledAddr.idx, labeledAddr.usedNext);
  } else {
    const addrIdx = lines.findIndex(isLikelyAddress);
    if (addrIdx !== -1) {
      personal.address = lines[addrIdx];
      lines = lines.filter((_, i) => i !== addrIdx);
    }
  }

  // 3) Additional sections — extract and remove each (header excluded)
  const out = {};

  // experience
  {
    const { sectionLines, cleaned } = extractSectionByHeader(
      lines,
      "experience"
    );
    out.experience = sectionLines;
    lines = cleaned;
  }

  // education
  {
    const { sectionLines, cleaned } = extractSectionByHeader(
      lines,
      "education"
    );
    out.education = sectionLines;
    lines = cleaned;
  }

  // skills
  {
    const { sectionLines, cleaned } = extractSectionByHeader(lines, "skills");
    out.skills = sectionLines;
    lines = cleaned;
  }

  // certifications
  {
    const { sectionLines, cleaned } = extractSectionByHeader(
      lines,
      "certifications"
    );
    out.certifications = sectionLines;
    lines = cleaned;
  }

  // languages
  {
    const { sectionLines, cleaned } = extractSectionByHeader(
      lines,
      "languages"
    );
    out.languages = sectionLines;
    lines = cleaned;
  }

  // projects
  {
    const { sectionLines, cleaned } = extractSectionByHeader(lines, "projects");
    out.projects = sectionLines;
    lines = cleaned;
  }

  return {
    personal_info: personal,
    experience: out.experience,
    education: out.education,
    skills: out.skills,
    certifications: out.certifications,
    languages: out.languages,
    projects: out.projects,
    references,
    // leftovers: lines,
  };
};

module.exports = {
  sectionize,
  extractSectionByHeader,
};
