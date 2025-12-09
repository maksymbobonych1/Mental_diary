/* global describe cy it beforeEach */

describe('Journal Functionality', () => {
  let email;
  let password;

  beforeEach(() => {
    const uniqueId = Date.now();
    email = `diary_${uniqueId}@test.com`;
    password = '12345';

    cy.visit('/login');

    cy.contains('span', 'Створити новий').click(); 

    cy.get('input[placeholder="Електронна пошта"]').type(email);
    cy.get('input[placeholder="Ім\'я"]').type('Test');
    cy.get('input[placeholder="Прізвище"]').type('User');
    cy.get('input[placeholder="Пароль"]').type(password);
    cy.get('input[placeholder="Пароль знову"]').type(password);
    
    cy.contains('button', 'Зареєструвати').click();

    cy.contains('h2', 'Увійти у свій акаунт').should('be.visible');

    cy.get('input[placeholder="Електронна пошта"]').clear().type(email);
    cy.get('input[placeholder="Пароль"]').clear().type(password);
    
    cy.contains('button', 'Увійти').click();

    cy.url().should('include', '/main');
  });

  it('should create a new mood entry', () => {
    cy.get('button').eq(0).click(); 

    const noteText = 'Мій E2E запис щоденника';
    cy.get('textarea').type(noteText);

    cy.contains('button', 'Робота').click();

    cy.contains('button', 'Зберегти запис').click();
    
    cy.get('textarea').should('have.value', '');
  });
});