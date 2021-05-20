const supertest = require('supertest');
const {app} = require('../../app');
const assert = require('assert');
const should = require('should');
const request = supertest(app.listen());

describe('问题类型配置', () => {

  it('1. 查询列表-成功', (done) => {
    request
      .get('/api/issue-type/list')
      .set('x-gateway-product', 2)
      .send()
      .expect(200)
      .end((err, res) => {
        const { code } = res.body;
        code.should.equal(20000);
        done();
      });
  });
  it('2. 创建-成功', (done) => {
    request
      .post('/api/issue-type')
      .set('x-gateway-product', 2)
      .send()
      .expect(200)
      .end((err, res) => {
        const { code } = res.body;
        code.should.equal(20000);
        done();
      });
  });
  it('3. 更新-成功', (done) => {
    request
      .put('/api/issue-type')
      .set('x-gateway-product', 2)
      .send()
      .expect(200)
      .end((err, res) => {
        const { code } = res.body;
        code.should.equal(20000);
        done();
      });
  });
  it('3. 删除-成功', (done) => {
    request
      .delete('/api/issue-type/0')
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
