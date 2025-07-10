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


  it('Simula erro 500 no servidor (via fetch)', () => {
    cy.intercept('POST', Cypress.env('login_endpoint'), {
      statusCode: 500,
      body: { error: 'Erro interno do servidor' }
    }).as('serverError')

    cy.window().then((win) => {
      return win.fetch(Cypress.env('login_endpoint'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: Cypress.env('user'),
          password: Cypress.env('pass')
        })
      })
    }).then((res) => {
      expect(res.status).to.eq(500)
    })

    cy.wait('@serverError')
  })

  it('Simula delay na API (via fetch)', () => {
    cy.intercept('POST', Cypress.env('login_endpoint'), (req) => {
      req.on('response', (res) => {
        res.setDelay(1000) // 1 segundo
      })
    }).as('delayedLogin')

    cy.window().then((win) => {
      return win.fetch(Cypress.env('login_endpoint'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: Cypress.env('user'),
          password: Cypress.env('pass')
        })
      })
    }).then((res) => {
      expect(res.status).to.eq(200)
    })

    cy.wait('@delayedLogin')
  })

  it('Simula erro 500 no servidor (via cy.request)', () => {
  cy.intercept('POST', Cypress.env('login_endpoint'), {
    statusCode: 500,
    body: { error: 'Erro interno do servidor' }
  }).as('serverError')

  cy.request({
    method: 'POST',
    url: Cypress.env('login_endpoint'),
    headers: { 'Content-Type': 'application/json' },
    body: {
      username: Cypress.env('user'),
      password: Cypress.env('pass')
    },
    failOnStatusCode: false // para não falhar automaticamente no status 500
  }).then((res) => {
    expect(res.status).to.eq(500)
  })

  cy.wait('@serverError')
})

it('Simula delay na API (via cy.request)', () => {
  cy.intercept('POST', Cypress.env('login_endpoint'), (req) => {
    req.on('response', (res) => {
      res.setDelay(1000) // 1 segundo de delay
    })
  }).as('delayedLogin')

  cy.request({
    method: 'POST',
    url: Cypress.env('login_endpoint'),
    headers: { 'Content-Type': 'application/json' },
    body: {
      username: Cypress.env('user'),
      password: Cypress.env('pass')
    }
  }).then((res) => {
    expect(res.status).to.eq(200)
  })

  cy.wait('@delayedLogin')
})


})
