const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Contacts API',
    description: 'CSE 341 - Contacts Management API'
  },
  host: 'project1-8r7q.onrender.com',
  schemes: ['https'],
  tags: [
    { name: 'Contacts', description: 'Operations about contacts' }
  ]
};

// ────────────────────────────────────────────────
// Important: point to file(s) that contain the route handlers + #swagger comments
// ────────────────────────────────────────────────
const outputFile = './swagger.json';           // match what your swagger-ui serves

const endpointsFiles = ['./controllers/contacts.js'];


swaggerAutogen(outputFile, endpointsFiles, doc)
  .then(() => {
    console.log('✅ Swagger JSON generated successfully → check swagger.json');
  })
  .catch(err => {
    console.error('Swagger generation failed:', err);
  });