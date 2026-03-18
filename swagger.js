const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Contacts API',
    description: 'CSE 341 - Contacts Management API'
  },
  host: 'project1-8r7q.onrender.com',   // ← your Render URL
  schemes: ['https'],
  tags: [
    { name: 'Contacts', description: 'Operations about contacts' }
  ]
};

const outputFile = './swagger-output.json';   // ← better name
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc)
  .then(() => console.log('Swagger JSON generated'))
  .catch(err => console.error('Swagger generation failed:', err));