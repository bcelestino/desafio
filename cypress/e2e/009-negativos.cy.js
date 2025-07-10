// cypress/e2e/009-negativos.cy.js

describe('Casos negativos', () => {
  beforeEach(() => {
    cy.login()
  })
  
  // ==========================
  // USUÁRIOS - GET /users/:id
  // ==========================
  describe('Usuários - Requisições inválidas', () => {
    it('Tenta buscar usuário inexistente', () => {
      cy.request({
        method: 'GET',
        url: '/users/999999',
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(404)
      })
    })

    it('Tenta buscar usuário com ID inválido (string)', () => {
      cy.request({
        method: 'GET',
        url: '/users/abc',
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.be.oneOf([400, 404])
      })
    })
  })

  // ==========================
  // LOGIN - POST /auth/login
  // ==========================
  describe('Login - Credenciais inválidas', () => {
    it('Tenta login com usuário inválido', () => {
      cy.request({
        method: 'POST',
        url: '/auth/login',
        failOnStatusCode: false,
        body: {
          username: 'usuario_inexistente',
          password: 'senhaqualquer',
        },
      }).then((res) => {
        expect(res.status).to.be.oneOf([400, 401])
      })
    })

    it('Tenta login com senha inválida', () => {
      cy.request({
        method: 'POST',
        url: '/auth/login',
        failOnStatusCode: false,
        body: {
          username: Cypress.env('user'),
          password: 'senha_errada',
        },
      }).then((res) => {
        expect(res.status).to.be.oneOf([400, 401])
      })
    })

    it('Tenta login com corpo vazio', () => {
      cy.request({
        method: 'POST',
        url: '/auth/login',
        failOnStatusCode: false,
        body: {},
      }).then((res) => {
        expect(res.status).to.be.oneOf([400, 401])
      })
    })
  })
})
