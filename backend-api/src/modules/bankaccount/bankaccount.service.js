//

const { Cruds } = require('src/common/handlers');
const BankAccountModel = require('./bankaccount.model');

class BankAccountService extends Cruds {

}

module.exports = new BankAccountService(BankAccountModel.Model, BankAccountModel.Schema);
