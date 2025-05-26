
const express = require('express');
const read = require('fs-readdir-recursive');

const router = express.Router();

const foundFiles = read(`${__dirname}/modules`);
const routes = foundFiles.filter((obj) => obj.indexOf('cp.router.js') > -1);

routes.forEach((element) => {
  const filePath = element.replace(/\\/g, '/');
  const route = require(`./modules/${filePath}`);
  const fileSplit = filePath.split('/');
  const name = route.routerName || fileSplit[fileSplit.length - 1].split('.')[0];
  router.use(`/${name}`, route);
});

module.exports = router;
