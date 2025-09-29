// Backend-only OCR performance test using a Cypress task (Node-side multipart).
// No UI, no cy.visit, no extra packages.
//
// Needs:
// - Backend at http://localhost:5050
// - cypress.env.json with { "loginEmail": "...", "loginPassword": "...", "ocrMaxMs": 15000 }
// - A test CV in cypress/fixtures

describe("OCR upload performance (backend-only)", () => {
  const API_BASE = "http://localhost:5050";
  const OCR_URL = `${API_BASE}/api/ocr/upload`;
  const SLA_MS = Number(Cypress.env("ocrMaxMs") || 15000);

  const FILES = [
    "Alex Omari CV (artist & environmentalist).pdf",
    "Ava Reynolds CV (demo3 - software engineer).pdf",
    "Brian Park CV (mining engineer).pdf",
    "Daniel Brooks CV (demo2 - finance).pdf",
  ];

  const RUNS = 3; // how many runs per file

  it(`runs ${RUNS} iterations per CV and reports min/max/avg`, () => {
    cy.loginByApi().then((token) => {
      const results = [];

      const runForFile = (fileName, run = 1, times = []) => {
        if (run > RUNS) {
          const min = Math.min(...times);
          const max = Math.max(...times);
          const avg = Math.round(
            times.reduce((a, b) => a + b, 0) / times.length
          );

          results.push({ file: fileName, min, max, avg });

          cy.log(` ${fileName}`);
          cy.log(`   min=${min}ms, max=${max}ms, avg=${avg}ms`);

          expect(avg, `${fileName} avg under SLA`).to.be.lessThan(SLA_MS);
          return cy.wrap(null);
        }

        const filePath = `${Cypress.config(
          "projectRoot"
        )}/cypress/fixtures/${fileName}`;

        return cy
          .task("ocrUpload", {
            url: OCR_URL,
            token,
            filePath,
            filename: fileName,
          })
          .then((res) => {
            expect(res.status, "HTTP status").to.eq(200);
            expect(res.elapsed, "under SLA").to.be.lessThan(SLA_MS);
            expect(res.body?.success, "response.success").to.be.true;

            cy.log(`   run ${run}: ${res.elapsed}ms`);
            times.push(res.elapsed);

            return runForFile(fileName, run + 1, times);
          });
      };

      let chain = cy.wrap(null);
      FILES.forEach((f) => {
        chain = chain.then(() => runForFile(f));
      });

      chain.then(() => {
        console.table(results);
      });
    });
  });
});
