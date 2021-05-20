/*
 * @Author: yangyang.zhang 张洋洋
 * @Date: 2020-07-29 11:18:14
 * @Company: Copyright(c) QuVideo F2E Team
 * @Email: yangyang.zhang@quvideo.com
 */

const assert = require('assert');
const axios = require('axios');
const { XError, } = require('../common/utils');
const request = require('../common/medi.request');

// 测试群
// const feiShuBot = 'https://open.feishu.cn/open-apis/bot/hook/2c024e91c4cc43dca0dba631280a405a';
// 客服Team-王者群
const feiShuBot = 'https://open.feishu.cn/open-apis/bot/hook/cfba49eff1e84f9b9966c865b103f1df';
// 升级为v2
const feiShuBot2 = 'https://open.feishu.cn/open-apis/bot/v2/hook/cfba49eff1e84f9b9966c865b103f1df';
// 升级为v2
// const feiShuBot2 = 'https://open.feishu.cn/open-apis/bot/v2/hook/c369859c-4e1e-4a33-b5ee-0fbd2a751760';

const sendMessage = async (title, text = 'test') => {
  const res = await axios.post(feiShuBot, {
    title,
    text,
  });
  return res;
};

const sendMessage2 = async data => {
  const res = await axios.post(feiShuBot2, data);
  return res;
};

// 获取人员信息
const getPeopleInfo = async reqData => {
  const { data, } = await request({
    method: 'post',
    url: '/api/rest/manager/feedback/peopleInfo',
    data: reqData,
  });
  assert.ok(data.success, new XError(20003, '查询人员出错'));
  return data.data.detailInfo;
};

// 获取平台概况信息
const getPlatformInfo = async reqData => {
  const { data, } = await request({
    method: 'post',
    url: '/api/rest/manager/feedback/platformInfo',
    data: reqData,
  });
  assert.ok(data.success, new XError(20003, '查询平台出错'));
  return data.data.totalInfo;
};

module.exports = {
  sendMessage,
  getPeopleInfo,
  getPlatformInfo,
  sendMessage2,
};
