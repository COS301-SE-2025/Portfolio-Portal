const { fromPath } = require("pdf2pic");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execSync, execFile, execFileSync } = require("child_process"); // NEW: execFileSync for converters

// Tesseract config
const TESS_LANG = "eng";
const TESS_OEM = "1"; // LSTM
const TESS_PSM = "3"; // automatic page segmentation

const getPDFPageCount = (pdfPath) => {
  try {
    const out = execSync(`pdfinfo "${pdfPath}"`).toString();
    const m = out.match(/Pages:\s+(\d+)/);
    return m ? parseInt(m[1], 10) : 1;
  } catch {
    return 1;
  }
};

const rasterizePDFtoImages = async (pdfPath) => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "cvocr-"));
  const convert = fromPath(pdfPath, {
    density: 300,
    saveFilename: "page",
    savePath: tempDir,
    format: "png",
    width: 1200,
    height: 1600,
  });

  const pageCount = getPDFPageCount(pdfPath);
  const images = [];
  try {
    for (let i = 1; i <= pageCount; i++) {
      const { path: imgPath } = await convert(i);
      images.push(imgPath);
    }
    return { tempDir, images };
  } catch (e) {
    fs.rmSync(tempDir, { recursive: true, force: true });
    throw e;
  }
};

// OCR (TSV)
const tesseractTSV = (imagePath) =>
  new Promise((resolve, reject) => {
    const args = [
      imagePath,
      "stdout",
      "-l",
      TESS_LANG,
      "--oem",
      TESS_OEM,
      "--psm",
      TESS_PSM,
      "tsv",
    ];
    execFile(
      "tesseract",
      args,
      { maxBuffer: 1024 * 1024 * 100 },
      (err, stdout, stderr) => {
        if (err)
          return reject(
            new Error(`tesseract failed: ${stderr || err.message}`)
          );
        resolve(stdout);
      }
    );
  });

const tesseractTSVWithFallback = async (imagePath) => {
  try {
    return await tesseractTSV(imagePath);
  } catch (e) {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cvocr-img-"));
    const pngOut = path.join(tmp, "image.png");
    try {
      try {
        execFileSync("magick", [imagePath, pngOut], { stdio: "ignore" });
      } catch {
        execFileSync("convert", [imagePath, pngOut], { stdio: "ignore" });
      }
      const res = await tesseractTSV(pngOut);
      fs.rmSync(tmp, { recursive: true, force: true });
      return res;
    } catch (e2) {
      fs.rmSync(tmp, { recursive: true, force: true });
      throw e;
    }
  }
};

const parseTSV = (tsv) => {
  const lines = (tsv || "").split(/\r?\n/);
  if (!lines.length) return [];
  const header = lines.shift();
  const cols = header ? header.split("\t") : [];
  const rows = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    const parts = line.split("\t");
    if (parts.length !== cols.length) continue;
    const obj = {};
    for (let i = 0; i < cols.length; i++) obj[cols[i]] = parts[i];
    [
      "level",
      "page_num",
      "block_num",
      "par_num",
      "line_num",
      "word_num",
      "left",
      "top",
      "width",
      "height",
      "conf",
    ].forEach((k) => (obj[k] = Number(obj[k])));
    obj.text = typeof obj.text === "string" ? obj.text : "";
    rows.push(obj);
  }
  return rows;
};

// group words into lines
const wordsToLines = (words) => {
  const byKey = new Map();
  for (const w of words) {
    const key = `${w.par_num}:${w.line_num}`;
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key).push(w);
  }
  const lines = [];
  for (const [, ws] of byKey) {
    ws.sort((a, b) => a.left - b.left);
    const text = ws
      .map((w) => (w.text || "").trim())
      .filter(Boolean)
      .join(" ");
    if (!text) continue;
    const left = Math.min(...ws.map((w) => w.left));
    const top = Math.min(...ws.map((w) => w.top));
    const right = Math.max(...ws.map((w) => w.left + w.width));
    const bottom = Math.max(...ws.map((w) => w.top + w.height));
    const avgConf =
      ws.reduce((acc, w) => acc + (isFinite(w.conf) ? w.conf : 0), 0) /
      Math.max(ws.length, 1);
    lines.push({
      text,
      left,
      top,
      width: right - left,
      height: bottom - top,
      avgConf,
    });
  }
  lines.sort((a, b) => a.top - b.top || a.left - b.left);
  return lines;
};

