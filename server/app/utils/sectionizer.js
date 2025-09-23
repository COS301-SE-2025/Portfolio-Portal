const SECTION_KEYWORDS = require("./section-keywords");

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/g;
const PHONE_RE =
  /(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{2,5}([-.\\s]?\d{2,5}){1,3}/g;
const URL_RE =
  /\b((https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-z]{2,})(\/[\S]*)?\b/g;
const ADDRESS_LABELS =
  /(address|location|residential\s*address|physical\s*address)/i;
const ADDRESS_LIKE =
  /\b(\d+\s+[^,\n]+\b(st(\.|reet)?|rd|road|ave|avenue|dr|drive|ln|lane|ct|court|blvd|boulevard)\b|\b(?:suburb|town|city|province|postal|zip)\b)/i;

const norm = (s) => (s ?? "").toString().trim();
const toLower = (s) => norm(s).toLowerCase();
const unique = (arr) =>
  Array.from(new Set(arr.filter(Boolean).map((s) => s.trim())));
const digits = (s) => (s || "").replace(/[^0-9]/g, "");

// top-of-document window for address/contacts proximity
const TOP_WINDOW = 25;

const TOP_LEVEL_SECTIONS = [
  "experience",
  "education",
  "skills",
  "certifications",
  "languages",
  "projects",
  "references",
  "about",
  "personal_info",
];

function isHeader(line, sectionName) {
  const meta = SECTION_KEYWORDS[sectionName];
  const variants = meta?.inline || [];
  const L = norm(line).toLowerCase();
  return variants.some((v) => {
    if (!v) return false;
    const escaped = v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`^\\s*${escaped}\\s*(?:[:\\-—])?\\s*$`, "i");
    return re.test(L);
  });
}

function findHeaderIndex(lines, sectionName) {
  for (let i = 0; i < lines.length; i++) {
    if (isHeader(lines[i], sectionName)) return i;
  }
  return -1;
}

function isTopLevelHeaderLine(line) {
  for (const sec of TOP_LEVEL_SECTIONS) {
    if (isHeader(line, sec)) return true;
  }
  return false;
}

function findNextHeaderIndex(lines, startIdx) {
  for (let i = startIdx; i < lines.length; i++) {
    if (isTopLevelHeaderLine(lines[i])) return i;
  }
  return lines.length; // no more headers
}

/**
 * Generic: find header for `sectionName`, collect every line below it until the
 * next header (of ANY section) or EOF. Returns { sectionLines, cleanedLines, range }
 *
 * - Does NOT include the header line itself in `sectionLines`.
 * - "cleanedLines" removes the header and the captured block.
 */
function extractSectionByHeader(lines, sectionName) {
  const startHeader = findHeaderIndex(lines, sectionName);
  if (startHeader === -1) {
    return { sectionLines: [], cleanedLines: [...lines], range: null };
  }

  const contentStart = startHeader + 1;
  const nextHeader = findNextHeaderIndex(lines, contentStart);
  const contentEnd = nextHeader;

  const sectionLines = lines
    .slice(contentStart, contentEnd)
    .map((s) => s.trim())
    .filter(Boolean);
  const cleanedLines = [
    ...lines.slice(0, startHeader),
    ...lines.slice(contentEnd),
  ];

  return { sectionLines, cleanedLines, range: [startHeader, contentEnd] };
}

function extractEmails(lines) {
  const matches = [...(lines.join(" ").matchAll(EMAIL_RE) || [])].map(
    (m) => m[0]
  );
  return unique(matches);
}

function extractPhones(lines) {
  const allMatches = [...(lines.join(" ").matchAll(PHONE_RE) || [])]
    .map((m) => m[0])
    .map((num) => num.trim())
    .filter((num) => digits(num).length >= 7);
  return [...new Set(allMatches)];
}

