// //frontend/cypress/integrationTests/home.cy.js
// describe("Home Page Integration", () => {
//   beforeEach(() => {
//     cy.visit("/home");
//   });

//   //---------------------------------------------------------

//   it("Renders all core sections", () => {
//     cy.get("#hero").should("exist");
//     cy.get("#how-it-works").should("exist");
//     cy.get("#upload-section").should("exist");
//     cy.get("#templates-section").should("exist");
//     cy.get("#about-section").should("exist");
//   });

//   //---------------------------------------------------------

//   it("Reveals sections as they scroll into view", () => {
//     cy.get("#hero").scrollIntoView();
//     cy.get("#hero").should("be.visible");

//     cy.get("#how-it-works").scrollIntoView();
//     cy.get("#how-it-works").should("be.visible");

//     cy.get("#upload-section").scrollIntoView();
//     cy.get("#upload-section").should("be.visible");

//     cy.get("#templates-section").scrollIntoView();
//     cy.get("#templates-section").should("be.visible");

//     cy.get("#about-section").scrollIntoView();
//     cy.get("#about-section").should("be.visible");
//   });

//   //---------------------------------------------------------

//   //   it("has theme toggle button visible", () => {
//   //     cy.get("button").contains(/theme/i).should("exist");
//   //   });

//   //---------------------------------------------------------

//   it("shows animated background and particles", () => {
//     cy.get(".absolute").should("exist");
//     cy.get('[style*="animation"]').should("have.length.greaterThan", 0);
//   });

//   //---------------------------------------------------------

//   it("opens HelpMenu when ? button is clicked", () => {
//     cy.get("body").then(($body) => {
//       const helpButton = $body.find("button:contains('?')");

//       if (helpButton.length) {
//         cy.wrap(helpButton).click();
//         cy.contains("Help").should("be.visible");
//       } else {
//         cy.log(
//           "HelpMenu button not found — ensure it renders a visible '?' button"
//         );
//       }
//     });
//   });
// });
