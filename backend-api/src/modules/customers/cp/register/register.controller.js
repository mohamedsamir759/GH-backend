//
const { ResponseMessages, CONSTANTS } = require('src/common/data');
const { ApiResponse, encryptPassword } = require('src/common/handlers');

const {
  customerService: service,
  activityService,
  walletService,
  dWalletService: dwalletService,
} = require('src/modules/services');

class CustomerController {
  async registerDemo(req, res, next) {
    try {
      // const oldPass = req.body.password;
      const params = {
        ...req.body,
        ip: req.ip,
        password: encryptPassword(req.body.password),
        category: CONSTANTS.CUSTOMER_TYPES.DEMO,
        source: CONSTANTS.CUSTOMER_SOURCES.DEMO,
      };
      const customer = await service.create(params);
      const user = await service.login(req.body.email, req.body.password, req.ip);
      await dwalletService.generateSystemWallets({
        customerId: customer._id,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, user);
    } catch (error) {
      return next(error);
    }
  }

  async registerLive(req, res, next) {
    try {
      const params = {
        ...req.body,
        ip: req.ip,
        password: encryptPassword(req.body.password),
        category: CONSTANTS.CUSTOMER_TYPES.LIVE,
        source: CONSTANTS.CUSTOMER_SOURCES.LIVE,
      };
      const customer = await service.create(params);
      await walletService.generateSystemWallets({
        customerId: customer._id,
      });
      const user = await service.login(req.body.email, req.body.password, req.ip);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, user);
    } catch (error) {
      return next(error);
    }
  }

  async getMyProfile(req, res, next) {
    try {
      const rec = await service.findById(req.user._id, { password: 0, source: 0 });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getActivities(req, res, next) {
    try {
      const rec = await activityService.find({ customerId: req.user._id });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new CustomerController();
