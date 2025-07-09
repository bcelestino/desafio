import { expect } from 'chai'
import chaiJsonSchema from 'chai-json-schema'
chai.use(chaiJsonSchema)

const userSchema = {
  title: 'User Schema',
  type: 'object',
  required: ['id', 'firstName', 'lastName', 'email'],
  properties: {
    id: { type: 'number' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string' },
  },
}

const productSchema = {
  title: 'Product Schema',
  type: 'object',
  required: ['id', 'title', 'price'],
  properties: {
    id: { type: 'number' },
    title: { type: 'string' },
    price: { type: 'number' },
  },
}

describe('Validação de contrato', () => {
  it('Valida schema de usuário', () => {
    cy.request('/users/1').then((res) => {
      expect(res.body).to.be.jsonSchema(userSchema)
    })
  })

  it('Valida schema de produto', () => {
    cy.login().then(() => {
      cy.request({
        method: 'POST',
        url: '/auth/products/add',
        headers: {
          Authorization: `Bearer ${Cypress.env('token')}`,
        },
        body: {
          title: 'Produto Schema',
          price: 75,
        },
      }).then((res) => {
        expect(res.body).to.be.jsonSchema(productSchema)
      })
    })
  })
})
