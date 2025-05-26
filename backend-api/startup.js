const { InitializeExchanges } = require('src/modules/crypto/exchange/api');
const { InitializeExchanges: InitializeExchangesWS } = require('src/modules/crypto/exchange/websockets');
const {
  klineService,
} = require('src/modules/services');
require('src/common/handlers/events/listener');

module.exports = () => {
  setTimeout(async () => {
    InitializeExchangesWS();
    InitializeExchanges();
    await klineService.updateInitialCacheData();
  }, 5000);
};
