/* global describe cy it beforeEach */
import React from "react";
import Footer from "./Footer";
import { BrowserRouter } from "react-router-dom";

describe("Footer Component Tests", () => {
  beforeEach(() => {
    cy.mount(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
  });

  it("1. Should render contact information correctly", () => {
    cy.contains("h4", "Контакти").should("be.visible");

    cy.contains("Телефон:").should("be.visible");
    cy.contains("Email:").should("be.visible");
    cy.contains("Адреса:").should("be.visible");
  });

  it("2. Should render navigation links with correct paths", () => {
    cy.contains("h4", "Про проєкт").should("be.visible");

    cy.contains("a", "Огляд")
      .should("be.visible")
      .and("have.attr", "href", "/review");

    cy.contains("a", "Авторизація")
      .should("be.visible")
      .and("have.attr", "href", "/login");
  });

  it("3. Should display current copyright year", () => {
    const currentYear = new Date().getFullYear();
    cy.contains(`© ${currentYear} Mental Diary`).should("be.visible");
  });
});
