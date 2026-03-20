const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
  res.send('Contacts API is running');
});

router.use('/contacts', require('./contacts'));  // ← changed from /users to /contacts (recommended)

module.exports = router;