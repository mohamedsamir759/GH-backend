/* eslint-disable func-names */
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));
const jwt = require('jsonwebtoken');
const { keys, CONSTANTS } = require('src/common/data');

const { model, Schema } = mongoose;

const CustomerSchema = new Schema(
  {

    recordId: { type: Number },
    title: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, required: true },
    nationality: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    mobile: { type: String, required: false },
    dob: { type: String },
    callStatus: { type: String },
    agent: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: false,
    },
    gender: { type: String },
    address: { type: String },
    address2: { type: String },
    zipCode: { type: String },
    referral: { type: String, default: Math.random().toString(36).slice(2, 10) },
    language: { type: String, default: 'en' },
    stages: {
      type: {
        kycUpload: { type: Boolean, default: false },
        kycApproved: { type: Boolean, default: false },
        kycRejected: { type: Boolean, default: false },
        madeDeposit: { type: Boolean, default: false },
        emailVerified: { type: Boolean, default: false },
        phoneVerified: { type: Boolean, default: false },
        startTrading: { type: Boolean, default: false },

        individual: {
          type: {
            submitProfile: { type: Boolean, default: false },
          },
        },
      },
      default: {
        kycUpload: false,
        kycApproved: false,
        kycRejected: false,
        madeDeposit: false,
        emailVerified: false,
        phoneVerified: false,
        startTrading: false,

        individual: {
          submitProfile: false,
        },
      },
    },

    idDetails: {
      type: { type: String, default: '' },
      documentNo: { type: String, default: '' },
      dateOfIssue: { type: String, default: '' },
      dateOfExpiry: { type: String, default: '' },
      countryOfIssue: { type: String, default: '' },
    },

    fatca: { type: String, default: '', enum: ['yes', 'no', ''] },
    politicallyExposed: { type: String, default: '', enum: ['yes', 'no', ''] },
    workedInCrypto: { type: String, default: '', enum: ['yes', 'no', ''] },
    taxIdentificationNumber: { type: String },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: false,
    },
    source: {
      type: String,
      enum: Object.keys(CONSTANTS.CUSTOMER_SOURCES),
      default: CONSTANTS.CUSTOMER_SOURCES.DEMO,
    },
    category: {
      type: String,
      enum: Object.keys(CONSTANTS.CUSTOMER_TYPES),
      default: CONSTANTS.CUSTOMER_TYPES.DEMO,
    },

    isActive: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },

    // salesAgentId: { type: Schema.Types.ObjectId, },
    password: { type: String },
    declarations: [{ type: String }],
    markupId: {
      type: Schema.Types.ObjectId,
      ref: 'markup',
    },
    transactionFeeId: {
      type: Schema.Types.ObjectId,
      ref: 'transaction-fee-group',
    },
    tradingFeeId: {
      type: Schema.Types.ObjectId,
      ref: 'fee-group',
    },
    experience: {
      type: {
        employmentStatus: { type: String, default: '' },
        profession: { type: String },
        jobTitle: { type: String },
        employer: { type: String },
      },
    },
    financialInfo:
    {
      type: {
        annualIncome: { type: String },
        sourceOfFunds: { type: String },
        workedInFinancial: { type: String, default: '', enum: ['yes', 'no', ''] },
      },
    },
    usCitizen: { type: String, default: '', enum: ['yes', 'no', ''] },
    twoFactorSecret: { type: Object, default: {} },
    settings: { twoFactorAuthEnabled: { type: Boolean, default: false } },
  },

  { timestamps: true },
);

CustomerSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({
    _id: this.id,
    email: this.email,
    is_active: this.isActive,
    category: this.category,
    settings: this.settings,
    twoFactorSecret: this.twoFactorSecret,
  }, keys.jwtKey,
  { expiresIn: keys.cpTokenTime.jwtTime });
  return token;
};

CustomerSchema.methods.generateResetPasswordToken = function () {
  const token = jwt.sign({
    _id: this.id,
    email: this.email,
  }, keys.jwtKey,
  { expiresIn: keys.cpResetPasswordTokenTime.jwtTime });
  return token;
};

CustomerSchema.index({
  firstName: 1,
  lastName: 1,
  email: 1,
  phone: 1,
  country: 1,
  nationality: 1,
  source: 1,
  category: 1,
  createdAt: -1,
});

CustomerSchema.plugin(mongoosePaginate);
CustomerSchema.plugin(AutoIncrement, {
  id: 'customerCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});

// CustomerSchema.index({ rec: 1 });

module.exports.Model = model('customers', CustomerSchema);
module.exports.Schema = CustomerSchema;

// mongoose.connection.collections.customers.ensureIndex({
//   firstName: 'text', lastName: 'text', email: 'text', phone: 'text', country: 'text',
// }, { language_override: 'lang', name: 'generalIndex' });
