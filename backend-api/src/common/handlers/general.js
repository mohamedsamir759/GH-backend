/* eslint-disable max-len */
const moment = require('moment');
const mongoose = require('mongoose');
const crypto = require('crypto');
const events = require('events');
const Joi = require('joi');

const { keys } = require('../data');
const { logger } = require('../lib');

const { emitter } = require('./events/emitter');

const getPrefixofModel = (modeName = '') => {
  const split = modeName.split('-');
  if (split.length > 1) {
    return split[0][0] + split[1][0];
  }

  return modeName.substring(0, 2);
};

const RoundDate = (date, duration, method) => moment(Math[method](+date / +duration) * +duration);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports.encryptPassword = (password) => {
  const iterations = 100;
  const keylen = 24;

  const derivedKey = crypto.pbkdf2Sync(
    password,
    keys.passwordSalt,
    iterations,
    keylen,
    'sha512',
  );
  const pw = Buffer.from(derivedKey, 'binary').toString('hex');
  return pw;
};

module.exports.comparePassword = (password, hash) => {
  const newPassword = this.encryptPassword(password);
  if (hash === newPassword) return true;
  return false;
};

module.exports.ApiResponse = (res, status, resObj, result) => res.status(resObj.code || 200).json({ status, message: resObj.message, result });

module.exports.generateRandomImageName = () => {
  const _sym = 'abcdefghijklmnopqrstuvwxyz1234567890';
  let str = '';

  for (let i = 0; i < 40; i++) {
    str += _sym[parseInt(Math.random() * (_sym.length), 10)];
  }
  return `${str}.png`;
};

module.exports.generatePassword = (len = 8) => {
  let pass = '';
  const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            + 'abcdefghijklmnopqrstuvwxyz0123456789@#$';
  for (let i = 1; i <= len; i++) {
    const char = Math.floor(Math.random()
                    * str.length + 1);
    pass += str.charAt(char);
  }
  return pass;
};

module.exports.stringArrToUri = (arr) => {
  try {
    let tmpStr = arr.join(' ');
    tmpStr = tmpStr.split(/\s+/).join(' ');
    return tmpStr.split(' ').join('-');
  } catch (error) {
    logger.log('err ', error);
    return '';
  }
};

module.exports.generateReferenceForModel = (len, modelName) => {
  const prefix = getPrefixofModel(modelName);
  let initialValue1 = '1';
  let initialValue2 = '9';
  for (let index = 1; index < len - 2; index++) {
    initialValue1 += '0';
    initialValue2 += '0';
  }
  return `${prefix.toUpperCase()}${Math.floor(parseInt(initialValue1, 10) + Math.random() * parseInt(initialValue2, 10))}`;
};

// const parseJoiObject = (validationObject) => {
//   if (!validationObject || !validationObject._inner || !validationObject._inner.children) return [];
//   const keysArr = [];
//   const entries = validationObject._inner.children.entries();
//   function logMapElements(value) {
//     keysArr.push({
//       key: value.key,
//       type: value.schema._type,
//       valids: value.schema._valids ? Array.from(value.schema._valids._set) : null, // for now only to make it work
//       flags: value.schema._flags,
//     });
//   }
//   new Map(entries)
//     .forEach(logMapElements);
//   return keysArr;
// };

module.exports.parseJoiObject = (validationObject) => {
  // const keysArr = [];
  // const entries = (validationObject && validationObject._inner.children && validationObject._inner.children.entries()) || [];
  // function logMapElements(value) {
  //   keysArr.push({
  //     key: value.key,
  //     type: (value.schema._inner && value.schema._inner.items) ? parseJoiObject(value.schema._inner.items[0]) : value.schema._type,
  //     valids: value.schema._valids ? Array.from(value.schema._valids._set) : null, // for now only to make it work
  //     flags: value.schema._flags,
  //   });
  // }
  // new Map(entries)
  //   .forEach(logMapElements);
  // return keysArr;
  const keysArr = [];
  const entries = validationObject && validationObject._ids._byKey.entries();
  function logMapElements(value, key) {
    keysArr.push({
      key,
      type: value.schema.type,
      valids: value.schema._valids ? Array.from(value.schema._valids._values) : null,
      flags: value.schema._flags,
    });
  }
  new Map(entries)
    .forEach(logMapElements);
  return keysArr;
};

module.exports.getMarketSymbolFromAssets = (baseAsset, quoteAsset) => (`${baseAsset}/${quoteAsset}`);
module.exports.getAssetsFromMarketSymbol = (symbol) => {
  const assets = symbol.split('/');
  return {
    baseAsset: assets[0],
    quoteAsset: assets[1],
  };
};
module.exports.removeMarketDivider = (marketSymbol, divider = '/', join = '') => marketSymbol.split(divider).join(join);
module.exports.RoundDate = RoundDate;
module.exports.sleep = sleep;
module.exports.getFromToMSFromSince = (since, timeFrame, limit) => {
  const fromDateTime = typeof since.getMonth === 'function' ? new Date(since) : new Date(parseInt(since, 10));
  const unit = timeFrame[timeFrame.length - 1];
  const time = parseInt(timeFrame.slice(0, timeFrame.indexOf(unit)), 10);
  const toDateTime = new Date(moment(fromDateTime).valueOf() + (limit * moment.duration(time, unit).valueOf()));
  const fromMS = RoundDate(
    fromDateTime,
    moment.duration(time, unit),
    'floor',
  ).valueOf();
  const toMS = RoundDate(
    toDateTime,
    moment.duration(time, unit),
    'floor',
  ).valueOf();
  return {
    fromMS,
    toMS,
    time,
    unit,
  };
};

module.exports.formatKline = (data, fromBase = true) => {
  if (fromBase) {
    return {
      time: data.t,
      open: data.o,
      high: data.h,
      low: data.l,
      close: data.c,
      volume: data.v,
      symbol: data.s,
    };
  }
  return {
    t: data.time,
    o: data.open,
    h: data.high,
    l: data.low,
    c: data.close,
    v: data.volume,
    s: data.symbol,
  };
};

module.exports.getDataFromTimespan = (timespan = '24h') => {
  let timeframe; let limit;
  const unit = timespan[timespan.length - 1];
  const time = parseInt(timespan.slice(0, timespan.indexOf(unit)), 10);
  const duration = moment.duration(time, unit);
  const since = new Date(moment().subtract(duration).valueOf());
  switch (timespan) {
    case '24h':
      timeframe = '30m';
      limit = 48;
      break;
    case '7d':
      timeframe = '4h';
      limit = 42;
      break;
    case '30d':
      timeframe = '12h';
      limit = 60;
      break;
    default:
      timeframe = '30m';
      limit = 48;
  }
  return {
    since,
    timeframe,
    limit,
  };
};

module.exports.getHighChartsKey = (ts, s) => (`base_high_${ts}_${s}`);

module.exports.dbConnectionUpCb = async (cb) => {
  return false;
  try {
    const interval = setInterval(() => {
      if (mongoose.connection.readyState === 1) {
        cb(true);
        clearInterval(interval);
      }
    }, 1000);
    return await mongoose.connection.readyState === 1;
  } catch (err) {
    return false;
  }
};

module.exports.SendEvent = (eventType, type, data, demo = false) => (
  emitter.emit(eventType, {
    type,
    data,
    demo,
  })
);

// eslint-disable-next-line max-len
module.exports.generateUuid = () => Math.random().toString() + Math.random().toString() + Math.random().toString();

module.exports.basePagination = {
  page: Joi.number(),
  limit: Joi.number(),
  searchText: Joi.string(),
};
