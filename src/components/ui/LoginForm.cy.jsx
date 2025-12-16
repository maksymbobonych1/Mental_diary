/* global describe cy it beforeEach */
import React from "react";
import LoginForm from "./LoginForm";
import PropTypes from "prop-types";
import { BrowserRouter } from "react-router-dom";

const MockLoginPage = ({
  onLogin,
  navigate,
  setIsLoginView,
  setError,
  testLogin,
}) => {
  return (
    <LoginForm
      onLogin={onLogin}
      navigate={navigate}
      setIsLoginView={setIsLoginView}
      setError={setError}
      testLogin={testLogin}
    />
  );
};

MockLoginPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
  setIsLoginView: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  testLogin: PropTypes.func,
};

describe("LoginForm Component Tests", () => {
  let loginStub;
  let onLoginSpy;
  let navigateSpy;

  beforeEach(() => {
    loginStub = cy.stub().resolves({ success: true });

    onLoginSpy = cy.spy().as("onLoginSpy");
    navigateSpy = cy.spy().as("navigateSpy");

    cy.mount(
      <BrowserRouter>
        <MockLoginPage
          onLogin={onLoginSpy}
          navigate={navigateSpy}
          setIsLoginView={cy.spy()}
          setError={cy.spy()}
          testLogin={loginStub}
        />
      </BrowserRouter>
    );
  });

  it("1. Should allow typing into email and password fields", () => {
    cy.get('input[type="email"]')
      .clear()
      .type("test@user.com")
      .should("have.value", "test@user.com");
    cy.get('input[type="password"]')
      .clear()
      .type("12345")
      .should("have.value", "12345");
  });

  it("2. Submitting the form should call the mock login function", () => {
    cy.get('input[type="email"]').clear().type("test@mail.com");
    cy.get('input[type="password"]').clear().type("12345");

    cy.get("form").submit();

    cy.wrap(loginStub).should("be.calledOnce");

    cy.wrap(onLoginSpy).should("be.called");
    cy.wrap(navigateSpy).should("be.calledWith", "/main");
  });
});
