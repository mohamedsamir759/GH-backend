//
const mongoose = require('mongoose');
const { default: BigNumber } = require('bignumber.js');
const { 
  Cruds, 
  SendEvent,
  dbConnectionUpCb,
} = require('src/common/handlers');
const { CONSTANTS } = require('src/common/data');
const { logger } = require('src/common/lib');
const TransactionModel = require('./transaction.model');

const { getExchange } = require('src/modules/crypto/exchange/api');

let customerService;
let systemEmailService;
let walletService;
let feeGroupService;
let settingsService;

const {
  APPROVED,
  REJECTED,
  PENDING,
  IN_PROGRESS,
} = CONSTANTS.TRANSACTIONS_STATUS;
const {
  DEPOSIT,
  WITHDRAW,
} = CONSTANTS.TRANSACTIONS_TYPES;
const {
  BLOCKCHAIN,
} = CONSTANTS.TRANSACTIONS_GATEWAYS;

class Service extends Cruds {
  _constructor() {
    this.defaultPopulate = [{
      path: 'walletId',
      select: 'asset amount assetId status freezeAmount',
      populate: [{
        path: 'assetId',
        select: 'image symbol',
      }],
    }, {
      path: 'customerId',
      select: 'firstName lastName category',
    }];
  }

  getPaginate(filter, options = {}) {
    return this.findWithPagination(filter, {
      ...options,
      populate: this.defaultPopulate,
    });
  }

  async createPendingTransaction(type, params = {}) {
    if (!type) {
      throw new Error('Type of transaction is required');
    }
    if (!params.customerId) {
      throw new Error('No customer Id Provided');
    }
    const feeGroup = await feeGroupService.getTransactionFeeGroupForCustomer(params.customerId);
    const mFeeGroup = feeGroupService.getTransactionFeeForAssetFromData(feeGroup, params.currency);
    const mFee = {
      cost: feeGroupService.calculateTransactionFeeAmount(mFeeGroup, params.amount).toString(),
      currency: params.currency,
    };
    return this.create({
      ...params,
      type,
      status: PENDING,
      mFeeGroup,
      mFee,
      isApproving: params.isAutoApprove || false,
    });
  }

  async basicDeposit(params = {}) {
    const wallet = await walletService.findById(params.walletId);
    const trans = await this.createPendingTransaction(
      DEPOSIT,
      {
        ...params,
        currency: wallet.asset,
      },
    );
    if (!trans.isApproving) {
      SendEvent(
        CONSTANTS.EVENT_TYPES.EVENT_LOG,
        CONSTANTS.LOG_TYPES.DEPOSIT,
        {
          customerId: params.customerId,
          userId: params.userId,
          triggeredBy: params.userId ? 1 : 0,
          userLog: false,
          level: CONSTANTS.LOG_LEVELS.INFO,
          details: {},
          content: trans,
        },
      );
    }
    if (!params.isAutoApprove) return trans;
    try {
      const paid = await walletService.changeBalanceViaWalletId(
        params.walletId,
        params.customerId,
        DEPOSIT,
        params.amount,
        trans.mFee,
      );
      await this.updateById(trans._id, {
        status: APPROVED,
        paid: paid.toString(),
      });
      const uTrans = await this.findById(trans._id, {}, true, this.defaultPopulate);
      SendEvent(
        CONSTANTS.EVENT_TYPES.EVENT_LOG,
        CONSTANTS.LOG_TYPES.DEPOSIT,
        {
          customerId: params.customerId,
          userId: params.userId,
          triggeredBy: params.userId ? 1 : 0,
          userLog: false,
          level: CONSTANTS.LOG_LEVELS.INFO,
          details: {},
          content: uTrans,
        },
      );
      return uTrans;
    } catch (err) {
      await this.updateById(trans._id, {
        status: REJECTED,
        reason: err.message,
      });
      const uTrans = await this.findById(trans._id, {}, true, this.defaultPopulate);
      SendEvent(
        CONSTANTS.EVENT_TYPES.EVENT_LOG,
        CONSTANTS.LOG_TYPES.DEPOSIT,
        {
          customerId: params.customerId,
          userId: params.userId,
          triggeredBy: params.userId ? 1 : 0,
          userLog: false,
          level: CONSTANTS.LOG_LEVELS.ERROR,
          details: {
            error: err.message,
          },
          content: uTrans,
        },
      );
      return uTrans;
    }
  }

