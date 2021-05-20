const { svcCommon, } = require('../services');

const translate = async ctx => {
  const { target, text, source, } = ctx.reqParam.body;
  const res = await svcCommon.googleTranslate(text, target, source);
  ctx.body = res[0];
};
// 调用node服务
const translate2 = async ctx => {
  const { target, text, source, key, } = ctx.reqParam.body;
  const res = await svcCommon.googleTranslate2(text, target, source, key);
  ctx.body = res;
};

module.exports = {
  translate,
  translate2,
};
