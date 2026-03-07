const express = require('express');
const router = express.Router();

router.use('/users', require('./users'));

router.get('/', (req, res) => {
  res.send('Welcome to Project 1 API');
});

module.exports = router;