describe('Performance - GET /users', () => {
  it('Responde em menos de 1000ms e retorna no máximo 30 usuários', () => {
    cy.request('/users').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.duration).to.be.lessThan(1000)
      expect(res.body.users).to.be.an('array').and.have.length.of.at.most(30)
    })
  })

  it('Página 2 (skip=30, limit=30) responde em menos de 1000ms', () => {
    cy.request('/users?skip=30&limit=30').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.duration).to.be.lessThan(1000)
      expect(res.body.users).to.be.an('array').and.have.length.of.at.most(30)
    })
  })
})

describe('Performance - GET /users/:id', () => {
  it('Responde em menos de 400ms com dados corretos para id 1', () => {
    cy.request('/users/1').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.duration).to.be.lessThan(400)
      expect(res.body).to.have.property('id', 1)
    })
  })

  it('Responde em menos de 400ms com 404 para usuário inexistente', () => {
    cy.request({
      method: 'GET',
      url: '/users/999999',
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404)
      expect(res.duration).to.be.lessThan(400)
    })
  })
})

describe('Performance - POST /auth/login', () => {
  it('Login válido responde em menos de 1000ms e retorna tokens e dados do usuário', () => {
    cy.request({
      method: 'POST',
      url: '/auth/login',
      body: {
        username: 'emilys',
        password: 'emilyspass',
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect([200, 201]).to.include(res.status)
      expect(res.duration).to.be.lessThan(1000)
      // Ajuste aqui: verificar as chaves corretas que aparecem na resposta real
      expect(res.body).to.include.all.keys(
        'accessToken',
        'refreshToken',
        'id',
        'username',
        'email',
        'firstName',
        'lastName',
        'gender',
        'image'
      )
    })
  })

  it('Login inválido responde em menos de 1000ms', () => {
    cy.request({
      method: 'POST',
      url: '/auth/login',
      body: {
        username: 'user_invalido',
        password: 'senha_errada',
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect([400, 401]).to.include(res.status)
      expect(res.duration).to.be.lessThan(1000)
    })
  })
})

describe('Performance - POST /auth/products/add', () => {
  let token

  before(() => {
    cy.request({
      method: 'POST',
      url: '/auth/login',
      body: {
        username: 'emilys',
        password: 'emilyspass',
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect([200, 201]).to.include(res.status)
      token = res.body.accessToken
      cy.log('Token capturado:', token)
      expect(token).to.be.a('string').and.not.be.empty
    })
  })

  it('Criação válida de produto responde em menos de 700ms', () => {
    cy.request({
      method: 'POST',
      url: '/auth/products/add',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        title: 'Perfume Oil',
        description: 'Mega Discount, Impression of A...',
        price: 13,
        discountPercentage: 8.4,
        rating: 4.26,
        stock: 65,
        brand: 'Impression of Acqua Di Gio',
        category: 'fragrances',
        thumbnail: 'https://i.dummyjson.com/data/products/11/thumnail.jpg',
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect([200, 201]).to.include(res.status)
      expect(res.duration).to.be.lessThan(700)
      expect(res.body).to.include.all.keys('id', 'title', 'price', 'stock')
    })
  })

  it('Criação inválida de produto responde rápido com erro 400 ou 401', () => {
    cy.request({
      method: 'POST',
      url: '/auth/products/add',
      headers: {
        Authorization: 'Bearer token_invalido',
      },
      body: {
        price: -10,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect([400, 401]).to.include(res.status)
      expect(res.duration).to.be.lessThan(500)
    })
  })
})
