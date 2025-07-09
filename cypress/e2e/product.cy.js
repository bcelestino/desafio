describe('POST /auth/products/add', () => {
  beforeEach(() => {
    cy.login()
  })

  it('Cria produto com sucesso', () => {
    cy.request({
      method: 'POST',
      url: '/auth/products/add',
      headers: {
        Authorization: `Bearer ${Cypress.env('token')}`
      },
      body: {
        title: 'Produto A',
        price: 120,
        stock: 50
      }
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.title).to.eq('Produto A')
    })
  })

  it('Valida campos retornados', () => {
    cy.request({
      method: 'POST',
      url: '/auth/products/add',
      headers: {
        Authorization: `Bearer ${Cypress.env('token')}`
      },
      body: {
        title: 'Produto B',
        price: 80,
        stock: 5
      }
    }).then((res) => {
      expect(res.body).to.have.property('id')
      expect(res.body.price).to.eq(80)
      expect(res.body.stock).to.eq(5)
    })
  })

  it('Falha ao enviar preço negativo', () => {
    cy.request({
      method: 'POST',
      url: '/auth/products/add',
      headers: {
        Authorization: `Bearer ${Cypress.env('token')}`
      },
      failOnStatusCode: false,
      body: {
        title: 'Produto Inválido',
        price: -10,
        stock: 10
      }
    }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })
})
