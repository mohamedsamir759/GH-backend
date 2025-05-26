const Redis = require('ioredis');
const { keys } = require('../data');

const logger = require('./logger');

const redis = new Redis(keys.redis);

module.exports.getKey = (key) => new Promise((resolve, reject) => {
  redis.get(key, (err, result) => {
    if (err) {
      return resolve(null);
    }
    try {
      return resolve(JSON.parse(result));
    } catch (error) {
      return resolve(result);
    }
  });
});

module.exports.setKey = (key, value, expiry) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value);
  }
  if (expiry) {
    redis.set(key, value, 'EX', expiry);
  }
  redis.set(key, value);
};

module.exports.deleteUserTokens = async (key = '') => new Promise((resolve, reject) => {
  if (!key || key === '' || key.length !== 24) {
    return reject(new Error('Invalid userID'));
  }
  const stream = redis.scanStream({
    match: `${key}:*`,
    count: 10,
  });
  stream.on('data', (resultKeys) => {
    for (let i = 0; i < resultKeys.length; i++) {
      const foundKey = resultKeys[i];
      redis.del(foundKey);
    }
  });
  stream.on('end', () => {
    logger.info(['all keys have been visited for ', key]);
    return resolve(true);
  });
});

module.exports.getClient = redis;
