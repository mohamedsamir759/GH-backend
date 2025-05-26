const Joi = require('joi');
const { basePagination } = require('src/common/handlers');

module.exports.listing = Joi.object({
  ...basePagination,
});

module.exports.create = Joi.object({
  exchanges: Joi.array().required(),
  actions: Joi.array().required(),
  emailProviders: Joi.array().required(),
  countries: Joi.array().required(),
});

module.exports.addItem = Joi.object({
  exchanges: Joi.string(),
  actions: Joi.string(),
  emailProviders: Joi.string(),
  countries: Joi.object(),
});

module.exports.getDictionary = Joi.object({
  id: Joi.string().required(),
});

module.exports.removeItem = Joi.object({
  exchanges: Joi.string(),
  actions: Joi.string(),
  emailProviders: Joi.string(),
  countries: Joi.object(),
});

module.exports.update = Joi.object({
  exchanges: Joi.string(),
  actions: Joi.string(),
  emailProviders: Joi.string(),
  countries: Joi.object(),
});