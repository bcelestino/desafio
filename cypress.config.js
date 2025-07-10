const { defineConfig } = require("cypress");
require("dotenv").config(); // carrega as variáveis do .env

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL || "https://dummyjson.com", // fallback
    env: {
      LOGIN_ENDPOINT: process.env.LOGIN_ENDPOINT,
      USERS_ENDPOINT: process.env.USERS_ENDPOINT,
      USER_BY_ID_ENDPOINT: process.env.USER_BY_ID_ENDPOINT,
      CREATE_PRODUCT_ENDPOINT: process.env.CREATE_PRODUCT_ENDPOINT,
      USERNAME: process.env.USERNAME,
      PASSWORD: process.env.PASSWORD,
    },
    setupNodeEvents(on, config) {
      // Aqui podem entrar plugins ou hooks
    },
  },
});
