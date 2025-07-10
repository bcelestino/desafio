// cypress.config.js
const { defineConfig } = require('cypress')
const dotenv = require('dotenv')

dotenv.config()

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL || 'https://dummyjson.com',
    supportFile: 'cypress/support/e2e.js',
    env: {
      login_endpoint: process.env.LOGIN_ENDPOINT,
      users_endpoint: process.env.USERS_ENDPOINT,
      user_by_id_endpoint: process.env.USER_BY_ID_ENDPOINT,
      create_product_endpoint: process.env.CREATE_PRODUCT_ENDPOINT,
      user: process.env.user,
      pass: process.env.pass,
      first_name: process.env.first_name,
      last_name: process.env.last_name,
      email_domain: process.env.email_domain,
    },
  },
})
