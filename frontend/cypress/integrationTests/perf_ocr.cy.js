// Backend-only OCR performance test using a Cypress task (Node-side multipart).
// No UI, no cy.visit, no extra packages.
//
// Needs:
// - Backend at http://localhost:5050
// - cypress.env.json with { "loginEmail": "...", "loginPassword": "...", "ocrMaxMs": 15000 }
// - A test CV in cypress/fixtures

describe("OCR upload performance (non-functional, backend-only)", () => {
  const API_BASE = "http://localhost:5050";
  const OCR_URL = `${API_BASE}/api/ocr/upload`;

  const FIXTURE_FILE = "Ava Reynolds CV (demo3 - software engineer).pdf";

  const SLA_MS = Number(Cypress.env("ocrMaxMs") || 15000);

  it("measures backend OCR time via Node task (reliable multipart)", () => {
    // Get JWT by logging in through API
    cy.loginByApi().then((token) => {
      cy.log("Logged in via API");

      // Resolve absolute path to fixture
      const filePath = `${Cypress.config(
        "projectRoot"
      )}/cypress/fixtures/${FIXTURE_FILE}`;

      // Call the Node task to upload the file with FormData
      const start = Date.now();
      cy.task("ocrUpload", {
        url: OCR_URL,
        token,
        filePath,
        filename: FIXTURE_FILE,
      }).then((res) => {
        const elapsed = Date.now() - start;

        cy.log(`HTTP status: ${res.status}`);
        cy.log(`OCR processing time: ${elapsed} ms`);

        console.log(
          "OCR elapsed (ms):",
          elapsed,
          "status:",
          res.status,
          res.body
        );

        expect(res.status, "HTTP status").to.eq(200);
        expect(
          elapsed,
          `OCR should complete under ${SLA_MS} ms`
        ).to.be.lessThan(SLA_MS);

        if (res.body && typeof res.body === "object") {
          expect(res.body.success, "response.success").to.be.true;
          expect(res.body.data, "response.data").to.exist;
        }
      });
    });
  });
});
