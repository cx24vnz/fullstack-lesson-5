const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            // aquí van los plugins si los necesitas
        },
        specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
        supportFile: false,
        baseUrl: 'http://localhost:5173'
    },
});