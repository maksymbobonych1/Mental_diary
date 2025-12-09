/* global describe cy it beforeEach */
import React from "react";
import RegistrationForm from "./RegistrationForm";
import PropTypes from "prop-types";
import { BrowserRouter } from "react-router-dom";

const MockRegistrationForm = ({
  setIsLoginView,
  setError,
  isSubmitting,
  testRegister,
}) => {
  return (
    <RegistrationForm
      setIsLoginView={setIsLoginView}
      setError={setError}
      isSubmitting={isSubmitting}
      testRegister={testRegister}
    />
  );
};

MockRegistrationForm.propTypes = {
  setIsLoginView: PropTypes.func,
  setError: PropTypes.func,
  isSubmitting: PropTypes.bool,
  testRegister: PropTypes.func,
};

describe("RegistrationForm Component Tests", () => {
  let registerStub;
  let setIsLoginViewSpy;
  let setErrorSpy;

  beforeEach(() => {
    registerStub = cy.stub().resolves({ success: true });
    setIsLoginViewSpy = cy.spy().as("setIsLoginViewSpy");
    setErrorSpy = cy.spy().as("setErrorSpy");

    cy.mount(
      <BrowserRouter>
        <MockRegistrationForm
          setIsLoginView={setIsLoginViewSpy}
          setError={setErrorSpy}
          isSubmitting={false}
          testRegister={registerStub}
        />
      </BrowserRouter>
    );
  });

  it("1. Should allow typing into all fields", () => {
    cy.get('input[placeholder="Електронна пошта"]')
      .clear()
      .type("new@user.com")
      .should("have.value", "new@user.com");
    cy.get('input[placeholder="Ім\'я"]')
      .clear()
      .type("Max")
      .should("have.value", "Max");
  });

  it("2. Should call register on successful submission", () => {
    cy.get('input[placeholder="Електронна пошта"]')
      .clear()
      .type("valid@user.com");
    cy.get('input[placeholder="Ім\'я"]').clear().type("Valid");
    cy.get('input[placeholder="Прізвище"]').clear().type("User");

    cy.get('input[placeholder="Пароль"]').clear().type("123456");
    cy.get('input[placeholder="Пароль знову"]').clear().type("123456");

    cy.get("form").submit();

    cy.wrap(registerStub).should("be.calledOnce");
  });

  it("3. Should show error if passwords do not match", () => {
    cy.get('input[placeholder="Електронна пошта"]')
      .clear()
      .type("test@test.com");
    cy.get('input[placeholder="Ім\'я"]').clear().type("Test");
    cy.get('input[placeholder="Прізвище"]').clear().type("Test");

    cy.get('input[placeholder="Пароль"]').clear().type("123456");
    cy.get('input[placeholder="Пароль знову"]').clear().type("000000");

    cy.get("form").submit();

    cy.wrap(registerStub).should("not.be.called");
    cy.get("@setErrorSpy").should("be.calledWith", "Паролі не збігаються!");
  });
});
