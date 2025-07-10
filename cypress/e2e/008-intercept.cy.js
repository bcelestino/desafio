describe('Intercept API - Erros simulados', () => {
  it('Simula erro 500 no GET /users', () => {
    cy.intercept('GET', '/users', {
      statusCode: 500,
      body: { error: 'Erro simulado' },
    }).as('getUsersError')

    cy.request({
      url: '/users',
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(500)
      expect(res.body).to.have.property('error', 'Erro simulado')
    })
  })

  it('Simula delay no GET /users', () => {
    cy.intercept('GET', '/users', (req) => {
      req.on('response', (res) => {
        res.setDelay(3000)
      })
    }).as('getUsersDelay')

    cy.request('/users').then((res) => {
      expect(res.status).to.eq(200)
    })
  })
})
