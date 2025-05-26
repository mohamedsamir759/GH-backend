const { default: BigNumber } = require('bignumber.js');
const TransactionFeeGroupModel = require('./trangroup.model');
const { Cruds } = require('src/common/handlers');

const { customerService } = require('src/modules/services');

class TransactionFeeGroup extends Cruds {
  async deleteById(id) {
    const obj = await this.findById(id);
    if (!obj) {
      throw new Error('Record does not exist');
    }
    if (obj.isDefault) {
      throw new Error('Default transaction fee group cannot be deleted');
    }
    return super.deleteById(id);
  }

  async getTransactionFeeGroupForCustomer(customerId) {
    let feeData = null;
    const customerWithFee = await customerService.findById(customerId, {}, true, [{
      path: 'transactionFeeId',
      select: 'isPercentage value markups markets',
    }]);
    if (customerWithFee && customerWithFee.transactionFeeId) {
      feeData = customerWithFee.transactionFeeId;
    } else {
      feeData = await this.findOne({
        isDefault: true,
      });
    }
    return feeData;
  }

  /**
   * @param {TransactionFeeGroupModel} markupData
   * @param {String} asset
   * @returns {*Object} data
   * @returns {*Number} data.value Absolute/Percent value
   * @returns {*Boolean} data.isPercentage Boolean value describing the above param
   */
  getTransactionFeeForAssetFromData(feeData = {}, asset = null) {
    let data = feeData;
    if (!asset || !feeData || !feeData.assets || !feeData.assets[asset]) {
      data = {
        _id: (feeData && feeData._id) || null,
        value: (feeData && feeData.value) || 0,
        isPercentage: (feeData && feeData.isPercentage) || false,
        minValue: (feeData && feeData.minValue) || 0,
        maxValue: (feeData && feeData.maxValue) || 0,
      };
    } else {
      data = {
        _id: (feeData && feeData._id) || null,
        value: (feeData && feeData.assets[asset] && feeData.assets[asset].value) || 0,
        isPercentage: (feeData && feeData.isPercentage) || false,
        minValue: (feeData && feeData.assets[asset] && feeData.assets[asset].minValue) || 0,
        maxValue: (feeData && feeData.assets[asset] && feeData.assets[asset].maxValue) || 0,
      };
    }
    return data;
  }

  calculateTransactionFeeAmount(feeDetails, amount) {
    let {
      value,
      isPercentage,
      minValue,
      maxValue,
    } = feeDetails;
    let fee = new BigNumber(0);
    value = new BigNumber(value);
    minValue = new BigNumber(minValue);
    maxValue = new BigNumber(maxValue);
    amount = new BigNumber(amount);
    if (isPercentage) {
      fee = fee.plus(amount.multipliedBy(value.dividedBy(100)));
      if (fee.isLessThan(minValue)) {
        fee = minValue;
      } else if (fee.isGreaterThan(maxValue)) {
        fee = maxValue;
      }
    } else {
      fee = fee.plus(value);
    }
    return fee;
  }
}

module.exports = new TransactionFeeGroup(
  TransactionFeeGroupModel.Model,
  TransactionFeeGroupModel.Schema,
);
