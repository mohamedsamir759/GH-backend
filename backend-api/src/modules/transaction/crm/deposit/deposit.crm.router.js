
const express = require('express');

const router = express.Router();
const vldtns = require('../transaction.validations');
const {
    validationMiddleware, validationPathMiddleware, authMiddleware, authorizeMW, attachCustomerMW,
} = require('src/shared/middlewares/crm-mw');

const DepositController = require('./deposit.controller');

router.use(authMiddleware);

// for adding record
router.post('/', authorizeMW('deposits', 'create'), validationMiddleware(vldtns.depositBasic), attachCustomerMW(false), DepositController.basicDeposit);

router.get('/', authorizeMW('deposits', 'get'), validationMiddleware(vldtns.listing, true), DepositController.getRecords);

router.get('/gateways', authorizeMW('deposits', 'get'), DepositController.getGateways);

router.patch('/:id/approve', authorizeMW('deposits', 'actions'), validationPathMiddleware(vldtns.update), attachCustomerMW(false), DepositController.approveDeposit);

router.patch('/:id/reject', authorizeMW('deposits', 'actions'), validationPathMiddleware(vldtns.update), attachCustomerMW(false), DepositController.rejectDeposit);

module.exports = router;
module.exports.routerName = 'transactions/deposit';
