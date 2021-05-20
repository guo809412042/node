#!/usr/bin/env node

'use strict';
const Log = console;
const { version, name, port, host, env, isMonitor, sentryDns, debug, apolloConf, } = require('./config');
// 错误监控
const Sentry = require('@sentry/node');

if (isMonitor) {
  Sentry.init({
    // 需修改 sentry 地址，每个项目都配置自己的地址，配置网站：http://vcm-sentry.api.xiaoying.co
    dsn: sentryDns,
    // 发布版本，默认读取package.json中的版本号
    release: version,
    name,
    // 环境：node环境+部署区域
    environment: `${env}_${apolloConf.clusterName}`,
  });
}

const Koa = require('koa');
const compose = require('koa-compose');
const MD = require('./middlewares/');

const app = new Koa();

app.proxy = true;
app.use(compose(MD));

function onError (err, ctx) {
  if (err.bcode) {
    ctx.log.warn({ err, event: 'error', }, `业务错误码 ${err.bcode}`);
  } else {
    if (isMonitor) {
      Sentry.withScope(scope => {
        scope.addEventProcessor(event => Sentry.Handlers.parseRequest(event, ctx.request));
        Sentry.captureException(err);
      });
    }
    Log.error('\n===未捕获的错误=== ', err);
    // ctx.log.error({ err, event: 'error', }, ` **** req 未处理的异常: ${ctx.reqId}`);
    // TODO XHR 兼容
    if (ctx) {
      ctx.body = {
        code: 40000,
        message: `出错了-未捕获的错误，\n${err.message} \n ${debug ? err.stack : ''}`,
      };
    }
  }
}

app.on('error', onError);

if (!module.parent) {
  const server = app.listen(port, host, () => {
    Log.info({ event: 'execute', }, `API server listening on ${host}:${port}, in ${env}`);
  });
  server.on('error', onError);
}

module.exports = {
  app,
  onError,
};
