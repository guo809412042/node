const { getUserId, } = require('../common/utils');
const { svcGhAutoReport, } = require('../services');
const assert = require('assert');
const { XError, } = require('../common/utils');

const updateReport = async ctx => {
  const { link, name, id, } = ctx.reqParam.body;
  assert(name, new XError(40000, '需求名称不能为空'));
  const resp = await svcGhAutoReport.updateRequirement({
    link,
    name,
    userId: getUserId(ctx),
    id,
  });
  ctx.body = resp;
};

const getReportList = async ctx => {
  const { name, pageSize, pageNo, } = ctx.reqParam.query;
  const resp = await svcGhAutoReport.getRequirementList({
    name,
    pageSize,
    pageNo,
  });
  ctx.body = resp;
};

const updateSqlSetting = async ctx => {
  const {
    id,
    requirementId,
    moduleId,
    baseSql,
    querySchema,
    respSchema,
    moduleDetailId,
    moduleDetailAds,
  } = ctx.reqParam.body;
  if (!id) {
    assert(requirementId, new XError(40000, '需求id不能为空'));
    assert(moduleId, new XError(40000, '页面关联模块id不能为空'));
    assert(baseSql, new XError(40000, '基础sql不能为空'));
  }
  const resp = await svcGhAutoReport.updateSqlSetting({
    id,
    userId: getUserId(ctx),
    requirementId,
    moduleId,
    baseSql,
    querySchema,
    respSchema,
    moduleDetailId,
    moduleDetailAds,
  });
  ctx.body = resp;
};

const deleteSqlSetting = async ctx => {
  const { id, } = ctx.reqParam.body;
  assert(id, new XError(40000, 'id不能为空'));
  const resp = await svcGhAutoReport.updateSqlSetting({
    id,
    userId: getUserId(ctx),
    invalid: 0,
  });
  ctx.body = resp;
};

const getReportSqlList = async ctx => {
  const { requirementId, moduleId, } = ctx.reqParam.query;
  assert(requirementId, new XError(40000, '需求id不能为空'));
  const resp = await svcGhAutoReport.getRequirementSqlList({
    requirementId,
    moduleId,
    invalid: 1,
  });

  ctx.body = resp;
};

const getGhData = async ctx => {
  const { requirementId, moduleId, filterParams, moduleDetailId, compId, } = ctx.reqParam.body;
  assert(requirementId, new XError(40000, '需求id不能为空'));
  assert(moduleId, new XError(40000, '页面模块id不能为空'));
  const resp = await svcGhAutoReport.getGhData({
    requirementId,
    moduleId,
    filterParams,
    moduleDetailId,
    compId,
  });

  ctx.body = resp;
};

const updateModuleSetting = async ctx => {
  const { id, requirementId, type, name, defaultQuery, componentSchema, invalid, } = ctx.reqParam.body;
  if (!id) {
    assert(requirementId, new XError(40000, '需求id不能为空'));
    assert(type, new XError(40000, '页面模块类型不能为空'));
    assert(componentSchema, new XError(40000, '页面配置信息不能为空'));
  }
  const resp = await svcGhAutoReport.updateModuleSetting({
    id,
    userId: getUserId(ctx),
    requirementId,
    type,
    name,
    defaultQuery,
    componentSchema,
    invalid,
  });
  ctx.body = resp;
};

const deleteModuleSetting = async ctx => {
  const { id, } = ctx.reqParam.body;
  assert(id, new XError(40000, 'id不能为空'));
  const resp = await svcGhAutoReport.updateModuleSetting({
    id,
    userId: getUserId(ctx),
    invalid: 0,
  });
  ctx.body = resp;
};

const getReportModuleList = async ctx => {
  const { requirementId, } = ctx.reqParam.query;
  assert(requirementId, new XError(40000, '需求id不能为空'));
  const resp = await svcGhAutoReport.getRequirementModuleList({
    requirementId,
    invalid: 1,
  });

  ctx.body = resp;
};

module.exports = {
  updateReport,
  getReportList,
  updateSqlSetting,
  getReportSqlList,
  getGhData,
  updateModuleSetting,
  getReportModuleList,
  deleteSqlSetting,
  deleteModuleSetting,
};
