const express = require('express');
const ctrl = require('./auth.controller');

const router = express.Router();

const { validationMiddleware, authMiddleware } = require('src/shared/middlewares/crm-mw');
const authValidations = require('./auth.validations');

router.post('/login', validationMiddleware(authValidations.login), ctrl.loginCrm);

router.use(authMiddleware);

router.get('/profile', ctrl.getProfile);

module.exports = router;
module.exports.routerName = 'auth';
