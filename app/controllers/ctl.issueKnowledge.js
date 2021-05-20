const { Op, } = require('sequelize');
const moment = require('moment');

const { getUserId, } = require('../common/utils');

const { svcIssueKnowledge, } = require('../services');

const getCurrentTime = () => moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

/**
 * 查找知识库标签
 * @param {*}} ctx
 */
const getTags = async ctx => {
  const { id, parentId, name, tagName, } = ctx.reqParam.query;
  const res = await svcIssueKnowledge.getTags(id, parentId, name, tagName);
  ctx.body = res;
};

/**
 * 创建知识库标签
 * @param {*} ctx
 */
const createTag = async ctx => {
  const data = ctx.reqParam.body;
  const res = await svcIssueKnowledge.createTag({
    name: data.name,
    parent_id: data.parentId,
  });
  ctx.body = res;
};

/**
 * 修改知识库标签
 * @param {*} ctx
 */
const updateTag = async ctx => {
  const data = ctx.reqParam.body;
  const res = await svcIssueKnowledge.updateTag(
    {
      name: data.name,
      create_time: getCurrentTime(),
    },
    data.id,
    data.parentId
  );
  ctx.body = res;
};

/**
 * 知识库列表
 * @param {*} ctx
 */
const getList = async ctx => {
  const { current, pageSize, tag, text, } = ctx.reqParam.query;
  const whereParams = {
    is_delete: 0,
  };
  if (tag) {
    // 公共类
    if (tag.indexOf('|') >= -1) {
      const tagList = tag.split('|').filter(v => v);
      whereParams.tag = {
        [Op.or]: tagList.map(v => ({
          [Op.startsWith]: v,
        })),
      };
    } else {
      whereParams.tag = {
        [Op.startsWith]: tag,
      };
    }
  }
  if (text) {
    whereParams[Op.or] = [
      {
        title: {
          [Op.substring]: text,
        },
      },
      {
        keywords: {
          [Op.substring]: text,
        },
      },
    ];
  }
  const res = await svcIssueKnowledge.list(whereParams, current, pageSize);

  ctx.body = res;
};

/**
 * 创建知识库
 * @param {*} ctx
 */
const create = async ctx => {
  const data = ctx.reqParam.body;
  const userId = getUserId(ctx);
  const res = await svcIssueKnowledge.create(data);
  await svcIssueKnowledge.createLog({
    issue_knowledge_id: res.id,
    operator_id: userId,
    type: 0,
    content: JSON.stringify(data),
  });
  ctx.body = res;
};

/**
 * 更新知识库
 * @param {*} ctx
 */
const update = async ctx => {
  const data = ctx.reqParam.body;
  const userId = getUserId(ctx);
  const res = await svcIssueKnowledge.update(data.id, data);
  await svcIssueKnowledge.createLog({
    issue_knowledge_id: data.id,
    operator_id: userId,
    type: 1,
    content: JSON.stringify(data),
  });
  ctx.body = res;
};

/**
 * 删除知识库
 * @param {*} ctx
 */
const remove = async ctx => {
  const { id, } = ctx.reqParam.body;
  const userId = getUserId(ctx);
  const res = await svcIssueKnowledge.remove(id);
  await svcIssueKnowledge.createLog({
    issue_knowledge_id: id,
    operator_id: userId,
    type: 2,
    content: '',
  });
  ctx.body = res;
};

/**
 * 查询操作日志
 * @param {*} ctx
 */
const getLogs = async ctx => {
  const { knowledgeId, } = ctx.reqParam.query;
  const res = await svcIssueKnowledge.getLogs(knowledgeId);
  ctx.body = res;
};

module.exports = {
  getTags,
  createTag,
  updateTag,
  getList,
  create,
  update,
  remove,
  getLogs,
};
