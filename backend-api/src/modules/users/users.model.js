/* eslint-disable linebreak-style */
const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

const jwt = require('jsonwebtoken');
const { keys } = require('src/common/data');

const UserSchema = new Schema({

  recordId: { type: Number },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  roleId: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: false,
  },
  memberTeamId: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: false,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  mobile: String,
  phone: String,
  referalCode: String,
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// this is done as the arrow functions do not bind this to the function
// eslint-disable-next-line func-names
UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({
    _id: this._id,
    email: this.email,
  }, keys.jwtKey,
  { expiresIn: keys.crmTokenTime.jwtTime });
  return token;
};

UserSchema.index({
  firstName: 1,
  lastName: 1,
  email: 1,
  phone: 1,
  createdAt: 1,
});

UserSchema.plugin(mongoosePaginate);
UserSchema.plugin(AutoIncrement, {
  id: 'userCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});
// UserSchema.index({ rec: 1 });

module.exports.Model = model('users', UserSchema);
module.exports.Schema = UserSchema;
