// Input: { name, remainingCV }

// const SECTION_KEYWORDS = require("./section-keywords");

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

// Headers
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

// extract lines by header -> next header (header NOT included)
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
