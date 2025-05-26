
const express = require('express');

const router = express.Router();
const vldtns = require('../transaction.validations');
const {
    authMW, valMW,
} = require('src/shared/middlewares/cp-mw');

const DepositController = require('./deposit.controller');

router.use(authMW);

// for adding record
router.post('/', valMW(vldtns.depositBasic), DepositController.basicDeposit);

router.get('/', valMW(vldtns.listing, true), DepositController.getRecords);

router.get('/gateways', DepositController.getGateways);

module.exports = router;
module.exports.routerName = 'transactions/deposit';
