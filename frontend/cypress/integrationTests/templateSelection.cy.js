// /// <reference types="cypress" />
// import "cypress-file-upload";

// describe("Template Selection Integration Tests", () => {
//   const testUser = {
//     name: "Test User",
//     email: `testuser+${Date.now()}@example.com`,
//     password: "Test1234!",
//   };

//   let isRegistered = false;

//   before(() => {
//     // clean up test user if exists from previous runs
//     cy.request({
//       method: "DELETE",
//       url: "http://localhost:5050/api/auth/delete",
//       body: { email: testUser.email },
//       failOnStatusCode: false,
//     });
//   });

//   beforeEach(() => {
//     cy.visit("/");
//     cy.clearLocalStorage();
//     cy.clearCookies();

//     if (isRegistered) {
//       cy.loginUser(testUser);
//     } else {
//       cy.registerNewUser(testUser);
//       isRegistered = true;
//     }
//   });

//   Cypress.Commands.add("registerNewUser", (user) => {
//     cy.visit("/register");
//     cy.get('input[name="name"], #name, [data-testid="name-input"]', {
//       timeout: 10000,
//     })
//       .should("be.visible")
//       .type(user.name);
//     cy.contains("button", /continue/i).click();

//     cy.get('input[name="email"], #email, [data-testid="email-input"]', {
//       timeout: 10000,
//     })
//       .should("be.visible")
//       .type(user.email);
//     cy.contains("button", /continue/i).click();

//     cy.get(
//       'input[name="password"], #password, [data-testid="password-input"]',
//       {
//         timeout: 10000,
//       }
//     )
//       .should("be.visible")
//       .type(user.password);

//     cy.get(
//       'input[name="confirmPassword"], #confirmPassword, [data-testid="confirm-password-input"]'
//     )
//       .should("be.visible")
//       .type(user.password);

//     cy.contains("button", /sign up/i).click();
//     cy.url({ timeout: 30000 }).should("include", "/home");
//   });

//   Cypress.Commands.add("loginUser", (user) => {
//     cy.visit("/login");
//     cy.get('input[name="email"]').type(user.email);
//     cy.get('input[name="password"]').type(user.password);
//     cy.contains("Sign in").click();
//     cy.url({ timeout: 30000 }).should("include", "/home");
//   });

//   const navigateToUploadSection = () => {
//     cy.contains("Find out more").click();
//     cy.get("#how-it-works", { timeout: 10000 }).should("be.visible");
//     cy.get("#how-it-works button").click({ force: true });
//     cy.contains("h1", /upload your/i, { timeout: 10000 }).should("be.visible");
//   };

//   const uploadCVAndVerifyTemplate = (
//     cvFixture,
//     expectedTemplate,
//     templateSpecificAssertions
//   ) => {
//     // upload the CV file
//     cy.fixture(cvFixture, "binary").then((fileContent) => {
//       const blob = new Blob([fileContent], { type: "application/pdf" });
//       const file = new File([blob], cvFixture, { type: "application/pdf" });

//       cy.get("input[type=file]").then((input) => {
//         const dataTransfer = new DataTransfer();
//         dataTransfer.items.add(file);
//         input[0].files = dataTransfer.files;
//         cy.wrap(input).trigger("change", { force: true });
//       });
//     });

//     cy.get("iframe", { timeout: 150000000 }).should("be.visible");
//     cy.contains("button", "Process CV").click();
//     cy.contains(/processing.../i, { timeout: 150000000 }).should("be.visible");
//     cy.url({ timeout: 300000000 }).should("include", `/${expectedTemplate}`);
//     templateSpecificAssertions();
//   };

//   //  ------------------------------------------Space Template Test------------------------------------------
//   describe("Space Template (Developer CV)", () => {
//     beforeEach(() => {
//       cy.intercept("POST", "/api/ocr/upload", {
//         statusCode: 200,
//         body: {
//           success: true,
//           template: "space",
//           data: {
//             name: "John Doe",
//             skills: ["JavaScript", "React", "Node.js"],
//             experience: [
//               {
//                 position: "Senior Developer",
//                 company: "Tech Corp",
//                 duration: "2020-Present",
//               },
//             ],
//           },
//         },
//       }).as("uploadRequest");
//       navigateToUploadSection();
//     });

//     it("should upload developer CV and select space template", () => {
//       uploadCVAndVerifyTemplate("developer-cv.pdf", "space", () => {
//         cy.get("canvas").should("exist");
//         cy.contains("h2", "About Me").should("be.visible");
//       });
//     });
//   });

//   //  ------------------------------------------Office Template Test------------------------------------------
//   describe("Office Template (Manager CV)", () => {
//     beforeEach(() => {
//       cy.intercept("POST", "/api/ocr/upload", {
//         statusCode: 200,
//         body: {
//           success: true,
//           template: "office",
//           data: {
//             name: "Jane Smith",
//             skills: ["Project Management", "Leadership"],
//             experience: [
//               {
//                 position: "Senior Manager",
//                 company: "Business Solutions",
//                 duration: "2018-Present",
//               },
//             ],
//           },
//         },
//       }).as("uploadRequest");
//       navigateToUploadSection();
//     });

//     it("should upload manager CV and select office template", () => {
//       uploadCVAndVerifyTemplate("manager-cv.pdf", "office", () => {
//         cy.contains("Hi").should("be.visible");
//       });
//     });
//   });

//   //  ------------------------------------------Forest Template Test------------------------------------------
//   describe("Forest Template (Designer CV)", () => {
//     beforeEach(() => {
//       cy.intercept("POST", "/api/ocr/upload", {
//         statusCode: 200,
//         body: {
//           success: true,
//           template: "forest",
//           data: {
//             name: "Alex Johnson",
//             skills: ["UI/UX Design", "Illustration"],
//             experience: [
//               {
//                 position: "Creative Director",
//                 company: "Design Studio",
//                 duration: "2019-Present",
//               },
//             ],
//           },
//         },
//       }).as("uploadRequest");
//       navigateToUploadSection();
//     });

//     it("should upload designer CV and select forest template", () => {
//       uploadCVAndVerifyTemplate("designer-cv.pdf", "forest", () => {
//         cy.contains("Hi").should("be.visible");
//       });
//     });
//   });

//   // ------------------------------------------Failed Upload Test ------------------------------------------
//   describe("Failed CV Upload", () => {
//     beforeEach(() => {
//       cy.intercept("POST", "/api/ocr/upload", {
//         statusCode: 500,
//         body: { success: false, message: "Processing failed" },
//       }).as("uploadRequest");
//       navigateToUploadSection();
//     });

//     it("should show error when processing fails", () => {
//       cy.fixture("developer-cv.pdf", "binary").then((fileContent) => {
//         const blob = new Blob([fileContent], { type: "application/pdf" });
//         const file = new File([blob], "developer-cv.pdf", {
//           type: "application/pdf",
//         });

//         cy.get("input[type=file]").then((input) => {
//           const dataTransfer = new DataTransfer();
//           dataTransfer.items.add(file);
//           input[0].files = dataTransfer.files;
//           cy.wrap(input).trigger("change", { force: true });
//         });
//       });

//       cy.get("iframe", { timeout: 150000000 }).should("be.visible");
//       cy.contains("button", "Process CV").click();
//       cy.wait("@uploadRequest");
//       cy.contains("Upload failed", { timeout: 150000000 }).should("be.visible");
//     });
//   });
//   //------------------------------------------------------------------------------------
// });