  async basicWithdraw(params = {}) {
    const wallet = await walletService.freezeBalanceForWithdrawal(params);
    const trans = await this.createPendingTransaction(
      WITHDRAW,
      {
        ...params,
        currency: wallet.asset,
        frozenAmount: params.amount,
      },
    );
    if (!trans.isApproving) {
      SendEvent(
        CONSTANTS.EVENT_TYPES.EVENT_LOG,
        CONSTANTS.LOG_TYPES.WITHDRAW,
        {
          customerId: params.customerId,
          userId: params.userId,
          triggeredBy: params.userId ? 1 : 0,
          userLog: false,
          level: CONSTANTS.LOG_LEVELS.INFO,
          details: {},
          content: trans,
        },
      );
    }
    if (!params.isAutoApprove) return trans;
    try {
      const paid = await walletService.changeBalanceViaWalletId(
        params.walletId,
        params.customerId,
        WITHDRAW,
        trans.frozenAmount,
        trans.mFee,
      );
      await this.updateById(trans._id, {
        status: APPROVED,
        paid: paid.toString(),
      });
      const uTrans = await this.findById(trans._id, {}, true, this.defaultPopulate);
      SendEvent(
        CONSTANTS.EVENT_TYPES.EVENT_LOG,
        CONSTANTS.LOG_TYPES.WITHDRAW,
        {
          customerId: params.customerId,
          userId: params.userId,
          triggeredBy: params.userId ? 1 : 0,
          userLog: false,
          level: CONSTANTS.LOG_LEVELS.INFO,
          details: {},
          content: uTrans,
        },
      );
      return uTrans;
    } catch (err) {
      await this.updateById(trans._id, {
        status: REJECTED,
        reason: err.message,
      });
      const uTrans = await this.findById(trans._id, {}, true, this.defaultPopulate);
      SendEvent(
        CONSTANTS.EVENT_TYPES.EVENT_LOG,
        CONSTANTS.LOG_TYPES.WITHDRAW,
        {
          customerId: params.customerId,
          userId: params.userId,
          triggeredBy: params.userId ? 1 : 0,
          userLog: false,
          level: CONSTANTS.LOG_LEVELS.ERROR,
          details: {
            error: err.message,
          },
          content: uTrans,
        },
      );
      return uTrans;
    }
  }

  getDeposits(filter = {}, options = {}) {
    return this.newFindWithPagination({
      ...filter,
      type: CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT,
    }, {
      ...options,
      populate: this.defaultPopulate,
    });
  }

  getWithdraws(filter = {}, options = {}) {
    return this.newFindWithPagination({
      ...filter,
      type: CONSTANTS.TRANSACTIONS_TYPES.WITHDRAW,
    }, {
      ...options,
      populate: this.defaultPopulate,
    });
  }

  getInternalTransfer(filter = {}, options = {}) {
    return this.findWithPagination({
      ...filter,
      type: CONSTANTS.TRANSACTIONS_TYPES.INTERNAL_TRANSFER,
    }, {
      ...options,
      populate: this.defaultPopulate,
    });
  }

  async checkTransaction(id, type) {
    if (!id) {
      throw new Error('Please provide an id to approve');
    }
    if (!type) {
      throw new Error('Please provide a transaction type');
    }
    const trans = await this.findOne({
      _id: id,
      type,
    });
    if (!trans) {
      throw new Error(`No such ${type} transaction found`);
    }
    if (trans && !(trans.status === PENDING || trans.status === IN_PROGRESS)) {
      throw new Error(`This transaction is already ${trans.status}, ${id}`);
    }
    return trans;
  }

  async approveDeposit({ id, userId }) {
    const trans = await this.checkTransaction(id, DEPOSIT, APPROVED);
    logger.info(`Deposit Transaction ${id}, Approving`);
    try {
      const paid = await walletService.changeBalanceViaWalletId(
        trans.walletId,
        trans.customerId,
        DEPOSIT,
        trans.amount,
        trans.mFee,
      );
      await this.updateById(trans._id, {
        status: APPROVED,
        paid: paid.toString(),
      });
      logger.info(`Deposit Transaction ${id}, Approved`);
      const uTrans = await this.findById(trans._id, {}, true, this.defaultPopulate);
      SendEvent(
        CONSTANTS.EVENT_TYPES.EVENT_LOG,
        CONSTANTS.LOG_TYPES.DEPOSIT,
        {
          customerId: trans.customerId,
          userId,
          triggeredBy: 1,
          userLog: false,
          level: CONSTANTS.LOG_LEVELS.INFO,
          details: {},
          content: uTrans,
        },
      );
      return uTrans;
    } catch (err) {
      await this.updateById(trans._id, {
        status: REJECTED,
        reason: err.message,
      });
      const uTrans = await this.findById(trans._id, {}, true, this.defaultPopulate);
      SendEvent(
        CONSTANTS.EVENT_TYPES.EVENT_LOG,
        CONSTANTS.LOG_TYPES.DEPOSIT,
        {
          customerId: trans.customerId,
          userId,
          triggeredBy: 1,
          userLog: false,
          level: CONSTANTS.LOG_LEVELS.ERROR,
          details: {
            error: err.message,
          },
          content: uTrans,
        },
      );
      logger.info(`Deposit Transaction ${id}, Rejected due to ${err.message}`);
      return uTrans;
    }
  }

