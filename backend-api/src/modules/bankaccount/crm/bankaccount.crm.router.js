
const express = require('express');

const router = express.Router();
const vldtns = require('../bankaccount.validations');
const {
  validationMiddleware, validationPathMiddleware, authMiddleware,
} = require('src/shared/middlewares/crm-mw');

const ctr = require('./bankaccount.controller');

router.use(authMiddleware);

// getting bank accounts belonging to a client Id
router.get('/:customerId', ctr.getRecords);
router.post('/', validationMiddleware(vldtns.create), ctr.createRecord);
router.patch('/:id', validationPathMiddleware(vldtns.getBank), validationMiddleware(vldtns.update), ctr.updateRecordById);
router.delete('/:id', validationPathMiddleware(vldtns.getBank), ctr.deleteRecordById);

module.exports = router;
module.exports.routerName = 'bank-accounts';
