const jwt = require('jsonwebtoken');

const service = require('src/modules/services').customerService;

const { keys, ResponseMessages } = require('src/common/data');
const { redis, logger } = require('src/common/lib');
const { CustomError, parseJoiObject, generateUuid } = require('src/common/handlers');

module.exports.authMW = async (req, res, next) => {
  try {
    req.isAuth = true;
    let token = req.headers['x-access-token'] || req.headers.authorization;
    if (!token) {
      return next(new CustomError(ResponseMessages.MISSING_TOKEN));
    }
    token = token.replace('Bearer ', '');
    const decoded = jwt.verify(token, keys.jwtKey);
    if (decoded._id) {
      const customer = await service.findById(decoded._id);
      if (customer && customer.isActive === false) {
        return next(new CustomError(ResponseMessages.INVALID_TOKEN));
      }
    }
    const user = await redis.getKey(`${decoded._id}:${token}`);
    if (!user || user === '') {
      return next(new CustomError(ResponseMessages.INVALID_TOKEN));
    }
    req.user = decoded;
    return next();
  } catch (ex) {
    return next(new CustomError(ResponseMessages.INVALID_TOKEN));
  }
};

module.exports.valMW = (validationObject, isGet = false) => (req, res, next) => {
  req.apiParams = parseJoiObject(validationObject);
  const body = isGet ? req.query : req.body;
  const { error } = validationObject.validate(body);
  if (error) {
    return next(new CustomError({
      ...ResponseMessages.JOI_VALIDATION_ERROR,
      message: error.message,
    }));
  }
  return next();
};

module.exports.vlPathMw = (validationObject) => (req, res, next) => {
  req.pathParams = parseJoiObject(validationObject);
  const body = req.params;
  const { error } = validationObject.validate(body);
  if (error) {
    return next(new CustomError({
      ...ResponseMessages.JOI_VALIDATION_ERROR,
      message: error.message,
    }));
  }
  return next();
};

module.exports.vlResetPassMw = async (req, res, next) => {
  try {
    req.isAuth = true;
    let token = req.headers['x-access-token'] || req.headers.authorization;
    if (!token) {
      return next(new CustomError(ResponseMessages.INVALID_EXPIRED_TOKEN));
    }
    token = token.replace('Bearer ', '');
    const decoded = jwt.verify(token, keys.jwtKey);
    if (decoded._id) {
      const customer = await service.findById(decoded._id);
      if (customer && customer.isActive === false) {
        return next(new CustomError(ResponseMessages.INVALID_EXPIRED_TOKEN));
      }
    }
    const user = await redis.getKey(`${decoded._id}:forgot_password:${token}`);
    if (!user || user === '') {
      return next(new CustomError(ResponseMessages.INVALID_EXPIRED_TOKEN));
    }
    req.user = decoded;
    redis.getClient.del(`${decoded._id}:forgot_password:${token}`);
    return next();
  } catch (ex) {
    return next(new CustomError(ResponseMessages.INVALID_EXPIRED_TOKEN));
  }
};

module.exports.addUniqueId = (req, res, next) => {
  // eslint-disable-next-line prefer-destructuring
  req.ip = req.ip.split(':')[0];
  req.uid = generateUuid();
  logger.info(['request ID => ', req.uid]);
  return next();
};
