/*
 * @Author: highsea.高海
 * @Date: 2019-01-14 14:37:33
 * @Copyright(c) QuVideo F2E Team
 * @Email: hai.gao@quvideo.com
 */

'use strict';

const Router = require('koa-router');
const routes = require('./routes');
const schemas = require('../schema');
const paramValidator = require('../middlewares/paramsValidator');
const config = require('../config');
const { join, } = require('path');
const router = new Router();
const Log = console;

schemas.init();

routes.forEach(item => {
  let method = item.method || 'all';
  if (!item.controller) {
    Log.error('\n\n', new Error(`请检查 ${item.path} controller 方法是否遗漏`));
    // 不影响其他
    return true;
  }
  let pre = config.urlPrefix[item.type || 'a'];
  let prePath = join(pre, item.path);

  router[method](prePath, paramValidator(item.controller.paramSchema), item.controller);
});

module.exports = router;
