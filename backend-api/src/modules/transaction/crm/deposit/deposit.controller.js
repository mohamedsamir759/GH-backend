//
const allServices = require('src/modules/services');
const { ResponseMessages, CONSTANTS } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const { transactionService: service, dTransactionService: dservice } = allServices;

class DepositController {
    async basicDeposit(req, res, next) {
      try {
        const rec = req.customer && req.customer.category === CONSTANTS.CUSTOMER_TYPES.DEMO
          ? await dservice.basicDeposit({
            ...req.body,
            isAutoApprove: true,
            userId: req.user && req.user._id,
          }) : await service.basicDeposit({
            ...req.body,
            isAutoApprove: true,
            userId: req.user && req.user._id,
          });
        return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
      } catch (error) {
        return next(error);
      }
    }
  
    async getRecords(req, res, next) {
      try {
        const rec = req.query.type === CONSTANTS.CUSTOMER_TYPES.DEMO
          ? await dservice.getDeposits(req.query)
          : await service.getDeposits(req.query);
        return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
      } catch (error) {
        return next(error);
      }
    }
  
    // getting transactions/deposites done by a client where clientId = customerId
    async getRecordsForClientId(req, res, next) {
      const clientId = req.params.id;
      try {
        const rec = await service.getDeposits({
          customerId: clientId,
        });
        return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
      } catch (error) {
        return next(error);
      }
    }
  
    async getGateways(req, res, next) {
      try {
        const rec = await service.getDepositGateways();
        return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
      } catch (error) {
        return next(error);
      }
    }
  
    async approveDeposit(req, res, next) {
      try {
        const { id } = req.params;
        const query = {
          id,
          userId: req.user && req.user._id,
        };
        const rec = req.customer && req.customer.category === CONSTANTS.CUSTOMER_TYPES.DEMO
          ? await dservice.approveDeposit(query)
          : await service.approveDeposit(query);
        return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
      } catch (error) {
        return next(error);
      }
    }
  
    async rejectDeposit(req, res, next) {
      try {
        const { id } = req.params;
        const query = {
          id,
          userId: req.user && req.user._id,
        };
        const rec = req.customer && req.customer.category === CONSTANTS.CUSTOMER_TYPES.DEMO
          ? await dservice.rejectDeposit(query)
          : await service.rejectDeposit(query);
        return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
      } catch (error) {
        return next(error);
      }
    }
  }
  
  module.exports = new DepositController();
  