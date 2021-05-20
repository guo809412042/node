const { TipOffTagRecord, } = require('../dao/models');
const assert = require('assert');
const { XError, } = require('../common/utils');

const getTipoffTagList = async data => {
  const { storeType, invalid, } = data;
  const where = {};
  if (storeType) {
    Object.assign(where, {
      store_type: storeType,
    });
  }
  if (invalid !== undefined) {
    Object.assign(where, {
      invalid,
    });
  }
  const res = await TipOffTagRecord.findAndCountAll({
    attributes: [ 'id', [ 'store_type', 'storeType', ], 'name', 'invalid', [ 'report_type', 'reportType', ], ],
    order: [
      [ 'invalid', 'DESC', ],
      [ 'mtime', 'DESC', ],
    ],
    where,
  });

  return res;
};

const createTipoffTag = async data => {
  const { name, storeType, userId, reportType, } = data;
  assert.ok(name, new XError(20003, '标签名称不能为空'));
  assert.ok(storeType, new XError(20003, '商店类型不能为空'));

  const isExist = await TipOffTagRecord.findOne({
    where: {
      name,
      store_type: storeType,
    },
  });
  assert(!isExist, new XError(20003, '标签已存在'));
  const fields = {
    store_type: storeType,
    report_type: reportType,
    name,
    c_user_id: userId || '',
    m_user_id: userId || '',
    invalid: 1,
  };
  await TipOffTagRecord.create(fields);
  return 'ok';
};

const createOrUpdateTipoffTag = async data => {
  const { id, } = data;

  if (!id) {
    return createTipoffTag(data);
  } else {
    return updateTipoffTag(data);
  }
};

const updateTipoffTag = async data => {
  const { id, name, storeType, userId, invalid, reportType, } = data;
  if (invalid !== undefined && invalid !== '') {
    const fields = {
      invalid,
      m_user_id: userId,
    };
    await TipOffTagRecord.update(fields, { where: { id, }, });
    return 'ok';
  }

  assert.ok(name, new XError(20003, '标签名称不能为空'));
  assert.ok(reportType, new XError(20003, '标签类型不能为空'));
  const existData = await TipOffTagRecord.findOne({
    where: {
      name,
      store_type: storeType,
    },
  });
  assert(!existData, new XError(20003, '标签已存在'));
  const fields = {
    name,
    report_type: reportType,
    m_user_id: userId,
  };
  await TipOffTagRecord.update(fields, { where: { id, }, });
  return 'ok';
};

const removeTipoffTag = async data => {
  const { id, userId, } = data;
  assert.ok(id, new XError(20003, 'id不能为空'));

  const fields = {
    invalid: 0,
    m_user_id: userId,
  };
  await TipOffTagRecord.update(fields, { where: { id, }, });
  return 'ok';
};

module.exports = {
  createOrUpdateTipoffTag,
  removeTipoffTag,
  getTipoffTagList,
};
