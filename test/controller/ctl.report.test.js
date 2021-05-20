const supertest = require('supertest');
const {app} = require('../../app');
const request = supertest(app.listen());

describe('业绩播报', () => {
  // it('1. 今日业务数据', (done) => {
  //   request
  //     .get('/api/issue-report/people')
  //     .expect(200)
  //     .end((err, res) => {
  //       const { code } = res.body;
  //       // code.should.equal(20000);
  //       done();
  //     });
  // })

  // it('2. 整体工单数据', (done) => {
  //   request
  //     .get('/api/issue-report/platform')
  //     .expect(200)
  //     .end((err, res) => {
  //       const { code } = res.body;
  //       // code.should.equal(20000);
  //       done();
  //     });
  // })
})