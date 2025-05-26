//
const allServices = require('src/modules/services');
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const { dictionaryService: service } = allServices;

class DictionaryController {
  async createRecord(req, res, next) {
    try {
      const rec = await service.createDictionary(req.body);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getDictionary(req, res, next) {
    try {
      const dictionary = await service.findDictionary();
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, dictionary);
    } catch (error) {
      return next(error);
    }
  }

  async getRecordById(req, res, next) {
    try {
      const { id } = req.params;
      const dictionary = await service.getDictionaryById(id);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, dictionary);
    } catch (error) {
      return next(error);
    }
  }

  async deleteRecordById(req, res, next) {
    try {
      const { id } = req.params;
      const rec = await service.deleteDictionary(id);
      return ApiResponse(res, ResponseMessages.RECORD_DELETE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async addItemToDictionary(req, res, next) {
    try {
      const { id } = req.params;
      const dictionary = await service.addItem(id, {}, { push: req.body });
      return ApiResponse(res, ResponseMessages.RECORD_UPDATE_SUCCESS, dictionary);
    } catch (error) {
      return next(error);
    }
  }

  async updateAction(req, res, next) {
    try {
      const { newValue } = req.query;

      const dictionary = await service.updateActions(req.body, newValue);
      return res.send(dictionary);
    } catch (error) {
      return next(error);
    }
  }

  async updateExchange(req, res, next) {
    try {
      const { newValue } = req.query;

      const dictionary = await service.updateExchanges(req.body, newValue);
      return res.send(dictionary);
    } catch (error) {
      return next(error);
    }
  }

  async updateEmailProvider(req, res, next) {
    try {
      const { newValue } = req.query;
      const result = await service.updateEmailProvider(req.body, newValue);
      return res.send(result);
    } catch (error) {
      return next(error);
    }
  }

  async updateCountry(req, res, next) {
    try {
      const result = await service.updateCountries(req.body, req.query);
      return res.send(result);
    } catch (error) {
      return next(error);
    }
  }

  async removeItemFromDictionary(req, res, next) {
    try {
      const { id } = req.params;
      const dictionary = await service.removeItemFromArray(id, {}, { pull: req.body });
      return ApiResponse(res, ResponseMessages.RECORD_UPDATE_SUCCESS, dictionary);
    } catch (error) {
      return next(error);
    }
  }
}
module.exports = new DictionaryController();
