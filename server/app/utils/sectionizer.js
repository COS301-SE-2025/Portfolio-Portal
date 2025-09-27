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

const HEADER_TRIM_RE = /^[\s|>•*·●\-–—@©]+|[\s|>•*·●\-–—@©:]+$/g;

function isHeader(line, sectionName) {
  const meta = SECTION_KEYWORDS[sectionName];
  const variants = meta?.inline || [];
  const L = (norm(line).replace(HEADER_TRIM_RE, "") || "").toLowerCase();
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

// section header extraction
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

// fallback, no header detected
function extractSectionByHeaderRegex(lines, regex) {
  let startHeader = -1;
  for (let i = 0; i < lines.length; i++) {
    const L = (norm(lines[i]).replace(HEADER_TRIM_RE, "") || "").toLowerCase();
    if (regex.test(L)) {
      startHeader = i;
      break;
    }
  }
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

function restoreBrokenEmails(lines) {
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

const ID_LABEL_RE =
  /\b(id(\s*no\.?)?|id\s*number|identity|passport|national\s*id)\b/i;

function looksLikeSAID13(d) {
  if (!/^\d{13}$/.test(d)) return false;
  const mm = parseInt(d.slice(2, 4), 10);
  const dd = parseInt(d.slice(4, 6), 10);
  if (mm < 1 || mm > 12) return false;
  if (dd < 1 || dd > 31) return false;
  return true;
}

function isLikelyIDNumber(raw, lineText) {
  const d = digits(raw);
  if (ID_LABEL_RE.test(lineText || "")) return true;
  if (/^\d{13,}$/.test(d) && !/[+\-().\s]/.test(raw)) {
    if (looksLikeSAID13(d)) return true;
    return true;
  }
  return false;
}

function extractPhones(lines) {
  const SEP = `[\\s.\\-()\\u00A0\\u202F\\u2009\\u2007\\u2060\\u2013\\u2014]`;
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
      if (isLikelyIDNumber(raw, text)) continue;

      let score = dcount;
      if (/^\+/.test(raw)) score += 3;
      if (/[()]/.test(raw)) score += 1;
      if (/\d+\s+\d+\s+\d+/.test(raw)) score += 1;
      if (idx <= TOP_WINDOW) score += 2;
      if (/(phone|tel|mobile|cell)\s*[:\-–]?/i.test(text)) score += 4;

      candidates.push({ raw, score });
    }
  });

  if (!candidates.length) {
    const text = lines.join("\n");
    const m = [...(text.matchAll(PHONE_RE) || [])].map((x) => x[0].trim());
    for (const raw of m) {
      const dcount = digits(raw).length;
      if (dcount < 7) continue;
      if (looksLikeDateSpan(raw)) continue;
      if (isLikelyIDNumber(raw, text)) continue;
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

// name and adress helpers
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

// detect about with no header
const BULLET_LIKE = /^[•*·●\-–—@©]\s*/i;
const I_LIKE = "[iIl\\|!1]";
const SUMMARY_STARTERS = [
  new RegExp(`^${I_LIKE}\\s*['’]?\\s*m\\b`, "i"),
  new RegExp(`^${I_LIKE}\\s+am\\b`, "i"),
  new RegExp(`^${I_LIKE}\\s+have\\b`, "i"),
  new RegExp(`^${I_LIKE}\\s+do\\b`, "i"),
  new RegExp(`^${I_LIKE}\\s+can\\b`, "i"),
  new RegExp(`^${I_LIKE}\\s+aim\\b`, "i"),
  new RegExp(`^${I_LIKE}\\s+strive\\b`, "i"),
  new RegExp(`^${I_LIKE}\\s+believe\\b`, "i"),
  new RegExp(`^${I_LIKE}\\s+bring\\b`, "i"),
  new RegExp(`^${I_LIKE}\\s+possess\\b`, "i"),
  /^personally\b/i,
  /^as\s+(an?|the)\b/i,
  /^with\b/i,
  /^motivated\b/i,
  /^driven\b/i,
  /^experienced\b/i,
  /^creative\b/i,
  /^dedicated\b/i,
  /^results[-\s]?oriented\b/i,
];

function isParagraphy(line) {
  const t = norm(line);
  if (!t) return false;
  if (t.length < 40) return false;
  if (/@|https?:|www\./i.test(t)) return false;
  const words = t.split(/\s+/).filter(Boolean);
  if (words.length < 8) return false;
  return true;
}

function looksLikeSummaryStart(line) {
  const L = norm(line);
  if (!isParagraphy(L)) return false;
  if (BULLET_LIKE.test(L)) return false;
  return SUMMARY_STARTERS.some((re) => re.test(L));
}

function isContactish(line) {
  const t = norm(line);
  if (!t) return false;
  const labelish = (t.replace(HEADER_TRIM_RE, "") || "").toLowerCase();
  if (/^contact(s| details| info)?$/i.test(labelish)) return true;
  if (EMAIL_RE.test(t)) return true;
  if (URL_RE.test(t)) return true;
  if (PHONE_RE.test(t)) return true;
  if (/\b(@|linkedin|github|website)\b/i.test(t)) return true;
  return false;
}

function extractTopSummaryNearTop(lines) {
  if (!lines?.length) return { about: "", remaining: [...lines] };

  const limit = Math.min(
    lines.length,
    Math.max(20, Math.floor(lines.length * 0.35)),
    80
  );

  let start = -1;
  for (let i = 0; i < limit; i++) {
    if (isTopLevelHeaderLine(lines[i])) break;
    if (looksLikeSummaryStart(lines[i])) {
      start = i;
      break;
    }
  }
  if (start < 0) return { about: "", remaining: [...lines] };

  const endBoundary = (() => {
    for (let i = start + 1; i < lines.length; i++) {
      const L = lines[i];
      if (isTopLevelHeaderLine(L)) return i;
      const trimmed = (norm(L).replace(HEADER_TRIM_RE, "") || "").toLowerCase();
      if (/^contact(s| details| info)?$/i.test(trimmed)) return i;
    }
    return lines.length;
  })();

  const picked = [];
  for (let i = start; i < endBoundary; i++) {
    const L = lines[i];
    if (!L) continue;
    if (isContactish(L)) break;
    if (BULLET_LIKE.test(L)) continue;
    picked.push(L);
  }

  const joined = norm(picked.join("\n"));
  if (joined.length < 60) {
    return { about: "", remaining: [...lines] };
  }

  const remaining = [...lines.slice(0, start), ...lines.slice(endBoundary)];
  return { about: joined, remaining };
}

const PROF_RE =
  /\b(fluent|native|bilingual|professional|proficient|intermediate|basic|beginner|mother\s*tongue|conversational)\b/i;

function levenshtein(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  const dp = Array(b.length + 1)
    .fill(0)
    .map((_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j];
      dp[j] =
        a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, dp[j - 1], dp[j]);
      prev = tmp;
    }
  }
  return dp[b.length];
}

function normalizeLangToken(tok) {
  return tok
    .toLowerCase()
    .replace(/[0]/g, "o")
    .replace(/[1l!]/g, "i")
    .replace(/[2]/g, "a")
    .replace(/[3]/g, "e")
    .replace(/[4]/g, "a")
    .replace(/[5]/g, "s")
    .replace(/[6]/g, "g")
    .replace(/[7]/g, "t")
    .replace(/[8]/g, "b")
    .replace(/[9]/g, "g")
    .replace(/[^a-z\u00c0-\u024f]+/g, "");
}

const LANG_KEYWORDS = (() => {
  const k = new Set(
    [
      ...(SECTION_KEYWORDS.languages?.kw || []),
      ...(SECTION_KEYWORDS.languages?.inline || []),
    ]
      .map((x) => x && x.toLowerCase())
      .filter(Boolean)
  );
  ["language", "languages", "ielts", "toefl"].forEach((w) => k.delete(w));
  return k;
})();

function tokenMatchesAnyLanguage(tok) {
  const n = normalizeLangToken(tok);
  if (!n) return false;
  if (LANG_KEYWORDS.has(n)) return true;
  for (const kw of LANG_KEYWORDS) {
    const d = levenshtein(n, kw);
    if (
      d <= 1 ||
      (Math.abs(n.length - kw.length) <= 2 &&
        Math.max(n.length, kw.length) >= 7 &&
        d <= 2)
    ) {
      return true;
    }
  }
  return false;
}

function isProbablyLanguageLine(line) {
  const raw = norm(line);
  if (!raw) return false;

  const t = raw.replace(BULLET_LIKE, "").toLowerCase();

  const tokens = t.split(/[^0-9a-z\u00c0-\u024f]+/i).filter(Boolean);
  if (!tokens.length) return false;

  if (PROF_RE.test(t)) {
    return tokens.some((w) => tokenMatchesAnyLanguage(w));
  }
  if (tokens.length <= 4) {
    return tokens.some((w) => tokenMatchesAnyLanguage(w));
  }
  return false;
}

function siphonLanguagesFromSkills(sections) {
  const skills = Array.isArray(sections.skills) ? sections.skills : [];
  const langs = Array.isArray(sections.languages) ? sections.languages : [];

  const moved = [];
  const kept = [];
  for (const line of skills) {
    if (isProbablyLanguageLine(line)) moved.push(line);
    else kept.push(line);
  }

  sections.skills = kept;
  sections.languages = unique([...langs, ...moved]);
  return sections;
}

// extract references first
function extractReferencesFirst(lines) {
  const { sectionLines, cleanedLines } = extractSectionByHeader(
    lines,
    "references"
  );
  return { references: sectionLines, remaining: cleanedLines };
}

// personal info
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

  // 1) If there is an explicit "About"/"Summary" header, use it.
  if (personalHeaderKey) {
    const { sectionLines, cleanedLines } = extractSectionByHeader(
      linesAfterContactRemoval,
      personalHeaderKey
    );
    if (sectionLines?.length) {
      description = (sectionLines || []).join("\n");
      linesAfterPI = cleanedLines;
    }
  }

  // 2) Otherwise, look for a header-less top summary near the top
  if (!description) {
    const det = extractTopSummaryNearTop(linesAfterPI);
    if (det.about) {
      description = det.about;
      linesAfterPI = det.remaining;
    }
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

  if (!out.languages?.length) {
    const { sectionLines, cleanedLines } = extractSectionByHeaderRegex(
      rest,
      /^(language|languages)\b/i
    );
    if (sectionLines.length) {
      out.languages = sectionLines;
      rest = cleanedLines;
    }
  }

  return { blocks: out, remaining: rest };
}

const SECTION_FILL_ORDER = [
  "experience",
  "education",
  "skills",
  "certifications",
  "languages",
  "projects",
];

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

    if (L === full) return false;
    if (tokens.some((t) => t.length > 2 && L === t)) return false;

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

    // classify obvious language lines first
    if (isProbablyLanguageLine(line)) {
      bySection.languages.push(line);
      prevSection = "languages";
      continue;
    }

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

  for (const s of SECTION_FILL_ORDER) {
    if (!SECTIONS_ALLOW_DUPES.has(s)) {
      bySection[s] = unique(bySection[s]);
    }
  }

  return bySection;
}

