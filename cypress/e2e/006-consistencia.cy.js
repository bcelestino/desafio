describe('Consistência de dados', () => {
  let token

  before(() => {
    // Login para obter token antes dos testes que precisam dele
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

  // ==========================
  // TESTES PRODUTOS
  // ==========================
  describe('Produtos', () => {
    it('Cria produto com dados válidos', () => {
      cy.request({
        method: 'POST',
        url: Cypress.config('baseUrl') + Cypress.env('create_product_endpoint'),
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          title: 'Produto Consistente',
          description: 'Teste de consistência produto',
          price: 120,
          discountPercentage: 10,
          rating: 4.5,
          stock: 10,
          brand: 'Marca Teste',
          category: 'teste',
          thumbnail: 'https://dummyimage.com/200x200/000/fff',
        },
      }).then((res) => {
        expect(res.status).to.be.oneOf([200, 201])
        expect(res.body).to.include.all.keys('id', 'title', 'price', 'stock')
        expect(res.body.title).to.eq('Produto Consistente')
        expect(res.body.price).to.eq(120)
        expect(res.body.stock).to.eq(10)
      })
    })
  })

  // ==========================
  // TESTES USUÁRIOS
  // ==========================
  describe('Usuários', () => {
    it('GET /users/:id retorna dados corretos', () => {
      cy.request(Cypress.config('baseUrl') + `${Cypress.env('user_by_id_endpoint')}/1`).then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body).to.include.all.keys(
          'id', 'firstName', 'lastName', 'email', 'username', 'role'
        )
        expect(res.body.id).to.eq(1)
      })
    })

    it('GET /users retorna lista com usuários válidos', () => {
      cy.request(Cypress.config('baseUrl') + Cypress.env('users_endpoint')).then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.users).to.be.an('array').and.have.length.of.at.most(30)
        res.body.users.forEach((user) => {
          expect(user).to.include.all.keys(
            'id', 'firstName', 'lastName', 'age', 'gender', 'email', 'username', 'birthDate', 'role'
          )
        })
      })
    })
  })

  // ==========================
  // TESTES LOGIN
  // ==========================
  describe('Login', () => {
    it('Login com credenciais válidas retorna dados consistentes', () => {
      cy.request({
        method: 'POST',
        url: Cypress.config('baseUrl') + Cypress.env('login_endpoint'),
        body: {
          username: Cypress.env('user'),
          password: Cypress.env('pass'),
        },
      }).then((res) => {
        expect(res.status).to.be.oneOf([200, 201])
        expect(res.body).to.include.all.keys(
          'accessToken', 'refreshToken', 'id', 'username', 'email', 'firstName', 'lastName', 'gender', 'image'
        )
        expect(res.body.username).to.eq(Cypress.env('user'))
      })
    })

    it('Login com credenciais inválidas retorna erro', () => {
      cy.request({
        method: 'POST',
        url: Cypress.config('baseUrl') + Cypress.env('login_endpoint'),
        body: {
          username: 'usuario_invalido',
          password: 'senha_errada',
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect([400, 401]).to.include(res.status)
      })
    })
  })
})