function extractLinksAll(lines) {
  const text = lines.join(" ");

  const emailSpans = [...(text.matchAll(EMAIL_RE) || [])].map((m) =>
    m[0].toLowerCase()
  );

  const urls = [...(text.matchAll(URL_RE) || [])].map((m) => m[0]);

  const normalized = urls
    .filter((u) => !u.includes("@"))
    .map((u) => (u.startsWith("http") ? u : `https://${u}`));

  const filteredOutEmailSubs = normalized.filter((url) => {
    const clean = url.replace(/^https?:\/\//i, "").toLowerCase();
    return !emailSpans.some((em) => em.includes(clean));
  });

  const linkedIn = unique(
    filteredOutEmailSubs.filter((u) => u.toLowerCase().includes("linkedin.com"))
  );
  const others = unique(
    filteredOutEmailSubs.filter(
      (u) =>
        !u.toLowerCase().includes("linkedin.com") &&
        !u.toLowerCase().includes("github.com")
    )
  );
  return { linkedIn, other: others };
}

function removeStringsFromLines(lines, strings) {
  const toRemove = new Set(strings.filter(Boolean));
  if (!toRemove.size) return [...lines];
  return lines.filter((line) => {
    const L = line.toLowerCase();
    for (const s of toRemove) {
      if (!s) continue;
      const needle = s.toLowerCase();
      if (L.includes(needle)) return false;
    }
    return true;
  });
}

function extractNameFallback(lines, currentName) {
  if (norm(currentName)) return currentName;

  const label =
    /(full\s*name|name|first\s*name|given\s*name|middle\s*name|surname|last\s*name|family\s*name)\s*[:\-–]\s*(.+)$/i;
  for (let i = 0; i < lines.length; i++) {
    const m = norm(lines[i]).match(label);
    if (m && m[2]) {
      const value = norm(m[2]).replace(/,$/, "");
      if (value) return value;
      const next = norm(lines[i + 1]);
      if (next) return next;
    }
  }

  return currentName || "";
}

function guessAddress(lines, contactHitIdxs) {
  const limit = Math.min(lines.length, TOP_WINDOW);

  for (let i = 0; i < limit; i++) {
    const L = lines[i];
    if (ADDRESS_LABELS.test(L)) {
      const afterColon = L.split(/:\s*/i)[1];
      if (afterColon && norm(afterColon)) return norm(afterColon);
      const next = norm(lines[i + 1]);
      if (next) return next;
    }
  }

  if (contactHitIdxs.length) {
    const minHit = Math.min(...contactHitIdxs);
    const maxHit = Math.max(...contactHitIdxs);
    const minIdx = Math.max(Math.min(minHit, maxHit) - 3, 0);
    const maxIdx = Math.min(Math.max(minHit, maxHit) + 3, limit - 1);
    for (let i = minIdx; i <= maxIdx; i++) {
      const L = lines[i];
      if (ADDRESS_LIKE.test(L) && norm(L).length > 10) return norm(L);
    }
  }

  for (let i = 0; i < limit; i++) {
    const L = lines[i];
    if (ADDRESS_LIKE.test(L) && norm(L).length > 10) return norm(L);
  }
  return "";
}

function extractReferencesFirst(lines) {
  const { sectionLines, cleanedLines } = extractSectionByHeader(
    lines,
    "references"
  );
  return { references: sectionLines, remaining: cleanedLines };
}

function extractPersonalInfo(lines, ocrName = "") {
  const emails = extractEmails(lines);
  const phones = extractPhones(lines);
  const { linkedIn, other } = extractLinksAll(lines);

  const linkedin = linkedIn[0] || "";
  const website = other[0] || "";

  const cleanupNeedles = unique([
    linkedin,
    website,
    ...emails,
    ...phones,
    ...other,
  ]);
  const linesAfterContactRemoval = removeStringsFromLines(
    lines,
    cleanupNeedles
  );

  const hitIdxs = [];
  const needles = new Set(cleanupNeedles.map((s) => s.toLowerCase()));
  lines.forEach((line, idx) => {
    const L = line.toLowerCase();
    for (const n of needles) {
      if (n && L.includes(n)) {
        hitIdxs.push(idx);
        break;
      }
    }
  });

  const address = guessAddress(lines, hitIdxs);

  const name = extractNameFallback(linesAfterContactRemoval, ocrName);

  const personalHeaderKey = SECTION_KEYWORDS.about ? "about" : null;
  let description = "";
  let linesAfterPI = [...linesAfterContactRemoval];
  if (personalHeaderKey) {
    const { sectionLines, cleanedLines } = extractSectionByHeader(
      linesAfterContactRemoval,
      personalHeaderKey
    );
    description = (sectionLines || []).join("\n");
    linesAfterPI = cleanedLines;
  }

  return {
    personal_info: {
      name: name || "",
      description: description || "",
      email: emails[0] || "",
      phone: phones[0] || "",
      address: address || "",
      linkedin: linkedin || "",
      website: website || "",
    },
    remaining: linesAfterPI,
  };
}

// Extract a simple block for each of the remaining sections using the generic header-based extractor
function extractSimpleBlocks(lines) {
  const sections = [
    "experience",
    "education",
    "skills",
    "certifications",
    "languages",
    "projects",
  ].filter((k) => SECTION_KEYWORDS[k]);

  const out = {};
  let rest = [...lines];

  for (const sec of sections) {
    const { sectionLines, cleanedLines } = extractSectionByHeader(rest, sec);
    out[sec] = sectionLines;
    rest = cleanedLines;
  }

  return { blocks: out, remaining: rest };
}

// keyword-based line assignment

const SECTION_FILL_ORDER = [
  "experience",
  "education",
  "skills",
  "certifications",
  "languages",
  "projects",
];

function getSectionLineKeywords(sectionName) {
  const meta = SECTION_KEYWORDS[sectionName] || {};
  const content = Array.isArray(meta.kw) ? meta.kw : [];
  const fallback = Array.isArray(meta.inline) ? meta.inline : [];
  return unique([...content, ...fallback].map((s) => toLower(s)));
}

function lineContainsAnyKeyword(line, keywords) {
  if (!line) return false;
  const L = toLower(line);
  for (const kw of keywords) {
    if (!kw) continue;
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`\\b${escaped}\\b`, "i");
    if (re.test(L)) return true;
  }
  return false;
}

