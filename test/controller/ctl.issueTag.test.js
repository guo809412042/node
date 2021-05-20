const supertest = require('supertest');
const {app} = require('../../app');
const assert = require('assert');
const should = require('should');
const request = supertest(app.listen());

describe('服务总结标签', () => {

  it('1. 查询列表-成功', (done) => {
    request
      .get('/api/issue-tag/list')
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
      .post('/api/issue-tag')
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
      .put('/api/issue-tag')
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
      .delete('/api/issue-tag/0')
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

describe('创建总结标签记录', () => {
  it('1. 创建-成功', (done) => {
    request
      .post('/api/issue-tag-record')
      .set('x-gateway-product', 2)
      .send({"source_id":48033,"source_type":0,"tag_id":49,"country":"CN","lang":"zh","is_vip":0,"product_id": 2,"source_create_time":"2020-02-19T10:54:52.000Z"})
      .expect(200)
      .end((err, res) => {
        console.log('========', res.body)
        const { code } = res.body;
        code.should.equal(20000);
        done();
      });
  });
});
