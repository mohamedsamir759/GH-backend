const apiResponseHandler = require('./response-handler');
const CustomError = require('./custom-error');
const general = require('./general');
const Cruds = require('./Cruds');

module.exports = {
  ...apiResponseHandler,
  CustomError,
  ...general,
  Cruds
};
