const assert = require('assert');
const { XError, } = require('../common/utils');
const request = require('../common/medi.request');
const { getProductId, ckObjValue, } = require('../common/utils');
const env = process.env.NODE_ENV || 'development';
const Apollo = process[env] || {};
const baseURL = Apollo.MEDI_SERVICE_URL_NEW || 'http://viva-qa.api.xiaoying.co';

/**
 * 获取工单列表
 * @param ctx
 * @returns {Promise<void>}
 */
const getList = async ctx => {
  const { current, pageSize, } = ctx.reqParam.body;
  const productId = getProductId(ctx);
  let reqData = Object.assign(
    {
      productId,
      pageNo: current,
    },
    ctx.reqParam.body
  );
  delete reqData.current;
  delete reqData.total;
  reqData = ckObjValue(reqData);
  // [DOC] http://restapi.quvideo.com/project/652/interface/api/8691
  const res = await request({
    method: 'post',
    url: '/api/rest/manager/feedback/getIssueReport',
    data: reqData,
  });
  let list = res.data.data || [];
  // list.forEach(v => {
  //   if (Array.isArray(v.issueReportChatLogList)) {
  //     v.issueReportChatLogList.reverse();
  //   }
  // });
  ctx.body = {
    list,
    pagination: {
      current,
      pageSize,
      total: res.data.count,
    },
  };
};

/**
 * 更新工单信息
 * @param ctx
 */
const update = async ctx => {
  // const productId = getProductId(ctx);
  const reqData = Object.assign({}, ctx.reqParam.body);
  // const { evaluationTypeId, issueId, } = reqData;
  // assert.ok(evaluationTypeId, new XError(40003, 'evaluationTypeId必传'));
  // assert.ok(issueId, new XError(40003, 'issueId必传'));
  // [DOC] http://restapi.quvideo.com/project/652/interface/api/8692
  const res = await request({
    method: 'post',
    url: '/api/rest/manager/feedback/updateIssue',
    data: reqData,
  });
  ctx.body = res.data;
};

/**
 * 客服回复消息
 * @param ctx
 */
const replay = async ctx => {
  // const productId = getProductId(ctx);
  const reqData = Object.assign({}, ctx.reqParam.body);
  // [DOC] http://restapi.quvideo.com/project/652/interface/api/8693
  const res = await request({
    method: 'post',
    url: '/api/rest/manager/feedback/feedback',
    data: reqData,
  });
  ctx.body = res.data;
};

/**
 * 获取聊天记录
 * @param ctx
 */
const getChatList = async ctx => {
  const { issueId, } = ctx.reqParam.query;
  // [DOC] http://restapi.quvideo.com/project/652/interface/api/8702
  const res = await request({
    method: 'post',
    url: '/api/rest/manager/feedback/getHistoryLog',
    data: {
      issueId,
    },
  });
  ctx.body = res.data;
};

const getLogs = async ctx => {
  const { issueId, } = ctx.reqParam.query;
  const res = await request({
    method: 'post',
    url: '/api/rest/manager/feedback/getIssueOperateLog',
    data: {
      issueReportId: issueId,
    },
  });
  ctx.body = res.data.data || [];
};

/**
 * 将邮件 1 工单 2 应用商城 3 工单添加到质检
 * @param {*} ctx
 * http://restapi.quvideo.com/project/871/interface/api/13408
 */
const apiMap = {
  1: `${baseURL}/api/rest/quality/sendRecord/sendIssueToQuality`,
  2: `${baseURL}/api/rest/quality/sendRecord/sendAppStoreToQuality`,
  3: `${baseURL}/api/rest/quality/sendRecord/sendMailToQuality`,
};
const sendIssueToQuality = async ctx => {
  const { sourceId, type, } = ctx.reqParam.body;
  assert.ok(sourceId && type, new XError(20003, 'sourceId和type必传'));
  const url = apiMap[type];
  assert.ok(url, new XError(20003, '请确认type参数'));
  const res = await request({
    method: 'post',
    url,
    data: {
      sourceId,
    },
  });
  if (!res.data.success) {
    assert.ok(false, new XError(20003, res.data.message));
  }
  ctx.body = res.data.data || {};
};

/**
 * 将邮件 1 工单 2 应用商城 3 工单添加到质检
 * @param {*} ctx
 * http://restapi.quvideo.com/project/652/interface/api/13576
 */
const batchApiMap = {
  1: `${baseURL}/api/rest/quality/sendRecord/sendIssueListToQuality`,
  2: `${baseURL}/api/rest/quality/sendRecord/sendAppStoreListToQuality`,
  3: `${baseURL}/api/rest/quality/sendRecord/sendMailListToQuality`,
};
const batchSendIssueToQuality = async ctx => {
  const { sourceIdList, type, } = ctx.reqParam.body;
  const status = sourceIdList && sourceIdList.length;
  assert.ok(status, new XError(20003, 'sourceIdList必传'));
  const url = batchApiMap[type];
  assert.ok(url, new XError(20003, '请确认type参数'));
  const res = await request({
    method: 'post',
    url,
    data: {
      sourceIdList,
    },
  });
  if (!res.data.success) {
    assert.ok(false, new XError(40003, res.data.message));
  }
  ctx.body = res.data.data || {};
};

module.exports = {
  getList,
  update,
  replay,
  getChatList,
  getLogs,
  sendIssueToQuality,
  batchSendIssueToQuality,
};
