/* global describe cy it beforeEach */
import React from "react";
import ProfileHeader from "./ProfileHeader";
import { BrowserRouter } from "react-router-dom";

describe("ProfileHeader Component Tests", () => {
  let onLogoutSpy;

  beforeEach(() => {
    onLogoutSpy = cy.spy().as("onLogoutSpy");

    cy.mount(
      <BrowserRouter>
        <ProfileHeader onLogout={onLogoutSpy} />
      </BrowserRouter>
    );
  });

  it("1. Should render logo, title and navigation buttons", () => {
    cy.contains("h1", "Профіль").should("be.visible");

    cy.contains("Головна сторінка").should("be.visible");
    cy.contains("Вихід").should("be.visible");
  });

  it('2. "Main Page" button should have correct link', () => {
    cy.contains("Головна сторінка").should("have.attr", "href", "/main");
  });

  it('3. Clicking "Logout" should call onLogout function', () => {
    cy.contains("Вихід").click();
    cy.get("@onLogoutSpy").should("be.calledOnce");
  });
});
