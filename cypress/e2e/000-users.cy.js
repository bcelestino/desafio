describe('GET /users - Testes API DummyJSON', () => {
  const usersEndpoint = Cypress.env('users_endpoint')

  before(() => {
    cy.log('Iniciando suite de testes para /users')
  })

  after(() => {
    cy.log('Finalizando suite de testes para /users')
  })

  beforeEach(() => {
    cy.log('Executando setup antes de cada teste')
  })

  it('Deve retornar status 200 OK', () => {
    cy.request(usersEndpoint).then((response) => {
      expect(response.status).to.eq(200)
    })
  })

  it('Deve retornar no máximo 30 usuários', () => {
    cy.request(usersEndpoint).then((response) => {
      expect(response.body.users.length).to.be.at.most(30)
    })
  })

  it('Cada usuário deve ter os campos obrigatórios corretos', () => {
  cy.request(usersEndpoint).then((response) => {
    response.body.users.forEach((user) => {
      cy.log(JSON.stringify(user))
      cy.validateUserFields(user)
    })
  })    
  })


  it('Deve interceptar a rota e simular delay', () => {
    cy.intercept('GET', usersEndpoint, (req) => {
      req.on('response', (res) => {
        res.setDelay(1000) // 1 segundo
      })
    }).as('getUsersDelay')

    cy.request(usersEndpoint).then((response) => {
      expect(response.status).to.eq(200)
    })
  })

  it('Deve interceptar e simular erro 500', () => {
  cy.intercept('GET', usersEndpoint, {
    statusCode: 500,
    body: {}
  }).as('getUsersError')

  // Dispara a requisição dentro do contexto do browser,
  // para que o intercept funcione de fato
  cy.window().then((win) => {
    return win.fetch(usersEndpoint)
  }).then((response) => {
    expect(response.status).to.eq(500)
  })
  })

  it('Deve interceptar e simular erro 500 via fetch no browser', () => {
  cy.intercept('GET', usersEndpoint, {
    statusCode: 500,
    body: { error: 'Erro interno do servidor simulado' }
  }).as('getUsersError')

  cy.visit('/') // sua página base, para carregar o contexto do browser

  cy.window().then((win) => {
    return win.fetch(usersEndpoint)
  }).then((response) => {
    expect(response.status).to.eq(500)
  })

  cy.wait('@getUsersError')
  })





})
