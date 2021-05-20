/*
 * @Author: highsea.高海
 * @Date: 2019-03-20 11:33:27
 * @Copyright(c) QuVideo F2E Team
 * @Email: hai.gao@quvideo.com
 */

'use strict';

// Load APM on production environment
// const apm = require('./apm');

const koaBody = require('koa-body');
const cors = require('@koa/cors');
const errorHandler = require('./errorHandler');
const favicon = require('koa-favicon');

const requestId = require('./requestId');
const responseHandler = require('./responseHandler');
const router = require('../router');
const { join, } = require('path');

const logMiddleware = require('./log');
const bunyan = require('bunyan');
const loggerConfig = require('../config/logger.js');

// const session = require('koa-session2');
// const Store = require('../common/redis/session.store');
// const range = require('koa-range');
/**
 * 日志处理中间件
 */
const mdLogger = logMiddleware({
  logger: bunyan.createLogger(
    Object.assign(
      {
        serializers: bunyan.stdSerializers,
      },
      loggerConfig
    )
  ),
});

/**
 * 生成请求 uuid
 */
const mdRequestId = requestId();

/**
 * 格式化 from， text， json 数据
 */
const mdKoaBody = koaBody({
  enableTypes: [ 'json', 'form', 'text', ],
  textLimit: '2mb',
  formLimit: '1mb',
  jsonLimit: '5mb',
  strict: true,
  multipart: true,
  onerror: function (err, ctx) {
    ctx.throw(422, new Error(`body parse error: ${err}`), { bcode: 20011, });
  },
  // extendTypes: {
  //   json: ['application/x-javascript']
  // }
  // formidable: {
  //   uploadDir: packageAssets,
  //   keepExtensions: true,
  //   maxFieldsSize: 2 * 1024 * 1024,
  //   // hash: 'md5',
  //   onFileBegin: (name, file) => {
  //     console.log('====file====> ', name, file);
  //   },

  // },
});

/**
 * 允许跨域
 */
const mdcors = cors({
  origin: '*',
  allowMethods: [ 'GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH', ],
  // exposeHeaders: [ 'X-Request-Id', ],
});

/**
 * res 格式化处理
 */
const mdResHandler = responseHandler();
/**
 * res 错误处理
 */
const mdErrorHandler = errorHandler();

/**
 * 路由
 */
const mdRouter = router.routes();
const mdRouterAllowed = router.allowedMethods();

/**
 * favicon
 */
const mdFavicon = favicon(join(__dirname, '../../public/favicon.ico'));

/**
 * session 持久化 redis
 * 需要 优先于 页面 koa-view 之前 use
 */
// const sessionRedis = session({
//   store: new Store(),
// });

module.exports = [
  // sessionRedis,
  // range,
  mdFavicon,
  mdKoaBody,
  mdcors,
  mdRequestId,
  mdLogger,
  mdResHandler,
  mdErrorHandler,
  mdRouter,
  mdRouterAllowed,
];
