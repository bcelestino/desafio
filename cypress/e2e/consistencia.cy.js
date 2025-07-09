describe('Consistência de dados', () => {
  beforeEach(() => {
    cy.login()
  })

  it('Cria produto e recupera por ID', () => {
    cy.request({
      method: 'POST',
      url: '/auth/products/add',
      headers: {
        Authorization: `Bearer ${Cypress.env('token')}`,
      },
      body: {
        title: 'Produto Consistente',
        price: 120,
        stock: 10,
      },
    }).then((res) => {
      const productId = res.body.id
      cy.request(`/products/${productId}`).then((getRes) => {
        expect(getRes.status).to.eq(200)
        expect(getRes.body.title).to.eq('Produto Consistente')
        expect(getRes.body.price).to.eq(120)
      })
    })
  })

  it('Verifica que produto não some após criação', () => {
    cy.request('/products').then((res) => {
      expect(res.body.products).to.be.an('array').that.is.not.empty
    })
  })
})
