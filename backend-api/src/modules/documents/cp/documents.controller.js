/* eslint-disable class-methods-use-this */
const { ResponseMessages } = require('src/common/data');
const { logger } = require('src/common/lib');
const { ApiResponse } = require('src/common/handlers');

const service = require('../documents.service');
// service.deleteById('5feef943595c4a2186eeff62')
class DocumentController {
  async getMyDocuments(req, res, next) {
    try {
      const rec = await service.find({
        customerId: req.user._id,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async addDocument(req, res, next) {
    try {
      logger.info(req.files, req.body);
      const result = await service.addNewdocument(req.user._id, req.body.type, req.files);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, result);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new DocumentController();
