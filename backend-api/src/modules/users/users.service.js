const { ObjectId } = require('mongoose').Types;

const allServices = require('src/modules/services');
const { Cruds, encryptPassword, comparePassword } = require('src/common/handlers');
const { keys, ResponseMessages } = require('src/common/data');
const { redis } = require('src/common/lib');

const UserModel = require('./users.model');

const service = new Cruds(UserModel.Model, UserModel.Schema);
module.exports = service;

const { rolesService } = allServices;

class UserService extends Cruds {
  async create(params) {
    const addObj = await super.create(params);
    delete addObj.password;
    return addObj;
  }

  async createUser(params) {
    const user = await this.findOne({ email: params.email });
    if (user) throw new Error('User already registered.');

    const newUser = new UserModel.Model(params);
    newUser.password = await encryptPassword(newUser.password);

    const userAdded = await newUser.save();
    const token = newUser.generateAuthToken();
    delete userAdded.password;
    return { user: userAdded, token };
  }

  async checkPassword(
    params,
    checkConfirm = true,
    checkOld = true,
    checkSame = true,
  ) {
    const {
      oldPassword,
      newPassword,
      cnfPassword = '',
      id,
    } = params;
    if (checkConfirm && newPassword !== cnfPassword) {
      throw new Error('Confirm Password not matching with password');
    }
    const user = await this.Model.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    if (checkOld) {
      const compare = await comparePassword(oldPassword, user._doc.password);
      if (!compare) {
        throw new Error('Incorrect old password');
      }
    }
    // if (checkSame) {
    //   const compare = await comparePassword(newPassword, user._doc.password);
    //   if (compare) {
    //     throw new Error('Password is the same, please provide a new password');
    //   }
    // }
    return true;
  }

  async updatePassword(params) {
    const {
      newPassword,
      id,
    } = params;
    await this.checkPassword(params, true, true);
    return this.changePasswordById(newPassword, id);
  }

  async changePasswordById(password, id) {
    return super.updateById(id, {
      password: encryptPassword(password),
    });
  }

  async loginCrm(email, password) {
    const user = await this.findOne({ email }, {}, {
      lean: false,
      populate: [{
        path: 'roleId',
        select: 'title key permissions isActive',
      }],
    });
    const userObj = JSON.parse(JSON.stringify(user));
    if (!user || !user.isActive || !user.roleId || !user.roleId.isActive) {
      throw new Error(ResponseMessages.LOGIN_FAIL.message);
    }
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) throw new Error(ResponseMessages.LOGIN_FAIL.message);

    if (passwordMatch) {
      const token = user.generateAuthToken();
      redis.setKey(`${user._id.toString()}:${token}`, userObj, keys.crmTokenTime.seconds);
      return {
        token,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleId: user.roleId,
      };
    }
    throw new Error(ResponseMessages.LOGIN_FAIL.message);
  }

  async getUserById(id) {
    return this.findById(id, { password: 0 }, true, [{
      path: 'roleId',
      select: 'title key permissions',
    }]);
  }

  async findById(id, projection = {}, lean = true, populate = []) {
    return super.findById(id, { ...projection, password: 0 }, lean, populate);
  }

  async find(params = {}, projection = {}, options = {}) {
    return super.find(params, { ...projection, password: 0 }, options);
  }

  async findWithPagination(params = {}, options = {}) {
    return super.findWithPagination(params, { ...options, projection: { password: 0 } });
  }

  async getAssignableUsers(params = {}, options = {}) {
    const assignableRoles = await rolesService.find({
      'permissions.users.canBeAssigned': true,
    }, { _id: 1 });
    return super.findWithPagination(
      { ...params, roleId: { $in: assignableRoles.map((obj) => obj._id) } },
      { ...options, projection: { password: 0 } },
    );
  }

  async findTeamMembers(params = {}, options = {}) {
    const memberRoles = await rolesService.find({
      'permissions.users.canBeTeamMember': true,
    }, { _id: 1 });
    return super.findWithPagination(
      {
        ...params,
        roleId: { $in: memberRoles.map((obj) => obj._id) },
        memberTeamId: { $eq: null },
      },
      { ...options, projection: { password: 0 } },
    );
  }

  async updateById(id, params) {
    const user = await this.findById(id);
    if (!user) throw new Error('User does not exist');
    if (user.email === 'admin@admin.com') throw new Error('This User Cannot be Updated');
    return super.updateById(id, params);
  }

  async deleteById(id) {
    const user = await this.findById(id);
    if (!user) throw new Error('User does not exist');
    if (user.email === 'admin@admin.com') throw new Error('This User Cannot be Deleted');
    return super.deleteById(id);
  }

  async endAllSessions(userId) {
    redis.deleteUserTokens(userId);
    return true;
  }

  async endAllSessionsByRole(roleId) {
    const users = await this.find({ roleId: ObjectId(roleId) });
    users.forEach((obj) => {
      redis.deleteUserTokens(obj._id.toString());
    });
    return true;
  }
  // async update() {
  //   throw new Error('This function not allowed here');
  // }
}

module.exports = new UserService(UserModel.Model, UserModel.Schema);
