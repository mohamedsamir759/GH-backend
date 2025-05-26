//
const dbMongo = require('./db.mongo');
const logger = require('./logger');
const redis = require('./redis');
const sockets = require('./sockets');

dbMongo();

module.exports.dbMongo = dbMongo;
module.exports.logger = logger;
module.exports.redis = redis;
module.exports.sockets = sockets;
