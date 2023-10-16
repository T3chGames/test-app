/// <reference types="cypress" />

context("Actions", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.get(".login").click();
    cy.contains("fake login").click();
  });
  it("test adding a recipient", () => {
    cy.contains("RECIPIENTS").click();
    cy.get("[type=email]").type("manpapier@gmail.com{enter}");
    cy.get("#copy").select("MAIN RECIEVER");
    cy.get("#add").click();
    cy.get("#save").click();
    cy.get("#login").should("contain.text", "LOGOUT");
  });

  it("test selecting date", () => {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    console.log(month.toString());
    if (month.toString().length == 1) {
      month = `0${month}`;
    }
    if (day.toString().length == 1) {
      day = `0${day}`;
    }
    cy.get("#sendDate").type(`${year}-${month}-${day}`);
  });
  it("test selecting time", () => {
    cy.get("#sendTime").type(`12:30`);
  });

  it("login and then set time and check if time is set", () => {
    const time = new Date();

    cy.get("#sendTime").type(`${time.getHours()}:${time.getMinutes() + 1}`);
    cy.get("#send").click();
    cy.get("#sendOnText").should(
      "contain.text",
      `${time.getHours()}:${time.getMinutes() + 1}`
    );
  });

  it("login, set send time, set subject and receivers and send the email.", () => {
    const time = new Date();

    cy.get("#sendTime").type(`${time.getHours()}:${time.getMinutes() + 3}`);
    cy.get("#recipients").click();
    cy.get("[type=email]").type("k.breider@provrex.nl{enter}");
    cy.get("#copy").select("MAIN RECIEVER");
    cy.get("#add").click();
    cy.get("#subject").type("automated test");
    cy.get("#save").click();
    cy.get("#send").click();
    cy.get("#confirm").click();
  });

  it("login, then save template and check if it comes back in list", () => {
    cy.get("#saveTemplate").click();
    cy.get('input[placeholder="template name"]').type("automated test1");
    cy.get('input[placeholder="template description"]').type("automated test1");
    cy.get("#save").click();
    cy.get("#importExport").click();
    cy.contains("#templateCard", "automated test1");
  });
});
