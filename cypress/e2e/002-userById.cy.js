/// <reference types="cypress" />

describe('Consulta de Usuário por ID', () => {
  const userIds = [1, 2, 3]; // IDs para testar

  // Corrigir a leitura do endpoint da variável correta do env (tudo minúsculo)
  const userBaseEndpoint = Cypress.env('users_endpoint');
  const expectedFirstName = Cypress.env('first_name');
  const expectedLastName = Cypress.env('last_name');
  const expectedEmailDomain = Cypress.env('email_domain');

  before(() => {
    // Validação simples para garantir que o endpoint foi carregado
    if (!userBaseEndpoint) {
      throw new Error('users_endpoint não está definido no Cypress.env');
    }
    cy.log('Preparando autenticação antes dos testes');
    cy.login(); // assumindo que seu comando cy.login() salva o token em Cypress.env('token')
  });

  beforeEach(() => {
    cy.log('Iniciando novo teste para GET /users/:id');
  });

  afterEach(() => {
    cy.log('Finalizando teste individual');
  });

  userIds.forEach((userId) => {
    it(`Deve retornar status 200 para usuário com ID ${userId}`, () => {
      cy.request({
        method: 'GET',
        url: `${userBaseEndpoint}/${userId}`,
        headers: {
          Authorization: `Bearer ${Cypress.env('token')}`
        }
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.id).to.eq(userId);
      });
    });

    it(`Deve validar campos principais do usuário com ID ${userId}`, () => {
      cy.request({
        method: 'GET',
        url: `${userBaseEndpoint}/${userId}`,
        headers: {
          Authorization: `Bearer ${Cypress.env('token')}`
        }
      }).then((res) => {
        const user = res.body;
        cy.validateUserFields(user); // assumindo que essa função existe

        if (userId === 1) {
          expect(user.firstName).to.eq(expectedFirstName);
          expect(user.lastName).to.eq(expectedLastName);
          expect(user.email).to.include(expectedEmailDomain);
        }
      });
    });
  });

  it('Deve falhar ao buscar usuário inexistente', () => {
    cy.request({
      method: 'GET',
      url: `${userBaseEndpoint}/99999`,
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${Cypress.env('token')}`
      }
    }).then((res) => {
      expect(res.status).to.eq(404);
    });
  });

  it('Deve validar tipos de dados e integridade do contrato para ID 1', () => {
    cy.request({
      method: 'GET',
      url: `${userBaseEndpoint}/1`,
      headers: {
        Authorization: `Bearer ${Cypress.env('token')}`
      }
    }).then((res) => {
      const user = res.body;
      expect(user.id).to.be.a('number');
      expect(user.firstName).to.be.a('string');
      expect(user.lastName).to.be.a('string');
      expect(user.age).to.be.a('number');
      expect(user.address).to.be.an('object');
      expect(user.bank).to.be.an('object');
      expect(user.hair).to.be.an('object');
    });
  });

  it('Simula erro 500 no servidor na rota GET /users/1 (via fetch no browser)', () => {
  cy.intercept('GET', '**/users/1', {
    statusCode: 500,
    body: { error: 'Erro interno do servidor' }
  }).as('getUserError')

  cy.visit('/') // Para ter contexto do window

  cy.window().then((win) => {
    return win.fetch('/users/1')
  })

  cy.wait('@getUserError').then(({ response }) => {
    expect(response.statusCode).to.eq(500)
    expect(response.body).to.have.property('error', 'Erro interno do servidor')
  })
  })

  it('Simula delay de 3 segundos na resposta da API GET /users/1 (via fetch no browser)', () => {
  cy.intercept('GET', '**/users/1', (req) => {
    req.on('response', (res) => {
      res.setDelay(3000) // delay em ms
    })
  }).as('getUserDelay')

  cy.visit('/') // Para ter contexto do window

  cy.window().then((win) => {
    return win.fetch('/users/1')
  })

  const startTime = Date.now()

  cy.wait('@getUserDelay').then(() => {
    const duration = Date.now() - startTime
    expect(duration).to.be.gte(3000)
  })
  })


});
