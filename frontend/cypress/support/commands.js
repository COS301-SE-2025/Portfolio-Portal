// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("loginByApi", () => {
  const email = Cypress.env("loginEmail");
  const password = Cypress.env("loginPassword");

  if (!email || !password) {
    throw new Error(
      'Missing loginEmail/loginPassword in cypress.env.json. Add: { "loginEmail": "...", "loginPassword": "..." }'
    );
  }

  return cy
    .request({
      method: "POST",
      url: "http://localhost:5050/api/users/login",
      body: { email, password },
      failOnStatusCode: true,
    })
    .then((res) => {
      const token = res.body?.token;
      if (!token) {
        throw new Error("Login succeeded but no token found in response.");
      }
      return token;
    });
});

Cypress.Commands.add("visitWithAuth", (path = "/home") => {
  return cy.loginByApi().then((token) => {
    cy.visit(path, {
      onBeforeLoad(win) {
        win.localStorage.setItem("token", token);
        win.localStorage.setItem("authToken", token);
      },
    });
    return cy.wrap(token, { log: false });
  });
});
