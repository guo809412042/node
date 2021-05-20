/*
 * @Date: 2020-03-19 21:55:56
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-09-23 14:19:40
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
const axios = require('axios');
const JSONbig = require('json-bigint')({ storeAsString: true, });
const env = process.env.NODE_ENV || 'development';
const Apollo = process[env] || {};

const { autoCrypto, } = require('../common/utils');
const { apiToken, } = require('../config/index');

const mediRequest = axios.create({
  baseURL: Apollo.ISSUE_MEDI_SERVICE_URL || 'http://viva-qa.api.xiaoying.co',
  timeout: 10000,
  transformRequest: [
    (data, headers) => {
      let timestamp = Date.now();
      let authStr = `${apiToken}${timestamp}`;
      headers.Authorization = autoCrypto(authStr, 'md5', true);
      headers.timestamp = timestamp;
      return data;
    },
    ...axios.defaults.transformRequest,
  ],
  transformResponse: [
    data => {
      // Do whatever you want to transform the data
      return JSONbig.parse(data);
    },
  ],
});
module.exports = mediRequest;
