/* eslint-disable class-methods-use-this */
const { ResponseMessages, CONSTANTS } = require('src/common/data');
const { ApiResponse, encryptPassword } = require('src/common/handlers');

const {
  customerService: service,
  dWalletService: dwalletService,
} = require('src/modules/services');

class CustomerController {
  async createLead(req, res, next) {
    try {
      const params = {
        ...req.body,
        ip: req.ip,
        createdBy: req.user._id,
        category: CONSTANTS.CUSTOMER_TYPES.DEMO,
        source: 'CRM',
        password: req.body.password ? encryptPassword(req.body.password) : null,
      };
      const rec = await service.create(params);
      dwalletService.generateSystemWallets({
        customerId: rec._id,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getPaginate(req, res, next) {
    try {
      const rec = await service.findWithPagination({
        ...req.query,
        category: CONSTANTS.CUSTOMER_TYPES.DEMO,
      }, {
        populate: [{
          path: 'agent',
          select: 'firstName lastName email',
        }],
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
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
      const rec = await service.updateById(id, { isDeleted: true });
      return ApiResponse(res, true, ResponseMessages.RECORD_DELETE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getRecordById(req, res, next) {
    try {
      const rec = await service.findById(req.params.id);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async registerDemo(req, res, next) {
    try {
      const params = {
        ...req.body,
        password: await encryptPassword(req.body.password),
        category: CONSTANTS.CUSTOMER_TYPES.DEMO,
        source: CONSTANTS.CUSTOMER_SOURCES.DEMO,
      };
      const rec = await service.create(params);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new CustomerController();