const MONTHS =
  "(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)";

function isDateOnlyLine(line) {
  const t = norm(line)
    .toLowerCase()
    .replace(/[•*·●]/g, "")
    .trim();
  if (!t) return false;

  if (
    /^((19|20)\d{2})\s*[–—-]\s*((19|20)\d{2}|present|current)$/i.test(t) ||
    /^((19|20)\d{2})$/.test(t)
  )
    return true;

  const monthSpan = new RegExp(
    `^${MONTHS}\\.?\\s+(19|20)\\d{2}(\\s*[–—-]\\s*(${MONTHS}\\.?\\s+(19|20)\\d{2}|present|current))?$`,
    "i"
  );
  if (monthSpan.test(t)) return true;

  if (/^(19|20)\d{2}\s*[\/\-]\s*(19|20)\d{2}$/i.test(t)) return true;

  return false;
}

function removeNameLines(lines, name) {
  const nm = norm(name);
  if (!nm) return [...lines];

  const tokens = nm
    .replace(/[^A-Za-z\s'-]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((s) => s.toLowerCase());

  const full = tokens.join(" ");

  return lines.filter((line) => {
    const L = norm(line)
      .replace(/[^A-Za-z\s'-]/g, " ")
      .toLowerCase();
    if (!L) return false;
    if (L === full) return false;
    if (tokens.some((t) => t.length > 2 && L === t)) return false;
    return true;
  });
}

function distributeLeftoverLines(leftover, blocks) {
  const bySection = {};
  for (const s of SECTION_FILL_ORDER) {
    bySection[s] = Array.isArray(blocks[s]) ? [...blocks[s]] : [];
  }

  const sectionKeywords = {};
  for (const s of SECTION_FILL_ORDER) {
    sectionKeywords[s] = getSectionLineKeywords(s);
  }

  let prevSection = null;

  for (const raw of leftover) {
    const line = norm(raw);
    if (!line) continue;

    let matched = null;
    for (const s of SECTION_FILL_ORDER) {
      if (
        sectionKeywords[s].length &&
        lineContainsAnyKeyword(line, sectionKeywords[s])
      ) {
        matched = s;
        break;
      }
    }

    if (matched) {
      bySection[matched].push(line);
      prevSection = matched;
      continue;
    }

    if (prevSection && isDateOnlyLine(line)) {
      bySection[prevSection].push(line);
      continue;
    }

    if (prevSection) {
      bySection[prevSection].push(line);
      continue;
    }
  }

  for (const s of SECTION_FILL_ORDER) {
    bySection[s] = unique(bySection[s]);
  }

  return bySection;
}

function processCV(ocr) {
  const ocrNameLocal = (ocr && ocr.name) || "";
  let lines = (ocr && ocr.remainingCV ? ocr.remainingCV : "")
    .split(/\s*[\n\r]+\s*/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (ocrNameLocal) {
    lines = removeNameLines(lines, ocrNameLocal);
  }

  const { references, remaining } = extractReferencesFirst(lines);
  lines = remaining;

  const { personal_info, remaining: remainingAfterPI } = extractPersonalInfo(
    lines,
    ocrNameLocal
  );
  lines = remainingAfterPI;

  const { blocks, remaining: leftover } = extractSimpleBlocks(lines);

  const filled = distributeLeftoverLines(leftover, blocks);

  return {
    personal_info,
    experience: filled.experience || [],
    education: filled.education || [],
    skills: filled.skills || [],
    certifications: filled.certifications || [],
    languages: filled.languages || [],
    projects: filled.projects || [],
    references: references || [],
  };
}

module.exports = {
  extractSectionByHeader,
  extractReferencesFirst,
  extractPersonalInfo,
  extractSimpleBlocks,
  processCV,
};
