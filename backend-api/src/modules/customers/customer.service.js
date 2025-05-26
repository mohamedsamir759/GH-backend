const mongoose = require('mongoose');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const {
  Cruds, SendEvent, comparePassword, encryptPassword, generatePassword, dbConnectionUpCb,
} = require('src/common/handlers');
const { logger, redis } = require('src/common/lib');
const { CONSTANTS, keys, ResponseMessages } = require('src/common/data');
const { twoFAClientName } = require('src/common/data/keys');

const CustomerModel = require('./customer.model');

let feeGroupService;
let transactionFeeGroupService;
let markupService;
let systemEmailService;

const {
  LOG_TYPES,
  LOG_LEVELS,
  CUSTOMER_TYPES,
  EMAIL_ACTIONS,
  EVENT_TYPES,
} = CONSTANTS;

class CustomerService extends Cruds {
  async checkCustomerSettings(params) {
    if (!params.markupId) {
      const mId = await markupService.findOne({ isDefault: true }, { _id: 1 });
      params.markupId = mId && mId._id;
    }
    if (!params.transactionFeeId) {
      const tId = await transactionFeeGroupService.findOne(
        { isDefault: true },
        { _id: 1 },
      );
      params.transactionFeeId = tId && tId._id;
    }
    if (!params.tradingFeeId) {
      const tId = await feeGroupService.findOne({ isDefault: true }, { _id: 1 });
      params.tradingFeeId = tId && tId._id;
    }
    return params;
  }

