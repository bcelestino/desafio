const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://dummyjson.com",
    setupNodeEvents(on, config) {
      // aqui podem entrar plugins ou hooks no futuro
    },
  },
});
