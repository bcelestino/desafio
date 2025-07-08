describe('GET /users', () => {
  it('Valida lista de usuários', () => {
    cy.request('/users').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.users.length).to.be.at.most(30)

      response.body.users.forEach((user) => {
        expect(user).to.have.all.keys(
          'id',
          'firstName',
          'lastName',
          'age',
          'gender',
          'email',
          'username',
          'birthDate',
          'role'
        )
      })
    })
  })
})
