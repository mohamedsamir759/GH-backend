//

/* eslint-disable class-methods-use-this */
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');
const {
  usersService: service,
  customerService,
} = require('src/modules/services');

class UserController {
  async createRecord(req, res, next) {
    try {
      const rec = await service.createUser({ ...req.body, createdBy: req.user._id });
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { id } = req.params;
      const rec = await service.updatePassword({
        ...req.body,
        id,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
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

  async getRecords(req, res, next) {
    try {
      const rec = await service.find();
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getPaginate(req, res, next) {
    try {
      const rec = await service.findWithPagination({
        ...req.query,
      }, {
        populate: [{
          path: 'roleId',
          select: 'title key',
        }],
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getTeamManagers(req, res, next) {
    try {
      const rec = await service.findWithPagination({
        ...req.query,
      }, {
        populate: [{
          path: 'roleId',
          select: 'title key',
        }],
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getTeamMembers(req, res, next) {
    try {
      const rec = await service.findTeamMembers({
        ...req.query,
      }, {
        populate: [{
          path: 'roleId',
          select: 'title key',
        }],
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getAssignable(req, res, next) {
    try {
      const rec = await service.getAssignableUsers({
        ...req.query,
      }, {
        populate: [{
          path: 'roleId',
          select: 'title key',
        }],
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getRecordById(req, res, next) {
    try {
      const rec = await service.findById(req.params.id, {}, true, [{
        path: 'roleId',
        select: 'title key',
      }]);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getRecordPaginated(req, res, next) {
    try {
      const rec = await service.find({});
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async assignAgents(req, res, next) {
    try {
      const { id: agent } = req.params;
      const { clientIds } = req.body;
      const rec = await customerService.assignAgents({
        agent,
        clientIds,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new UserController();
