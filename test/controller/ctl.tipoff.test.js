const supertest = require('supertest');
const { app } = require('../../app');
const request = supertest(app.listen());

describe('商城举报标签', () => {
  it('1. 查询列表-成功', (done) => {
    request
      .get('/api/report-tag/list')
      .send()
      .expect(200)
      .end((err, res) => {
        const { code } = res.body;
        code.should.equal(20000);
        done();
      });
  });
  // it('2. 创建-成功', (done) => {
  //   request
  //     .post('/api/report-tag/createOrUpdate')
  //     .set("Content-Type", "application/x-www-form-urlencoded")
  //     .send({
  //       "name": "测试6",
  //       "storeType": 2,
  //       "reportType": "测试6",
  //     })
  //     .expect(200)
  //     .end((err, res) => {
  //       const { code } = res.body;
  //       code.should.equal(20000);
  //       done();
  //     });
  // });
  it('3. 删除-成功', (done) => {
    request
      .put('/api/report-tag/delete')
      .send({ "id": 28 })
      .expect(200)
      .end((err, res) => {
        const { code } = res.body;
        code.should.equal(20000);
        done();
      });
  });
});
