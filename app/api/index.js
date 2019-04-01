const express = require('express')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const apiApp = express()

var swaggerDefinition = {
  info: {
    // API informations (required)
    title: 'Analog.Cafe API', // Title (required)
    version: '1.0.0' // Version (required)
  }
}

var options = {
  swaggerDefinition: swaggerDefinition,
  apis: [
    './app/article/index.js',
    './app/authentication/index.js',
    './app/author/index.js',
    './app/collaboration/index.js',
    './app/image/index.js',
    './app/setting/index.js',
    './app/sitemap/index.js',
    './app/submission/index.js',
    './app/favorite/index.js',
    './app/user/index.js'
  ]
}

var swaggerSpec = swaggerJSDoc(options)

apiApp.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

module.exports = apiApp
