const supertest = require('supertest');
const {app} = require('../../app');
const assert = require('assert');
const should = require('should');
const request = supertest(app.listen());

describe('问题类型配置', () => {

  it('查询平台概况-成功', (done) => {
    request
      .post('/api/statistics/platform-overview')
      .set('x-gateway-product', 2)
      .send()
      .expect(200)
      .end((err, res) => {
        const { code } = res.body;
        code.should.equal(20000);
        done();
      });
  });
  it('查询人员概况-成功', (done) => {
    request
      .post('/api/statistics/staff-overview')
      .set('x-gateway-product', 2)
      .send()
      .expect(200)
      .end((err, res) => {
        const { code } = res.body;
        code.should.equal(20000);
        done();
      });
  });

  it('查询标签统计-成功', (done) => {
    request
      .post('/api/statistics/tag')
      .set('x-gateway-product', 2)
      .send({"startTime":"2020-02-16T06:42:28.818Z","endTime":"2020-03-16T06:42:28.819Z"})
      .expect(200)
      .end((err, res) => {
        const { code } = res.body;
        code.should.equal(20000);
        done();
      });
  });
});
