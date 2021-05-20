/*
 * @Author: yangyang.zhang 张洋洋
 * @Date: 2020-07-09 10:42:48
 * @Company: Copyright(c) QuVideo F2E Team
 * @Email: yangyang.zhang@quvideo.com
 */
const { IssueUserSearch, } = require('../dao/models');

/**
 * 获取用户常用搜索列表
 * @param {Object} data
 * @param {number} data.userId 用户ID
 */
const getList = async ({ sourceType = 0, userId, }) => {
  const where = {
    source_type: sourceType,
    user_id: userId,
    staus: 0,
  };
  const res = await IssueUserSearch.findAll({ where, });
  return res;
};

/**
 * 添加用户常用搜索
 * @param {Object} data
 * @param {string} data.title 搜索标题
 * @param {string} data.content 搜索内容
 * @param {number} data.sourceType
 * 渠道 0.工单,1.GP 回复,2.App Store回复,3.邮件 5.tempo
 * 数据看板 6. 全渠道业务量概览 7. 工单反馈概览 8. 应用商城反馈概览 9. 邮件反馈概览
 *        10. 全渠道问题波动概览 11. 问题类型统计 12. 工单概览 13. 应用商城概览
 *        14. 邮件概览
 * @param {number} data.userId 用户ID
 */
const create = async ({ title, content, sourceType, userId, }) => {
  const data = {
    title,
    content,
    source_type: sourceType,
    user_id: userId,
  };
  const res = await IssueUserSearch.findOrCreate({
    where: { source_type: sourceType, title, user_id: userId, staus: 0, },
    defaults: data,
  });
  return res;
};

/**
 * 修改用户常用搜索
 * @param {object} data
 * @param {number} data.id 搜索id
 * @param {string} data.title 搜索标题
 * @param {number=} data.staus 状态 0. 可用 1. 不可用
 * @param {string=} data.content 搜索内容
 */
const edit = async ({ id, title, staus, content, }) => {
  const data = {};
  const where = { id, };
  if (title) data.title = title;
  if (staus) data.staus = staus;
  if (content) data.content = content;
  const res = await IssueUserSearch.update(data, { where, });
  return res;
};

module.exports = {
  getList,
  create,
  edit,
};
