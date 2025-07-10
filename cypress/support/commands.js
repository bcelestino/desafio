import jwt from 'jsonwebtoken'

Cypress.Commands.add('login', () => {
  const username = Cypress.env('user')
  const password = Cypress.env('pass')
  const loginEndpoint = Cypress.env('login_endpoint')

  cy.request('POST', loginEndpoint, {
    username,
    password
  }).then((response) => {
    expect(response.status).to.eq(200)

    const accessToken = response.body.accessToken
    const refreshToken = response.body.refreshToken

    expect(accessToken, 'Access token deve estar presente').to.exist
    expect(refreshToken, 'Refresh token deve estar presente').to.exist

    Cypress.env('token', accessToken)

    const decoded = jwt.decode(accessToken)
    expect(decoded).to.have.property('username', username)

    cy.log(`Access token obtido e armazenado para o usuário: ${username}`)
  })
})

Cypress.Commands.add('validateUserFields', (user) => {
  expect(user).to.include.all.keys(
    'id', 'firstName', 'lastName', 'age',
    'gender', 'email', 'username', 'birthDate', 'role'
  )

  expect(user.id).to.be.a('number')
  expect(user.firstName).to.be.a('string')
  expect(user.email).to.include('@')

  Object.keys(user).forEach((key) => {
    expect(user[key]).to.not.be.null
  })
})

// Comando customizado para criar produto
Cypress.Commands.add('createProduct', (product) => {
  cy.request({
    method: 'POST',
    url: Cypress.env('create_product_endpoint'),
    headers: {
      Authorization: `Bearer ${Cypress.env('token')}`,
      'Content-Type': 'application/json'
    },
    body: product,
    failOnStatusCode: false // deixa a gente verificar falhas manualmente
  }).then((response) => {
    return response
  })
})

// Comando para validar os campos principais do produto criado
Cypress.Commands.add('validateProductResponse', (productResponse, expectedProduct) => {
  expect(productResponse).to.have.property('id').that.is.a('number')
  expect(productResponse.title).to.eq(expectedProduct.title)
  expect(productResponse.price).to.eq(expectedProduct.price)
  expect(productResponse.stock).to.eq(expectedProduct.stock)
  expect(productResponse).to.have.property('rating')
  expect(productResponse).to.have.property('thumbnail')
  expect(productResponse.description).to.eq(expectedProduct.description)
  expect(productResponse.brand).to.eq(expectedProduct.brand)
  expect(productResponse.category).to.eq(expectedProduct.category)
})
