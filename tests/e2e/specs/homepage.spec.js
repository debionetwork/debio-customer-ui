// https://docs.cypress.io/api/introduction/api.html

describe("Homepage Tests", () => {
  it("Visits the app root url", () => {
    cy.visit("http://localhost:8080");
    cy.contains("h2", "Welcome to our site!");
    cy.contains("h4", "DeBio Network allows users to sample and test anonymously, without leaving home. Empower labs of all sizes to collaborate on analyzing genetic and medical data, and offering joint biomedical products.");
    cy.contains("div", "The Privacy-First Platform for Personal Genetic and Biomedical Testing");
    cy.contains("span", "Sign In");
    cy.contains("span", "Generate Account");
  });
});
