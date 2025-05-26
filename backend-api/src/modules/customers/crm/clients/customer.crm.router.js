const express = require('express');

const router = express.Router();
const vldtns = require('../customer.validations');
const {
  validationMiddleware, validationPathMiddleware, authMiddleware, authorizeMW,
} = require('src/shared/middlewares/crm-mw');
const ctr = require('./customer.controller');

router.use(authMiddleware);

router.post('/', authorizeMW('clients', 'create'), validationMiddleware(vldtns.create), ctr.createClient);
router.get('/', authorizeMW('clients', 'get'), validationMiddleware(vldtns.listing, true), ctr.getPaginate);
router.get('/:id', authorizeMW('clients', 'get'), validationPathMiddleware(vldtns.getCustomer), ctr.getRecordById);
router.patch('/:id', authorizeMW('clients', 'update'), validationPathMiddleware(vldtns.getCustomer), validationMiddleware(vldtns.update), ctr.updateRecordById);
router.delete('/:id', authorizeMW('clients', 'delete'), validationPathMiddleware(vldtns.getCustomer), ctr.deleteRecordById);
router.patch('/:id/financial-info', authorizeMW('clients', 'update'), ctr.updateFinancialInfo);
router.patch('/:id/experience', authorizeMW('clients', 'update'), ctr.updateEmploymentInfo);
router.post('/:id/access/:status', authorizeMW('clients', 'security'), validationPathMiddleware(vldtns.customerAccess), ctr.clientAccess);
router.post('/:id/reset-password', authorizeMW('clients', 'security'), validationPathMiddleware(vldtns.getCustomer), ctr.resetPassword);
router.post('/:id/forgot-password', authorizeMW('clients', 'security'), validationPathMiddleware(vldtns.getCustomer), ctr.forgotPassword);
router.post('/send-mail', ctr.sendEmailLink);
module.exports = router;
module.exports.routerName = 'clients';
