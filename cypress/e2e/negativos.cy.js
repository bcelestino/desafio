describe('Casos negativos', () => {
  beforeEach(() => {
    cy.login()
  })

  it('Tenta criar produto sem título', () => {
    cy.request({
      method: 'POST',
      url: '/auth/products/add',
      headers: {
        Authorization: `Bearer ${Cypress.env('token')}`,
      },
      failOnStatusCode: false,
      body: {
        price: 80,
        stock: 5,
      },
    }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('Tenta criar produto sem preço', () => {
    cy.request({
      method: 'POST',
      url: '/auth/products/add',
      headers: {
        Authorization: `Bearer ${Cypress.env('token')}`,
      },
      failOnStatusCode: false,
      body: {
        title: 'Sem Preço',
        stock: 5,
      },
    }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })
})
