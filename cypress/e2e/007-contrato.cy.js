import chaiJsonSchema from 'chai-json-schema'
chai.use(chaiJsonSchema)

const userSchema = {
  title: 'User Schema',
  type: 'object',
  required: ['id', 'firstName', 'lastName', 'email', 'username', 'role'],
  properties: {
    id: { type: 'number' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string' },
    username: { type: 'string' },
    role: { type: 'string' },
  },
}

const usersListSchema = {
  title: 'Users List Schema',
  type: 'object',
  required: ['users'],
  properties: {
    users: {
      type: 'array',
      items: userSchema,
      maxItems: 30,
    },
  },
}

const productSchema = {
  title: 'Product Schema',
  type: 'object',
  required: ['id', 'title', 'price', 'stock'],
  properties: {
    id: { type: 'number' },
    title: { type: 'string' },
    price: { type: 'number' },
    stock: { type: 'number' },
  },
}

const productsListSchema = {
  title: 'Products List Schema',
  type: 'object',
  required: ['products'],
  properties: {
    products: {
      type: 'array',
      items: productSchema,
    },
  },
}

const loginResponseSchema = {
  title: 'Login Response Schema',
  type: 'object',
  required: ['accessToken', 'refreshToken', 'id', 'username', 'email'],
  properties: {
    accessToken: { type: 'string' },
    refreshToken: { type: 'string' },
    id: { type: 'number' },
    username: { type: 'string' },
    email: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    gender: { type: 'string' },
    image: { type: 'string' },
  },
}

describe('Validação de Contrato de API', () => {
  // ==========================
  // Usuários
  // ==========================
  describe('Usuários', () => {
    it('GET /users/:id deve respeitar o schema do usuário', () => {
      cy.request(Cypress.config('baseUrl') + `${Cypress.env('user_by_id_endpoint')}/1`)
        .then((res) => {
          expect(res.status).to.eq(200)
          expect(res.body).to.be.jsonSchema(userSchema)
        })
    })

    it('GET /users deve respeitar o schema da lista de usuários', () => {
      cy.request(Cypress.config('baseUrl') + Cypress.env('users_endpoint'))
        .then((res) => {
          expect(res.status).to.eq(200)
          expect(res.body).to.be.jsonSchema(usersListSchema)
        })
    })
  })

  // ==========================
  // Produtos
  // ==========================
  describe('Produtos', () => {
    let token

    before(() => {
      // Login para obter token para criação de produto
      cy.request({
        method: 'POST',
        url: Cypress.config('baseUrl') + Cypress.env('login_endpoint'),
        body: {
          username: Cypress.env('user'),
          password: Cypress.env('pass'),
        },
      }).then((res) => {
        expect(res.status).to.be.oneOf([200, 201])
        token = res.body.accessToken
        Cypress.env('token', token)
      })
    })

    it('POST /auth/products/add deve respeitar o schema do produto criado', () => {
      cy.request({
        method: 'POST',
        url: Cypress.config('baseUrl') + Cypress.env('create_product_endpoint'),
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          title: 'Produto Schema Test',
          price: 100,
          stock: 15,
        },
      }).then((res) => {
        expect(res.status).to.be.oneOf([200, 201])
        expect(res.body).to.be.jsonSchema(productSchema)
      })
    })

    it('GET /products deve respeitar o schema da lista de produtos', () => {
      cy.request(Cypress.config('baseUrl') + '/products')
        .then((res) => {
          expect(res.status).to.eq(200)
          expect(res.body).to.be.jsonSchema(productsListSchema)
        })
    })
  })

  // ==========================
  // Login
  // ==========================
  describe('Login', () => {
    it('POST /auth/login deve respeitar o schema da resposta de login', () => {
      cy.request({
        method: 'POST',
        url: Cypress.config('baseUrl') + Cypress.env('login_endpoint'),
        body: {
          username: Cypress.env('user'),
          password: Cypress.env('pass'),
        },
      }).then((res) => {
        expect(res.status).to.be.oneOf([200, 201])
        expect(res.body).to.be.jsonSchema(loginResponseSchema)
      })
    })
  })
})
