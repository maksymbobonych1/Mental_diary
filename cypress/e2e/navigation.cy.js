/* global describe cy it beforeEach  */

describe('Navigation and Logout', () => {
  const email = 'test@mail.com';
  const password = '12345';

  beforeEach(() => {
    cy.visit('/login');
    cy.get('input[placeholder="Електронна пошта"]').clear().type(email);
    cy.get('input[placeholder="Пароль"]').clear().type(password);
    cy.contains('button', 'Увійти').click();
    cy.url().should('include', '/main');
  });

  it('should navigate between pages', () => {
    cy.contains('a', 'Огляд').click();
    cy.url().should('include', '/review');
    cy.contains('h2', 'Графік настрою').should('be.visible');

    cy.get('a[href="/profile"]').first().click();
    cy.url().should('include', '/profile');
    cy.contains('h2', 'Особисті дані').should('be.visible');
    
    cy.contains('Email:').next().should('contain', email);
  });

  it('should logout correctly', () => {
    cy.get('a[href="/profile"]').first().click();
    
    cy.url().should('include', '/profile');
    
    cy.contains('Вихід').should('be.visible').click();
    
    cy.url().should('include', '/login');
    cy.contains('h2', 'Увійти у свій акаунт').should('be.visible');
  });
});