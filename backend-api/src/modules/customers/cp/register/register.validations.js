const Joi = require('joi');

const customerSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),

  country: Joi.string().required(),
  nationality: Joi.string(),
  city: Joi.string(),
  email: Joi.string().email().required(),
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

  country: Joi.string(),
  nationality: Joi.string(),
  city: Joi.string(),
  phone: Joi.string(),
  dob: Joi.string(),
  gender: Joi.string(),
  address1: Joi.string(),
  address2: Joi.string(),
  declarations: Joi.array().items(Joi.string()),
});

module.exports.create = customerSchema;
module.exports.registerDemo = customerSchema;
module.exports.registerLive = customerSchema;
