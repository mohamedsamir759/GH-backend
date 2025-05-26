const { model, Schema } = require('mongoose');

const SettingsSchema = new Schema(
  {
    recordId: { type: Number, default: 10000 },
    email: {
      provider: {
        type: String,
        default: 'smtp',
      },
      apiKey: {
        type: String,
      },
      secret: {
        type: String,
      },
    },
    defaultLanguage: {
      type: String,
      default: 'en',
    },
    systemLanguages: {
      type: [{
        type: String,
      }],
      default: ['en', 'ar'],
    },
    portalLanguages: {
      type: [{
        type: String,
      }],
      default: ['en', 'ar'],
    },
    orderTypes: {
      type: [{
        type: String,
      }],
      default: ['limit', 'market'],
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    exchanges: {
      type: [{
        name: {
          type: String,
        },
        apiKey: {
          type: String,
        },
        secret: {
          type: String,
        },
        default: {
          type: Boolean,
        },
        extraParams: {
          type: Schema.Types.Mixed,
        },
      }],
      default: [{
        name: 'binance',
        apiKey: 'test',
        apiSecret: 'test',
        extraParams: {},
        default: true,
      }],
    },
  },
  { timestamps: true },
);

SettingsSchema.index({
  title: 1,
  key: 1,
  createdAt: 1,
});

module.exports.Model = model('settings', SettingsSchema);
module.exports.Schema = SettingsSchema;
