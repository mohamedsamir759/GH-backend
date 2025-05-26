//
const { ObjectId } = require('mongoose').Types;
const allServices = require('src/modules/services');
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const { todoService: service } = allServices;

class TodoController {
  async createRecord(req, res, next) {
    try {
      const rec = await service.create({ ...req.body, createdBy: req.user._id });
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, {
        ...rec._doc,
        customerId: req.customer,
        createdBy: req.user,
      });
    } catch (error) {
      return next(error);
    }
  }

  async getPaginate(req, res, next) {
    try {
      const { start, end, ...query } = req.query;
      if (query.customerId) {
        query.customerId = ObjectId(query.customerId);
      }
      if (start && end) {
        query.timeEnd = {
          $gte: start,
          $lte: end,
        };
      }
      const rec = await service.findWithPagination({ ...query }, {
        populate: [{
          path: 'createdBy',
          select: 'firstName lastName',
        }, {
          path: 'customerId',
          select: 'firstName lastName',
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

  async getRecordById(req, res, next) {
    try {
      const rec = await service.findById(req.params.id);
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
}

module.exports = new TodoController();