  async create(params) {
    params = await this.checkCustomerSettings(params);
    await this.checkEmail(params.email);
    const addObj = await super.create({
      ...params,
      email: params.email.toLowerCase(),
    });
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.REGISTER,
      {
        customerId: addObj._id,
        userId: params.createdBy,
        triggeredBy: params.createdBy ? 1 : 0,
        userLog: false,
        level: LOG_LEVELS.INFO,
        details: { ip: params.ip, category: params.category },
        content: params,
      },
      params.category === 'DEMO',
    );
    delete addObj.password;
    return addObj;
  }

  async addLead(params) {
    return this.create({
      ...params,
      email: params.email.toLowerCase(),
      category: CONSTANTS.CUSTOMER_TYPES.DEMO,
      password: params.password ? encryptPassword(params.password) : null,
    });
  }

  async login(email, password, ip = null) {
    const customer = await this.findOne({
      email: email.toLowerCase().trim(),
    }, {}, { lean: false });

    if (!customer) throw new Error(ResponseMessages.LOGIN_FAIL.message);
    if (!customer.isActive) throw new Error(ResponseMessages.LOGIN_FAIL.message);
    const passwordMatch = comparePassword(password, customer.password);
    // if (!passwordMatch) throw new Error(ResponseMessages.LOGIN_FAIL.message);
    if (passwordMatch && customer.settings && customer.settings.twoFactorAuthEnabled) {
      return {
        twoFactorAuthEnabled: customer.settings.twoFactorAuthEnabled,
      };
    }
    if (passwordMatch && !customer.settings.twoFactorAuthEnabled) { // passwordMatch
      return this.generateLoginToken(customer, ip);
    }
    throw new Error(ResponseMessages.LOGIN_FAIL.message);
  }

  async generateLoginToken(customer, ip = null) {
    if (!customer || !customer.generateAuthToken) {
      throw new Error(ResponseMessages.LOGIN_FAIL.message);
    }
    const token = customer.generateAuthToken();
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.LOGIN,
      {
        customerId: customer._id,
        userId: null,
        triggeredBy: 0,
        userLog: false,
        level: LOG_LEVELS.INFO,
        details: { ip },
        content: {},
      },
      customer.category === 'DEMO',
    );
    redis.setKey(`${customer._id.toString()}:${token}`, { email: customer.email }, keys.cpTokenTime.seconds);
    return {
      token,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      category: customer.category,
      twoFactorAuthEnabled: customer.settings.twoFactorAuthEnabled,
    };
  }

  async findById(id, projection, lean = true, populate = []) {
    if (!projection) projection = { password: 0 };
    return super.findById(id, { ...projection }, lean, populate);
  }

  async changePassword(customerId, password = '') {
    const pass = encryptPassword(password || generatePassword());
    logger.warn(['password changed to ', pass, ' for ', customerId]);
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.CHANGE_PASSWORD,
      {
        customerId,
        userId: null,
        triggeredBy: 0,
        userLog: false,
        level: LOG_LEVELS.INFO,
        details: {},
        content: {},
      },
    );
    return this.updateById(customerId, { password: pass });
  }

  async find(params = {}, projection = {}, options = {}) {
    return super.find(params, { ...projection, password: 0 }, options);
  }

  async findWithPagination(params = {}, options = {}) {
    return super.findWithPagination(params, { ...options, projection: { password: 0 } });
  }

  async forgotPassword(email, _id) {
    const customer = email
      ? await this.findOne({ email }, {}, { lean: false })
      : await this.findOne({ _id }, {}, { lean: false });
    if (!customer) throw new Error(ResponseMessages.JOI_VALIDATION_ERROR.message);
    if (!customer.isActive) throw new Error(ResponseMessages.JOI_VALIDATION_ERROR.message);
    const token = customer.generateResetPasswordToken();
    redis.setKey(`${customer._id.toString()}:forgot_password:${token}`, { email: customer.email }, keys.cpTokenTime.seconds);
    const resetLink = `<a href="${keys.cpUrl}reset-password?token=${token}" target="_blank"> <strong><i>Reset Password</i></strong> </a>`;
    systemEmailService.sendSystemEmail(
      EMAIL_ACTIONS.RESET_CP_PASSWORD_LINK, {
        to: customer.email,
        resetLink,
        ...customer,
      },
    );
    return true;
  }

  async assignAgents(params = {}) {
    const {
      clientIds,
      agent,
    } = params;
    const query = {
      _id: {
        $in: clientIds.map((x) => mongoose.Types.ObjectId(x)),
      },
    };
    return this.updateMany(query, { agent });
  }

  async endAllSessions(customerId) {
    redis.deleteUserTokens(customerId.toString());
    return true;
  }

  async getDefaultConfigs(customerId) {
    const customerData = await super.findById(customerId, {
      markupId: 1,
      transactionFeeId: 1,
      tradingFeeId: 1,
    }, true, [{
      path: 'markupId',
      select: 'value title markets isPercentage',
    }, {
      path: 'transactionFeeId',
      select: 'value assets title isPercentage mixValue maxValue',
    }, {
      path: 'tradingFeeId',
      select: 'value markets title isPercentage mixValue maxValue',
    }]);
    let tradingFeeGroup = customerData.tradingFeeId;
    let transactionFeeGroup = customerData.transactionFeeId;
    let markupGroup = customerData.markupId;
    if (!markupGroup) {
      markupGroup = await markupService.findOne({ isDefault: true }, {
        value: 1,
        title: 1,
        markets: 1,
        isPercentage: 1,
      });
    }
    if (!tradingFeeGroup) {
      tradingFeeGroup = await feeGroupService.findOne({ isDefault: true }, {
        value: 1,
        mixValue: 1,
        maxValue: 1,
        isPercentage: 1,
        title: 1,
        markets: 1,
      });
    }
    if (!transactionFeeGroup) {
      transactionFeeGroup = await transactionFeeGroupService.findOne({ isDefault: true }, {
        value: 1,
        mixValue: 1,
        maxValue: 1,
        isPercentage: 1,
        title: 1,
        assets: 1,
      });
    }
    return {
      markupGroup,
      transactionFeeGroup,
      tradingFeeGroup,
    };
  }

  async convertDemoToLive({
    category, customerId, ip, userId,
  }) {
    if (category === CONSTANTS.CUSTOMER_TYPES.LIVE) {
      throw new Error('Customer is already a live one');
    }
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.CONVERT_CUSTOMER,
      {
        customerId,
        userId,
        triggeredBy: userId ? 1 : 0,
        userLog: false,
        level: LOG_LEVELS.INFO,
        details: {
          from: category, to: CONSTANTS.CUSTOMER_TYPES.LIVE, ip,
        },
        content: {},
      },
    );
    return this.updateById(customerId, {
      category: CUSTOMER_TYPES.LIVE,
    });
  }

  async verifyTwoFactorAuth(params) {
    const {
      token,
      email,
      ip,
      type = 'verify',
    } = params;
    const customer = await this.findOne({ email }, {}, { lean: false });
    if (!customer) {
      throw new Error('Invalid email');
    }
    let secret;
    if (type === 'enable') {
      secret = await redis.getKey(`${customer._id.toString()}:${email}:enable2FA`);
    } else {
      secret = customer.twoFactorSecret;
    }
    const verified = speakeasy.totp.verify({
      secret: secret.ascii,
      encoding: 'ascii',
      token,
    });
    if (!verified) {
      throw new Error('Invalid two factor authentication code');
    }
    switch (type) {
      case 'login':
        return this.generateLoginToken(customer, ip);
      case 'enable':
        if (customer.settings.twoFactorAuthEnabled) {
          throw new Error('2FA is already enabled');
        }
        redis.getClient.del(`${customer._id.toString()}:${email}:enable2FA`);
        await this.updateById(
          customer._id, {
            settings: { twoFactorAuthEnabled: true },
            twoFactorSecret: secret,
          },
        );
        return verified;
      case 'disable':
        if (!customer.settings.twoFactorAuthEnabled) {
          throw new Error('2FA is already enabled');
        }
        await this.updateById(customer._id, {
          settings: { twoFactorAuthEnabled: false },
          twoFactorSecret: {},
        });
        return verified;
      default:
        return verified;
    }
  }

  async firstTime2FAVerification(params) {
    const { token, id } = params;
    const customer = await this.findOne({ _id: id }, {}, { lean: false });
    const verified = speakeasy.totp.verify({
      secret: customer.twoFactorSecret.ascii,
      encoding: 'ascii',
      token,
    });
    if (!verified) {
      throw new Error('invalid two factor authentication code');
    }
    return verified;
  }

  async generateQRCode(params) {
    const { email, category, _id } = params;
    const customer = await this.findById(_id, {}, { lean: true });
    const secret = speakeasy.generateSecret({
      name: `${twoFAClientName} / (${email})`,
    });
    if (!customer.settings.twoFactorAuthEnabled) {
      redis.setKey(`${customer._id.toString()}:${email}:enable2FA`, secret, keys.twoFactorAuthTokenTime.seconds);
    } else {
      throw new Error('Already enabled 2FA');
    }
    // if (!customer.settings.twoFactorAuthEnabled) {
    //   await this.updateById(_id, { twoFactorSecret: secret });
    // }
    const qrCodeData = await qrcode.toDataURL(secret.otpauth_url);
    if (!qrCodeData) {
      throw new Error('Cannot generate qr');
    }
    return qrCodeData;
  }

  async checkEmail(email) {
    const customer = await this.findOne({ email });
    if (customer) throw new Error('Email already registered');
    return true;
  }
}

