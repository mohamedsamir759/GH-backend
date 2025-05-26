/* eslint-disable class-methods-use-this */

const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const {
  customerService: service,
  walletService,
} = require('src/modules/services');

class CustomerController {
  async updateProfile(req, res, next) {
    try {
      const { _id } = req.user;
      const rec = await service.updateById(_id, req.body);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async submitProfile(req, res, next) {
    try {
      const { _id } = req.user;
      await service.updateById(_id, {
        ...req.body,
        'stages.individual.submitProfile': true,
      });
      const { stages } = await service.findById(_id, { stages: 1 });
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, stages);
    } catch (error) {
      return next(error);
    }
  }

  async getStages(req, res, next) {
    try {
      const { _id } = req.user;
      const rec = await service.findById(_id, { stages: 1 });
      return ApiResponse(
        res, true, ResponseMessages.RECORD_FETCH_SUCCESS, (rec && rec.stages) || {},
      );
    } catch (error) {
      return next(error);
    }
  }

  async getDefaultConfig(req, res, next) {
    try {
      const { _id } = req.user;
      const rec = await service.getDefaultConfigs(_id);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async convertDemoToLive(req, res, next) {
    try {
      const { _id, category } = req.user;
      const rec = await service.convertDemoToLive({ customerId: _id, category, ip: req.ip });
      walletService.generateSystemWallets({
        customerId: _id,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { password } = req.body;
      const { _id } = req.user;
      const rec = await service.changePassword(_id, password);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const rec = await service.forgotPassword(email);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async checkEmail(req, res, next) {
    try {
      const { email } = req.query;
      const rec = await service.checkEmail(email);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new CustomerController();
