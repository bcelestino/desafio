describe('GET /users/:id', () => {
  it('Valida status 200 para usuário existente', () => {
    cy.request('/users/1').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.id).to.eq(1)
    })
  })

  it('Valida campos principais do usuário', () => {
    cy.request('/users/1').then((res) => {
      expect(res.body).to.have.property('firstName')
      expect(res.body).to.have.property('lastName')
      expect(res.body).to.have.property('email').and.to.include('@')
    })
  })

  it('Falha ao buscar usuário inexistente', () => {
    cy.request({
      url: '/users/99999',
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404)
    })
  })

  it('Valida tipos de dados', () => {
    cy.request('/users/1').then((res) => {
      expect(res.body.id).to.be.a('number')
      expect(res.body.firstName).to.be.a('string')
      expect(res.body.lastName).to.be.a('string')
    })
  })
})
