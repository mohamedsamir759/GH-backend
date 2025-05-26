const DocumentModel = require('./documents.model');
const { Cruds } = require('src/common/handlers');
const { CONSTANTS, keys } = require('src/common/data');

const { DCOUMENTS_STATUS } = CONSTANTS;

const getFileName = (file) => file;
const { customerService } = require('src/modules/services');

class DocumentService extends Cruds {
  async addNewdocument(customerId, type, files) {
    const customerDocs = await this.find({ customerId });
    let existing = null;
    if (keys.kycDocuments.indexOf(type) !== -1) {
      existing = customerDocs.find((obj) => obj.type === type);
      if (existing) {
        if (existing.status === DCOUMENTS_STATUS.APPROVED) {
          throw new Error(`Document - ${type} already approved`);
        }
        await this.updateById(existing._id, {
          file1: getFileName(files[0]),
          file2: getFileName(files[1]),
          status: 'PENDING',
          rejectionReason: '',
        });
      } else {
        await this.create({
          customerId,
          type,
          file1: getFileName(files[0]),
          file2: getFileName(files[1]),
        });
        await this.isKycAdded(customerId, true);
      }
    } else {
      existing = customerDocs.filter((obj) => obj.type !== 'ID' && obj.type !== 'ADDRESS');
      if (existing.length + files.length > 8) {
        throw new Error('Maximum limit exceeded to upload documents');
      }
      await this.createBulk(files.map((obj) => ({
        customerId,
        type,
        file1: getFileName(obj),
      })));
    }
    return true;
  }

  async changeDocumentStatus(status, documentId, rejectionReason = '') {
    const document = await this.findById(documentId);
    if (!document || ['APPROVED', 'REJECTED'].indexOf(document.status) !== -1) {
      throw new Error('Error occred, while doing action on Document');
    }
    const result = await this.updateById(documentId, { status, rejectionReason });
    if (keys.kycDocuments.indexOf(document.type) !== -1 && ['APPROVED', 'REJECTED'].indexOf(status) !== -1) {
      await this.isKycApproved(document.customerId, true);
    }
    return result;
  }

  async isKycAdded(customerId, updateStatus = false) {
    const customerDocs = await this.find({
      type: { $in: keys.kycDocuments },
      customerId,
    });
    let allExist = true;
    keys.kycDocuments.every((key) => {
      const matched = customerDocs.find((obj) => obj.type === key);
      if (!matched) {
        allExist = false;
        return false;
      }
      return true;
    });
    if (updateStatus && allExist) {
      await customerService.updateById(customerId, { 'stages.kycUpload': true });
    }
    return allExist;
  }

  async isKycApproved(customerId, updateStatus = false) {
    const customerDocs = await this.find({
      type: { $in: keys.kycDocuments },
      customerId,
    });
    let allApproved = true;
    keys.kycDocuments.every((key) => {
      const matched = customerDocs.find((obj) => obj.type === key && obj.status === 'APPROVED');
      if (!matched) {
        allApproved = false;
        return false;
      }
      return true;
    });
    if (updateStatus && allApproved) {
      await customerService.updateById(customerId, { 'stages.kycApproved': true });
    }
    return allApproved;
  }
}

module.exports = new DocumentService(DocumentModel.Model, DocumentModel.Schema);
