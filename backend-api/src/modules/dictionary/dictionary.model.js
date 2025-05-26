const { model, Schema } = require('mongoose');

const DictionarySchema = new Schema(
  {
    recordId: { type: Number, default: 10000 },
    countries: [{
      alpha2: { type: String },
      alpha3: { type: String },
      callingCode: { type: Number },
      en: { type: String },
      ar: { type: String },
    }],
    exchanges: [{ type: String }],
    actions: [{ type: String }],
    emailProviders: [{ type: String }],
  },
  { timestamps: true },
);

DictionarySchema.index({
  title: 1,
  key: 1,
  createdAt: 1,
});

module.exports.Model = model('dictionary', DictionarySchema);
module.exports.Schema = DictionarySchema;
