import jwt from 'jsonwebtoken'

Cypress.Commands.add('login', () => {
  cy.request('POST', '/auth/login', {
    username: 'emilys',
    password: 'emilyspass'
  }).then((response) => {
    expect(response.status).to.eq(201)
    const token = response.body.token
    Cypress.env('token', token)

    // Decodificar e validar token
    const decoded = jwt.decode(token)
    expect(decoded).to.have.property('username', 'emilys')
  })
})
