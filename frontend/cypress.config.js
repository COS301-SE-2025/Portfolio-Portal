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
    baseUrl: "http://localhost:5173", // Vite default dev port
  },
});
