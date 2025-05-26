
const express = require('express');

const router = express.Router();
const vldtns = require('../logs.validations');
const {
  authMW, valMW
} = require('src/shared/middlewares/cp-mw');

const LogsController = require('./logs.controller');

router.use(authMW);

router.get('/', valMW(vldtns.listing, true), LogsController.getClientLogs);

module.exports = router;
module.exports.routerName = 'logs';
