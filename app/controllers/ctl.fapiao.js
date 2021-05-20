const { svcFapiao, } = require('../services');

/**
 * 获取发票订单信息
 * @param {Object} ctx
 * @property {number} ctx.reqParam.query.productId 产品Id
 * @property {number} ctx.reqParam.query.platform 平台
 * @property {number} ctx.reqParam.query.status 状态 1:未处理 2:已核对 3:处理中 4:已处理
 * @property {number} ctx.reqParam.query.type 抬头类型 1: 企业 2: 个人
 * @property {Array} ctx.reqParam.query.title 发票抬头
 * @property {Array} ctx.reqParam.query.orderId 订单ID
 * @property {Array} ctx.reqParam.query.taxNumber 税号
 * @property {Array} ctx.reqParam.query.email 邮箱
 */
const getList = async ctx => {
  const { productId, platform, status, type, title, orderId, taxNumber, email, auid, } = ctx.reqParam.query;
  const res = await svcFapiao.getList({ productId, platform, status, type, title, orderId, taxNumber, email, auid, });
  ctx.body = res;
};

/**
 * 创建
 * @param {*} ctx
 */
const create = async ctx => {
  const reqData = Object.assign({}, ctx.reqParam.body);
  const res = await svcFapiao.create(reqData);
  ctx.body = res;
};

/**
 * 批量创建
 * @param {*} ctx
 */
const bulkCreate = async ctx => {
  const { dataList = [], } = ctx.reqParam.body;
  const res = await svcFapiao.bulkCreate(dataList);
  ctx.body = res;
};

/**
 * 修改状态
 * @param {*} ctx
 */
const edit = async ctx => {
  const { ids = [], status, } = ctx.reqParam.body;
  const res = await svcFapiao.edit({ ids, status, });
  ctx.body = res;
};

/**
 * 删除
 * @param {*} ctx
 */

/**
 * 设置开发票H5的过期时间
 * @param {*} ctx
 */
const setExpireTime = async ctx => {
  const { issueId, duration = 172800, } = ctx.reqParam.body;
  const res = await svcFapiao.setExpireTime(issueId, duration);
  ctx.body = res;
};

/**
 * 查询开发票H5是否过期
 * @param {*} ctx
 */
const isExpired = async ctx => {
  const { issueId, } = ctx.reqParam.query;
  const res = await svcFapiao.isExpired(issueId);
  ctx.body = res;
};

module.exports = {
  getList,
  create,
  bulkCreate,
  edit,
  setExpireTime,
  isExpired,
};
