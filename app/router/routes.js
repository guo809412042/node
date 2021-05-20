/*
 * @Author: highsea.高海
 * @Date: 2019-03-20 11:35:42
 * @Copyright(c) QuVideo F2E Team
 * @Email: hai.gao@quvideo.com
 */

'use strict';

const {
  ctlSpec,
  ctlIssue,
  ctlIssueTag,
  ctlIssueType,
  ctlCommon,
  ctlStatistics,
  ctlIssueKnowledge,
  ctlSearch,
  ctlReport,
  ctlFapiao,
  ctlTipoffTag,
  ctlAutoReport,
} = require('../controllers');

// 路由列表
// type ： url path 前缀； a或者缺省:/api; b:'/'; d:'/document'
const routeArray = [
  // 工单列表
  {
    method: 'post',
    path: '/issue/list',
    controller: ctlIssue.getList,
  },
  {
    method: 'get',
    path: '/issue/chat-list',
    controller: ctlIssue.getChatList,
  },
  {
    method: 'get',
    path: '/issue/logs',
    controller: ctlIssue.getLogs,
  },
  {
    method: 'post',
    path: '/issue/reply',
    controller: ctlIssue.replay,
  },
  {
    method: 'post',
    path: '/issue/update',
    controller: ctlIssue.update,
  },
  {
    method: 'post',
    path: '/issue/sendIssueToQuality',
    controller: ctlIssue.sendIssueToQuality,
  },
  {
    method: 'post',
    path: '/issue/sendto-quality/batch',
    controller: ctlIssue.batchSendIssueToQuality,
  },

  // 问题类型配置
  {
    method: 'get',
    path: '/issue-type/list',
    controller: ctlIssueType.getList,
  },
  {
    method: 'post',
    path: '/issue-type',
    controller: ctlIssueType.create,
  },
  {
    method: 'put',
    path: '/issue-type',
    controller: ctlIssueType.update,
  },
  {
    method: 'delete',
    path: '/issue-type/:id',
    controller: ctlIssueType.remove,
  },

  // 标签配置
  {
    method: 'get',
    path: '/issue-tag/list',
    controller: ctlIssueTag.getList,
  },
  {
    method: 'post',
    path: '/issue-tag',
    controller: ctlIssueTag.create,
  },
  {
    method: 'put',
    path: '/issue-tag',
    controller: ctlIssueTag.update,
  },
  {
    method: 'delete',
    path: '/issue-tag/:id',
    controller: ctlIssueTag.remove,
  },
  {
    method: 'post',
    path: '/issue-tag-record',
    controller: ctlIssueTag.createRecord,
  },
  {
    method: 'post',
    path: '/statistics/platform-overview',
    controller: ctlStatistics.getPlatformOverview,
  },
  {
    method: 'post',
    path: '/statistics/staff-overview',
    controller: ctlStatistics.getStaffOverview,
  },
  {
    method: 'post',
    path: '/statistics/tag',
    controller: ctlStatistics.getTagStatistics,
  },

  {
    method: 'get',
    path: '/issue-knowledge/list',
    controller: ctlIssueKnowledge.getList,
  },
  {
    method: 'get',
    path: '/issue-knowledge/tags',
    controller: ctlIssueKnowledge.getTags,
  },
  {
    method: 'get',
    path: '/issue-knowledge/logs',
    controller: ctlIssueKnowledge.getLogs,
  },
  {
    method: 'post',
    path: '/issue-knowledge/create',
    controller: ctlIssueKnowledge.create,
  },
  {
    method: 'post',
    path: '/issue-knowledge/update',
    controller: ctlIssueKnowledge.update,
  },
  {
    method: 'post',
    path: '/issue-knowledge/delete',
    controller: ctlIssueKnowledge.remove,
  },
  {
    method: 'post',
    path: '/issue-knowledge/create-tag',
    controller: ctlIssueKnowledge.createTag,
  },
  {
    method: 'post',
    path: '/issue-knowledge/update-tag',
    controller: ctlIssueKnowledge.updateTag,
  },
  // 用户搜索内容
  {
    method: 'get',
    path: '/issue-search/list',
    controller: ctlSearch.getList,
  },
  {
    method: 'post',
    path: '/issue-search/create',
    controller: ctlSearch.create,
  },
  {
    method: 'post',
    path: '/issue-search/edit',
    controller: ctlSearch.edit,
  },
  {
    method: 'post',
    path: '/issue-search/delete',
    controller: ctlSearch.del,
  },
  // 业绩播报
  {
    method: 'get',
    path: '/issue-report/people',
    controller: ctlReport.sendPeopleReport,
  },
  {
    method: 'get',
    path: '/issue-report/platform',
    controller: ctlReport.sendPlatformReport,
  },
  // 开发票
  {
    method: 'get',
    path: '/fapiao/list',
    controller: ctlFapiao.getList,
  },
  {
    method: 'post',
    path: '/fapiao/create',
    controller: ctlFapiao.create,
  },
  {
    method: 'post',
    path: '/fapiao/bulk-create',
    controller: ctlFapiao.bulkCreate,
  },
  {
    method: 'post',
    path: '/fapiao/edit',
    controller: ctlFapiao.edit,
  },
  {
    method: 'get',
    path: '/fapiao/expired',
    controller: ctlFapiao.isExpired,
  },
  {
    method: 'post',
    path: '/fapiao/expired',
    controller: ctlFapiao.setExpireTime,
  },

  // 通用
  {
    method: 'post',
    path: '/common/translate',
    controller: ctlCommon.translate,
  },
  {
    method: 'post',
    path: '/common/translate2',
    controller: ctlCommon.translate,
  },

  {
    method: 'get',
    path: '/info',
    type: 'd',
    controller: ctlSpec.getApiInfo,
  },
  {
    method: 'get',
    path: '/',
    type: 'd',
    controller: ctlSpec.getSwaggerSpec,
  },
  // 举报标签配置
  {
    method: 'get',
    path: '/report-tag/list',
    controller: ctlTipoffTag.getList,
  },
  {
    method: 'post',
    path: '/report-tag/delete',
    controller: ctlTipoffTag.remove,
  },
  {
    method: 'post',
    path: '/report-tag/createOrUpdate',
    controller: ctlTipoffTag.createOrUpdate,
  },
  // sql拼装后台
  {
    method: 'post',
    path: '/auto-report/report/update',
    controller: ctlAutoReport.updateReport,
  },
  {
    method: 'get',
    path: '/auto-report/report/list',
    controller: ctlAutoReport.getReportList,
  },
  {
    method: 'post',
    path: '/auto-report/sql/update',
    controller: ctlAutoReport.updateSqlSetting,
  },
  {
    method: 'post',
    path: '/auto-report/sql/delete',
    controller: ctlAutoReport.deleteSqlSetting,
  },
  {
    method: 'get',
    path: '/auto-report/sql/list',
    controller: ctlAutoReport.getReportSqlList,
  },
  {
    method: 'post',
    path: '/auto-report/gh/data',
    controller: ctlAutoReport.getGhData,
  },
  {
    method: 'post',
    path: '/auto-report/module/update',
    controller: ctlAutoReport.updateModuleSetting,
  },
  {
    method: 'post',
    path: '/auto-report/module/delete',
    controller: ctlAutoReport.deleteModuleSetting,
  },
  {
    method: 'get',
    path: '/auto-report/module/list',
    controller: ctlAutoReport.getReportModuleList,
  },
];

module.exports = routeArray;
