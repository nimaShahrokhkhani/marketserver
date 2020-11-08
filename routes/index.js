var express = require('express');
var router = express.Router();
/*const sessionManager = require('../helper/sessionManager');

router.use(sessionManager.initialize());
router.use((request, response, next) => {
    sessionManager.getSession(request)
        .then((session) => {
            next();
        })
        .catch((error) => {
            next(error);
        });
});*/
router.use('/login', require('./login'));
router.use('/register', require('./register'));
router.use('/users', require('./users'));
router.use('/productCategory', require('./productCategory'));
router.use('/products', require('./products'));
router.use('/companies', require('./companies'));
router.use('/highlight', require('./highlight'));
router.use('/events', require('./events'));

module.exports = router;