function salvageSummaryFromSkills(sections, currentDescription = "") {
  if (currentDescription) return { description: currentDescription, sections };

  const skillLines = Array.isArray(sections.skills) ? sections.skills : [];
  const maybes = skillLines.filter((ln) => {
    const t = norm(ln);
    if (!isParagraphy(t)) return false;
    return (
      /^([iIl\|!1]\s+|personally\b|as\s+(an?|the)\b)/i.test(t) ||
      /\b(personality|work ethic|passion|aim|goal|strengths|reliable|responsible)\b/i.test(
        t
      )
    );
  });

  let description = currentDescription;
  if (maybes.length) {
    const joined = maybes.join("\n");
    if (joined.length >= 80) {
      description = joined;
      const keep = [];
      const rm = new Set(maybes);
      for (const l of skillLines) if (!rm.has(l)) keep.push(l);
      sections.skills = keep;
    }
  }

  return { description, sections };
}

// main function
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
  let filled = distributeLeftoverLines(leftover, blocks);

  // move any leaked language lines out of skills
  filled = siphonLanguagesFromSkills(filled);

  // salvage a summary paragraph from Skills if still empty
  const salvage = salvageSummaryFromSkills(filled, personal_info.description);
  filled = salvage.sections;
  personal_info.description = salvage.description || personal_info.description;

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