  async rejectDeposit({ id, reason = null, userId }) {
    const trans = await this.checkTransaction(id, DEPOSIT, REJECTED);
    logger.info(`Deposit Transaction ${id}, Rejected`);
    await this.updateById(trans._id, {
      status: REJECTED,
      reason,
    });
    const uTrans = await this.findById(trans._id, {}, true, this.defaultPopulate);
    SendEvent(
      CONSTANTS.EVENT_TYPES.EVENT_LOG,
      CONSTANTS.LOG_TYPES.DEPOSIT,
      {
        customerId: trans.customerId,
        userId,
        triggeredBy: 1,
        userLog: false,
        level: CONSTANTS.LOG_LEVELS.INFO,
        details: {},
        content: uTrans,
      },
    );
    return uTrans;
  }

  async approveWithdraw({ id, userId }) {
    const trans = await this.checkTransaction(id, WITHDRAW, APPROVED);
    logger.info(`Withdraw Transaction ${id}, Approving`);
    try {
      const paid = await walletService.changeBalanceViaWalletId(
        trans.walletId,
        trans.customerId,
        WITHDRAW,
        trans.amount,
        trans.mFee,
      );
      await this.updateById(trans._id, {
        status: APPROVED,
        paid: paid.toString(),
      });
      logger.info(`Withdraw Transaction ${id}, Approved`);
      const uTrans = await this.findById(trans._id, {}, true, this.defaultPopulate);
      SendEvent(
        CONSTANTS.EVENT_TYPES.EVENT_LOG,
        CONSTANTS.LOG_TYPES.WITHDRAW,
        {
          customerId: trans.customerId,
          userId,
          triggeredBy: 1,
          userLog: false,
          level: CONSTANTS.LOG_LEVELS.INFO,
          details: {},
          content: uTrans,
        },
      );
      return uTrans;
    } catch (err) {
      await this.updateById(trans._id, {
        status: REJECTED,
        reason: err.message,
      });
      const uTrans = await this.findById(trans._id, {}, true, this.defaultPopulate);
      SendEvent(
        CONSTANTS.EVENT_TYPES.EVENT_LOG,
        CONSTANTS.LOG_TYPES.WITHDRAW,
        {
          customerId: trans.customerId,
          userId,
          triggeredBy: 1,
          userLog: false,
          level: CONSTANTS.LOG_LEVELS.ERROR,
          details: {
            error: err.message,
          },
          content: uTrans,
        },
      );
      logger.info(`Withdraw Transaction ${id}, Rejected due to ${err.message}`);
      return uTrans;
    }
  }

  async rejectWithdraw({ id, reason = null, userId }) {
    const trans = await this.checkTransaction(id, WITHDRAW, REJECTED);
    logger.info(`Withdraw Transaction ${id}, Rejected`);
    await this.updateById(trans._id, {
      status: REJECTED,
      reason,
    });
    const uTrans = await this.findById(trans._id, {}, true, this.defaultPopulate);
    SendEvent(
      CONSTANTS.EVENT_TYPES.EVENT_LOG,
      CONSTANTS.LOG_TYPES.WITHDRAW,
      {
        customerId: trans.customerId,
        userId,
        triggeredBy: 1,
        userLog: false,
        level: CONSTANTS.LOG_LEVELS.INFO,
        details: {},
        content: uTrans,
      },
    );
    return uTrans;
  }

  async getDepositGateways() {
    return CONSTANTS.TRANSACTIONS_GATEWAYS;
  }

  async getWithdrawalGateways() {
    return CONSTANTS.TRANSACTIONS_GATEWAYS;
  }

  async getTransactionsBelongingToClient(clientId) {
    const transactionRecords = await this.find({ customerId: clientId });

    return transactionRecords;
  }

  async addPendingBlockchainDeposit(data) {
    const {
      rawData,
    } = data;
    const {
      amount,
      currency,
      txId,
    } = rawData;
    return this.createPendingTransaction(DEPOSIT, {
      ...data,
      amount,
      currency,
      txId,
      gateway: BLOCKCHAIN,
    });
  }

