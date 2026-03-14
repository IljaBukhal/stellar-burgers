describe('Страница конструктора', () => {
  beforeEach(() => {
    // Устанавливаем фейковые токены для имитации авторизации
    cy.setCookie('accessToken', 'fake-access-token');
    window.localStorage.setItem('refreshToken', 'fake-refresh-token');

    // Перехватываем запросы к API с маской ** (любой домен)
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    cy.clearLocalStorage('refreshToken');
  });

  it('должен добавлять булку в конструктор', () => {
    cy.contains('Краторная булка N-200i')
      .parents('[data-testid="ingredient-card"]')
      .find('button')
      .click();

    cy.get('[data-testid="constructor-bun-top"]').should(
      'contain',
      'Краторная булка N-200i (верх)'
    );
  });

  it('должен открывать и закрывать модальное окно ингредиента', () => {
    cy.contains('Краторная булка N-200i').click();

    cy.get('[data-testid="modal"]').should('be.visible');
    cy.get('[data-testid="modal"]')
      .contains('Краторная булка N-200i')
      .should('exist');

    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');

    cy.contains('Краторная булка N-200i').click();
    cy.get('[data-testid="modal-overlay"]').click({ force: true });
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('должен создавать заказ', () => {
    // Добавляем булку
    cy.contains('Краторная булка N-200i')
      .parents('[data-testid="ingredient-card"]')
      .find('button')
      .click();

    // Добавляем соус
    cy.contains('Соус фирменный Space Sauce')
      .parents('[data-testid="ingredient-card"]')
      .find('button')
      .click();

    // Кликаем по кнопке «Оформить заказ»
    cy.contains('button', 'Оформить заказ').click();

    cy.wait('@createOrder');

    // Проверяем модальное окно заказа
    cy.get('[data-testid="modal"]').should('be.visible');
    cy.get('[data-testid="order-number"]').should('contain', '54321');
    cy.contains('идентификатор заказа').should('be.visible');

    // Закрываем модальное окно
    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');

    // Проверяем, что конструктор очищен
    cy.get('[data-testid="constructor-bun-top"]').should('not.exist');
    cy.get('[data-testid="constructor-ingredient"]').should('not.exist');
  });
});
