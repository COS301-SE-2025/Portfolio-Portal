//frontend/cypress/integrationTests/register.cy.js
describe("Register Page", () => {
  beforeEach(() => {
    cy.visit("/register");
  });

  //---------------------------------------------------------

  it("Renders all input fields & the Sign up button", () => {
    cy.get('input[name="name"]').should("exist");
    cy.get('input[name="email"]').should("exist");
    cy.get('input[name="password"]').should("exist");
    cy.get('input[name="confirmPassword"]').should("exist");
    cy.contains("Sign up").should("exist");
  });

  //---------------------------------------------------------

  it("Shows error if passwords do not match", () => {
    cy.get('input[name="name"]').type("Test User");
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("primary123");
    cy.get('input[name="confirmPassword"]').type("different456");
    cy.contains("Sign up").click();

    cy.contains("Passwords do not match").should("be.visible");
  });

  //---------------------------------------------------------

  it("Shows error when registration fails", () => {
    // intercept registration POST request & mock a 500 error response
    cy.intercept("POST", "**/api/users/register", {
      statusCode: 500,
      body: { error: "Internal server error" },
    }).as("regError");

    cy.visit("/register");

    // fill the registration form w. valid data
    cy.get('input[name="name"]').type("Test User");
    cy.get('input[name="email"]').type("testuser@example.com");
    cy.get('input[name="password"]').type("testpassword");
    cy.get('input[name="confirmPassword"]').type("testpassword");

    // click Sign up button to trigger reg. request
    cy.contains("Sign up").click();

    // wait for intercepted request to complete
    cy.wait("@regError");

    // check that error message from the server displayed
    cy.contains("Registration failed").should("be.visible");
  });

  //---------------------------------------------------------

  it("Registers successfully and redirects to /home", () => {
    cy.intercept("POST", "**/api/users/register", {
      statusCode: 200,
      body: { token: "mock-reg-token" },
    }).as("regSuccess");

    cy.visit("/register");

    cy.get('input[name="name"]').type("New User");
    cy.get('input[name="email"]').type("new@example.com");
    cy.get('input[name="password"]').type("securepass");
    cy.get('input[name="confirmPassword"]').type("securepass");
    cy.contains("Sign up").click();

    cy.wait("@regSuccess");
    cy.url().should("include", "/home");
    cy.window().its("localStorage.token").should("eq", "mock-reg-token");
  });

  //---------------------------------------------------------

  it("registers successfully and redirects to /home", () => {
    cy.intercept("POST", "**/api/users/register", {
      statusCode: 201,
      body: { token: "mock-reg-token" },
    }).as("regSuccess");

    cy.visit("/register");

    cy.get('input[name="name"]').type("New User");
    cy.get('input[name="email"]').type("new@example.com");
    cy.get('input[name="password"]').type("securepass");
    cy.get('input[name="confirmPassword"]').type("securepass");
    cy.contains("Sign up").click();

    cy.wait("@regSuccess");
    cy.url().should("include", "/home");
    cy.window().its("localStorage.token").should("eq", "mock-reg-token");
  });
});
