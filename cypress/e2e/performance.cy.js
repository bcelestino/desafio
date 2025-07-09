describe('Performance', () => {
  it('GET /users responde em menos de 500ms', () => {
    cy.request('/users').then((res) => {
      expect(res.duration).to.be.lessThan(500)
    })
  })

  it('GET /users/1 responde em menos de 400ms', () => {
    cy.request('/users/1').then((res) => {
      expect(res.duration).to.be.lessThan(400)
    })
  })

  it('Login responde em menos de 600ms', () => {
    cy.request('POST', '/auth/login', {
      username: 'emilys',
      password: 'emilyspass',
    }).then((res) => {
      expect(res.duration).to.be.lessThan(600)
    })
  })
})
