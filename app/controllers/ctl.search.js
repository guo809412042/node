/*
 * @Author: yangyang.zhang 张洋洋
 * @Date: 2020-07-09 10:44:03
 * @Company: Copyright(c) QuVideo F2E Team
 * @Email: yangyang.zhang@quvideo.com
 */
const { svcSearch, } = require('../services');
const { getUserId, } = require('../common/utils');

/**
 * 获取用户常用搜索列表
 * @param {*} ctx
 */
const getList = async ctx => {
  const { sourceType, } = ctx.reqParam.query;
  const userId = getUserId(ctx);
  const res = await svcSearch.getList({
    sourceType,
    userId,
  });
  ctx.body = res;
};

/**
 * 创建用户常用搜索
 * @param {*} ctx
 */
const create = async ctx => {
  const { title, content, sourceType, } = ctx.reqParam.body;
  const userId = getUserId(ctx);
  const res = await svcSearch.create({
    title,
    content,
    sourceType,
    userId,
  });
  ctx.body = res;
};

/**
 * 修改用户常用搜索
 * @param {*} ctx
 */
const edit = async ctx => {
  const { id, title, staus, content, } = ctx.reqParam.body;
  const res = await svcSearch.edit({
    id,
    title,
    staus,
    content,
  });
  ctx.body = res;
};

/**
 * 删除常用搜索
 * @param {*} ctx
 */
const del = async ctx => {
  const { id, } = ctx.reqParam.body;
  const res = await svcSearch.edit({ id, staus: 1, });
  ctx.body = res;
};

module.exports = {
  getList,
  create,
  edit,
  del,
};
