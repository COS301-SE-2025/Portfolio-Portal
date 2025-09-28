// import { defineConfig } from "cypress";

// export default defineConfig({
//   e2e: {
//     setupNodeEvents(on, config) {
//       // implement node event listeners here
//     },
//   },
// });

import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: "cypress/integrationTests/**/*.cy.{js,jsx,ts,tsx}",

    baseUrl: "http://localhost:5173",

    setupNodeEvents(on, config) {
      on("task", {
        async ocrUpload({ url, token, filePath, filename }) {
          const fs = await import("node:fs");
          const data = fs.readFileSync(filePath);

          const form = new FormData();
          const blob = new Blob([data], { type: "application/pdf" });
          form.append("cv", blob, filename);

          const res = await fetch(url, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: form,
          });

          const text = await res.text();
          let body;
          try {
            body = JSON.parse(text);
          } catch {
            body = { raw: text };
          }

          return {
            status: res.status,
            ok: res.ok,
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
