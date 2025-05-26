const Joi = require('joi');
const { basePagination } = require('src/common/handlers');

module.exports.listing = Joi.object({
  ...basePagination,
  type: Joi.string().valid('LIVE', 'DEMO'),
  searchText: Joi.string(),
});

module.exports.find = Joi.object({
  firstName: Joi.string(),
});

module.exports.getCustomer = Joi.object({
  id: Joi.string(),
});

module.exports.customerAccess = Joi.object({
  id: Joi.string(),
  status: Joi.string().valid('activate', 'deactivate').required(),
});

module.exports.create = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),

  country: Joi.string().required(),
  nationality: Joi.string(),
  city: Joi.string(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  dob: Joi.string(),
  gender: Joi.string(),
  // address: Joi.string(),

  password: Joi.string().required(),
  declarations: Joi.array().items(Joi.string()),
  // ibid: Joi.string(),
});

module.exports.update = Joi.object({
  title: Joi.string(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string(),
  country: Joi.string(),
  nationality: Joi.string(),
  city: Joi.string(),
  phone: Joi.string(),
  mobile: Joi.string().allow(''),
  agent: Joi.string().allow(''),
  callStatus: Joi.string().allow(''),
  dob: Joi.string(),
  gender: Joi.string(),
  address: Joi.string(),
  address2: Joi.string().allow(''),
  declarations: Joi.array().items(Joi.string()),
  isActive: Joi.string().allow('').valid(false, true),
  language: Joi.string(),
  zipCode: Joi.string().allow(''),
  source: Joi.string(),

  idDetails: Joi.object({
    type: Joi.string().allow(''),
    documentNo: Joi.string().allow(''),
    dateOfIssue: Joi.string().allow(''),
    dateOfExpiry: Joi.string().allow(''),
    countryOfIssue: Joi.string().allow(''),
  }),

  fatca: Joi.string().allow('').valid('yes', 'no'),
  usCitizen: Joi.string().allow('').valid('yes', 'no'),
  politicallyExposed: Joi.string().allow('').valid('yes', 'no'),
  taxIdentificationNumber: Joi.string().allow(''),
  workedInCrypto: Joi.string().allow('').valid('yes', 'no'),
  markupId: Joi.string().allow(''),
  tradingFeeId: Joi.string().allow(''),
  transactionFeeId: Joi.string().allow(''),
});
