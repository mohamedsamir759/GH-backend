//
const allServices = require('src/modules/services');
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const { bankAccountService: service } = allServices;

class BankAccountController {
  async getRecords(req, res, next) {
    try {
      const rec = await service.findWithPagination({
        customerId: req.params.customerId,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async createRecord(req, res, next) {
    try {
      const rec = await service.create({ ...req.body, createdBy: req.user._id });
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async updateRecordById(req, res, next) {
    try {
      const { id } = req.params;
      const rec = await service.updateById(id, req.body);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async deleteRecordById(req, res, next) {
    try {
      const { id } = req.params;
      const rec = await service.deleteById(id);
      return ApiResponse(res, true, ResponseMessages.RECORD_DELETE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new BankAccountController();
