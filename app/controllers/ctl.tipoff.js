const { getUserId, } = require('../common/utils');
const { svcTipoffTag, } = require('../services');

/**
 * 获取举报标签列表
 * @param {*}} ctx
 */
const getList = async ctx => {
  const { storeType, } = ctx.reqParam.query;
  const userId = getUserId(ctx);
  const res = await svcTipoffTag.getTipoffTagList({
    userId,
    storeType,
  });

  ctx.body = res;
};

/**
 * 创建或者更新举报标签
 * @param {*} ctx
 */
const createOrUpdate = async ctx => {
  const { id, name, storeType, invalid, reportType, } = ctx.reqParam.body;
  const userId = getUserId(ctx);
  const res = await svcTipoffTag.createOrUpdateTipoffTag({
    id,
    name,
    storeType,
    invalid,
    userId,
    reportType,
  });

  ctx.body = res;
};

/**
 * 删除举报标签
 * @param {*} ctx
 */
const remove = async ctx => {
  const { body, } = ctx.reqParam;
  const { id, } = body;
  const userId = getUserId(ctx);
  const res = await svcTipoffTag.removeTipoffTag({
    userId,
    id,
  });

  ctx.body = res;
};

module.exports = {
  getList,
  createOrUpdate,
  remove,
};