// group rows to blocks
const rowsToBlocks = (rows) => {
  const byBlock = new Map();
  for (const r of rows) {
    if (r.level !== 5) continue; // word
    if (!byBlock.has(r.block_num)) byBlock.set(r.block_num, []);
    byBlock.get(r.block_num).push(r);
  }
  const blocks = [];
  for (const [block_num, words] of byBlock) {
    const lines = wordsToLines(words);
    if (!lines.length) continue;
    const left = Math.min(...lines.map((l) => l.left));
    const top = Math.min(...lines.map((l) => l.top));
    const bottom = Math.max(...lines.map((l) => l.top + l.height));
    blocks.push({ block_num, left, top, bottom, lines });
  }
  blocks.sort((a, b) => a.top - b.top);
  return blocks;
};

// Heading & name heuristics
const HEADER_ALIASES = [
  "about me",
  "summary",
  "objective",
  "professional experience",
  "experience",
  "work experience",
  "education",
  "skills",
  "technical skills",
  "projects",
  "project experience",
  "certifications",
  "certification",
  "languages",
  "language",
  "contact",
  "personal information",
  "personal info",
  "references",
  "referees",
  "referee",
  "cv",
  "curriculum vitae",
  "resume",
  "profile",
  "summary profile",
  "qualifications",
];

const normalize = (t) =>
  (t || "")
    .toLowerCase()
    .replace(/[•·●\-\u2022:]+/g, " ")
    .trim();

const isHeading = (t) => {
  const norm = normalize(t);
  return HEADER_ALIASES.some((h) => norm.startsWith(h));
};

// names
const NAME_PARTICLES = new Set([
  "van",
  "von",
  "de",
  "del",
  "della",
  "da",
  "dos",
  "das",
  "di",
  "du",
  "la",
  "le",
  "lo",
  "bin",
  "binti",
  "ibn",
  "al",
  "el",
  "den",
  "der",
]);

// not be part of names
const ROLE_STOPWORDS = new Set([
  "software",
  "developer",
  "engineer",
  "designer",
  "student",
  "intern",
  "manager",
  "analyst",
  "consultant",
  "architect",
  "administrator",
  "officer",
  "director",
  "lead",
  "senior",
  "junior",
  "teacher",
  "professor",
  "accountant",
  "lawyer",
  "doctor",
  "nurse",
  "writer",
  "marketing",
  "sales",
  "support",
  "steward",
]);

