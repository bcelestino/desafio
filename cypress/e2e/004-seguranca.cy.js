describe('Segurança - Produtos', () => {
  it('Falha ao criar produto sem token', () => {
    cy.request({
      method: 'POST',
      url: '/auth/products/add',
      failOnStatusCode: false,
      body: {
        title: 'Produto Sem Token',
        price: 50,
      },
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it('Falha com token inválido', () => {
    cy.request({
      method: 'POST',
      url: '/auth/products/add',
      headers: {
        Authorization: 'Bearer token_fake'
      },
      failOnStatusCode: false,
      body: {
        title: 'Produto Token Fake',
        price: 60,
      },
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it('Falha ao buscar produto privado sem token', () => {
    cy.request({
      url: '/auth/products/1',
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([401, 404])
    })
  })
})
