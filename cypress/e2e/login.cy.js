describe('POST /auth/login', () => {
  it('Login válido', () => {
    cy.request('POST', '/auth/login', {
      username: 'emilys',
      password: 'emilyspass'
    }).then((res) => {
      expect(res.status).to.eq(201)
      expect(res.body).to.have.property('token')
    })
  })

  it('Verifica dados do usuário', () => {
    cy.request('POST', '/auth/login', {
      username: 'emilys',
      password: 'emilyspass'
    }).then((res) => {
      expect(res.body).to.have.property('username', 'emilys')
      expect(res.body.email).to.include('@')
      expect(res.body.firstName).to.eq('Emily')
    })
  })

  it('Token JWT deve ter 3 partes', () => {
    cy.request('POST', '/auth/login', {
      username: 'emilys',
      password: 'emilyspass'
    }).then((res) => {
      const token = res.body.token
      expect(token.split('.')).to.have.length(3)
    })
  })

  it('Falha com senha inválida', () => {
    cy.request({
      method: 'POST',
      url: '/auth/login',
      failOnStatusCode: false,
      body: {
        username: 'emilys',
        password: 'senhaerrada'
      }
    }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })
})
