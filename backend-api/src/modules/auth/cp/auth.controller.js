/* eslint-disable class-methods-use-this */
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const service = require('src/modules/services').customerService;

class AuthController {
  async login(req, res, next) {
    const { email, password } = req.body;
    try {
      const user = await service.login(email, password, req.ip);
      if (!user) {
        return ApiResponse(res, false, ResponseMessages.LOGIN_FAIL, {});
      }
      return ApiResponse(res, true, ResponseMessages.LOGIN_SUCCESS, user);
    } catch (error) {
      return next(error);
    }
  }

  async getProfile(req, res, next) {
    const { _id } = req.user;
    try {
      const user = await service.findById(_id, {}, true, [{
        path: 'markupId',
        select: 'value title markets isPercentage',
      }, {
        path: 'transactionFeeId',
        select: 'value assets title isPercentage minValue maxValue',
      }, {
        path: 'tradingFeeId',
        select: 'value markets title isPercentage minValue maxValue',
      }]);
      if (!user) {
        return ApiResponse(res, false, ResponseMessages.ACCESS_DENIED, {});
      }
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, user);
    } catch (error) {
      return next(error);
    }
  }

  async verifyTwoFactorAuth(req, res, next) {
    try {
      const verified = await service.verifyTwoFactorAuth({
        ...req.body,
        ip: req.ip,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, verified);
    } catch (err) {
      return next(err);
    }
  }

  async disableTwoFactorAuth(req, res, next) {
    const { token, email } = req.body;
    try {
      const verified = await service.verifyTwoFactorAuth({ token, email });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, verified);
    } catch (err) {
      return next(err);
    }
  }

  async firstTime2FAVerification(req, res, next) {
    const { token } = req.body;
    const { _id } = req.user;
    try {
      const verified = await service.firstTime2FAVerification({ token, id: _id });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, verified);
    } catch (err) {
      return next(err);
    }
  }

  async generateQR(req, res, next) {
    try {
      const qrCodeData = await service.generateQRCode(req.user);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, qrCodeData);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new AuthController();
