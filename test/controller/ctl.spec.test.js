/*
 * @Author: highsea.高海
 * @Date: 2019-03-22 16:13:22
 * @Copyright(c) QuVideo F2E Team
 * @Email: hai.gao@quvideo.com
 */

'use strict';

const mm = require('mm');
const should = require('should'); // eslint-disable-line
const supertest = require('supertest');
const { app } = require('../../app');
const assert = require('assert')
// const pool = require('../../common/mysql');
// http://mockjs.com/examples.html
// const mockjs = require('mockjs)
const request = supertest(app.listen());
let doc = {}

describe('文档信息获取', () => {

  it('API文档-成功', (done) => {
    request
      .get('/document')
      .expect(200, done)
  });

  it('项目文档-成功', (done) => {
    request
      .get('/document/info')
      .expect(200, done)
  });

  
})