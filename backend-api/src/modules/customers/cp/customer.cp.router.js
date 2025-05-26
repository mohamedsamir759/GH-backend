const express = require('express');

const router = express.Router();

const { valMW, authMW, vlResetPassMw } = require('src/shared/middlewares/cp-mw');

const { update, submitIndProfile } = require('./customer.validations');
const CustomerController = require('./customer.controller');

router.patch('/reset-password', vlResetPassMw, CustomerController.resetPassword);
router.patch('/forgot-password', CustomerController.forgotPassword);
router.get('/check-email', CustomerController.checkEmail);

router.use(authMW);

router.patch('/profile', valMW(update), CustomerController.updateProfile);
router.get('/stages', CustomerController.getStages);

router.post('/profile-submit', valMW(submitIndProfile), CustomerController.submitProfile);
router.get('/config/defaults', CustomerController.getDefaultConfig);
router.get('/convert', CustomerController.convertDemoToLive);
router.patch('/change-password', CustomerController.resetPassword);
module.exports = router;
module.exports.routerName = 'customer';
