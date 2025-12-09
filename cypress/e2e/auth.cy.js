/* global describe cy it expect */
describe('Authentication Flow (E2E)', () => {
  const uniqueEmail = `user_${Date.now()}@test.com`;
  const password = 'password123';

  it('should register a new user and then log in', () => {
    cy.visit('/login');

    cy.contains('Створити новий').click();
    cy.contains('h1', 'Реєстрація').should('be.visible');

    cy.get('input[placeholder="Електронна пошта"]').type(uniqueEmail);
    cy.get('input[placeholder="Ім\'я"]').type('TestUser');
    cy.get('input[placeholder="Прізвище"]').type('Tester');
    cy.get('input[placeholder="Пароль"]').type(password);
    cy.get('input[placeholder="Пароль знову"]').type(password);

    cy.on('window:alert', (text) => {
      expect(text).to.contains('Реєстрація успішна');
    });

    cy.contains('button', 'Зареєструвати').click();

    cy.contains('h1', 'Авторизація').should('be.visible');

    cy.get('input[placeholder="Електронна пошта"]')
      .clear()
      .type(uniqueEmail);
    cy.get('input[placeholder="Пароль"]')
      .clear() 
      .type(password);
    cy.contains('button', 'Увійти').click();

    cy.url().should('include', '/main');
    cy.contains('Як ти сьогодні почуваєшся?').should('be.visible');
  });
});