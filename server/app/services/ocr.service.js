const { fromPath } = require("pdf2pic");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execSync, execFile, execFileSync } = require("child_process");

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

// simple ImageMagick wrapper (tries `magick`, then `convert`)
const magickRun = (args) => {
  try {
    execFileSync("magick", args, { stdio: "ignore" });
    return true;
  } catch {
    try {
      execFileSync("convert", args, { stdio: "ignore" });
      return true;
    } catch {
      return false;
    }
  }
};

// basic preprocessing: grayscale + normalize + contrast-stretch + light sharpen
const preprocessBasicImage = (inputPath) => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "cvocr-prep-"));
  const outPath = path.join(tmpDir, "preprocessed.png");
  const ok = magickRun([
    inputPath,
    "-colorspace",
    "Gray",
    "-normalize",
    "-contrast-stretch",
    "1%",
    "-sharpen",
    "0x1.0",
    outPath,
  ]);
  if (!ok || !fs.existsSync(outPath)) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    return null;
  }
  return { tmpDir, outPath };
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

// quick TSV quality score: sum of confidences + character count of words
const scoreTSV = (tsv) => {
  const rows = parseTSV(tsv);
  let confSum = 0;
  let charCount = 0;
  for (const r of rows) {
    if (r.level === 5 && r.text) {
      if (isFinite(r.conf) && r.conf > 0) confSum += r.conf;
      charCount += r.text.length;
    }
  }
  return confSum + charCount;
};

// run OCR on original and a basic preprocessed image, pick the better TSV
const tesseractBestOfOriginalAndPreprocessed = async (imagePath) => {
  let tsvOriginal = "";
  try {
    tsvOriginal = await tesseractTSVWithFallback(imagePath);
  } catch {
    tsvOriginal = "";
  }

  let tsvPre = "";
  let prepTmp = null;
  try {
    const prep = preprocessBasicImage(imagePath);
    if (prep && prep.outPath) {
      prepTmp = prep.tmpDir;
      tsvPre = await tesseractTSVWithFallback(prep.outPath);
    }
  } catch {
    tsvPre = "";
  } finally {
    if (prepTmp) fs.rmSync(prepTmp, { recursive: true, force: true });
  }

  const sOrig = tsvOriginal ? scoreTSV(tsvOriginal) : -1;
  const sPre = tsvPre ? scoreTSV(tsvPre) : -1;

  if (sPre > sOrig) return tsvPre;
  if (sOrig >= 0) return tsvOriginal;
  // if both failed, throw
  throw new Error("tesseract failed on both original and preprocessed images");
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
    const right = Math.max(...lines.map((l) => l.left + l.width));
    const bottom = Math.max(...lines.map((l) => l.top + l.height));
    blocks.push({
      block_num,
      left,
      top,
      right,
      bottom,
      width: right - left,
      height: bottom - top,
      lines,
    });
  }
  blocks.sort((a, b) => a.top - b.top || a.left - b.left);
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
  "contact info",
  "contact information",
  "contact details",
  "professional skills",
  "professional profile",
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

/**
 * Column-aware page text reconstruction.
 * - Ignore very-wide header blocks for column split, then add them back.
 * - Split at the largest gap between horizontal centers (if significant).
 * - Render: full left column (top->bottom), then full right column (top->bottom).
 */
const pageTextByColumns = (blocks) => {
  if (!blocks?.length) return "";

  const minLeft = Math.min(...blocks.map((b) => b.left));
  const maxRight = Math.max(...blocks.map((b) => b.right));
  const pageSpan = Math.max(1, maxRight - minLeft);

  // Wide blocks (e.g., full-width name band) should not decide columns
  const wideThreshold = pageSpan * 0.7;
  const wideBlocks = blocks.filter((b) => b.width >= wideThreshold);
  const colCandidates = blocks.filter((b) => b.width < wideThreshold);

  // If too few candidates, just return basic top->bottom text
  if (colCandidates.length < 3) {
    return blocks
      .sort((a, b) => a.top - b.top || a.left - b.left)
      .map((b) => b.lines.map((l) => l.text).join("\n"))
      .join("\n\n");
  }

  // 1D clustering by largest horizontal gap between centers
  const centers = colCandidates
    .map((b) => ({
      b,
      c: b.left + b.width / 2,
    }))
    .sort((a, b) => a.c - b.c);

  let bestGap = -1;
  let bestIdx = -1;
  for (let i = 0; i < centers.length - 1; i++) {
    const gap = centers[i + 1].c - centers[i].c;
    if (gap > bestGap) {
      bestGap = gap;
      bestIdx = i;
    }
  }

  const significantGap = bestGap >= Math.max(40, pageSpan * 0.08);
  if (!significantGap) {
    // Fall back: simple top->bottom
    return blocks
      .sort((a, b) => a.top - b.top || a.left - b.left)
      .map((b) => b.lines.map((l) => l.text).join("\n"))
      .join("\n\n");
  }

  const leftGroup = centers.slice(0, bestIdx + 1).map((o) => o.b);
  const rightGroup = centers.slice(bestIdx + 1).map((o) => o.b);

  // If the split produced a tiny group, it's probably noise; fallback
  if (Math.min(leftGroup.length, rightGroup.length) < 2) {
    return blocks
      .sort((a, b) => a.top - b.top || a.left - b.left)
      .map((b) => b.lines.map((l) => l.text).join("\n"))
      .join("\n\n");
  }

  const renderBlocks = (arr) =>
    arr
      .sort((a, b) => a.top - b.top)
      .map((b) => b.lines.map((l) => l.text).join("\n"))
      .join("\n\n");

  const wideText = wideBlocks
    .sort((a, b) => a.top - b.top)
    .map((b) => b.lines.map((l) => l.text).join("\n"))
    .join("\n\n");

  // Ensure left column is actually the left-most
  const leftAvg = leftGroup.reduce((s, b) => s + b.left, 0) / leftGroup.length;
  const rightAvg =
    rightGroup.reduce((s, b) => s + b.left, 0) / rightGroup.length;
  const [firstCol, secondCol] =
    leftAvg <= rightAvg ? [leftGroup, rightGroup] : [rightGroup, leftGroup];

  const leftText = renderBlocks(firstCol);
  const rightText = renderBlocks(secondCol);

  return [wideText, leftText, rightText].filter(Boolean).join("\n\n");
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
        const tsv = await tesseractBestOfOriginalAndPreprocessed(images[i]);
        const rows = parseTSV(tsv);
        const blocks = rowsToBlocks(rows);
        pages.push({ page: i + 1, blocks });
      }
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  } else if (isImage(mimeType, ext)) {
    const tsv = await tesseractBestOfOriginalAndPreprocessed(filePath);
    const rows = parseTSV(tsv);
    const blocks = rowsToBlocks(rows);
    pages.push({ page: 1, blocks });
  } else if (isOfficeLike(mimeType, ext)) {
    const { outDir, pdfPath } = officeToPDF(filePath);
    try {
      const { tempDir, images } = await rasterizePDFtoImages(pdfPath);
      try {
        for (let i = 0; i < images.length; i++) {
          const tsv = await tesseractBestOfOriginalAndPreprocessed(images[i]);
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
