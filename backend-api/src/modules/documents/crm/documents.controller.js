/* eslint-disable class-methods-use-this */
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const service = require('../documents.service');

class DocumentController {
  async getMyDocuments(req, res, next) {
    try {
      const rec = await service.find({
        customerId: req.params.customerId,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async addDocument(req, res, next) {
    try {
      const promiseArr = [];
      Object.keys(req.files).forEach((key) => {
        promiseArr.push(
          service.addNewdocument(req.params.customerId, key, req.files[key]),
        );
      });
      return Promise.all(promiseArr)
        .then((rep) => ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rep))
        .catch((err) => next(err));
    } catch (err) {
      return next(err);
    }
  }

  async changeStatus(req, res, next) {
    try {
      const { status, documentId } = req.params;
      const { rejectionReason } = req.body;
      const result = await service.changeDocumentStatus(status, documentId, rejectionReason);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, result);
    } catch (err) {
      return next(err);
    }
  }

  async deleteDocument(req, res, next) {
    try {
      const { status, documentId } = req.params;
      const result = await service.deleteById(documentId);
      return ApiResponse(res, true, ResponseMessages.RECORD_DELETE_SUCCESS, result);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new DocumentController();
