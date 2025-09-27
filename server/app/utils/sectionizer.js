const SECTION_KEYWORDS = require("./section-keywords");

const EMAIL_RE = /[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-z]{2,}/gi;
const PHONE_RE =
  /(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{2,5}([-.\\s]?\d{2,5}){1,3}/g;
const URL_RE =
  /\b((https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-z]{2,})(\/[\S]*)?\b/g;

const ADDRESS_LABELS =
  /(address|location|residential\s*address|physical\s*address)/i;
const ADDRESS_LIKE =
  /\b(\d+\s+[^,\n]+\b(st(\.|reet)?|rd|road|ave|avenue|dr|drive|ln|lane|ct|court|blvd|boulevard)\b|\b(?:suburb|town|city|province|postal|zip)\b)/i;

const COMMON_EMAIL_DOMAINS = [
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "icloud.com",
  "yahoo.com",
  "protonmail.com",
  "proton.me",
];

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
  return lines.length;
}

/** ---------- Header extractor ---------- */
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

/** ---------- Email / link / phone helpers ---------- */

function restoreBrokenEmails(lines) {
  // Fix common OCR case: "nameegmail.com" or "name gmail.com"
  const domainParts = COMMON_EMAIL_DOMAINS.map((d) =>
    d.replace(/\./g, "\\.")
  ).join("|");

  const rxE = new RegExp(
    `\\b([a-z0-9._%+-]{2,})\\s*e\\s*(${domainParts})\\b`,
    "ig"
  );
  const rxSpace = new RegExp(
    `\\b([a-z0-9._%+-]{2,})\\s+(${domainParts})\\b`,
    "ig"
  );

  return lines.map((line) => {
    let fixed = line;
    fixed = fixed.replace(rxE, (_m, u, d) => `${u}@${d}`);
    fixed = fixed.replace(rxSpace, (_m, u, d) => `${u}@${d}`);
    return fixed;
  });
}

function extractEmails(lines) {
  const matches = [...(lines.join(" ").matchAll(EMAIL_RE) || [])].map(
    (m) => m[0]
  );
  return unique(matches);
}

// True for "2022-2024", "2019 – present", "Jan 2020 - Mar 2022", etc.
const MONTHS =
  "(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)";
const DATE_SPAN_RE = new RegExp(
  `^\\s*(?:${MONTHS}\\.?\\s+)?(19|20)\\d{2}\\s*[–—-]\\s*(?:${MONTHS}\\.?\\s+)?((19|20)\\d{2}|present|current)\\s*$`,
  "i"
);
const SINGLE_YEAR_RE = /^\s*(19|20)\d{2}\s*$/;

function looksLikeDateSpan(s) {
  const t = norm(s)
    .toLowerCase()
    .replace(/[•*·●]/g, "");
  if (!t) return false;
  if (DATE_SPAN_RE.test(t)) return true;
  return false;
}

/** NEW: greedy per-line phone extractor that keeps full number (+country code) */
function extractPhones(lines) {
  // Unicode separators we commonly see from OCR (thin/nb spaces, dashes, etc.)
  const SEP = `[\\s.\\-()\\u00A0\\u202F\\u2009\\u2007\\u2060\\u2013\\u2014]`;
  // At least 7 digits overall, allow separators between them
  const GREEDY_LINE_PHONE = new RegExp(`(\\+?\\d(?:${SEP}*\\d){6,})`, "g");

  const candidates = [];

  lines.forEach((ln, idx) => {
    const text = ln || "";
    const matches = [...text.matchAll(GREEDY_LINE_PHONE)];
    for (const m of matches) {
      const raw = norm(m[1]);
      const dcount = digits(raw).length;
      if (dcount < 7) continue;
      if (looksLikeDateSpan(raw)) continue;

      // Score: prefer longer, leading '+', nice grouping, early lines, and label
      let score = dcount;
      if (/^\+/.test(raw)) score += 3;
      if (/[()]/.test(raw)) score += 1;
      if (/\d+\s+\d+\s+\d+/.test(raw)) score += 1;
      if (idx <= TOP_WINDOW) score += 2;
      if (/(phone|tel|mobile|cell)\s*[:\-–]?/i.test(text)) score += 4;

      candidates.push({ raw, score });
    }
  });

  // Fallback to old pattern if greedy found nothing
  if (!candidates.length) {
    const text = lines.join("\n");
    const m = [...(text.matchAll(PHONE_RE) || [])].map((x) => x[0].trim());
    for (const raw of m) {
      const dcount = digits(raw).length;
      if (dcount < 7) continue;
      if (looksLikeDateSpan(raw)) continue;
      let score = dcount + (/^\+/.test(raw) ? 3 : 0);
      candidates.push({ raw, score });
    }
  }

  candidates.sort((a, b) => b.score - a.score || b.raw.length - a.raw.length);
  const best = candidates.length ? [candidates[0].raw] : [];
  return best;
}

// Avoid treating tech tokens like 'node.js', 'next.js', etc. as URLs
function looksLikeTechDotToken(u) {
  const s = (u || "").toLowerCase();
  if (/^(https?:\/\/|www\.)/.test(s)) return false; // real URL: keep
  if (/\b[a-z0-9+-]+\.(js|ts|jsx|tsx)\b/i.test(s)) return true;
  if (
    /\b(node|next|react|vue|svelte|angular|nuxt|nestjs|express|koa|hapi)\.js\b/i.test(
      s
    )
  )
    return true;
  return false;
}

