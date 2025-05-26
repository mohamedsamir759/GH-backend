const express = require('express');

const router = express.Router();
const vldtns = require('./register.validations');

const { valMW } = require('src/shared/middlewares/cp-mw');
const ctr = require('./register.controller');

router.post('/demo', valMW(vldtns.registerDemo), ctr.registerDemo);
router.post('/live', valMW(vldtns.registerLive), ctr.registerLive);

module.exports = router;
module.exports.routerName = 'register';
