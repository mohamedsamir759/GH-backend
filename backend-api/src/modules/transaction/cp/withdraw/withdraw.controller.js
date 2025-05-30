//
const allServices = require('src/modules/services');
const { ResponseMessages, CONSTANTS } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const { transactionService: service, dTransactionService: dservice } = allServices;

class WithdrawController {
  async basicWithdraw(req, res, next) {
    try {
      const query = {
        ...req.body,
        customerId: (req.user && req.user._id) || '',
      };
      const rec = req.user && req.user.category === CONSTANTS.CUSTOMER_TYPES.LIVE
        ? await service.basicWithdraw(query)
        : await dservice.basicWithdraw(query);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async cryptoWithdraw(req, res, next) {
    try {
      const query = {
        ...req.body,
        customerId: (req.user && req.user._id) || '',
      };
      const rec = req.user && req.user.category === CONSTANTS.CUSTOMER_TYPES.LIVE
        ? await service.addPendingBlockchainWithdraw(query)
        : await dservice.addPendingBlockchainWithdraw(query);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getRecords(req, res, next) {
    try {
      const query = {
        ...req.body,
        ...req.query,
        customerId: (req.user && req.user._id) || '',
      };
      const rec = req.user && req.user.category === CONSTANTS.CUSTOMER_TYPES.LIVE
        ? await service.getWithdraws(query)
        : await dservice.getWithdraws(query);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getGateways(req, res, next) {
    try {
      const rec = req.user && req.user.category === CONSTANTS.CUSTOMER_TYPES.LIVE
        ? await service.getWithdrawalGateways()
        : await dservice.getWithdrawalGateways();
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new WithdrawController();
