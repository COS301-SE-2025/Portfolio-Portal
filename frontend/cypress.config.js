// import { defineConfig } from "cypress";

// export default defineConfig({
//   e2e: {
//     setupNodeEvents(on, config) {
//       // implement node event listeners here
//     },
//   },
// });

import { defineConfig } from "cypress";
import fs from "node:fs";

export default defineConfig({
  e2e: {
    specPattern: "cypress/integrationTests/**/*.cy.{js,jsx,ts,tsx}",
    baseUrl: "http://localhost:5173",

    setupNodeEvents(on, config) {
      on("task", {
        async ocrUpload({ url, token, filePath, filename }) {
          const data = fs.readFileSync(filePath);

          const form = new FormData();
          const blob = new Blob([data], { type: "application/pdf" });
          form.append("cv", blob, filename);

          const start = Date.now();
          const res = await fetch(url, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: form,
          });
          const elapsed = Date.now() - start;

          let body;
          try {
            body = await res.json();
          } catch {
            body = { raw: await res.text() };
          }

          return {
            status: res.status,
            elapsed,
            body,
          };
        },
      });

      return config;
    },
  },

  video: false,
  viewportWidth: 1280,
  viewportHeight: 800,
});
