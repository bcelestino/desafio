/// <reference types="cypress" />

describe('Autenticação - POST /auth/login', () => {
  before(() => {
    cy.log('Iniciando suite de autenticação')
  })

  beforeEach(() => {
    cy.log('Preparando teste individual')
  })

  after(() => {
    cy.log('Finalizou suite de autenticação')
  })

  afterEach(() => {
    cy.log('Finalizando teste individual')
    Cypress.env('token', null)
  })

  it('Deve realizar login válido e validar campos básicos', () => {
    cy.request('POST', Cypress.env('login_endpoint'), {
      username: Cypress.env('user'),
      password: Cypress.env('pass')
    }).then((res) => {
      expect(res.status).to.eq(200)

      expect(res).to.have.property('body')
      expect(res.body).to.include.all.keys(
        'id', 'username', 'email', 'firstName',
        'lastName', 'gender', 'image', 'accessToken', 'refreshToken'
      )

      expect(res.body.username).to.eq('emilys')
      expect(res.body.email).to.eq('emily.johnson@x.dummyjson.com')
      expect(res.body.firstName).to.eq('Emily')
      expect(res.body.lastName).to.eq('Johnson')
    })
  })

  it('Token JWT deve ser válido e possuir 3 partes', () => {
    cy.login()
    cy.then(() => {
      const token = Cypress.env('token')
      expect(token.split('.')).to.have.length(3)
    })
  })

  it('Deve falhar com senha inválida e retornar 400', () => {
    cy.request({
      method: 'POST',
      url: Cypress.env('login_endpoint'),
      failOnStatusCode: false,
      body: {
        username: Cypress.env('user'),
        password: 'senhaErrada'
      }
    }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('message')
    })
  })

  it('Simula erro 500 no servidor (via fetch no browser)', () => {
  const loginEndpoint = Cypress.env('login_endpoint')

  cy.intercept('POST', loginEndpoint, {
    statusCode: 500,
    body: { error: 'Erro interno do servidor' }
  }).as('serverError')

  cy.visit('/') // Abre a aplicação para ter contexto do browser

  cy.window().then((win) => {
    return win.fetch(loginEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: Cypress.env('user'),
        password: Cypress.env('pass')
      }),
    })
  }).then((res) => {
    expect(res.status).to.eq(500)
  })

  cy.wait('@serverError')
  })

  it('Simula delay na API (via fetch no browser)', () => {
  const loginEndpoint = Cypress.env('login_endpoint')

  cy.intercept('POST', loginEndpoint, (req) => {
    req.on('response', (res) => {
      res.setDelay(1000) // 1 segundo de delay simulado
    })
  }).as('delayedLogin')

  cy.visit('/') // Abre a aplicação para ter contexto do browser

  cy.window().then((win) => {
    return win.fetch(loginEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: Cypress.env('user'),
        password: Cypress.env('pass')
      }),
    })
  }).then((res) => {
    expect(res.status).to.eq(200)
  })

  cy.wait('@delayedLogin')
  })






})
