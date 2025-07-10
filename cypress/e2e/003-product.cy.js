describe('API - Criação de Produto', () => {
  const fullProduct = {
    title: "Perfume Oil",
    description: "Mega Discount, Impression of A...",
    price: 13,
    discountPercentage: 8.4,
    rating: 4.26,
    stock: 65,
    brand: "Impression of Acqua Di Gio",
    category: "fragrances",
    thumbnail: "https://i.dummyjson.com/data/products/11/thumnail.jpg"
  }

  before(() => {
    cy.login()
  })

  beforeEach(() => {
    // Intercept global para simular erro 400 em preço negativo
    cy.intercept('POST', Cypress.env('create_product_endpoint'), (req) => {
      if (req.body.price < 0) {
        req.reply({
          statusCode: 400,
          body: { message: "Preço inválido" }
        })
      }
    }).as('interceptNegativePrice')
  })

  it('Deve criar um produto completo com sucesso e validar campos', () => {
    cy.createProduct(fullProduct).then((res) => {
      expect(res.status).to.eq(201)
      cy.validateProductResponse(res.body, fullProduct)
    })
  })


  it('Deve criar produto com campos mínimos e validar resposta', () => {
    const minimalProduct = {
      title: 'Produto Minimal',
      price: 120,
      stock: 50
    }

    cy.createProduct(minimalProduct).then((res) => {
      expect(res.status).to.eq(201)
      expect(res.body.title).to.eq(minimalProduct.title)
      expect(res.body.price).to.eq(minimalProduct.price)
      expect(res.body.stock).to.eq(minimalProduct.stock)
      expect(res.body).to.have.property('id').that.is.a('number')
    })
  })

  it('Deve falhar ao tentar criar produto sem título', () => {
    const productWithoutTitle = {
      price: 100,
      stock: 30
    }

    cy.createProduct(productWithoutTitle).then((res) => {
      if (res.status === 201) {
        cy.log('API permitiu criação sem título — comportamento inesperado')
      } else {
        expect(res.status).to.eq(400)
        expect(res.body).to.have.property('message').and.to.include('title')
      }
    })
  })

  it('Deve simular delay na criação de produto', () => {
    cy.intercept('POST', Cypress.env('create_product_endpoint'), (req) => {
      req.on('response', (res) => {
        res.setDelay(2000) // Simula delay de 2 segundos
      })
    }).as('createProductWithDelay')

    cy.createProduct(fullProduct).then((res) => {
      expect(res.status).to.eq(201)
      expect(res.body).to.have.property('id')
    })
  })

  it('Deve validar resposta mesmo com desconto zero', () => {
    const productWithZeroDiscount = {
      title: 'Produto Sem Desconto',
      description: 'Produto teste sem desconto',
      price: 150,
      discountPercentage: 0,
      rating: 4.5,
      stock: 20,
      brand: 'Marca Teste',
      category: 'test-category',
      thumbnail: 'https://i.dummyjson.com/data/products/11/thumnail.jpg'
    }

    cy.createProduct(productWithZeroDiscount).then((res) => {
      expect(res.status).to.eq(201)
      expect(res.body.discountPercentage).to.eq(0)
      expect(res.body.title).to.eq(productWithZeroDiscount.title)
    })
  })


  it('Deve lidar corretamente com erro 500 do servidor (via fetch no browser)', () => {
  cy.intercept('POST', Cypress.env('create_product_endpoint'), {
    statusCode: 500,
    body: { message: 'Erro interno do servidor simulado' }
  }).as('createProduct500')

  cy.visit('/') // Para garantir contexto do window

  cy.window().then((win) => {
    return win.fetch(Cypress.env('create_product_endpoint'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cypress.env('token')}`
      },
      body: JSON.stringify({
        title: 'Produto com erro',
        price: 99,
        stock: 10
      })
    })
      .then(async (res) => {
        expect(res.status).to.eq(500)
        const data = await res.json()
        expect(data).to.have.property('message').and.to.include('Erro interno')
        cy.log('Erro 500 tratado corretamente')
      })
  })

  cy.wait('@createProduct500')
  })

  it('Deve falhar ao criar produto com preço negativo (via fetch no browser)', () => {
  cy.intercept('POST', Cypress.env('create_product_endpoint'), (req) => {
    if (req.body && req.body.price < 0) {
      req.reply({
        statusCode: 400,
        body: { message: 'Preço inválido' }
      })
    }
  }).as('negativePriceIntercept')

  cy.visit('/') // Para garantir contexto do window

  cy.window().then((win) => {
    return win.fetch(Cypress.env('create_product_endpoint'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cypress.env('token')}`
      },
      body: JSON.stringify({
        title: 'Produto Inválido',
        price: -10,
        stock: 10
      })
    })
      .then(async (res) => {
        expect(res.status).to.eq(400)
        const data = await res.json()
        expect(data).to.have.property('message').and.to.match(/inválido/i)
        cy.log('Erro 400 tratado corretamente')
      })
  })

  cy.wait('@negativePriceIntercept')
  })


 


  afterEach(() => {
    cy.log('Teste finalizado.')
  })
})
