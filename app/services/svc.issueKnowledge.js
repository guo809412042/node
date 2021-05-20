const { Op, } = require('sequelize');
const assert = require('assert');
const { XError, } = require('../common/utils');
const { IssueKnowledge, IssueKnowledgeLog, IssueKnowledgeTag, } = require('../dao/models');

const create = async data => {
  const res = await IssueKnowledge.create(data);
  return res;
};

const update = async (id, data) => {
  const res = await IssueKnowledge.update(data, {
    where: {
      id,
    },
  });
  return res;
};

const list = async (where, current = 1, pageSize = 10) => {
  const res = await IssueKnowledge.findAndCountAll({
    where,
    limit: pageSize,
    offset: (current - 1) * pageSize,
    order: [ [ 'modify_time', 'DESC', ], ],
  });
  const tagIds = [
    ...new Set(
      res.rows
        .map(v => v.tag)
        .join(',')
        .split(',')
    ),
  ];
  const tags = await IssueKnowledgeTag.findAll({
    where: {
      id: {
        [Op.in]: tagIds,
      },
    },
  });
  const tagDict = {};
  tags.forEach(v => {
    tagDict[v.id] = v;
  });

  const list = res.rows.map(v => {
    const tag = v.tag.split(',').map(tagId => tagDict[tagId]);
    v.tag = tag;
    return v;
  });

  return {
    list,
    pagination: {
      current,
      pageSize,
      total: res.count,
    },
  };
};

const remove = async id => {
  const res = await IssueKnowledge.update(
    { is_delete: 1, },
    {
      where: {
        id,
      },
    }
  );
  return res;
};

/**
 * 创建知识库标签
 * @param {*} data
 */
const createTag = async data => {
  // 查询标签是否存在
  const { name, parent_id = 0, } = data;
  const isExist = await IssueKnowledgeTag.findOne({
    where: {
      name,
      parent_id,
    },
  });
  assert.ok(!isExist, new XError(20003, '标签已存在'));
  const res = await IssueKnowledgeTag.create(data);
  return res;
};

/**
 * 修改知识库标签
 * @param {*} data
 * @param {*} id
 * @param {*} parentId
 */
const updateTag = async (data, id, parentId = 0) => {
  const { name = '', } = data;
  if (parentId) {
    data.parent_id = parentId;
  }
  const isExist = await IssueKnowledgeTag.findOne({
    where: {
      name,
      parent_id: parentId,
    },
  });
  assert.ok(!isExist, new XError(20003, '标签已存在'));
  const res = await IssueKnowledgeTag.update(data, {
    where: {
      id,
    },
  });
  return res;
};

/**
 * 获取知识库标签
 * @param {*} id
 * @param {*} parentId
 * @param {*} name
 * @param {*} tagName
 */
const getTags = async (id = '', parentId, name = '', tagName = '') => {
  const where = {};
  if (parentId || Number(parentId) === 0) {
    where.parent_id = parentId;
  }
  if (id) {
    where.id = id;
  }
  if (name) {
    where.name = name;
  }
  if (tagName) {
    where.name = tagName;
  }
  const res = await IssueKnowledgeTag.findAll({
    where,
    order: [ [ 'id', 'DESC', ], ],
  });
  return res;
};

const getLogs = async knowledgeId => {
  const res = await IssueKnowledgeLog.findAll({
    where: {
      issue_knowledge_id: knowledgeId,
    },
    order: [ [ 'create_time', 'desc', ], ],
  });
  return res;
};

const createLog = async data => {
  const res = await IssueKnowledgeLog.create(data);
  return res;
};

module.exports = {
  create,
  update,
  list,
  remove,
  createTag,
  updateTag,
  getTags,
  getLogs,
  createLog,
};
