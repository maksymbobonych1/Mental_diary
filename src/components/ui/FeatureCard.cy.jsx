/* global describe cy it */

import React from "react";
import FeatureCard from "./FeatureCard";
import styles from "../../styles/HomePage.module.css";

const mockProps = {
  title: "Тест Приватність",
  description:
    "Це демонстраційний опис, який повинен бути відображений у картці.",
};

describe("FeatureCard Component Tests", () => {
  it("should mount the component and check for basic structure", () => {
    cy.mount(<FeatureCard {...mockProps} />);

    cy.get('[data-cy="feature-card"]').should("be.visible");
    cy.get("h2").should("exist");
    cy.get("p").should("exist");
  });

  it("should display the correct title and description from props", () => {
    cy.mount(<FeatureCard {...mockProps} />);

    cy.get(`.${styles.cardTitle}`)
      .should("contain.text", mockProps.title)
      .should("be.visible");

    cy.get(`.${styles.cardDescription}`)
      .should("contain.text", mockProps.description)
      .should("be.visible");
  });

  it("should render content correctly even with empty props", () => {
    cy.mount(<FeatureCard title="" description="" />);

    cy.get('[data-cy="card-title"]').should("exist");
    cy.get(`.${styles.cardDescription}`).should("be.empty");
  });
});
