//
const { Cruds } = require('src/common/handlers');
const { logger } = require('src/common/lib');
const SettingsModal = require('./settings.model');

class SettingsService extends Cruds {
  async getSettings(key = '') {
    if (!this.settings) {
      logger.warn('Fetching settings from database');
      this.settings = await this.findOne({});
    } else {
      logger.warn('Taking data from variable');
    }
    return key === '' ? this.settings : this.settings[key];
  }

  async addExchange(exchangeData = {}) {
    const exchanges = await this.getSettings('exchanges');
    // TODO: check if exchange is implemented or not
    if (exchanges.findIndex((x) => x.name === exchangeData.name) !== -1) {
      throw new Error('Exchange already exists');
    }
    if (exchangeData.default && exchanges.findIndex((x) => x.default) !== -1) {
      throw new Error('There already is a default exchange');
    }
    // need to setup ws here for the exchange added
    return this.Model.findOneAndUpdate({}, {
      $push: {
        exchanges: exchangeData,
      },
    }, { new: true });
  }

  async removeExchange(exchangeName = '') {
    const exchanges = await this.getSettings('exchanges');
    if (exchanges.findIndex((x) => x.name === exchangeName) === -1) {
      throw new Error('Exchange does not exists');
    }
    // need to setup ws here for the exchange added
    this.settings = await this.Model.findOneAndUpdate({}, {
      $pull: {
        exchanges: {
          name: exchangeName,
        },
      },
    }, { new: true });
    return this.settings;
  }

  async updateExchange(exchangeName, exchangeData = {}) {
    let updateModel = {};
    if (exchangeData.apiKey) {
      updateModel = {
        ...updateModel,
        'exchanges.$.apiKey': exchangeData.apiKey,
      };
    }
    if (exchangeData.secret) {
      updateModel = {
        ...updateModel,
        'exchanges.$.secret': exchangeData.secret,
      };
    }
    if (exchangeData.extraParams) {
      updateModel = {
        ...updateModel,
        'exchanges.$.extraParams': exchangeData.extraParams,
      };
    }
    this.settings = await this.Model.findOneAndUpdate({
      exchanges: {
        $elemMatch: { name: exchangeName },
      },
    }, {
      $set: updateModel,
    }, { new: true });
    return this.settings;
  }

  async getExchangeDetails(exchangeName) {
    return this.settings.exchanges.find((x) => x.name === exchangeName);
  }

  async getDefaultExchange() {
    return this.settings.exchanges
      ? this.settings.exchanges.find((ex) => ex.default === true)
      : {};
  }
}

module.exports = new SettingsService(SettingsModal.Model, SettingsModal.Schema);