const tokenLooksLikeName = (tok) => {
  if (!tok) return false;
  if (!/^[A-Za-z][A-Za-z\-'.]*$/.test(tok)) return false;
  if (NAME_PARTICLES.has(tok.toLowerCase())) return true;
  return (
    /^[A-Z][a-z]+(?:[-'][A-Z][a-z]+)*$/.test(tok) || tok === tok.toUpperCase()
  );
};

const lineLooksLikeNameFragment = (text) => {
  if (!text) return false;
  const norm = normalize(text);
  if (isHeading(norm)) return false;

  const tokens = text.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0 || tokens.length > 5) return false;

  // exclude if any token is a common role/title word
  const hasRoleWord = tokens.some((t) => ROLE_STOPWORDS.has(t.toLowerCase()));
  if (hasRoleWord) return false;

  return tokens.every(tokenLooksLikeName);
};

// Collect lines from the top 33% until first heading
const collectTopRegionLines = (blocks) => {
  if (!blocks?.length) return [];
  const pageTop = Math.min(...blocks.map((b) => b.top));
  const pageBottom = Math.max(...blocks.map((b) => b.bottom));
  const pageHeight = Math.max(1, pageBottom - pageTop);
  const cutoff = pageTop + pageHeight * 0.33;

  const lines = [];
  let hitHeading = false;
  for (const b of blocks) {
    for (const ln of b.lines) {
      if (ln.top > cutoff) continue;
      const t = (ln.text || "").trim();
      if (!t) continue;
      if (isHeading(t)) {
        hitHeading = true;
        break;
      }
      lines.push(t);
    }
    if (hitHeading) break;
  }
  return lines;
};

// fallback single-line scorer inside top region
const pickNameFromTopUntilHeading = (blocks) => {
  if (!blocks?.length) return "";
  const pageTop = Math.min(...blocks.map((b) => b.top));
  const pageBottom = Math.max(...blocks.map((b) => b.bottom));
  const pageHeight = Math.max(1, pageBottom - pageTop);
  const cutoff = pageTop + pageHeight * 0.4;

  const candidates = [];
  let hitHeading = false;
  for (const b of blocks) {
    for (const ln of b.lines) {
      if (ln.top > cutoff) continue;
      const txt = (ln.text || "").trim();
      if (!txt) continue;
      if (isHeading(txt)) {
        hitHeading = true;
        break;
      }
      if (!lineLooksLikeNameFragment(txt)) continue;
      const score =
        ln.height * 1.2 +
        ln.width * 0.02 +
        (isFinite(ln.avgConf) ? ln.avgConf : 60) * 0.1;
      candidates.push({ text: txt, score });
    }
    if (hitHeading) break;
  }
  candidates.sort((a, b) => b.score - a.score);
  return candidates[0]?.text || "";
};

// Column-aware
/**
 * Concatenate text column-aware: left column first, then right column.
 * Inside each column: top->bottom, lines kept in order.
 */
const pageTextByColumns = (blocks) => {
  if (!blocks?.length) return "";
  const lefts = blocks.map((b) => b.left).sort((a, b) => a - b);
  const median = lefts[Math.floor(lefts.length / 2)];
  const leftBlocks = [];
  const rightBlocks = [];
  for (const b of blocks) (b.left <= median ? leftBlocks : rightBlocks).push(b);

  const render = (blkArr) =>
    blkArr
      .sort((a, b) => a.top - b.top)
      .map((b) => b.lines.map((l) => l.text).join("\n"))
      .join("\n\n");

  const leftTxt = render(leftBlocks);
  const rightTxt = render(rightBlocks);
  return [leftTxt, rightTxt].filter(Boolean).join("\n\n");
};

const getExt = (p) =>
  (path.extname(p || "").toLowerCase() || "").replace(".", "");
const isPDF = (mt, ext) => mt === "application/pdf" || ext === "pdf";
const isImage = (mt, ext) =>
  (mt && mt.startsWith("image/")) ||
  [
    "png",
    "jpg",
    "jpeg",
    "tif",
    "tiff",
    "bmp",
    "gif",
    "webp",
    "heic",
    "heif",
  ].includes(ext);
const isOfficeLike = (mt, ext) =>
  [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.oasis.opendocument.text",
    "application/rtf",
    "text/rtf",
    "text/plain",
    "text/html",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ].includes(mt) ||
  ["doc", "docx", "odt", "rtf", "txt", "html", "htm", "ppt", "pptx"].includes(
    ext
  );

const officeToPDF = (inputPath) => {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "cvocr-doc-"));
  try {
    execFileSync(
      "soffice",
      ["--headless", "--convert-to", "pdf", "--outdir", outDir, inputPath],
      { stdio: "ignore" }
    );
  } catch {
    execFileSync(
      "libreoffice",
      ["--headless", "--convert-to", "pdf", "--outdir", outDir, inputPath],
      { stdio: "ignore" }
    );
  }
  const base = path.basename(inputPath, path.extname(inputPath));
  const pdfPath = path.join(outDir, `${base}.pdf`);
  if (!fs.existsSync(pdfPath)) {
    throw new Error("Conversion to PDF failed");
  }
  return { outDir, pdfPath };
};

const processCV = async (filePath, mimeType) => {
  const pages = [];

  const ext = getExt(filePath);
  if (isPDF(mimeType, ext)) {
    const { tempDir, images } = await rasterizePDFtoImages(filePath);
    try {
      for (let i = 0; i < images.length; i++) {
        const tsv = await tesseractTSVWithFallback(images[i]);
        const rows = parseTSV(tsv);
        const blocks = rowsToBlocks(rows);
        pages.push({ page: i + 1, blocks });
      }
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  } else if (isImage(mimeType, ext)) {
    const tsv = await tesseractTSVWithFallback(filePath);
    const rows = parseTSV(tsv);
    const blocks = rowsToBlocks(rows);
    pages.push({ page: 1, blocks });
  } else if (isOfficeLike(mimeType, ext)) {
    const { outDir, pdfPath } = officeToPDF(filePath);
    try {
      const { tempDir, images } = await rasterizePDFtoImages(pdfPath);
      try {
        for (let i = 0; i < images.length; i++) {
          const tsv = await tesseractTSVWithFallback(images[i]);
          const rows = parseTSV(tsv);
          const blocks = rowsToBlocks(rows);
          pages.push({ page: i + 1, blocks });
        }
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    } finally {
      fs.rmSync(outDir, { recursive: true, force: true });
    }
  } else {
    throw new Error("Unsupported file type");
  }

  const firstBlocks = pages[0]?.blocks || [];
  const topLines = collectTopRegionLines(firstBlocks);

  let name = "";
  if (topLines.length) {
    const run = [];
    for (let i = 0; i < Math.min(3, topLines.length); i++) {
      if (lineLooksLikeNameFragment(topLines[i])) run.push(topLines[i]);
      else break;
    }
    if (run.length >= 2) name = run.join(" ").replace(/\s+/g, " ").trim();
    else if (run.length === 1) name = run[0];
  }
  if (!name) name = pickNameFromTopUntilHeading(firstBlocks) || "";

  let remainingCV = pages
    .map((p) => pageTextByColumns(p.blocks))
    .join("\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (name) {
    const nameRx = new RegExp(`^\\s*${escapeRegExp(name)}\\s*$`, "im");
    remainingCV = remainingCV
      .replace(nameRx, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  return { name, remainingCV };
};

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports = {
  processCV,
};
