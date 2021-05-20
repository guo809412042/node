const supertest = require('supertest');
const {app} = require('../../app');
const request = supertest(app.listen());

describe('开发票', () => {

  it('1. 创建', (done) => {
    request
      .post('/api/fapiao/create')
      .send({})
      .expect(200)
      .end((err, res) => {
        const { code } = res.body;
        code.should.equal(20000);
        done();
      });
  });

  it('2. 查询', (done) => {
    request
      .get('/api/fapiao/list')
      .expect(200)
      .end((err, res) => {
        const { code } = res.body;
        code.should.equal(20000);
        done();
      });
  });

  it('3. 批量创建', (done) => {
    request
      .post('/api/fapiao/bulk-create')
      .send([])
      .expect(200)
      .end((err, res) => {
        const { code } = res.body;
        code.should.equal(20000);
        done();
      });
  });

  it('4. 编辑', (done) => {
    request
      .post('/api/fapiao/edit')
      .send({})
      .expect(200)
      .end((err, res) => {
        const { code } = res.body;
        code.should.equal(20000);
        done();
      });
  });

  it('5. 设置过期时间', (done) => {
    request
      .post('/api/fapiao/expired')
      .send({ issueId: '233' })
      .expect(200)
      .end((err, res) => {
        const { code } = res.body;
        code.should.equal(20000);
        done();
      });
  });

  it('6. 查询过期时间', (done) => {
    request
      .get('/api/fapiao/expired')
      .send({ issueId: '233' })
      .expect(200)
      .end((err, res) => {
        const { code } = res.body;
        code.should.equal(20000);
        done();
      });
  });

});
