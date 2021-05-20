const request = require('../common/medi.request');
const { getProductId, } = require('../common/utils');
const { svcIssueTag, } = require('../services');

/**
 * 获取标签列表
 * @param ctx
 * @returns {Promise<void>}
 */
const getList = async ctx => {
  const productId = getProductId(ctx);
  const reqData = Object.assign(
    {
      productId,
    },
    ctx.reqParam.query
  );
  // [DOC] http://restapi.quvideo.com/project/652/interface/api/8696
  const res = await request({
    method: 'post',
    url: '/api/rest/manager/feedback/getIssueTag',
    data: reqData,
  });
  ctx.body = {
    list: res.data.data,
  };
};

/**
 * 创建标签
 * @param ctx
 * @returns {Promise<void>}
 */
const create = async ctx => {
  const productId = getProductId(ctx);
  const reqData = Object.assign(
    {
      productId,
    },
    ctx.reqParam.body
  );
  // [DOC] http://restapi.quvideo.com/project/652/interface/api/8694
  const res = await request({
    method: 'post',
    url: '/api/rest/manager/feedback/addIssueTag',
    data: reqData,
  });
  ctx.body = res.data;
};

/**
 * 更新标签
 * @param ctx
 * @returns {Promise<void>}
 */
const update = async ctx => {
  const productId = getProductId(ctx);
  const reqData = Object.assign(
    {
      productId,
    },
    ctx.reqParam.body
  );
  // [DOC] http://restapi.quvideo.com/project/652/interface/api/8695
  const res = await request({
    method: 'post',
    url: '/api/rest/manager/feedback/updateIssueTag',
    data: reqData,
  });
  ctx.body = res.data;
};

/**
 * 删除
 * @param ctx
 * @returns {Promise<void>}
 */
const remove = async ctx => {
  const id = ctx.params.id;
  const productId = getProductId(ctx);
  const reqData = Object.assign(
    {
      productId,
    },
    ctx.reqParam.query,
    {
      id,
      isDelete: 1,
    }
  );
  // [DOC] http://restapi.quvideo.com/project/652/interface/api/8695
  const res = await request({
    method: 'post',
    url: '/api/rest/manager/feedback/updateIssueTag',
    data: reqData,
  });
  ctx.body = res.data;
};

/**
 * 创建一条打标签记录,用于统计数据
 * 如果重复创建,则更新旧的记录
 * @param {*} ctx
 */
const createRecord = async ctx => {
  const data = ctx.reqParam.body;
  const res = await svcIssueTag.createOrUpdateTagRecord(data);
  ctx.body = res;
};

module.exports = {
  getList,
  create,
  update,
  remove,
  createRecord,
};