function extractLinksAll(lines) {
  const text = lines.join(" ");

  const emailSpans = [...(text.matchAll(EMAIL_RE) || [])].map((m) =>
    m[0].toLowerCase()
  );

  const rawUrls = [...(text.matchAll(URL_RE) || [])].map((m) => m[0]);
  const rawFiltered = rawUrls.filter((u) => !looksLikeTechDotToken(u));

  const normalized = rawFiltered
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

function removeContactLabelOnlyLines(lines) {
  const rx =
    /^(email|e-?mail|mail|phone|tel|mobile|cell|linkedin|website|address|contact)\s*[:\-–]?\s*$/i;
  return lines.filter((l) => !rx.test((l || "").trim()));
}

function removeStringsFromLines(lines, strings) {
  const needles = new Set();

  const addUrlVariants = (u) => {
    const l = (u || "").toLowerCase().trim();
    if (!l) return;
    const noProto = l.replace(/^https?:\/\//i, "");
    const noWww = noProto.replace(/^www\./i, "");
    [l, noProto, noWww, `https://${noProto}`, `https://${noWww}`].forEach(
      (v) => {
        if (v) needles.add(v);
      }
    );
  };

  for (const s of strings.filter(Boolean)) {
    const lower = s.toLowerCase();
    if (lower.includes("@")) {
      needles.add(lower);
    } else if (/\.[a-z]{2,}/i.test(lower)) {
      addUrlVariants(lower);
    } else {
      needles.add(lower);
    }
  }

  return lines.filter((line) => {
    const L = (line || "").toLowerCase();
    if (!L) return false;
    for (const n of needles) {
      if (n && L.includes(n)) return false;
    }
    return true;
  });
}

/** ---------- Name/Address helpers ---------- */

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

/** ---------- References first ---------- */

function extractReferencesFirst(lines) {
  const { sectionLines, cleanedLines } = extractSectionByHeader(
    lines,
    "references"
  );
  return { references: sectionLines, remaining: cleanedLines };
}

/** ---------- Personal info ---------- */

function extractPersonalInfo(lines, ocrName = "") {
  // Repair email glitches before extracting
  const repairedLines = restoreBrokenEmails(lines);

  const emails = extractEmails(repairedLines);
  const phones = extractPhones(repairedLines);
  const { linkedIn, other } = extractLinksAll(repairedLines);

  const linkedin = linkedIn[0] || "";
  const website = other[0] || "";

  // remove contacts from remaining lines
  const cleanupNeedles = unique([
    linkedin,
    website,
    ...emails,
    ...phones,
    ...other,
  ]);

  let linesAfterContactRemoval = removeStringsFromLines(
    repairedLines,
    cleanupNeedles
  );
  linesAfterContactRemoval = removeContactLabelOnlyLines(
    linesAfterContactRemoval
  );

  // approximate contact area to help find address
  const hitIdxs = [];
  const needles = new Set(cleanupNeedles.map((s) => s.toLowerCase()));
  repairedLines.forEach((line, idx) => {
    const L = (line || "").toLowerCase();
    for (const n of needles) {
      if (n && L.includes(n)) {
        hitIdxs.push(idx);
        break;
      }
    }
  });

  const address = guessAddress(repairedLines, hitIdxs);
  const name = extractNameFallback(linesAfterContactRemoval, ocrName);

  // profile/summary block
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

/** ---------- Simple blocks ---------- */

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

/** ---------- Keyword-based assignment ---------- */

const SECTION_FILL_ORDER = [
  "experience",
  "education",
  "skills",
  "certifications",
  "languages",
  "projects",
];

// sections where duplicate lines are OK (don’t dedupe)
const SECTIONS_ALLOW_DUPES = new Set([
  "experience",
  "education",
  "projects",
  "certifications",
]);

const ALLOW_DATE_SECTIONS = new Set([
  "experience",
  "education",
  "projects",
  "certifications",
]);

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

function isDateOnlyLine(line) {
  const t = norm(line)
    .toLowerCase()
    .replace(/[•*·●]/g, "")
    .trim();
  if (!t) return false;
  if (DATE_SPAN_RE.test(t)) return true;
  if (SINGLE_YEAR_RE.test(t)) return true;
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
  const tokSet = new Set(tokens);
  const full = tokens.join(" ");

  return lines.filter((line) => {
    const Lraw = norm(line);
    const L = Lraw.replace(/[^A-Za-z\s'-]/g, " ")
      .toLowerCase()
      .trim();
    if (!L) return false;

    // exact full name
    if (L === full) return false;

    // single-token lines that equal a name token (e.g., "Calvyn" or "Van")
    if (tokens.some((t) => t.length > 2 && L === t)) return false;

    // any line composed entirely of a subset of name tokens (e.g., "Calvyn Van")
    const words = L.split(/\s+/).filter(Boolean);
    if (words.length && words.every((w) => tokSet.has(w))) return false;

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

    // Don't let date-only lines ever match skills/languages
    let matched = null;
    for (const s of SECTION_FILL_ORDER) {
      if ((s === "skills" || s === "languages") && isDateOnlyLine(line)) {
        continue;
      }
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

    // Only propagate "date-only" lines if the previous section allows dates
    if (prevSection && isDateOnlyLine(line)) {
      if (ALLOW_DATE_SECTIONS.has(prevSection)) {
        bySection[prevSection].push(line);
      }
      continue;
    }

    if (prevSection) {
      bySection[prevSection].push(line);
      continue;
    }
  }

  // Dedupe only the list-like sections
  for (const s of SECTION_FILL_ORDER) {
    if (!SECTIONS_ALLOW_DUPES.has(s)) {
      bySection[s] = unique(bySection[s]);
    }
  }

  return bySection;
}

/** ---------- Public API ---------- */

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
