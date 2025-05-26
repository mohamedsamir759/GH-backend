
const express = require('express');

const router = express.Router();
const vldtns = require('./pricing.validations');
const {
  validationMiddleware, validationPathMiddleware, authMiddleware, authorizeMW,
} = require('src/shared/middlewares/crm-mw');

const PricingController = require('./pricing.controller');

router.use(authMiddleware);

router.get('/', authorizeMW('pricing', 'get'), validationMiddleware(vldtns.listing, true), PricingController.getPaginate);

module.exports = router;
module.exports.routerName = 'pricing';
