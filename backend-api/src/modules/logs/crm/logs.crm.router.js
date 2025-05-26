
const express = require('express');

const router = express.Router();
const vldtns = require('../logs.validations');
const {
  validationMiddleware, authMiddleware, attachCustomerMW,
} = require('src/shared/middlewares/crm-mw');

const LogsController = require('./logs.controller');

router.use(authMiddleware);

// for paginate records
router.get('/', validationMiddleware(vldtns.listing, true), attachCustomerMW(true), LogsController.getPaginate);

// for get record by id
router.get('/:id', LogsController.getRecordById);

module.exports = router;
module.exports.routerName = 'logs';