  async addUpdateBlockchainDeposit(data) {
    const {
      rawData,
    } = data;
    const {
      amount,
      currency,
      txId,
    } = rawData;
    // TODO: need to deposit this received amount to the main binance wallet.
    let findTransaction = await this.findOne({ txId }, { txId: 1 });
    if (!findTransaction) {
      findTransaction = await this.addPendingBlockchainDeposit({
        ...data,
        amount,
        currency,
        txId,
      });
    }
    return this.approveDeposit(findTransaction._id);
  }

  async addPendingBlockchainWithdraw(params = {}) {
    const wallet = await walletService.freezeBalanceForWithdrawal(params);
    const trans = await this.createPendingTransaction(
      WITHDRAW,
      {
        ...params,
        currency: wallet.asset,
        gateway: BLOCKCHAIN,
        frozenAmount: params.amount,
      },
    );
    this.makeExchangeWithdrawal({ ...trans._doc, ...params });
    return trans;
  }

  async makeExchangeWithdrawal(params = {}) {
    const {
      currency,
      amount,
      to,
      tag,
      _id,
      mFee,
    } = params;
    // TODO: decide which exchange to do the withdrawal on
    const exchangeData = await settingsService.getDefaultExchange();
    if (!exchangeData || !exchangeData.name) {
      return this.rejectWithdraw(_id);
    }
    const apiExchange = await getExchange(
      exchangeData.name, {
        apiKey: exchangeData.apiKey,
        secret: exchangeData.secret,
        ...exchangeData.extraParams,
      },
    );
    try {
      const res = await apiExchange.withdraw(
        currency,
        new BigNumber(amount).minus(new BigNumber(mFee.cost)),
        to,
        tag,
        {},
      );
      await this.updateById(_id, { rawData: res });
    } catch (err) {
      logger.error(JSON.stringify(err));
      return this.rejectWithdraw(_id, err.message);
    }
    // return res;
  }
}

async function transactionWatcher() {
  const collection = mongoose.connection.db.collection('transactions');
  const changeStream = collection.watch({ fullDocument: 'updateLookup' });
  changeStream.on('change', async (next) => {
    const {
      fullDocument, documentKey, operationType, updateDescription,
    } = next;
    if (operationType === 'insert') {
      if (!fullDocument.isApproving) {
        const customer = await customerService.findById(fullDocument.customerId);
        let action = '';
        switch (fullDocument.type) {
          case CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT:
            action = CONSTANTS.EMAIL_ACTIONS.TRANSACTION_DEPOSIT_PENDING;
            break;
          case CONSTANTS.TRANSACTIONS_TYPES.WITHDRAW:
            action = CONSTANTS.EMAIL_ACTIONS.TRANSACTION_WITHDRAWAL_PENDING;
            break;
          default:
            break;
        }
        systemEmailService.sendSystemEmail(
          action, {
            to: customer.email,
          }, {
            ...customer,
            ...fullDocument,
          },
        );
      }
    } else if (operationType === 'update') {
      const customer = await customerService.findById(fullDocument.customerId);
      let action = '';
      if (updateDescription.updatedFields.status !== null) {
        const isApproved = updateDescription.updatedFields.status === 'APPROVED';
        switch (fullDocument.type) {
          case CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT:
            action = isApproved
              ? CONSTANTS.EMAIL_ACTIONS.TRANSACTION_DEPOSIT_APPROVED
              : CONSTANTS.EMAIL_ACTIONS.TRANSACTION_DEPOSIT_REJECTED;
            break;
          case CONSTANTS.TRANSACTIONS_TYPES.WITHDRAW:
            action = isApproved
              ? CONSTANTS.EMAIL_ACTIONS.TRANSACTION_WITHDRAWAL_APPROVED
              : CONSTANTS.EMAIL_ACTIONS.TRANSACTION_WITHDRAWAL_REJECTED;
            break;
          default:
            break;
        }
        systemEmailService.sendSystemEmail(
          action, {
            to: customer.email,
          }, {
            ...customer,
            ...fullDocument,
          },
        );
      }
    }
  });
}
dbConnectionUpCb(transactionWatcher);

module.exports = new Service(TransactionModel.Model, TransactionModel.Schema);

setTimeout(() => {
  const services = require('src/modules/services');
  customerService = services.customerService;
  systemEmailService = services.systemEmailService;
  walletService = services.walletService;
  feeGroupService = services.feeGroupService;
  settingsService = services.settingService;
}, 0);
