const supertest = require('supertest');
const {app} = require('../../app');
const assert = require('assert');
const should = require('should');
const request = supertest(app.listen());

describe('工单列表', () => {

  it('1. 查询列表-成功', (done) => {
    request
      .post('/api/issue/list')
      .set('x-gateway-product', 2)
      .send()
      .expect(200)
      .end((err, res) => {
        const { code } = res.body;
        code.should.equal(20000);
        done();
      });
  });
  it('2. 查询工单聊天记录-成功', (done) => {
    request
      .get('/api/issue/chat-list')
      .set('x-gateway-product', 2)
      .send()
      .expect(200)
      .end((err, res) => {
        const { code } = res.body;
        code.should.equal(20000);
        done();
      });
  });
  it('3. 客服回复-成功', (done) => {
    request
      .post('/api/issue/reply')
      .set('x-gateway-product', 2)
      .send()
      .expect(200)
      .end((err, res) => {
        const { code } = res.body;
        code.should.equal(20000);
        done();
      });
  });
  it('3. 更新工单-成功', (done) => {
    request
      .post('/api/issue/update')
      .set('x-gateway-product', 2)
      .send()
      .expect(200)
      .end((err, res) => {
        const { code } = res.body;
        code.should.equal(20000);
        done();
      });
  });
  it('4. 查询工单日志-成功', (done) => {
    request
      .get('/api/issue/logs?issueId=1')
      .set('x-gateway-product', 2)
      .send()
      .expect(200)
      .end((err, res) => {
        const { code } = res.body;
        code.should.equal(20000);
        done();
      });
  });
});
