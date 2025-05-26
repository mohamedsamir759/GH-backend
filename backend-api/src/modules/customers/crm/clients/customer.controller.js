/* eslint-disable class-methods-use-this */
const { ResponseMessages, CONSTANTS } = require('src/common/data');
const { ApiResponse, encryptPassword } = require('src/common/handlers');

const {
  customerService: service,
  systemEmailService,
  walletService,
  dWalletService: dwalletService,
} = require('src/modules/services');

class CustomerController {
  async createClient(req, res, next) {
    try {
      const params = {
        ...req.body,
        ip: req.ip,
        createdBy: req.user._id,
        category: CONSTANTS.CUSTOMER_TYPES.LIVE,
        password: req.body.password ? encryptPassword(req.body.password) : null,
        declarations: ['By clicking here I give my consent for Accuindex to contact me for marketing purposes.', 'You can opt out at any time. For further details please see ourMarketing and Communication Policy Statement.',

          'I confirm that I have read and fully understood the terms and conditions of the Account Opening Agreement with the National Portfolio Securities Company - Introducing Broker for Accuindex Limited in Jordan.',
          'That you have read, understood, acknowledged, and agreed to all Accuindex’s policies, terms & conditions and client agreements which are available on the company’s website www.exiniti.com',

          'You have read, understood, and agreed to Accuindex’s client agreement which includes order execution policy, conflict of interest policy, privacy policy , 3rd party disclosure policy and any other terms in the client agreement',

          'You confirm that you do not breach any regulation of your country of residence in trading with Accuindex.',

          'Your electronic signature is considered a legal and official signature'],
      };
      const rec = await service.create(params);
      if (params.category === CONSTANTS.CUSTOMER_TYPES.LIVE) {
        walletService.generateSystemWallets({
          customerId: rec._id,
        });
      } else {
        dwalletService.generateSystemWallets({
          customerId: rec._id,
        });
      }
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getPaginate(req, res, next) {
    try {
      const { type } = req.query;
      if (req.query.type) { delete req.query.type; }
      const rec = type ? await service.findWithPagination({
        ...req.query,
        category: type,
      }, {
        populate: [{
          path: 'agent',
          select: 'firstName lastName email',
        }, {
          path: 'markupId',
          select: 'title',
        }, {
          path: 'tradingFeeId',
          select: 'title',
        }, {
          path: 'transactionFeeId',
          select: 'title',
        }],
      }) : await service.findWithPagination({
        ...req.query,
        category: CONSTANTS.CUSTOMER_TYPES.LIVE,
      }, {
        populate: [{
          path: 'agent',
          select: 'firstName lastName email',
        }, {
          path: 'markupId',
          select: 'title',
        }, {
          path: 'tradingFeeId',
          select: 'title',
        }, {
          path: 'transactionFeeId',
          select: 'title',
        }],
      });

      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async updateRecordById(req, res, next) {
    try {
      const { id } = req.params;
      const { body } = req;
      if (body.agent === '') body.agent = null;
      const rec = await service.updateById(id, req.body);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async deleteRecordById(req, res, next) {
    try {
      const { id } = req.params;
      const rec = await service.updateById(id, { isDeleted: true });
      return ApiResponse(res, true, ResponseMessages.RECORD_DELETE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getRecords(req, res, next) {
    try {
      const rec = await service.find();
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getRecordById(req, res, next) {
    try {
      const rec = await service.findById(req.params.id, {}, true, [{
        path: 'agent',
        select: 'firstName lastName email',
      }, {
        path: 'markupId',
        select: 'title',
      }, {
        path: 'tradingFeeId',
        select: 'title',
      }, {
        path: 'transactionFeeId',
        select: 'title',
      }]);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async registerLive(req, res, next) {
    try {
      const params = {
        ...req.body,
        password: await encryptPassword(req.body.password),
        category: CONSTANTS.CUSTOMER_TYPES.LIVE,
        source: CONSTANTS.CUSTOMER_SOURCES.LIVE,
      };
      const rec = await service.create(params);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async clientAccess(req, res, next) {
    try {
      const { id, status } = req.params;
      const rec = await service.updateById(id, { isActive: status === 'activate' });
      if (status === 'deactivate') {
        service.endAllSessions(id);
      }
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { password } = req.body;
      const { id } = req.params;
      const rec = await service.changePassword(id, password);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { id } = req.params;
      const rec = await service.forgotPassword(null, id);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async updateFinancialInfo(req, res, next) {
    try {
      const { id } = req.params;
      const rec = await service.updateById(id, req.body);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async updateEmploymentInfo(req, res, next) {
    try {
      const { id } = req.params;
      const rec = await service.updateById(id, req.body);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async sendEmailLink(req, res, next) {
    try {
      const { email } = req.body;
      const client = await service.findOne({ email }, {}, { lean: false });
      if (!client) {
        return res.send({ message: 'Error Sending email' });
      }
      await systemEmailService.sendMail({
        to: email,
        subject: 'Password Reset',
        body: `Kindly click here to reset your password.
        ${process.env.CLIENT_PORTAL_URL}reset-password`,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, { message: 'Email has been sent correctly' });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new CustomerController();
