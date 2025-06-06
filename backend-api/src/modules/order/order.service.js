//
const { default: BigNumber } = require('bignumber.js');
const { 
  Cruds, 
  SendEvent,
  getAssetsFromMarketSymbol,
} = require('src/common/handlers');
const { CONSTANTS } = require('src/common/data');
const { logger } = require('src/common/lib');
const OrderModel = require('./order.model');
const MarketModel = require('../market/market.model');
const WalletModel = require('../wallet/wallet.model');
const { getExchange } = require('src/modules/crypto/exchange/api');

let walletService;
let markupService;
let feeGroupService;
class OrderService extends Cruds {
  _constructor() {
    this.baseErrorMessage = 'Order is not valid';
  }

  async getMarkupData(customerId) {
    let markupData = null;
    const customerWithMarkup = await customerService.findById(customerId, {
      markup: 1,
    }, true, [{
      path: 'markupId',
      select: 'isPercentage value',
    }]);
    if (customerWithMarkup) {
      markupData = customerWithMarkup.markupId;
    } else {
      markupData = await markupService.findOne({
        isDefault: true,
      });
    }
    return markupData;
  }

  async updatePriceForMarkup(customerId, side, price) {
    let markupData = null;
    const customerWithMarkup = await customerService.findById(customerId, {
      markup: 1,
    }, true, [{
      path: 'markupId',
      select: 'isPercentage value',
    }]);
    let markedUpPrice = price;
    if (customerWithMarkup) {
      markupData = customerWithMarkup.markupId;
    } else {
      markupData = await markupService.findOne({
        isDefault: true,
      });
    }
    if (side === 'buy') {
      markedUpPrice = markupService.getMarkedDownAmount(markupData, price, false);
    } else if (side === 'sell') {
      markedUpPrice = markupService.getMarkedUpAmount(markupData, price, false);
    }
    return {
      markedUpPrice,
      markupData,
    };
  }

  async createOrder(params) {
    const {
      symbol,
      type,
      side,
      amount,
      price = undefined,
      mPrice = 0,
    } = params;
    // TODO: get best price here and exchange here as well
    // const priceFromExchange = price;
    const {
      exchangeData,
      customerId,
    } = await this.checkOrder({
      ...params,
      exchange: 'binance',
    });
    const fullMarkupData = await markupService.getMarkupDataForCustomer(customerId);
    const markupData = markupService.getMarkupForMarketFromData(fullMarkupData, symbol);
    // get the actual market price of the exchange symbol
    const pricingData = await pricingService.getMarkedPrice(
      markupData,
      params.symbol,
      type,
      side,
      exchangeData.name,
      params.price,
    );
    params.mPrice = (pricingData && pricingData.mPrice);
    params.price = (pricingData && pricingData.marketPrice);
    const apiExchange = getExchange(
      exchangeData.name, {
        apiKey: exchangeData.apiKey,
        secret: exchangeData.secret,
        ...exchangeData.extraParams,
      },
    );
    // const serverTime = await apiExchange.exchange.publicGetTime();
    // console.log(serverTime.serverTime);
    // console.log(new Date().getTime());
    // console.log((new Date().getTime()) - serverTime.serverTime);
    const mFeeGroup = await feeGroupService.getFeeGroupForCustomer(customerId);
    const order = await this.create({
      symbol,
      type,
      side,
      amount,
      mPrice: params.mPrice,
      price: params.price,
      exchange: exchangeData.name,
      paramsData: params,
      customerId,
      markup: markupData,
      mFeeGroup,
    });
    const frozenAmount = await walletService.freezeAmountForOrder(order);
    let exchangeOrder;
    try {
      exchangeOrder = await apiExchange.exchange.createOrder(
        symbol,
        type,
        side,
        amount,
        price, {
          clientOrderId: `${order.recordId}___${customerId}`,
        },
      );
    } catch (err) {
      await this.updateById(order._id, {
        status: 'rejected',
        frozenAmount,
        exchangeData: {
          error: err.message,
        },
      });
      SendEvent(
        CONSTANTS.EVENT_TYPES.EVENT_LOG,
        CONSTANTS.LOG_TYPES.ORDER,
        {
          customerId,
          userId: params.userId,
          triggeredBy: params.userId ? 1 : 0,
          userLog: false,
          level: CONSTANTS.LOG_LEVELS.ERROR,
          details: {
            category: customerId && customerId.category,
            error: err.message,
          },
          content: params,
        },
      );
      await walletService.revertFrozenAmountForOrder(order);
      logger.error(`Error creating order on exchange, ${order._id} due to ${err.message}`);
      return this.findById(order._id);
    }
    const {
      info,
      trades,
      id: exchangeId,
      amount: x,
      price: y,
      filled,
      remaining,
      ...rest
    } = exchangeOrder;
    logger.info(`${type} ${side} [${symbol}] order for, ${customerId} Amount: ${amount} Price: ${price}`);
    SendEvent(
      CONSTANTS.EVENT_TYPES.EVENT_LOG,
      CONSTANTS.LOG_TYPES.ORDER,
      {
        customerId,
        userId: params.userId,
        triggeredBy: params.userId ? 1 : 0,
        userLog: false,
        level: CONSTANTS.LOG_LEVELS.INFO,
        details: { category: customerId && customerId.category },
        content: {
          ...params,
          status: rest.status,
        },
      },
    );
    await this.updateById(order._id, {
      ...rest,
      frozenAmount,
      exchangeId,
      exchangeData: info,
    });
    return this.findById(order._id);
  }

