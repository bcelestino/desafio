// cypress/e2e/008-intercept.cy.js

describe('Intercept API - Erros simulados e delays (fetch)', () => {

  describe('Usuários - GET /users', () => {
    it('Simula erro 500 no GET /users', () => {
      cy.intercept('GET', '**/users', {
        statusCode: 500,
        body: { error: 'Erro simulado' },
      }).as('getUsersError')

      cy.window().then(win => win.fetch('/users'))

      cy.wait('@getUsersError').then(({ response }) => {
        expect(response.statusCode).to.eq(500)
        expect(response.body).to.have.property('error', 'Erro simulado')
      })
    })

    it('Simula delay de 3s no GET /users', () => {
      cy.intercept('GET', '**/users', (req) => {
        req.on('response', (res) => {
          res.setDelay(3000)
        })
      }).as('getUsersDelay')

      cy.window().then(win => win.fetch('/users'))

      cy.wait('@getUsersDelay').then(({ response }) => {
        expect(response.statusCode).to.eq(200)
      })
    })
  })

  describe('Usuários - GET /users/:id', () => {
    it('Simula erro 404 no GET /users/:id', () => {
      cy.intercept('GET', '**/users/9999', {
        statusCode: 404,
        body: { error: 'Usuário não encontrado' },
      }).as('getUserNotFound')

      cy.window().then(win => win.fetch('/users/9999'))

      cy.wait('@getUserNotFound').then(({ response }) => {
        expect(response.statusCode).to.eq(404)
        expect(response.body).to.have.property('error', 'Usuário não encontrado')
      })
    })
  })

  describe('Login - POST /auth/login', () => {
    it('Simula erro 401 no POST /auth/login', () => {
      cy.intercept('POST', '**/auth/login', {
        statusCode: 401,
        body: { error: 'Credenciais inválidas' },
      }).as('postLoginUnauthorized')

      cy.window().then(win =>
        win.fetch('/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'user_invalido', password: 'senha_errada' }),
        })
      )

      cy.wait('@postLoginUnauthorized').then(({ response }) => {
        expect(response.statusCode).to.eq(401)
        expect(response.body).to.have.property('error', 'Credenciais inválidas')
      })
    })

    it('Simula delay de 2s no POST /auth/login', () => {
      cy.intercept('POST', '**/auth/login', (req) => {
        req.on('response', (res) => {
          res.setDelay(2000)
        })
      }).as('postLoginDelay')

      cy.window().then(win =>
        win.fetch('/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'emilys', password: 'emilyspass' }),
        })
      )

      cy.wait('@postLoginDelay').then(({ response }) => {
        expect(response.statusCode).to.be.oneOf([200, 201])
      })
    })
  })

  describe('Produtos - POST /auth/products/add', () => {
    it('Simula erro 400 no POST /auth/products/add', () => {
      cy.intercept('POST', '**/auth/products/add', {
        statusCode: 400,
        body: { error: 'Dados do produto inválidos' },
      }).as('postProductBadRequest')

      cy.window().then(win =>
        win.fetch('/auth/products/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: '', price: -10 }), // dados inválidos
        })
      )

      cy.wait('@postProductBadRequest').then(({ response }) => {
        expect(response.statusCode).to.eq(400)
        expect(response.body).to.have.property('error', 'Dados do produto inválidos')
      })
    })

    it('Simula delay de 2.5s no POST /auth/products/add', () => {
      cy.intercept('POST', '**/auth/products/add', (req) => {
        req.on('response', (res) => {
          res.setDelay(2500)
        })
      }).as('postProductDelay')

      cy.window().then(win =>
        win.fetch('/auth/products/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'Produto Teste', price: 100, stock: 10 }),
        })
      )

      cy.wait('@postProductDelay').then(({ response }) => {
        // Pode ser 401 se token faltar, ou 200/201 se autorizado
        expect(response.statusCode).to.be.oneOf([200, 201, 401])
      })
    })
  })

})
