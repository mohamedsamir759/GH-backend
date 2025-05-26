/* eslint-disable class-methods-use-this */
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');
const {
  usersService: service,
} = require('src/modules/services');

class AuthController {
  async loginCrm(req, res, next) {
    const { email, password } = req.body;
    try {
      const user = await service.loginCrm(email, password);
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
      const user = await service.getUserById(_id);
      if (!user) {
        return ApiResponse(res, false, ResponseMessages.ACCESS_DENIED, {});
      }
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, user);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new AuthController();
