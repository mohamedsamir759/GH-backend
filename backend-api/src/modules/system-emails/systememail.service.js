/**
 * Service for system generated Emails
 */
const slugify = require('slugify');
const { ObjectId } = require('mongoose').Types;
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

const { keys } = require('src/common/data');
const { Cruds } = require('src/common/handlers');
const { logger } = require('src/common/lib');
const SystemEmailModel = require('./systememail.model');
const templateService = require('./template.service');

let settingsService;

const baseFields = ['cpUrl', 'crmUrl', 'firstName', 'lastName', 'email'];

class SystemEmailService extends Cruds {
  async setupEmailsConfig() {
    const emailConfig = await settingsService.getSettings('email');
    if (emailConfig) {
      this.emailConfig = emailConfig;
      switch (emailConfig.provider) {
        case 'sendgrid':
          sgMail.setApiKey(emailConfig.sendGridApiKey);
          logger.info('sendgrid key set');
          break;
        case 'smtp':
          this.transporter = nodemailer.createTransport({
            host: emailConfig.smtp.server,
            port: emailConfig.smtp.port,
            secure: emailConfig.smtp.secure, // true for 465, false for other ports
            auth: {
              user: emailConfig.smtp.auth, // generated ethereal user
              pass: emailConfig.smtp.password, // generated ethereal password
            },
          });
          logger.info('smtp transporter set');
          break;
        default:
          break;
      }
    }
  }

  create(params) {
    const obj = {
      ...params,
      key: slugify(params.title),
      fields: params.fields ? params.fields : baseFields,
    };
    return super.create(obj);
  }

  updateById(id, params) {
    const obj = {
      ...params,
      key: slugify(params.title),
    };
    return super.updateById(id, obj);
  }

  updateStatus(id, params) {
    return super.updateById(id, params);
  }

  updateContentById(id, language, subject, body) {
    return this.update({
      _id: ObjectId(id),
    }, {
      [`content.${language}`]: {
        subject,
        body,
      },
    });
  }

  async getPreviewContent(id, lang) {
    const rec = await this.findById(id);
    if (!rec) return '';

    return templateService.getSubjectBody(rec, lang);
  }

  async sendMail({
    to, subject = '', body = '', cc = [], bcc = [], attachments = [],
  }) {
    if (!to) throw new Error('Email recipient not speicified');
    if (bcc.length > 0) {
      (bcc = [...new Set(bcc)]);
    }
    if (this.emailConfig && this.emailConfig.provider) {
      let msg;
      switch (this.emailConfig.provider) {
        case 'sendgrid':
          msg = {
            from: this.emailConfig.sendFrom,
            to,
            subject,
            html: body,
            attachments,
            bcc,
          };
          return sgMail
            .send(msg)
            .then((res) => {
              logger.info('Email send success response');
              return res;
            })
            .catch((error) => {
              logger.error('Email send error response');
              logger.error(error);
              return { messageId: null, error };
            });
        case 'smtp':
          return this.transporter.sendMail({
            from: `${this.emailConfig.sendFrom}`,
            to,
            subject,
            html: body,
            attachments,
            bcc,
          }).then((res) => {
            logger.info('Email send success response');
            return { messageId: res.messageId };
          })
            .catch((error) => {
              logger.error('Email send error response');
              logger.error(error);
              return { messageId: null, error };
            });
        default:
          break;
      }
    }
    return {};
  }

  async sendSystemEmail(action, emailParams = {}, extraParams = {}) {
    const {
      to, cc, bcc, attachments, lang = 'en',
    } = emailParams;
    if (!to) throw new Error('Email recipient / customer not speicified');
    logger.info(['Email Params ', to, cc, bcc, attachments]);
    logger.info(['Extra Params ', extraParams]);

    const emailObj = await this.findOne({ action });
    if (!emailObj) throw new Error('Email for this action not found');
    const { subject, body } = templateService.getSubjectBody(
      emailObj, { ...emailParams, ...extraParams }, lang,
    );
    return this.sendMail({
      to, subject, body, cc, bcc, attachments,
    });
  }

  async getUsedActions() {
    const res = await this.aggregate(
      [{ $group: { _id: null, actions: { $addToSet: '$action' } } }],
    );
    if (res && res[0]) {
      return res[0].actions;
    }
    return [];
  }
}

const service = new SystemEmailService(SystemEmailModel.Model, SystemEmailModel.Schema);
service.emailConfig = {};
module.exports = service;

setTimeout(() => {
  settingsService = require('src/modules/services').settingService;
  service.setupEmailsConfig();
}, 0);
