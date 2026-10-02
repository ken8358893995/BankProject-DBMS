module.exports = (app) => {
  const branch = require('../controllers/branchController.js');
  const { jwtauth } = require('../middleware/jwt.js');
  const router = require('express').Router();

  // All branch routes require employee authentication
  router.use(jwtauth);

  router.get('/', branch.getAllBranches);
  router.post('/add', branch.createBranch);

  app.use('/branches', router);
};
