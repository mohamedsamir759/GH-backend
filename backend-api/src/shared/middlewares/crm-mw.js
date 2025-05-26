const jwt = require('jsonwebtoken');
const { keys, ResponseMessages } = require('src/common/data');
const { redis } = require('src/common/lib');
const { CustomError, parseJoiObject } = require('src/common/handlers');

const service = require('src/modules/services').usersService;

module.exports.authMiddleware = async (req, res, next) => {
  req.isAuth = true;
  let token = req.headers['x-access-token'] || req.headers.authorization;
  if (!token) {
    return next(new CustomError(ResponseMessages.MISSING_TOKEN));
  }
  token = token.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, keys.jwtKey);
    if (!decoded || !decoded._id) {
      return next(new CustomError(ResponseMessages.INVALID_TOKEN));
    }
    const user = await redis.getKey(`${decoded._id}:${token}`);
    if (!user || user === '') {
      return next(new CustomError(ResponseMessages.INVALID_TOKEN));
    }
    req.user = user;
    // const user = await service.getUserById(decoded._id);
    // req.user = {
    //   ...user,
    //   _id: decoded._id,
    // };
    return next();
  } catch (ex) {
    return next(new CustomError(ResponseMessages.INVALID_TOKEN));
  }
};

module.exports.authorizeMW = (group = '', permission = '') => (req, res, next) => {
  if (!req.user || !req.user.roleId || !req.user.roleId.permissions) {
    return next(new CustomError(ResponseMessages.ACCESS_DENIED));
  }
  const perms = req.user.roleId.permissions;
  if (perms[group] && perms[group][permission]) {
    return next();
  }
  return next(new CustomError(ResponseMessages.ACCESS_DENIED));
};

module.exports.validationMiddleware = (validationObject, isGet = false) => (req, res, next) => {
  req.apiParams = parseJoiObject(validationObject);
  const body = isGet ? req.query || {} : req.body || {};
  const { error } = validationObject ? validationObject.validate(body) : '';
  if (error) {
    return next(new CustomError(ResponseMessages.JOI_VALIDATION_ERROR));
  }
  return next();
};

module.exports.validationPathMiddleware = (validationObject) => (req, res, next) => {
  req.pathParams = parseJoiObject(validationObject);
  const body = req.params;
  const { error } = validationObject.validate(body);
  if (error) {
    return next(new CustomError(ResponseMessages.JOI_VALIDATION_ERROR));
  }
  return next();
};

module.exports.attachCustomerMW = (isGet) => async (req, res, next) => {
  const body = isGet ? req.query || {} : req.body || {};
  const { customerId, belongsTo } = body;
  if (customerId || belongsTo) {
    const customer = await customerService.findById(customerId || belongsTo);
    // eslint-disable-next-line max-len
    if (customer) { req.customer = customer; } else { next(new CustomError(ResponseMessages.JOI_VALIDATION_ERROR)); }
  } else { return next(new CustomError(ResponseMessages.JOI_VALIDATION_ERROR)); }
  return next();
};

module.exports.addUniqueId = (req, res, next) => {
  // eslint-disable-next-line prefer-destructuring
  req.ip = req.ip.split(':')[0];
  req.uid = generateUuid();
  logger.info(['request ID => ', req.uid]);
  return next();
};
