/* global describe cy it */

import React from "react";
import Header from "./Header";
import { BrowserRouter } from "react-router-dom";

const mountWithRouter = (component) => {
  return cy.mount(<BrowserRouter>{component}</BrowserRouter>);
};

describe("Header Component Tests", () => {
  it("1. Renders correctly and displays the app name", () => {
    mountWithRouter(<Header />);
    cy.get("header").should("be.visible");
    cy.contains("Mental Diary").should("exist");
  });

  it("2. Log in button links to /login", () => {
    mountWithRouter(<Header />);
    cy.contains("Log in").should("have.attr", "href", "/login");
  });
});
