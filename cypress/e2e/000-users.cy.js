describe('GET /users', () => {
  it('Valida status code 200', () => {
    cy.request('/users').then((response) => {
      expect(response.status).to.eq(200)
    })
  })

  it('Valida quantidade máxima de usuários', () => {
    cy.request('/users').then((response) => {
      expect(response.body.users.length).to.be.at.most(30)
    })
  })

  it('Valida campos obrigatórios em cada usuário', () => {
    cy.request('/users').then((response) => {
      response.body.users.forEach((user) => {
        expect(user).to.have.all.keys(
          'id', 'firstName', 'lastName', 'age',
          'gender', 'email', 'username', 'birthDate', 'role'
        )
      })
    })
  })

  it('Valida tipos de campos', () => {
    cy.request('/users').then((response) => {
      response.body.users.forEach((user) => {
        expect(user.id).to.be.a('number')
        expect(user.firstName).to.be.a('string')
        expect(user.email).to.include('@')
      })
    })
  })

  it('Valida que não existem campos nulos', () => {
    cy.request('/users').then((response) => {
      response.body.users.forEach((user) => {
        Object.keys(user).forEach((key) => {
          expect(user[key]).to.not.be.null
        })
      })
    })
  })
})
