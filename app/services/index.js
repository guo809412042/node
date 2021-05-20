/*
 * @Author: highsea.高海
 * @Date: 2019-03-20 11:32:09
 * @Copyright(c) QuVideo F2E Team
 * @Email: hai.gao@quvideo.com
 */

'use strict';

const svcCommon = require('./svc.common');
const svcIssueTag = require('./svc.issueTag');
const svcStatistics = require('./svc.statistics');
const svcIssueKnowledge = require('./svc.issueKnowledge');
const svcSearch = require('./svc.search');
const svcReport = require('./svc.report');
const svcFapiao = require('./svc.fapiao');
const svcTipoffTag = require('./svc.tipoff');
const svcApplication = require('./svc.application');
const svcGhAutoReport = require('./svc.svcAutoReport.js');

module.exports = {
  svcCommon,
  svcIssueTag,
  svcStatistics,
  svcIssueKnowledge,
  svcSearch,
  svcReport,
  svcFapiao,
  svcTipoffTag,
  svcApplication,
  svcGhAutoReport,
};
