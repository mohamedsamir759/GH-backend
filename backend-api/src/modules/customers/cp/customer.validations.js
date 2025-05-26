const Joi = require('joi');

module.exports.update = Joi.object({
  title: Joi.string(),
  firstName: Joi.string(),
  lastName: Joi.string(),

  country: Joi.string(),
  nationality: Joi.string(),
  city: Joi.string(),
  phone: Joi.string(),
  agent: Joi.string(),
  callStatus: Joi.string(),
  dob: Joi.string(),
  gender: Joi.string(),
  address1: Joi.string(),
  address2: Joi.string(),
  declarations: Joi.array().items(Joi.string()),
});

module.exports.submitIndProfile = Joi.object({
  title: Joi.string(),
  nationality: Joi.string(),
  city: Joi.string(),
  dob: Joi.string(),
  gender: Joi.string(),
  address: Joi.string(),
  address2: Joi.string().allow(''),
  language: Joi.string(),
  politicallyExposed: Joi.string(),
  usCitizen: Joi.string(),
  zipCode: Joi.string().allow(''),
  // declarations: Joi.array().items(Joi.string()),
  experience: Joi.object({
    profession: Joi.string(),
    employmentStatus: Joi.string(),
    employer: Joi.string().allow(''),
    jobTitle: Joi.string(),
  }),
  financialInfo: Joi.object({
    annualIncome: Joi.string(),
    sourceOfFunds: Joi.string(),
    workedInCrypto: Joi.string(),
  }),

});
