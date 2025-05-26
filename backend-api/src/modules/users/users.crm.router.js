const express = require('express');

const router = express.Router();
const userValidations = require('./users.validations');
const {
  validationMiddleware, validationPathMiddleware, authMiddleware, authorizeMW,
} = require('src/shared/middlewares/crm-mw');

const UserController = require('./users.controller');

router.use(authMiddleware);

// for adding record
router.post('/', authorizeMW('users', 'create'), validationMiddleware(userValidations.create), UserController.createRecord);

// for paginate records
router.get('/', authorizeMW('users', 'get'), validationMiddleware(userValidations.listing, true), UserController.getPaginate);
router.get('/managers', authorizeMW('users', 'get'), validationMiddleware(userValidations.listing, true), UserController.getTeamManagers);
router.get('/members', authorizeMW('users', 'get'), validationMiddleware(userValidations.listing, true), UserController.getTeamMembers);
router.get('/assignable', authorizeMW('users', 'get'), validationMiddleware(userValidations.listing, true), UserController.getAssignable);

// for get record  by id
router.get('/:id', authorizeMW('users', 'get'), validationPathMiddleware(userValidations.getUser), UserController.getRecordById);

// for updating record by id
router.post('/:id/assign', validationPathMiddleware(userValidations.getUser), validationMiddleware(userValidations.assignAgents), UserController.assignAgents);
router.patch('/:id/password', authorizeMW('users', 'update'), validationPathMiddleware(userValidations.getUser), validationMiddleware(userValidations.changePassword), UserController.changePassword);
router.patch('/:id', authorizeMW('users', 'update'), validationPathMiddleware(userValidations.getUser), validationMiddleware(userValidations.update), UserController.updateRecordById);

// for deleting record by id
router.delete('/:id', authorizeMW('users', 'delete'), validationPathMiddleware(userValidations.getUser), UserController.deleteRecordById);

module.exports = router;
module.exports.routerName = 'users';
