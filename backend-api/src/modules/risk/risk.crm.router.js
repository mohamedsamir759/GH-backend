
const express = require('express');

const router = express.Router();
const vldtns = require('./risk.validations');
const {
  validationMiddleware, authMiddleware,
} = require('src/shared/middlewares/crm-mw');

const RiskController = require('./risk.controller');

router.use(authMiddleware);

// for getting records with pagination
router.get('/orders', validationMiddleware(vldtns.listing, true), RiskController.fetchOrders);
router.get('/balances', validationMiddleware(vldtns.balances, true), RiskController.fetchBalances);

module.exports = router;
module.exports.routerName = 'roles';
