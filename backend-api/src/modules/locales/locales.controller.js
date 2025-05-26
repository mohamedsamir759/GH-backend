const i18n = require('i18n');
const translator = require('../../common/handlers/translator');

module.exports.missingKeyHandler = (req, res, next) => {
  Object.keys(req.body).forEach((key) => {
    translator(req.params.lng, key);
  });
  return res.json({ status: true });
};

module.exports.getResourcesHandler = (req, res, next) => {
  // console.log(i18n);
  return res.json(i18n.getCatalog(req.params.lng));
};
