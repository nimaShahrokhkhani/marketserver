var express = require('express');
var router = express.Router();

router.use('/login', require('./login'));
router.use('/register', require('./register'));
router.use('/users', require('./users'));
router.use('/products', require('./products'));
router.use('/companies', require('./companies'));

module.exports = router;