async function customerWatcher() {
  const collection = mongoose.connection.db.collection('customers');
  const changeStream = collection.watch({ fullDocument: 'updateLookup' });
  changeStream.on('change', async (next) => {
    const {
      fullDocument, documentKey, operationType, updateDescription,
    } = next;
    if (operationType === 'insert') {
      let action = '';
      switch (fullDocument.category) {
        case CUSTOMER_TYPES.DEMO:
          action = EMAIL_ACTIONS.REGISTER_DEMO;
          break;
        case CUSTOMER_TYPES.LIVE:
          action = EMAIL_ACTIONS.REGISTER_INDIVIDUAL;
          break;
        default:
          break;
      }

      systemEmailService.sendSystemEmail(
        action, {
          to: fullDocument.email,
          ...fullDocument,
        },
      );
    } else if (operationType === 'update') {
      const kycUploadStatus = updateDescription.updatedFields['stages.kycUpload'];
      const kycApproveStatus = updateDescription.updatedFields['stages.kycApproved'];
      const kycRejectStatus = updateDescription.updatedFields['stages.kycRejected'];
      let action = '';
      if (kycUploadStatus) action = EMAIL_ACTIONS.KYC_STATUS_UPLOAD;
      if (kycApproveStatus) action = EMAIL_ACTIONS.KYC_STATUS_APPROVED;
      if (kycRejectStatus) action = EMAIL_ACTIONS.KYC_STATUS_REJECTED;
      systemEmailService.sendSystemEmail(
        action, {
          to: fullDocument.email,
          ...fullDocument,
        },
      );
    }
  });
}

dbConnectionUpCb(customerWatcher);
module.exports = new CustomerService(CustomerModel.Model, CustomerModel.Schema);

setTimeout(() => {
  const servies = require('src/modules/services');
  feeGroupService = servies.feeGroupService;
  transactionFeeGroupService = servies.transactionFeeGroupService;
  markupService = servies.markupService;
  systemEmailService = servies.systemEmailService;
}, 0);
