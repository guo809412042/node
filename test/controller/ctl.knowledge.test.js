const supertest = require('supertest');
const { app } = require('../../app');
const assert = require('assert');
const should = require('should');
const request = supertest(app.listen());

describe('知识库配置', () => {
  it('1. 查询列表-成功', done => {
    request
      .get('/api/issue-knowledge/list')
      .set('x-gateway-product', 2)
      .set('Cookie', ['userid=3182'])
      .send()
      .expect(200)
      .end((err, res) => {
        const { code } = res.body;
        code.should.equal(20000);
        done();
      });
  });
  it('2. 创建-成功', done => {
    request
      .post('/api/issue-knowledge/create')
      .set('x-gateway-product', 2)
      .set('Cookie', ['userid=3182'])
      .send({})
      .expect(200)
      .end((err, res) => {
        const { code } = res.body;
        code.should.equal(20001);
        done();
      });
  });
  it('3. 更新-成功', done => {
    request
      .post('/api/issue-knowledge/update')
      .set('x-gateway-product', 2)
      .set('Cookie', ['userid=3182'])
      .send({ id: 1, title: 'update title' })
      .expect(200)
      .end((err, res) => {
        const { code } = res.body;
        code.should.equal(20000);
        done();
      });
  });
  it('4. 删除-成功', done => {
    request
      .post('/api/issue-knowledge/delete')
      .set('x-gateway-product', 2)
      .set('Cookie', ['userid=3182'])
      .send({ id: 1 })
      .expect(200)
      .end((err, res) => {
        const { code } = res.body;
        code.should.equal(20000);
        done();
      });
  });
  it('5. 日志查询-成功', done => {
    request
      .get('/api/issue-knowledge/logs')
      .query({ knowledgeId: 1 })
      .set('x-gateway-product', 2)
      .set('Cookie', ['userid=3182'])
      .send()
      .expect(200)
      .end((err, res) => {
        const { code } = res.body;
        code.should.equal(20000);
        done();
      });
  });
  it('6. 标签创建-成功', done => {
    request
      .post('/api/issue-knowledge/create-tag')
      .set('x-gateway-product', 2)
      .set('Cookie', ['userid=3182'])
      .send()
      .expect(200)
      .end((err, res) => {
        const { code } = res.body;
        code.should.equal(20001);
        done();
      });
  });
  it('6. 标签查询-成功', done => {
    request
      .get('/api/issue-knowledge/tags')
      .set('x-gateway-product', 2)
      .set('Cookie', ['userid=3182'])
      .send()
      .expect(200)
      .end((err, res) => {
        const { code } = res.body;
        code.should.equal(20000);
        done();
      });
  });
  it('7. 标签修改成功', done => {
    request
      .post('/api/issue-knowledge/update-tag')
      .set('x-gateway-product', 2)
      .set('Cookie', ['userid=3182'])
      .send({
        name: '小影',
        parentId: '0'
      })
      .expect(200)
      .end((err, res) => {
        const { code } = res.body;
        code.should.equal(20003);
        done();
      });
  })
});
