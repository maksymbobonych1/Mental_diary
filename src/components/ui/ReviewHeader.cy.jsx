/* global describe cy it */
import React from "react";
import ReviewHeader from "./ReviewHeader";
import { BrowserRouter } from "react-router-dom";

describe("ReviewHeader Component Tests", () => {
  it('1. Should render correctly for "Огляд" page', () => {
    cy.mount(
      <BrowserRouter>
        <ReviewHeader currentPage="Огляд" />
      </BrowserRouter>
    );

    cy.contains("h1", "Огляд").should("be.visible");

    cy.contains("a", "Головна сторінка").should("have.attr", "href", "/main");
  });

  it('2. Should render correctly for "Main" (Home) page', () => {
    cy.mount(
      <BrowserRouter>
        <ReviewHeader currentPage="Main" />
      </BrowserRouter>
    );

    cy.contains("h1", "Головна").should("be.visible");

    cy.contains("a", "Огляд").should("have.attr", "href", "/review");
  });

  it("3. Logo and Icon should link to Profile", () => {
    cy.mount(
      <BrowserRouter>
        <ReviewHeader currentPage="Main" />
      </BrowserRouter>
    );

    cy.get("header a").first().should("have.attr", "href", "/profile");

    cy.get("nav a").last().should("have.attr", "href", "/profile");
  });
});
