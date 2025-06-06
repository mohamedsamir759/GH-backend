const { permissions } = require('./permission-groups');

module.exports.ROLES = [{
  title: 'Admin',
  key: 'admin',
  permissions,
}];

module.exports.USERS = [{
  firstName: 'admin',
  lastName: 'User',
  email: 'admin@admin.com',
  password: 'admin123',
}];

module.exports.REQUESTS_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

module.exports.EVENT_TYPES = {
  EVENT_LOG: 'EVENT_LOG',
};

module.exports.LOG_TYPES = {
  REGISTER: 'REGISTER',
  LOGIN: 'LOGIN',
  CONVERT_CUSTOMER: 'CONVERT_CUSTOMER',
  CHANGE_PASSWORD: 'CHANGE_PASSWORD',
  RESET_PASSWORD: 'RESET_PASSWORD',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  DEPOSIT: 'DEPOSIT',
  WITHDRAW: 'WITHDRAW',
  CONVERT: 'CONVERT',
  ORDER: 'ORDER',
  WALLET: 'WALLET',
  ROLES: 'ROLES',
};

module.exports.LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

module.exports.REQUESTS_TYPES = {
  PARTNERSHIP: 'PARTNERSHIP',
};

module.exports.TRANSACTIONS_TYPES = {
  DEPOSIT: 'DEPOSIT',
  WITHDRAW: 'WITHDRAW',
  INTERNAL_TRANSFER: 'INTERNAL_TRANSFER',
};

module.exports.TRANSACTIONS_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

module.exports.TRANSACTIONS_GATEWAYS = {
  WIRE_TRANSFER: 'WIRE_TRANSFER',
  BLOCKCHAIN: 'BLOCKCHAIN',
  VISA: 'VISA',
  MASTERCARD: 'MASTERCARD',
  NETELLER: 'NETELLER',
  SKRILL: 'SKRILL',
};

module.exports.DCOUMENTS_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  IN_PROGRESS: 'IN_PROGRESS',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED',
};

module.exports.CUSTOMER_TYPES = {
  DEMO: 'DEMO',
  LIVE: 'LIVE',
};

module.exports.CUSTOMER_SOURCES = {
  DEMO: 'DEMO',
  LIVE: 'LIVE',
  CRM: 'CRM',
};

module.exports.CREATE_MARKET_ORDER = 'createMarketOrder';
module.exports.CREATE_LIMIT_ORDER = 'createLimitOrder';
module.exports.BUY = 'buy';
module.exports.SELL = 'sell';

module.exports.BINANCE_EXCHANGE = 'binance';

module.exports.ALLOWED_EXCHANGES = ['binance'];
module.exports.TIMESPANS = ['24h', '7d', '30d'];

module.exports.EMAIL_ACTIONS = {
  // emails configured
  REGISTER_INDIVIDUAL: 'REGISTER_INDIVIDUAL',
  REGISTER_DEMO: 'REGISTER_DEMO',
  KYC_STATUS_UPLOAD: 'KYC_STATUS_UPLOAD',
  KYC_STATUS_APPROVED: 'KYC_STATUS_APPROVED',
  KYC_STATUS_REJECTED: 'KYC_STATUS_REJECTED',
  TRANSACTION_DEPOSIT_PENDING: 'TRANSACTION_DEPOSIT_PENDING',
  TRANSACTION_DEPOSIT_APPROVED: 'TRANSACTION_DEPOSIT_APPROVED',
  TRANSACTION_DEPOSIT_REJECTED: 'TRANSACTION_DEPOSIT_REJECTED',
  TRANSACTION_WITHDRAWAL_PENDING: 'TRANSACTION_WITHDRAWAL_PENDING',
  TRANSACTION_WITHDRAWAL_APPROVED: 'TRANSACTION_WITHDRAWAL_APPROVED',
  TRANSACTION_WITHDRAWAL_REJECTED: 'TRANSACTION_WITHDRAWAL_REJECTED',

  // emails pending
  COIN_CONVERTED: 'COIN_CONVERTED',
  RESET_CP_PASSWORD_LINK: 'RESET_CP_PASSWORD_LINK',
  RESET_CP_PASSWORD_DONE: 'RESET_CP_PASSWORD_DONE',
  TRANSACTION_DEPOSIT_DECLINED: 'TRANSACTION_DEPOSIT_DECLINED',
  LOGIN_OTP: 'LOGIN_OTP',
  COIN_PURCHASED: 'COIN_PURCHASED',
};