  async checkOrder(order) {
    const {
      symbol: pairName,
      type,
      side,
      amount,
      price,
      exchange,
      customerId,
    } = order;
    const amountBN = new BigNumber(amount);
    const {
      baseAsset,
      quoteAsset,
    } = getAssetsFromMarketSymbol(pairName);
    if (!customerId) {
      throw new Error('No Customer Id Provided');
    }
    if (['buy', 'sell'].indexOf(side) === -1) throw new Error(`Order side not valid (${side})`);
    if (['market', 'limit'].indexOf(type) === -1) throw new Error(`This type of order is not supported (${type})`);
    if (type === 'limit' && !price) throw new Error(`${this.baseErrorMessage} ${pairName} Price is not provided`);
    if (!exchange) throw new Error(`${this.baseErrorMessage}, exchange is undefined`);
    // TODO: check if exchange exists in system
    if (!customerId) throw new Error(`${this.baseErrorMessage}, customer id is undefined`);
    const [
      exchangeParams,
      marketInSystem,
      customerBaseWalletResponse,
      customerQuoteWalletResponse,
    ] = await Promise.allSettled([
      settingsService.getSettings('exchanges'),
      MarketModel.Model.findOne({
        pairName,
      }),
      WalletModel.Model.findOne({
        asset: baseAsset,
        belongsTo: customerId,
      }),
      WalletModel.Model.findOne({
        asset: quoteAsset,
        belongsTo: customerId,
      }),
    ]);
    if (!exchangeParams.value || (
      exchangeParams.value && !exchangeParams.value[0]
    )) {
      throw new Error('No Exchanges Defined');
    }
    const exchangeData = exchangeParams.value.find((ex) => ex.name === exchange);
    if (!exchangeData) throw new Error(`Parameter are not set for this Exchange, ${exchange}.`);
    // if (!exchangeData.default)
    // throw new Error(`This is not set as a default exchange, ${exchange}.`);
    const customerBaseWallet = customerBaseWalletResponse
    && customerBaseWalletResponse.value
    && customerBaseWalletResponse.value._doc;
    const customerQuoteWallet = customerQuoteWalletResponse
    && customerQuoteWalletResponse.value
    && customerQuoteWalletResponse.value._doc;
    if (!customerBaseWallet || (!customerBaseWallet.asset)) {
      throw new Error(`Customer ${baseAsset}, wallet not found`);
    }
    if (!customerQuoteWallet || (!customerQuoteWallet.asset)) {
      throw new Error(`Customer ${quoteAsset}, wallet not found`);
    }
    const baseAmountBN = new BigNumber(customerBaseWallet.amount);
    const quoteAmountBN = new BigNumber(customerQuoteWallet.amount);
    if (side === 'buy' && quoteAmountBN.isLessThan(amountBN)) {
      throw new Error('Customer quote wallet balance insufficient');
    } else if (side === 'sell' && baseAmountBN.isLessThan(amountBN)) {
      throw new Error('Customer base wallet balance insufficient');
    }
    if (!marketInSystem.value || (marketInSystem.value && !marketInSystem.value._doc.pairName)) {
      throw new Error(`${this.baseErrorMessage} ${pairName} is not available in the system`);
    }
    if (amountBN.isZero()
    || amountBN.isNegative()
    || amountBN.isLessThan(new BigNumber(marketInSystem.value._doc.minAmount))) {
      throw new Error(`${this.baseErrorMessage}, please check order amount`);
    }
    return {
      ...order,
      baseAsset,
      quoteAsset,
      baseWallet: customerBaseWallet,
      quoteWallet: customerQuoteWallet,
      exchangeData,
    };
  }

  async getOrderFromExchangeViaExchangeId(exchange, exchangeOrderId, symbol) {
    const exchangeData = await settingsService.getExchangeDetails(exchange);
    const apiExchange = getExchange(
      exchangeData.name, {
        apiKey: exchangeData.apiKey,
        secret: exchangeData.secret,
        ...exchangeData.extraParams,
      },
    );
    return apiExchange.getOrder(exchangeOrderId, symbol);
  }

  async cancelOrder(orderId) {
    const findOrder = await this.findById(orderId);
    if (!findOrder) {
      throw new Error('Order not found');
    }
    if (findOrder.status !== 'open') {
      throw new Error(`Cannot cancel order in state ${findOrder.status}`);
    }
    const exchangeData = await settingsService.getExchangeDetails(findOrder.exchange);
    const apiExchange = getExchange(
      exchangeData.name, {
        apiKey: exchangeData.apiKey,
        secret: exchangeData.secret,
        ...exchangeData.extraParams,
      },
    );
    const cancelResult = await apiExchange.cancelOpenOrder(
      findOrder.exchangeId,
      findOrder.symbol,
    );
    if (cancelResult.status === 'canceled') {
      return {
        ...findOrder,
        status: cancelResult.status,
      };
    }
    throw new Error('Error canceling order');
  }
}

module.exports = new OrderService(OrderModel.Model, OrderModel.Schema);

setTimeout(() => {
  const services = require('src/modules/services');
  walletService = services.walletService;
  markupService = services.markupService;
  feeGroupService = services.feeGroupService;
}, 0);
