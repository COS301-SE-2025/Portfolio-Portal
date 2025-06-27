//frontend/cypress/integrationTests/login.cy.js
describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  //---------------------------------------------------------

  it("Renders login form with inputs & button", () => {
    cy.get('input[name="email"]').should("exist");
    cy.get('input[name="password"]').should("exist");
    cy.contains("Sign in").should("exist");
  });

  //---------------------------------------------------------

  it("Accepts user input for email and password", () => {
    cy.get('input[name="email"]')
      .type("test@example.com")
      .should("have.value", "test@example.com");
    cy.get('input[name="password"]')
      .type("securepassword")
      .should("have.value", "securepassword");
  });

  //---------------------------------------------------------

  it("Shows error message on failed login", () => {
    cy.intercept("POST", "**/login", {
      statusCode: 401,
      body: { message: "Invalid credentials" },
    }).as("loginFail");

    cy.get('input[name="email"]').type("wrong@example.com");
    cy.get('input[name="password"]').type("wrongpassword");
    cy.contains("Sign in").click();

    cy.wait("@loginFail");

    cy.contains("Invalid credentials").should("exist");
  });

  //---------------------------------------------------------

  it("Logs in successfully and redirects to /home", () => {
    cy.intercept("POST", "**/login", {
      statusCode: 200,
      body: { token: "mock-token" },
    }).as("loginSuccess");

    cy.get('input[name="email"]').type("valid@example.com");
    cy.get('input[name="password"]').type("validpassword");
    cy.contains("Sign in").click();

    cy.wait("@loginSuccess");

    cy.url().should("include", "/home");
    cy.window().then((win) => {
      expect(win.localStorage.getItem("token")).to.eq("mock-token");
    });
  });

  //---------------------------------------------------------

  it("Navigates to register page on Sign Up click", () => {
    cy.contains("Sign Up").click();
    cy.url().should("include", "/register");
  });
});
