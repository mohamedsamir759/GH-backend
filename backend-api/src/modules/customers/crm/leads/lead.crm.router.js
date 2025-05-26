const express = require('express');

const router = express.Router();

const vldtns = require('../customer.validations');
const {
  validationMiddleware, validationPathMiddleware, authMiddleware, authorizeMW,
} = require('src/shared/middlewares/crm-mw');
const ctr = require('./lead.controller');

router.use(authMiddleware);

router.post('/', authorizeMW('leads', 'create'), validationMiddleware(vldtns.create), ctr.createLead);
router.get('/', authorizeMW('leads', 'get'), validationMiddleware(vldtns.listing, true), ctr.getPaginate);
router.get('/:id', authorizeMW('leads', 'get'), validationPathMiddleware(vldtns.getCustomer), ctr.getRecordById);
router.patch('/:id', authorizeMW('leads', 'update'), validationPathMiddleware(vldtns.getCustomer), validationMiddleware(vldtns.update), ctr.updateRecordById);
router.delete('/:id', authorizeMW('leads', 'delete'), validationPathMiddleware(vldtns.getCustomer), ctr.deleteRecordById);

module.exports = router;
module.exports.routerName = 'leads';
