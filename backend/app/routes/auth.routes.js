module.exports = (app) => {
  const auth = require('../controllers/authController');
  const { jwtauth } = require('../middleware/jwt.js');
  const router = require('express').Router();

  router.post('/customer', auth.customerLogin);
  router.post('/employee', auth.employeeLogin);
  router.post('/signup', auth.customerSignup);
  router.post('/changePassword', [jwtauth], auth.changePassword);

  app.use('/login', router);
};
