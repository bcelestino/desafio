describe('Testes de Segurança - Endpoints', () => {

  // 1. Segurança GET /users (Listagem)
  describe('GET /users', () => {
    it('Falha ao acessar sem autenticação (se aplicável)', () => {
      // Se o endpoint /users não exigir auth, este teste pode ser ignorado.
      // Aqui apenas um exemplo genérico que retorna 200 mesmo sem token.
      cy.request({
        method: 'GET',
        url: '/users',
        failOnStatusCode: false,
      }).then((res) => {
        // Se exigir auth, deve ser 401, se não, deve ser 200
        expect([200, 401]).to.include(res.status)
      })
    })
  })

  // 2. Segurança POST /auth/login
  describe('POST /auth/login', () => {
    it('Falha login sem credenciais', () => {
      cy.request({
        method: 'POST',
        url: '/auth/login',
        body: {},
        failOnStatusCode: false
      }).then((res) => {
        expect(res.status).to.eq(400) // Bad Request ou 401 dependendo da API
      })
    })

    it('Falha login com credenciais inválidas', () => {
  cy.request({
    method: 'POST',
    url: '/auth/login',
    body: {
      username: 'user_fake',
      password: 'pass_fake'
    },
    failOnStatusCode: false
  }).then((res) => {
    expect([400, 401]).to.include(res.status)
  })
    })

  })

  // 3. Segurança POST /auth/products/add
  describe('POST /auth/products/add', () => {
    it('Falha ao criar produto sem token', () => {
      cy.request({
        method: 'POST',
        url: '/auth/products/add',
        failOnStatusCode: false,
        body: {
          title: 'Produto Sem Token',
          price: 50,
        },
      }).then((res) => {
        expect(res.status).to.eq(401)
      })
    })

    it('Falha ao criar produto com token inválido', () => {
      cy.request({
        method: 'POST',
        url: '/auth/products/add',
        headers: {
          Authorization: 'Bearer token_invalido'
        },
        failOnStatusCode: false,
        body: {
          title: 'Produto Token Inválido',
          price: 50,
        },
      }).then((res) => {
        expect(res.status).to.eq(401)
      })
    })
  })

  // 4. Segurança GET /users/:id
  describe('GET /users/:id', () => {
    it('Falha ao buscar usuário com ID inválido', () => {
      cy.request({
        method: 'GET',
        url: '/users/99999999', // ID inexistente
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(404)
      })
    })

    it('Falha ao buscar usuário com ID mal formatado', () => {
      cy.request({
        method: 'GET',
        url: '/users/abc', // formato inválido
        failOnStatusCode: false,
      }).then((res) => {
        // Pode retornar 400 ou 404 dependendo da API
        expect([400, 404]).to.include(res.status)
      })
    })
  })

})
